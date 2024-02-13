import BaseController from "./base-controller.js";


/**
 * ReadController class responsible for handling read operations from MongoDB.
 * @class
 */
export default class ReadController extends BaseController {
  constructor(model) {
    super(model, 'read');
  }

  /**
   * Perform read operation based on the provided query object.
   * @public
   * @async
   * @param {Object} queryObject - The query object for the read operation.
   */
  async read(queryObject) {
    // Execute read operation
    await this.execute(queryObject);
  }
}
