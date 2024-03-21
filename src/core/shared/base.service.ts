import { Document, Model, Types } from 'mongoose';
import { InvalidIdException } from '../exceptions/invalid-id.exception';
import { isEmpty } from 'lodash';
import { toPipelineStage } from '../utils';

/**
 * Base CRUD service contains functionality shared between all services
 */
export class BaseService<T> {
  constructor(protected model: Model<any & Document>) {}

  /**
   * Validate id and return a valid BSON ObjectId
   */
  public toObjectId(id: string | Types.ObjectId): Types.ObjectId {
    if (!Types.ObjectId.isValid(id)) throw new InvalidIdException();

    return typeof id === 'string' ? new Types.ObjectId(id) : id;
  }

  /**
   * Sort search results with one or more fields
   */
  public sort(aggregation: any, sort: string, dir: string) {
    if (dir === 'asc') aggregation.push({ $sort: { [sort]: 1 } });
    else aggregation.push({ $sort: { [sort]: -1 } });
  }

  /**
   * update a single document by its _id field
   */
  async updateById(
    id: string | Types.ObjectId,
    updates: any,
    projection = {},
  ): Promise<T> {
    const doc = await this.model.findByIdAndUpdate(
      this.toObjectId(id),
      updates,
      projection,
    );

    return doc as unknown as T;
  }

  public filter(
    aggregation: Record<string, any>[],
    filterBy: Record<string, any>[],
  ) {
    const matchQry = [];
    for (const filter of filterBy) {
      if (!isEmpty(filter)) matchQry.push(toPipelineStage(filter));
    }

    if (matchQry.length) aggregation.push({ $match: { $and: matchQry } });
  }
}
