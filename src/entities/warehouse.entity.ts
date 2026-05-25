import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Inventory } from './inventory.entity';

@Entity('warehouses')
export class Warehouse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 200, nullable: true })
  location: string;

  @Column({ name: 'manager_name', length: 100, nullable: true })
  managerName: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relaciones
  @OneToMany(() => Inventory, inventory => inventory.warehouse)
  inventories: Inventory[];
}