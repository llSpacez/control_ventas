import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Role } from './role.entity';
import { Sale } from './sale.entity';
import { Purchase } from './purchase.entity';
import { Payment } from './payment.entity';
import { CashRegister } from './cash-register.entity';
import { Expense } from './expense.entity';
import { SystemLog } from './system-log.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ length: 255 })
  password: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ name: 'full_name', length: 100 })
  fullName: string;

  @Column({ name: 'role_id' })
  roleId: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'last_login', type: 'timestamp', nullable: true })
  lastLogin: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToMany(() => Sale, sale => sale.user)
  sales: Sale[];

  @OneToMany(() => Purchase, purchase => purchase.user)
  purchases: Purchase[];

  @OneToMany(() => Payment, payment => payment.user)
  payments: Payment[];

  @OneToMany(() => CashRegister, cashRegister => cashRegister.openedBy)
  cashRegistersOpened: CashRegister[];

  @OneToMany(() => Expense, expense => expense.user)
  expenses: Expense[];

  @OneToMany(() => SystemLog, log => log.user)
  logs: SystemLog[];
}