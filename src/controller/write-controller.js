import BaseController from "./base-controller";

/**
 * WriteController class responsible for handling write operations to MongoDB.
 * @class
 */
export default class WriteController extends BaseController {
  constructor(model) {
    super(model, 'write');
  }

  /**
   * Perform write operation based on the provided query object.
   * @public
   * @async
   * @param {Object} queryObject - The query object for the write operation.
   */
  async write(queryObject) {
    // Execute write operation
    await this.execute(queryObject);
  }
}
