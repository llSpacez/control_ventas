import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

@Injectable()
export class BackupService {
  private backupDir: string;
  private dbHost: string;
  private dbUser: string;
  private dbPassword: string;
  private dbName: string;

  constructor(private configService: ConfigService) {
    this.backupDir = this.configService.get('BACKUP_PATH') || './backups';
    this.dbHost = this.configService.get('DB_HOST');
    this.dbUser = this.configService.get('DB_USER');
    this.dbPassword = this.configService.get('DB_PASSWORD');
    this.dbName = this.configService.get('DB_NAME');

    // Crear directorio de backups si no existe
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  async createBackup(): Promise<{ filename: string; path: string; size: number }> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `backup_${this.dbName}_${timestamp}.sql`;
      const filepath = path.join(this.backupDir, filename);

      // Comando mysqldump
      const command = `mysqldump -h ${this.dbHost} -u ${this.dbUser} -p${this.dbPassword} ${this.dbName} --routines --triggers --single-transaction > "${filepath}"`;
      
      await execAsync(command);
      
      // Verificar que el archivo se creó
      if (!fs.existsSync(filepath)) {
        throw new Error('No se pudo crear el respaldo');
      }

      const stats = fs.statSync(filepath);
      
      return {
        filename,
        path: filepath,
        size: stats.size,
      };
    } catch (error) {
      console.error('Error al crear respaldo:', error);
      throw new InternalServerErrorException('Error al crear el respaldo de la base de datos');
    }
  }

  async listBackups(): Promise<Array<{ filename: string; path: string; size: number; created: Date }>> {
    try {
      const files = fs.readdirSync(this.backupDir);
      const backups = files
        .filter(file => file.endsWith('.sql'))
        .map(file => {
          const filepath = path.join(this.backupDir, file);
          const stats = fs.statSync(filepath);
          return {
            filename: file,
            path: filepath,
            size: stats.size,
            created: stats.birthtime,
          };
        })
        .sort((a, b) => b.created.getTime() - a.created.getTime());
      
      return backups;
    } catch (error) {
      throw new InternalServerErrorException('Error al listar respaldos');
    }
  }

  async restoreBackup(filename: string): Promise<void> {
    try {
      const filepath = path.join(this.backupDir, filename);
      
      if (!fs.existsSync(filepath)) {
        throw new NotFoundException('Archivo de respaldo no encontrado');
      }

      // Comando para restaurar
      const command = `mysql -h ${this.dbHost} -u ${this.dbUser} -p${this.dbPassword} ${this.dbName} < "${filepath}"`;
      
      await execAsync(command);
    } catch (error) {
      console.error('Error al restaurar respaldo:', error);
      throw new InternalServerErrorException('Error al restaurar el respaldo');
    }
  }

  async deleteBackup(filename: string): Promise<void> {
    try {
      const filepath = path.join(this.backupDir, filename);
      
      if (!fs.existsSync(filepath)) {
        throw new NotFoundException('Archivo de respaldo no encontrado');
      }
      
      fs.unlinkSync(filepath);
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar el respaldo');
    }
  }

  async downloadBackup(filename: string): Promise<{ path: string; filename: string }> {
    const filepath = path.join(this.backupDir, filename);
    
    if (!fs.existsSync(filepath)) {
      throw new NotFoundException('Archivo de respaldo no encontrado');
    }
    
    return {
      path: filepath,
      filename,
    };
  }

  async getBackupSize(): Promise<number> {
    try {
      const files = fs.readdirSync(this.backupDir);
      let totalSize = 0;
      
      for (const file of files) {
        if (file.endsWith('.sql')) {
          const filepath = path.join(this.backupDir, file);
          const stats = fs.statSync(filepath);
          totalSize += stats.size;
        }
      }
      
      return totalSize;
    } catch (error) {
      return 0;
    }
  }
}