import { Column, Entity, OneToMany } from 'typeorm';
import { Role } from '../../auth/enums';
import { Booking } from '../../booking/entities/booking.entity';
import { AbstractEntity } from '../../common/entities';
import { Transaction } from '../../transaction/entities/transaction.entity';

@Entity('users')
export class User extends AbstractEntity {
  @Column({ unique: true })
  public email!: string;

  @Column()
  public password!: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  public role!: Role;

  @Column({ name: 'refresh_token', nullable: true, default: null })
  refreshToken!: string;

  @OneToMany(() => Booking, (booking) => booking.user)
  public bookings!: Booking[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  public transactions!: Transaction[];
}
