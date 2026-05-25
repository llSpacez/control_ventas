import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('cash_registers')
export class CashRegister {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'opening_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  openingDate: Date;

  @Column({ name: 'closing_date', type: 'timestamp', nullable: true })
  closingDate: Date;

  @Column({ name: 'initial_amount', type: 'decimal', precision: 10, scale: 2 })
  initialAmount: number;

  @Column({ name: 'sales_total', type: 'decimal', precision: 10, scale: 2, default: 0 })
  salesTotal: number;

  @Column({ name: 'expenses_total', type: 'decimal', precision: 10, scale: 2, default: 0 })
  expensesTotal: number;

  @Column({ name: 'expected_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  expectedAmount: number;

  @Column({ name: 'actual_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  actualAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  difference: number;

  @Column({ type: 'enum', enum: ['open', 'closed', 'suspended'], default: 'open' })
  status: string;

  @Column({ name: 'opened_by' })
  openedByUserId: number;

  @Column({ name: 'closed_by', nullable: true })
  closedByUserId: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relaciones
  @ManyToOne(() => User)
  @JoinColumn({ name: 'opened_by' })
  openedBy: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'closed_by' })
  closedBy: User;
}