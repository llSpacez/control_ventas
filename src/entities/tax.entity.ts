import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('taxes')
export class Tax {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  percentage: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'applies_to', type: 'enum', enum: ['products', 'services', 'both'], default: 'both' })
  appliesTo: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}