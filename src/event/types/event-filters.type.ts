import { EventCategory } from '../enums';

export type EventFilters = Partial<{
  title: string;
  dateFrom: string;
  dateTo: string;
  venue: string;
  category: EventCategory;
}>;
