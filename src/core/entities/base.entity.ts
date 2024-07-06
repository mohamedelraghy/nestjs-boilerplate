import { Prop, Schema } from '@nestjs/mongoose';
import { ObjectId } from '../utils';
import { Types } from 'mongoose';

@Schema({ timestamps: true, id: true, versionKey: false })
export class BaseEntity {
  constructor(args: any = {}) {
    Object.assign(this, args);
  }

  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: ObjectId;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}
