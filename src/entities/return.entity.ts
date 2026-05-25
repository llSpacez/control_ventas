import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from 'typeorm';
import { Sale } from './sale.entity';
import { User } from './user.entity';
import { ReturnDetail } from './return-detail.entity';

@Entity('returns')
export class Return {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'return_number', length: 50, unique: true })
  returnNumber: string;

  @Column({ name: 'sale_id' })
  saleId: number;

  @Column({ name: 'return_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  returnDate: Date;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'enum', enum: ['pending', 'approved', 'rejected', 'completed'], default: 'pending' })
  status: string;

  @Column({ name: 'user_id' })
  userId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relaciones
  @ManyToOne(() => Sale, sale => sale.id)
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => ReturnDetail, detail => detail.return, { cascade: true })
  details: ReturnDetail[];
}