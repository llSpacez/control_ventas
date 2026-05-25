import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product.entity';
import { Warehouse } from './warehouse.entity';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'warehouse_id' })
  warehouseId: number;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ name: 'min_stock', type: 'int', default: 5 })
  minStock: number;

  @Column({ name: 'max_stock', type: 'int', default: 100 })
  maxStock: number;

  @UpdateDateColumn({ name: 'last_updated' })
  lastUpdated: Date;

  // Relaciones
  @ManyToOne(() => Product, product => product.inventories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Warehouse, warehouse => warehouse.inventories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;
}