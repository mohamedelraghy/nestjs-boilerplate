import { Document, Model, Types } from 'mongoose';
import { InvalidIdException } from '../exceptions/invalid-id.exception';
import { isEmpty } from 'lodash';
import { arrayToProjection, toPipelineStage } from '../utils';
import { Pagination } from './pagination.dto';
import { RecordExistsException } from '../exceptions/record-exists.exception';
import { RecordNotFoundException } from '../exceptions';

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
  public sort(aggregation: Record<string, any>[], sort: string, dir: string) {
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

  /**
   * Filter aggregated  results.
   */
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

  /**
   * Select only specific fields required by the user.
   */
  public project(
    aggregation: Record<string, any>[],
    attributes: string[],
  ): void {
    aggregation.push({ $project: arrayToProjection(attributes) });
  }

  /**
   * Skip a number of documents and apply a limit on the result.
   */
  public paginate(
    aggregation: Record<string, any>[],
    offset: number,
    size: number,
  ): void {
    aggregation.push({ $skip: offset }, { $limit: size });
  }

  public async exists(filter: Record<string, any>) {
    return await this.model.exists(filter);
  }

  public async count(filter: Record<string, any>): Promise<number> {
    return await this.model.countDocuments(filter);
  }

  /**
   * Creates a new document or documents
   */
  async create(model: any) {
    try {
      const doc = await this.model.create(model);
      return doc as T;
    } catch (err) {
      if (err.code === 11000) {
        throw new RecordExistsException(this.model.modelName);
      }
    }
  }

  async bulkWrite(writes) {
    if (writes.length) {
      return await this.model.bulkWrite(writes);
    }
  }

  /**
   * Finds one document that matches the given filter.
   */
  async findOne(filter: any, projection: any = {}): Promise<T> {
    const doc = await this.model.findOne(filter, projection).exec();

    return doc as T;
  }

  /**
   * Finds one document that matches the given filter.
   * Throws error if not found.
   */
  async findOneAndErr(filter: any, projection: any = {}): Promise<T> {
    const doc = await this.model.findOne(filter, projection).exec();
    if (!doc) {
      throw new RecordNotFoundException(this.model.modelName);
    }

    return doc as T;
  }

  /**
   * Finds a single document by its _id field.
   */
  async findOneById(
    id: string | Types.ObjectId,
    projection: any = {},
  ): Promise<T> {
    const doc = await this.model
      .findById(this.toObjectId(id), projection)
      .exec();
    if (!doc) {
      throw new RecordNotFoundException(this.model.modelName);
    }

    return doc as T;
  }

  /**
   * Finds all documents that match the given filter.
   */
  async find(filter: any = {}, projection: any = {}): Promise<T[]> {
    const docs = await this.model.find(filter, projection).exec();
    return docs as unknown[] as T[];
  }

  /**
   * Updates a single document by its _id field.
   */
  async update(
    id: string | Types.ObjectId,
    updates: any,
    projection = {},
  ): Promise<T> {
    const doc = await this.model.findByIdAndUpdate(
      this.toObjectId(id),
      updates,
      {
        new: true,
        projection,
      },
    );
    if (!doc) {
      throw new RecordNotFoundException(this.model.modelName);
    }

    return doc as T;
  }

  /**
   * Removes one document by id.
   */
  async remove(id: string | Types.ObjectId) {
    const doc = await this.model.findByIdAndDelete(this.toObjectId(id));
    if (!doc) {
      throw new RecordNotFoundException(this.model.modelName);
    }

    return true;
  }
  /**
   * Remove all document collection.
   */
  async removeAll(filter: any) {
    const doc = await this.model.deleteMany(filter);
    if (!doc) {
      throw new RecordNotFoundException(this.model.modelName);
    }

    return true;
  }

  /**
   * Removes one document that match filter.
   */
  async removeOne(filter: any) {
    const doc = await this.model.findOneAndDelete(filter);
    if (!doc) {
      throw new RecordNotFoundException(this.model.modelName);
    }

    return true;
  }

  /**
   * Aggregate a collection to retrieve multiple documents
   */
  async aggregate(
    aggregation: any[],
    offset: number,
    size: number,
  ): Promise<Pagination> {
    aggregation.push(
      {
        $group: {
          _id: null,
          content: { $push: '$$ROOT' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          content: { $slice: ['$content', offset, size] },
          count: 1,
          _id: 0,
        },
      },
    );

    const data = await this.model.aggregate(aggregation);
    return new Pagination(data[0]);
  }

  /**
   * Aggregates a collection to retrieve one document.
   */
  async aggregateOne(aggregation: any[]): Promise<T> {
    const data = await this.model.aggregate(aggregation);
    return data[0] as unknown as T;
  }
}
