import { Types } from 'mongoose';

export type ObjectId = Types.ObjectId;

export function toPipelineStage(
  filter: Record<string, any>,
): Record<string, any> {
  const [key, value] = Object.entries(filter)[0] as [string, any];

  if (typeof value === 'string' && Types.ObjectId.isValid(value))
    filter[key] = new Types.ObjectId(value);

  if (typeof value !== 'string' && value[0]) {
    let valueTransformed = value;
    if (Types.ObjectId.isValid(value[0])) {
      valueTransformed = value.map((id: string) => new Types.ObjectId(id));
    }
    filter[key] = { $in: valueTransformed };
  }

  return filter;
}

export function arrayToProjection(
  attributes: string[],
): Record<string, number> {
  const specifications = {};
  for (const attr of attributes) {
    specifications[attr] = 1;
  }
  return specifications;
}
