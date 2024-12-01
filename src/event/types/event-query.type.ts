import { EventCategory } from '../enums';

export type EventQuery = Partial<{
  title: { $regex: string; $options: string };
  date: { $gte?: Date; $lte?: Date };
  venue: { $regex: string; $options: string };
  category: EventCategory;
}>;
