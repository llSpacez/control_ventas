import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Category } from './category.entity';
import { Supplier } from './supplier.entity';
import { SaleDetail } from './sale-detail.entity';
import { PurchaseDetail } from './purchase-detail.entity';
import { Inventory } from './inventory.entity';
import { ReturnDetail } from './return-detail.entity';

@Entity('products')
@Index(['code', 'barcode'])
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ length: 100, unique: true, nullable: true })
  barcode: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cost: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ name: 'min_stock', type: 'int', default: 5 })
  minStock: number;

  @Column({ name: 'category_id' })
  categoryId: number;

  @Column({ name: 'supplier_id', nullable: true })
  supplierId: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Category, category => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Supplier, supplier => supplier.products)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @OneToMany(() => SaleDetail, saleDetail => saleDetail.product)
  saleDetails: SaleDetail[];

  @OneToMany(() => PurchaseDetail, purchaseDetail => purchaseDetail.product)
  purchaseDetails: PurchaseDetail[];

  @OneToMany(() => Inventory, inventory => inventory.product)
  inventories: Inventory[];

  @OneToMany(() => ReturnDetail, returnDetail => returnDetail.product)
  returnDetails: ReturnDetail[];
}