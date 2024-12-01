import { EventDocument } from '../schemas/event.schema';

export type EventFindAggregate = {
  data: EventDocument[];
  totalItems: number;
};
