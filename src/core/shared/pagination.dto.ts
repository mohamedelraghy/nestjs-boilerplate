/**
 * Creates paginated results.
 *
 */

export class Pagination {
  constructor(args: any = {}) {
    Object.assign(this, args);
  }

  /**
   * the number of docs available that match the search filter.
   */
  count = 0;

  /**
   * content returned.
   */
  content = [];
}
