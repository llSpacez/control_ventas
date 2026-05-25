import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Return } from './return.entity';
import { Product } from './product.entity';

@Entity('return_details')
export class ReturnDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'return_id' })
  returnId: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'text', nullable: true })
  reason: string;

  // Relaciones
  @ManyToOne(() => Return, returnEntity => returnEntity.details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'return_id' })
  return: Return;

  @ManyToOne(() => Product, product => product.returnDetails)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}