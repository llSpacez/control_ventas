import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from 'typeorm';
import { Customer } from './customer.entity';
import { User } from './user.entity';
import { SaleDetail } from './sale-detail.entity';
import { Payment } from './payment.entity';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'invoice_number', length: 50, unique: true })
  invoiceNumber: string;

  @Column({ name: 'sale_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  saleDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'enum', enum: ['pending', 'completed', 'cancelled'], default: 'pending' })
  status: string;

  @Column({ name: 'payment_status', type: 'enum', enum: ['pending', 'partial', 'paid'], default: 'pending' })
  paymentStatus: string;

  @Column({ name: 'customer_id' })
  customerId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relaciones
  @ManyToOne(() => Customer, customer => customer.sales)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => User, user => user.sales)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => SaleDetail, detail => detail.sale, { cascade: true })
  details: SaleDetail[];

  @OneToMany(() => Payment, payment => payment.sale)
  payments: Payment[];
}