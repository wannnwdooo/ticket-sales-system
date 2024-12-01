import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { BookingViewDto, CreateBookingDto, UpdateBookingDto } from './dto';

@Controller()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @ApiResponse({ type: BookingViewDto, status: HttpStatus.CREATED })
  public async create(
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<BookingViewDto> {
    return this.bookingService.create(createBookingDto);
  }

  @Get(':userId')
  @ApiOkResponse({ type: BookingViewDto, isArray: true })
  public async findAll(
    @Param('userId') userId: string,
  ): Promise<BookingViewDto[]> {
    return this.bookingService.findAll(userId);
  }

  @Get(':bookingId/:userId')
  @ApiOkResponse({ type: BookingViewDto })
  public async findOne(
    @Param('bookingId') bookingId: string,
    @Param('userId') userId: string,
  ): Promise<BookingViewDto> {
    return this.bookingService.findOne(bookingId, userId);
  }

  @Patch(':bookingId/complete')
  @ApiOkResponse({ type: BookingViewDto })
  public async completeReservation(
    @Param('bookingId') bookingId: string,
  ): Promise<BookingViewDto> {
    return this.bookingService.completeReservation(bookingId);
  }

  @Patch(':bookingId')
  @ApiResponse({ type: BookingViewDto, status: HttpStatus.OK })
  public async update(
    @Param('bookingId') bookingId: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ): Promise<BookingViewDto> {
    return this.bookingService.update(bookingId, updateBookingDto);
  }

  @Delete(':bookingId')
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  public async delete(@Param('bookingId') bookingId: string): Promise<void> {
    await this.bookingService.delete(bookingId);
  }
}
