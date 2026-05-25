import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { CashRegister } from './cash-register.entity';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'expense_number', length: 50, unique: true })
  expenseNumber: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ length: 50 })
  category: string;

  @Column({ name: 'expense_date', type: 'date' })
  expenseDate: Date;

  @Column({ name: 'payment_method', type: 'enum', enum: ['cash', 'transfer', 'check'], default: 'cash' })
  paymentMethod: string;

  @Column({ name: 'receipt_number', length: 100, nullable: true })
  receiptNumber: string;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'cash_register_id', nullable: true })
  cashRegisterId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relaciones
  @ManyToOne(() => User, user => user.expenses)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => CashRegister)
  @JoinColumn({ name: 'cash_register_id' })
  cashRegister: CashRegister;
}