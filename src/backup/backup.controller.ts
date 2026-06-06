import { Controller, Get, Post, Delete, Param, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { BackupService } from './backup.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('backup')
@ApiBearerAuth('JWT-auth')
@Controller('backup')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BackupController {
  constructor(private backupService: BackupService) {}

  @Post('create')
  @Roles('admin')
  async createBackup() {
    const backup = await this.backupService.createBackup();
    return {
      success: true,
      message: 'Respaldo creado exitosamente',
      data: backup,
    };
  }

  @Get('list')
  @Roles('admin')
  async listBackups() {
    const backups = await this.backupService.listBackups();
    const totalSize = await this.backupService.getBackupSize();
    
    return {
      success: true,
      data: backups,
      totalBackups: backups.length,
      totalSize,
    };
  }

  @Post('restore/:filename')
  @Roles('admin')
  async restoreBackup(@Param('filename') filename: string) {
    await this.backupService.restoreBackup(filename);
    return {
      success: true,
      message: 'Base de datos restaurada exitosamente',
    };
  }

  @Delete(':filename')
  @Roles('admin')
  async deleteBackup(@Param('filename') filename: string) {
    await this.backupService.deleteBackup(filename);
    return {
      success: true,
      message: 'Respaldo eliminado exitosamente',
    };
  }

  @Get('download/:filename')
  @Roles('admin')
  async downloadBackup(@Param('filename') filename: string, @Res() res: Response) {
    const { path: filepath, filename: name } = await this.backupService.downloadBackup(filename);
    res.download(filepath, name);
  }
}