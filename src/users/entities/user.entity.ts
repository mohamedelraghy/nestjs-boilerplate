import { Prop, Schema } from '@nestjs/mongoose';

import { BaseEntity } from 'src/core/entities/base.entity';
import { toHash } from 'src/core/utils';

@Schema({ timestamps: true, id: true, versionKey: false })
export class User extends BaseEntity {
  @Prop({ type: String, required: true, lowerCase: true, unique: true })
  email: string;

  @Prop({ type: String, required: true, set: (value: string) => toHash(value) })
  password: string;
}
