import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Redis, { RedisKey } from 'ioredis';
import { Model } from 'mongoose';
import { SortOrder } from '../common/enums';
import { Pagination, ViewByPage } from '../common/types';
import { CreateEventDto, UpdateEventDto } from './dto';
import { EventViewDto } from './dto/event-view.dto';
import { mapToViewEvent } from './mappers';
import { Event, EventDocument } from './schemas/event.schema';
import { EventFilters, EventFindAggregate, EventQuery } from './types';

@Injectable()
export class EventService {
  private readonly cacheTTL = 3600;
  private readonly eventsCacheKey = 'events';

  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectRedis() private readonly redisClient: Redis,
  ) {}

  public async create(eventData: CreateEventDto): Promise<EventViewDto> {
    const event = new this.eventModel(eventData);
    await event.save();

    await this.clearEventsCache();

    return mapToViewEvent(event);
  }

  public async findAll(
    filters: EventFilters,
    pagination: Pagination,
  ): Promise<ViewByPage<EventViewDto[]>> {
    const cacheKey = this.getEventsCacheKey(filters, pagination);
    const cachedData = await this.redisClient.get(cacheKey);

    if (cachedData) {
      const parsedData: ViewByPage<EventDocument[]> = JSON.parse(cachedData);

      const mappedData = await Promise.all(
        parsedData.data.map(async (event: EventDocument) =>
          this.mapEventByCache(event),
        ),
      );
      return {
        ...parsedData,
        data: mappedData,
      };
    }

    const events = await this.queryEventsFromDb(filters, pagination);

    const mappedData = await Promise.all(
      events.data.map(async (event: EventDocument) =>
        this.mapEventByCache(event),
      ),
    );

    await this.redisClient.set(
      cacheKey,
      JSON.stringify(events),
      'EX',
      this.cacheTTL,
    );

    return {
      ...events,
      data: mappedData,
    };
  }

  public async findOne(id: string): Promise<EventViewDto> {
    const cacheKey = this.getEventCacheKey(id);
    const cachedEvent = await this.redisClient.get(cacheKey);

    if (cachedEvent) {
      return this.mapEventByCache(JSON.parse(cachedEvent));
    }

    const event = await this.eventModel.findById(id).lean();
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    await this.redisClient.set(
      cacheKey,
      JSON.stringify(event),
      'EX',
      this.cacheTTL,
    );

    return this.mapEventByCache(event);
  }

  public async update(
    id: string,
    updateData: UpdateEventDto,
  ): Promise<EventViewDto> {
    const event = await this.eventModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    await this.clearEventsCache();
    await this.redisClient.del(this.getEventCacheKey(id));

    return mapToViewEvent(event);
  }

  public async delete(id: string): Promise<void> {
    const result = await this.eventModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    await this.clearEventsCache();
    await this.redisClient.del(this.getEventCacheKey(id));
  }

  public async decrementTickets(eventId: string, count: number): Promise<void> {
    const result = await this.eventModel
      .updateOne(
        { _id: eventId, ticketsAvailable: { $gte: count } },
        { $inc: { ticketsAvailable: -count } },
      )
      .exec();

    if (result.modifiedCount === 0) {
      throw new NotFoundException(
        `Unable to decrement tickets for event with id ${eventId}. Not enough tickets available.`,
      );
    }

    await this.redisClient.del(this.getEventCacheKey(eventId));
    await this.clearEventsCache();
  }

  private async mapEventByCache(event: Event): Promise<EventViewDto> {
    const reservedTicketsKey = this.reservedTicketsKey(event._id.toString());
    const reservedTickets = await this.redisClient.get(reservedTicketsKey);
    const ticketsAvailable = reservedTickets
      ? event.ticketsAvailable - parseInt(reservedTickets)
      : event.ticketsAvailable;
    return mapToViewEvent({
      ...event,
      ticketsAvailable,
    });
  }

  private reservedTicketsKey(eventId: string): RedisKey {
    return `${this.getEventCacheKey(eventId)}:reservedTickets`;
  }

  private getEventsCacheKey(
    filters: EventFilters,
    pagination: Pagination,
  ): string {
    return `${this.eventsCacheKey}:${JSON.stringify(filters)}:${JSON.stringify(
      pagination,
    )}`;
  }

  private getEventCacheKey(eventId: string): RedisKey {
    return `event:${eventId}`;
  }

  private async clearEventsCache(): Promise<void> {
    const keys = await this.redisClient.keys(`${this.eventsCacheKey}*`);
    if (keys.length) {
      await this.redisClient.del(...keys);
    }
  }

  private async queryEventsFromDb(
    filters: EventFilters,
    pagination: Pagination,
  ): Promise<ViewByPage<EventDocument[]>> {
    const { title, dateFrom, dateTo, venue, category } = filters;
    const { page, limit, sortBy, sortOrder } = pagination;

    const query: EventQuery = {
      ...(title && { title: { $regex: title, $options: 'i' } }),
      ...(dateFrom || dateTo
        ? {
            date: {
              ...(dateFrom && { $gte: new Date(dateFrom) }),
              ...(dateTo && { $lte: new Date(dateTo) }),
            },
          }
        : {}),
      ...(venue && { venue: { $regex: venue, $options: 'i' } }),
      ...(category && { category }),
    };

    const sortStage: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === SortOrder.ASC ? 1 : -1,
    };

    const result: EventFindAggregate[] = await this.eventModel.aggregate([
      { $match: query },
      {
        $facet: {
          metadata: [{ $count: 'totalItems' }],
          data: [
            { $sort: sortStage },
            { $skip: (page - 1) * limit },
            { $limit: limit },
          ],
        },
      },
      {
        $project: {
          data: 1,
          totalItems: { $arrayElemAt: ['$metadata.totalItems', 0] },
        },
      },
    ]);

    const { data = [], totalItems = 0 } = result[0] || {};
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  }
}
