import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Product } from './product.entity';
import { Purchase } from './purchase.entity';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, unique: true })
  ruc: string;

  @Column({ name: 'business_name', length: 100 })
  businessName: string;

  @Column({ name: 'contact_name', length: 100, nullable: true })
  contactName: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relaciones
  @OneToMany(() => Product, product => product.supplier)
  products: Product[];

  @OneToMany(() => Purchase, purchase => purchase.supplier)
  purchases: Purchase[];
}