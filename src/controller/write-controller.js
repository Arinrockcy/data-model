import { dataTypeMap } from "../db/config.js";
import { DB } from '../db/connect.js';
import mongoose from 'mongoose';
import removeModels from "../util/remove-models.js";
export default class Write {

  /**
     * Constructs a Write object.
     * @param {Object} model - The model object representing the database configuration.
     */
  constructor(model) {
    this._model = model;
    this.init()
  }

  /**
     * Retrieves the data type from the dataTypeMap based on the given dataType.
     * @param {string} dataType - The data type to retrieve from the map.
     * @returns {any} The corresponding data type retrieved from the map.
     * @throws {Error} Throws an error if the provided data type is not found in the map.
     */
  init() {
    this._DB = DB(this._model._dbConfig);
  }

  /**
     * Processes entities and converts them into a structured payload for database operations.
     * @param {Array<Object>} entities - An array of entity objects to process.
     * @returns {Map} A Map object containing structured payload data for database operations.
     */
  getDataType(dataType) {
    if (!dataTypeMap.has(dataType)) {
      throw new Error(`${dataType} is not valid data type`);
    }
    return dataTypeMap.get(dataType);
  }

  /**
   * Processes entities and converts them into a structured payload for database operations.
   * @param {Array<Object>} entities - An array of entity objects to process.
   * @returns {Map} A Map object containing structured payload data for database operations.
   */
  processData(entities) {
    const _payload = new Map();
    for (const entity of entities) {
      for (const key in entity) {
        if (entity.entitySpecs.fields[key]) {
          const entitySpec = entity.entitySpecs.fields[key];
          if (Object.hasOwnProperty.call(entitySpec, "isOneToMany")) {
            continue;
          }
          const element = typeof entity[key] === 'object' && entity[key].value ? entity[key].value : entity[key];
          const dataType = this.getDataType(entitySpec.dataType);
          for (const table of entitySpec.table) {
            if (!_payload.has(table.tableId)) {
              _payload.set(table.tableId, {
                _data: {},
                _keys: [],
                _schema: {},
                _modelName: table.tableId,
                entity: entity
              });
            }
            const payload = _payload.get(table.tableId);
            if (entitySpec.key) {
              payload._keys.push({
                [key]: element
              });
            }
            payload._data[key] = element;
            payload._schema[key] = {
              type: dataType
            }
          }

        }
      }
    }
    return _payload;
  }

  /**
     * Performs operations after saving data to the database.
     * Updates specific fields based on the result of the save operation.
     * @param {Object} result - The result object obtained after saving data to the database.
     * @param {Object} entity - The entity object associated with the saved data.
     * @param {string} modelName - The name of the model/table where the data was saved.
     */
  afterSave(result, entity, modelName) {
    const insertedId = result.id;
    const fieldSpec = Object.values(entity._entitySpecs.fields).find(
      field =>
        field.table.filter(
          table =>
            table.tableId === modelName
                        &&
                        table.columnName === '_id'
        )
    );
    if (fieldSpec) {
      entity.update({ [fieldSpec.path]: insertedId });
    }

  }

  /**
     * Processes conditions for filtering data in a specific format for database queries.
     * @param {Array<Object>} filters - An array of filter objects specifying conditions.
     * @param {string} [operator='and'] - Logical operator ('and' or 'or') to combine multiple filters.
     * @returns {Object} Processed conditions in the required format for database queries.
     */
  processCondition(filters, operator = 'and') {
    let conditions = filters.pop();
    const seen = new Set();
    seen.add(Object.keys(conditions)[0]);
    for (const filter of filters) {
      if (seen.has(Object.keys(filter)[0])) {
        continue;
      }
      seen.add(Object.keys(filter)[0]);
      conditions = {
        ['$' + operator]: [
          conditions,
          filter
        ]
      }
    }
    return conditions;
  }

  /**
     * Recursively performs write operations on the given payload.
     * @param {Array<Object>} _payload - An array of payload objects to write to the database.
     * @returns {number} The count of successful write operations.
     */
  async writes(_payload) {
    if (_payload.length === 0) {
      removeModels();
      return 0
    }
    const payload = _payload.pop();
    const _model = mongoose.models[payload._modelName] || this._DB.model(payload._modelName, new mongoose.Schema(payload._schema));
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const result = await _model.findOneAndUpdate(this.processCondition(payload._keys), payload._data, options);
    this.afterSave(result, payload.entity, payload._modelName)
    return await this.writes(_payload);
  }

  /**
     * Writes entities to the database by processing and executing write operations.
     * @param {Array<Object>} entities - An array of entity objects to be written to the database.
     * @returns {Promise<number>} A promise that resolves to the count of successful write operations.
     */
  async write(entities) {
    const _payload = this.processData(entities);
    return await this.writes(Array.from(_payload.values()));
  }

}