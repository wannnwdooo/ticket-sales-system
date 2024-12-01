import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { EventCategory } from '../enums';

export type EventDocument = HydratedDocument<Event>;

@Schema({ timestamps: true })
export class Event {
  public _id!: Types.ObjectId;

  @Prop({ required: true })
  public title!: string;

  @Prop({ required: true })
  public description!: string;

  @Prop({ required: true })
  public date!: Date;

  @Prop({ required: true })
  public venue!: string;

  @Prop({ required: true, min: 0 })
  public ticketsAvailable!: number;

  @Prop({ required: true, min: 0 })
  public price!: number;

  @Prop({ required: true, enum: EventCategory })
  public category!: EventCategory;
}

export const EventSchema = SchemaFactory.createForClass(Event);
