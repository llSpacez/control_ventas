import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from 'typeorm';
import { Supplier } from './supplier.entity';
import { User } from './user.entity';
import { PurchaseDetail } from './purchase-detail.entity';

@Entity('purchases')
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'purchase_number', length: 50, unique: true })
  purchaseNumber: string;

  @Column({ name: 'purchase_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  purchaseDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ name: 'supplier_id' })
  supplierId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'enum', enum: ['pending', 'received', 'cancelled'], default: 'pending' })
  status: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relaciones
  @ManyToOne(() => Supplier, supplier => supplier.purchases)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @ManyToOne(() => User, user => user.purchases)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => PurchaseDetail, detail => detail.purchase, { cascade: true })
  details: PurchaseDetail[];
}