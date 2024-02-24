import BaseController from "./base-controller.js";

/**
 * WriteController class responsible for handling write operations to MongoDB.
 * @class
 */
export default class WriteController extends BaseController {
  constructor(model) {
    super(model, 'write');
    this._modelNameMap = new Map();
  }

  /**
   * Perform write operation based on the provided query object.
   * @public
   * @async
   * @param {<Entity>} entities - The entities for the write operation.
   */
  async write(entities) {
    this._groupByModelName(entities);
    // Execute write operation
    await this.saveData(this._modelNameMap);
  }
 
  /**
   * Group entities by their model name.
   * @private
   * @param {Array<Entity>} entities - The entities to group.
   */
  _groupByModelName(entities) {
    for (const entity of entities) {
      const { fields } = entity._entitySpecs;
      for (const fieldName in fields) {
        if (Object.hasOwnProperty.call(fields, fieldName) && entity[fieldName]) {
          const { tables } = fields[fieldName];
          if (!Array.isArray(tables) || tables.length === 0) {
            continue;
          }
          const { connectionName } = tables[0];
          if (!this._modelNameMap.has(connectionName)) {
            this._modelNameMap.set(connectionName, new Set());
          }
          const _modelNameMap = this._modelNameMap.get(connectionName);
          _modelNameMap.add(entity);
        }
      }
      console.log(entity);
    }
    console.log(this._modelNameMap)
  }
}
