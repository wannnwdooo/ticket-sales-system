import { InjectRedis } from '@nestjs-modules/ioredis';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Redis, { RedisKey } from 'ioredis';
import { EventService } from 'src/event/event.service';
import { EntityManager, Repository } from 'typeorm';
import { TransactionStatus } from '../transaction/enums';
import { TransactionService } from '../transaction/transaction.service';
import { UserService } from '../user/user.service';
import { BookingViewDto, CreateBookingDto, UpdateBookingDto } from './dto';
import { Booking } from './entities/booking.entity';
import { mapToViewBooking } from './mappers';

@Injectable()
export class BookingService {
  private readonly reservationTTL = 300;

  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly entityManager: EntityManager,
    @InjectRedis()
    private readonly redisClient: Redis,
    private readonly eventService: EventService,
    private readonly transactionService: TransactionService,
    private readonly userService: UserService,
  ) {}

  public async create(
    createBookingDto: CreateBookingDto,
  ): Promise<BookingViewDto> {
    const { userId, eventId, ticketsCount } = createBookingDto;

    const event = await this.eventService.findOne(eventId);
    if (!event) {
      throw new NotFoundException(`Event with id ${eventId} not found`);
    }

    const user = await this.userService.findOneById(userId);

    const reservedTicketsKey = this.reservedTicketsKey(eventId);

    if (ticketsCount > event.ticketsAvailable) {
      throw new ConflictException('Not enough tickets available');
    }

    await this.redisClient.incrby(reservedTicketsKey, ticketsCount);
    await this.redisClient.expire(reservedTicketsKey, this.reservationTTL);

    return this.entityManager
      .transaction(async (entityManager) => {
        const totalPrice = ticketsCount * event.price;

        const booking = this.bookingRepository.create({
          eventId,
          ticketsCount,
          totalPrice,
          user,
        });

        const savedBooking = await entityManager.save(booking);

        const transaction = await this.transactionService.create(
          {
            booking: savedBooking,
            user,
            eventId,
            amount: totalPrice,
            status: TransactionStatus.PENDING,
          },
          entityManager,
        );
        return mapToViewBooking({ ...savedBooking, transaction });
      })
      .catch(async (error) => {
        await this.redisClient.decrby(reservedTicketsKey, ticketsCount);
        throw error;
      });
  }

  public async findAll(userId: string): Promise<BookingViewDto[]> {
    return this.bookingRepository.find({
      where: { user: { id: userId } },
      select: ['id', 'eventId', 'ticketsCount', 'totalPrice'],
    });
  }

  public async findOne(
    bookingId: string,
    userId: string,
  ): Promise<BookingViewDto> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId, user: { id: userId } },
      select: ['id', 'eventId', 'ticketsCount', 'totalPrice'],
    });
    if (!booking) {
      throw new NotFoundException(`Booking with id ${bookingId} not found`);
    }
    return mapToViewBooking(booking);
  }

  public async update(
    bookingId: string,
    { ticketsCount }: UpdateBookingDto,
  ): Promise<BookingViewDto> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: { transaction: true },
    });
    if (!booking) {
      throw new NotFoundException(`Booking with id ${bookingId} not found`);
    }
    this.checkByTTLReservation(booking.createdAt);
    const event = await this.eventService.findOne(booking.eventId);

    return this.entityManager.transaction(async (entityManager) => {
      const totalPrice = ticketsCount * event.price;

      booking.ticketsCount = ticketsCount;
      booking.totalPrice = totalPrice;
      const savedBooking = await entityManager.save(booking);

      booking.transaction.amount = totalPrice;
      const transaction = await this.transactionService.update(
        booking.transaction,
        entityManager,
      );
      return mapToViewBooking({ ...savedBooking, transaction });
    });
  }

  public async delete(bookingId: string): Promise<void> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: { transaction: true },
    });
    if (!booking) {
      throw new NotFoundException(`Booking with id ${bookingId} not found`);
    }

    await this.transactionService.delete(booking.transaction.id);

    await this.bookingRepository.softDelete(bookingId);
  }

  public async completeReservation(bookingId: string): Promise<BookingViewDto> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: { transaction: true, user: true },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with id ${bookingId} not found`);
    }

    this.checkByTTLReservation(booking.createdAt);

    await this.eventService.decrementTickets(
      booking.eventId,
      booking.ticketsCount,
    );

    await this.transactionService.updateStatus(
      booking.transaction.id,
      TransactionStatus.SUCCESS,
    );

    const reservedTicketsKey = this.reservedTicketsKey(booking.eventId);
    await this.redisClient.decrby(reservedTicketsKey, booking.ticketsCount);

    return mapToViewBooking({
      ...booking,
      transaction: {
        ...booking.transaction,
        status: TransactionStatus.SUCCESS,
      },
    });
  }

  private reservedTicketsKey(eventId: string): RedisKey {
    return `event:${eventId}:reservedTickets`;
  }

  private checkByTTLReservation(createdAt: Date) {
    const currentTime = Math.floor(Date.now() / 1000);
    const bookingCreatedTime = Math.floor(createdAt.getTime() / 1000);

    if (currentTime - bookingCreatedTime > this.reservationTTL) {
      throw new ConflictException(
        'Reservation time exceeded. Booking cannot be completed.',
      );
    }
  }
}
