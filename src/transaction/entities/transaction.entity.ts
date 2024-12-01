import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';
import { AbstractEntity } from '../../common/entities';
import { User } from '../../user/entities/user.entity';
import { TransactionStatus } from '../enums';

@Entity('transactions')
export class Transaction extends AbstractEntity {
  @Column()
  public eventId!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  public amount!: number;

  @Column({ type: 'enum', enum: TransactionStatus })
  public status!: TransactionStatus;

  @ManyToOne(() => User, (user) => user.transactions)
  public user!: User;

  @OneToOne(() => Booking, (booking) => booking.transaction, { cascade: true })
  @JoinColumn()
  public booking!: Booking;
}
