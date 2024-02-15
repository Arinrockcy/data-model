import BaseController from "./base-controller.js";

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
   * @param {Entity} entities - The entities for the write operation.
   */
  async write(entities) {
    // Execute write operation
    await this.execute(entities);
  }
}
