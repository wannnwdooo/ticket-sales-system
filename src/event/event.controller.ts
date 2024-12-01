import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Public, Roles } from '../auth/decorators';
import { Role } from '../auth/enums';
import { RolesGuard } from '../auth/guards';
import { ApiOkResponsePaginated } from '../common/decorators';
import { SortOrder } from '../common/enums';
import { ViewByPage } from '../common/types';
import { CreateEventDto, UpdateEventDto } from './dto';
import { EventViewDto } from './dto/event-view.dto';
import { EventCategory } from './enums';
import { EventService } from './event.service';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Roles(Role.ORGANIZER)
  @UseGuards(RolesGuard)
  @Post()
  @ApiResponse({ type: EventViewDto, status: HttpStatus.CREATED })
  public async create(
    @Body() createEventDto: CreateEventDto,
  ): Promise<EventViewDto> {
    return this.eventService.create(createEventDto);
  }

  @Public()
  @Get()
  @ApiOkResponsePaginated(EventViewDto)
  @ApiQuery({
    name: 'title',
    required: false,
    description: 'Filter by title',
  })
  @ApiQuery({
    name: 'dateFrom',
    required: false,
    description: 'Filter events from this date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'dateTo',
    required: false,
    description: 'Filter events up to this date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'venue',
    required: false,
    description: 'Filter by venue',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    enum: EventCategory,
    description: 'Filter by event category',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Field to sort by (e.g. date, title)',
    example: 'title',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: SortOrder,
    description: 'Sorting order: "asc" for ascending or "desc" for descending',
  })
  public async findAll(
    @Query('title') title?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('venue') venue?: string,
    @Query('category') category?: EventCategory,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sortBy') sortBy = 'title',
    @Query('sortOrder') sortOrder: SortOrder = SortOrder.ASC,
  ): Promise<ViewByPage<EventViewDto[]>> {
    return this.eventService.findAll(
      { title, dateFrom, dateTo, venue, category },
      { page: Number(page), limit: Number(limit), sortBy, sortOrder },
    );
  }

  @Public()
  @Get(':id')
  @ApiOkResponse({ type: EventViewDto })
  public async findOne(@Param('id') id: string): Promise<EventViewDto> {
    return this.eventService.findOne(id);
  }

  @Roles(Role.ORGANIZER)
  @UseGuards(RolesGuard)
  @Patch(':id')
  @ApiResponse({ type: EventViewDto, status: HttpStatus.OK })
  public async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<EventViewDto> {
    return this.eventService.update(id, updateEventDto);
  }

  @Roles(Role.ORGANIZER)
  @UseGuards(RolesGuard)
  @Delete(':id')
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  public async remove(@Param('id') id: string): Promise<void> {
    return this.eventService.delete(id);
  }
}
