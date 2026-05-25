import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Sale } from './sale.entity';
import { Product } from './product.entity';

@Entity('sale_details')
export class SaleDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'sale_id' })
  saleId: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  // Relaciones
  @ManyToOne(() => Sale, sale => sale.details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;

  @ManyToOne(() => Product, product => product.saleDetails)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}