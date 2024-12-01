import { plainToInstance } from 'class-transformer';
import { EventViewDto } from '../dto/event-view.dto';
import { Event } from '../schemas/event.schema';

export function mapToViewEvent(event: Event): EventViewDto {
  return plainToInstance(EventViewDto, event, {
    excludeExtraneousValues: true,
  });
}
