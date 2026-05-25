import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Sale } from './sale.entity';
import { User } from './user.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'sale_id' })
  saleId: number;

  @Column({ name: 'payment_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  paymentDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'payment_method', type: 'enum', enum: ['cash', 'credit_card', 'debit_card', 'transfer', 'check'] })
  paymentMethod: string;

  @Column({ name: 'reference_number', length: 100, nullable: true })
  referenceNumber: string;

  @Column({ type: 'enum', enum: ['pending', 'completed', 'failed'], default: 'completed' })
  status: string;

  @Column({ name: 'user_id' })
  userId: number;

  // Relaciones
  @ManyToOne(() => Sale, sale => sale.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;

  @ManyToOne(() => User, user => user.payments)
  @JoinColumn({ name: 'user_id' })
  user: User;
}