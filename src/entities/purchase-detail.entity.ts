import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Purchase } from './purchase.entity';
import { Product } from './product.entity';

@Entity('purchase_details')
export class PurchaseDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'purchase_id' })
  purchaseId: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ name: 'unit_cost', type: 'decimal', precision: 10, scale: 2 })
  unitCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  // Relaciones
  @ManyToOne(() => Purchase, purchase => purchase.details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'purchase_id' })
  purchase: Purchase;

  @ManyToOne(() => Product, product => product.purchaseDetails)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}