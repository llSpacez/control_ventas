import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Sale } from './sale.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'document_type', type: 'enum', enum: ['DNI', 'RUC', 'CE', 'PASSPORT'], default: 'DNI' })
  documentType: string;

  @Column({ name: 'document_number', length: 20, unique: true })
  documentNumber: string;

  @Column({ name: 'full_name', length: 100 })
  fullName: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relaciones
  @OneToMany(() => Sale, sale => sale.customer)
  sales: Sale[];
}