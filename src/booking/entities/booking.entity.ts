import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { AbstractEntity } from '../../common/entities';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { User } from '../../user/entities/user.entity';

@Entity('bookings')
export class Booking extends AbstractEntity {
  @Column()
  public eventId!: string;

  @Column()
  public ticketsCount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  public totalPrice!: number;

  @ManyToOne(() => User, (user) => user.bookings)
  public user!: User;

  @OneToOne(() => Transaction, (transaction) => transaction.booking)
  public transaction!: Transaction;
}
