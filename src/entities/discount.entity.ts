import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('discounts')
export class Discount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'enum', enum: ['percentage', 'fixed'], default: 'percentage' })
  type: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column({ name: 'min_purchase', type: 'decimal', precision: 10, scale: 2, default: 0 })
  minPurchase: number;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({ name: 'max_uses', type: 'int', nullable: true })
  maxUses: number;

  @Column({ name: 'uses_count', type: 'int', default: 0 })
  usesCount: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}