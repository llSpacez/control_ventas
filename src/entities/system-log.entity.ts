import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('system_logs')
export class SystemLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ length: 100 })
  action: string;

  @Column({ name: 'table_name', length: 50, nullable: true })
  tableName: string;

  @Column({ name: 'record_id', nullable: true })
  recordId: number;

  @Column({ name: 'old_data', type: 'json', nullable: true })
  oldData: any;

  @Column({ name: 'new_data', type: 'json', nullable: true })
  newData: any;

  @Column({ name: 'ip_address', length: 45, nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relaciones
  @ManyToOne(() => User, user => user.logs, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}