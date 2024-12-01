import { Test, TestingModule } from '@nestjs/testing';
import { ViewByPage } from '../common/types';
import { CreateEventDto, UpdateEventDto } from './dto';
import { EventViewDto } from './dto/event-view.dto';
import { EventCategory } from './enums';
import { EventController } from './event.controller';
import { EventService } from './event.service';

describe('EventController', () => {
  let eventController: EventController;
  let eventService: jest.Mocked<EventService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        {
          provide: EventService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    eventController = module.get<EventController>(EventController);
    eventService = module.get(EventService);
  });

  describe('create', () => {
    it('should create an event', async () => {
      const createDto: CreateEventDto = {
        title: 'Test Event',
        date: new Date().toISOString(),
        venue: 'Venue',
        category: EventCategory.THEATER,
        ticketsAvailable: 100,
        description: 'Test Description',
        price: 0,
      };
      const viewDto: EventViewDto = {
        _id: '674417809f2fdc360348596e',
        ...createDto,
        date: new Date(createDto.date),
      };
      eventService.create.mockResolvedValueOnce(viewDto);

      const result = await eventController.create(createDto);

      expect(eventService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(viewDto);
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of events', async () => {
      const events: EventViewDto[] = [
        {
          _id: '674417809f2fdc360348596e',
          title: 'Event 1',
          description: 'Description 1',
          date: new Date(),
          venue: 'Venue 1',
          ticketsAvailable: 100,
          price: 50,
          category: EventCategory.CINEMA,
        },
        {
          _id: '674417809f2fdc360348591t',
          title: 'Event 2',
          description: 'Description 2',
          date: new Date(),
          venue: 'Venue 2',
          ticketsAvailable: 200,
          price: 75,
          category: EventCategory.THEATER,
        },
      ];

      const paginatedResult: ViewByPage<EventViewDto[]> = {
        data: events,
        meta: {
          totalItems: 2,
          totalPages: 1,
          currentPage: 1,
          itemsPerPage: 10,
        },
      };

      jest
        .spyOn(eventService, 'findAll')
        .mockResolvedValueOnce(paginatedResult);

      const result = await eventController.findAll();

      expect(eventService.findAll).toHaveBeenCalled();
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('findOne', () => {
    it('should return a single event', async () => {
      const event: EventViewDto = {
        _id: '674417809f2fdc360348596e',
        title: 'Test Event',
        description: 'Event description',
        date: new Date(),
        venue: 'Test Venue',
        ticketsAvailable: 100,
        price: 50,
        category: EventCategory.CINEMA,
      };

      jest.spyOn(eventService, 'findOne').mockResolvedValueOnce(event);
      const result = await eventController.findOne('674417809f2fdc360348596e');
      expect(eventService.findOne).toHaveBeenCalledWith(
        '674417809f2fdc360348596e',
      );
      expect(result).toEqual(event);
    });
  });

  describe('update', () => {
    it('should update an event', async () => {
      const updateDto: UpdateEventDto = { title: 'Updated Title' };

      const updatedEvent: EventViewDto = {
        _id: '674417809f2fdc360348596e',
        title: 'Updated Title',
        description: 'Updated Description',
        date: new Date(),
        venue: 'Updated Venue',
        ticketsAvailable: 100,
        price: 50,
        category: EventCategory.CINEMA,
      };

      jest.spyOn(eventService, 'update').mockResolvedValueOnce(updatedEvent);
      const result = await eventController.update(
        '674417809f2fdc360348596e',
        updateDto,
      );
      expect(eventService.update).toHaveBeenCalledWith(
        '674417809f2fdc360348596e',
        updateDto,
      );
      expect(result).toEqual(updatedEvent);
    });
  });

  describe('delete', () => {
    it('should delete an event', async () => {
      eventService.delete.mockResolvedValueOnce();

      await eventController.remove('674417809f2fdc360348596e');

      expect(eventService.delete).toHaveBeenCalledWith(
        '674417809f2fdc360348596e',
      );
    });
  });
});
