import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'parent_category_id', nullable: true })
  parentCategoryId: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relaciones
  @ManyToOne(() => Category, category => category.children)
  @JoinColumn({ name: 'parent_category_id' })
  parentCategory: Category;

  @OneToMany(() => Category, category => category.parentCategory)
  children: Category[];

  @OneToMany(() => Product, product => product.category)
  products: Product[];
}