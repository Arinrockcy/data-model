import { dataTypeMap } from "../../db/config.js";
import mongoose from 'mongoose';
import removeModels from "../../util/remove-models.js";
export default class WriteQueryController {
  constructor(model, connectionName) {
    this._model = model;
    this._dataBaseConnection = model._dataBaseConnections.get(connectionName).getConnection();
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
    const payloadMap = new Map();

    for (const entity of entities) {
      const { entityFields, entitySpecs } = entity;

      for (const key in entityFields) {
        const fieldSpec = entityFields[key];
        const field = entity[key]
        if (!field) {
          continue;
        }
        if (fieldSpec && !fieldSpec.isOneToMany) {
          const fieldValue = (typeof field === 'object' && field.value) ? field.value : field;
          const dataType = this.getDataType(fieldSpec.dataType);

          for (const table of fieldSpec.tables) {
            const tableId = table.tableId;

            if (!payloadMap.has(tableId)) {
              payloadMap.set(tableId, {
                _data: {},
                _keys: [],
                _schema: {},
                _modelName: tableId,
                entity: entity
              });
            }

            const payload = payloadMap.get(tableId);

            if (entitySpecs.fields[key].key) {
              payload._keys.push({ [key]: fieldValue });
            }

            payload._data[key] = fieldValue;
            payload._schema[key] = { type: dataType };
          }
        }
      }
    }

    return payloadMap;
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
        field.tables.filter(
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
  async writes(_payloads) {
    while (_payloads.length > 0) {
      const { _modelName: modelName, _schema: schema, _keys: keys, _data: data, entity } = _payloads.pop();
  
      // Ensure the model exists, or create a new one if it doesn't
      const Model = mongoose.models[modelName] || mongoose.model(modelName, new mongoose.Schema(schema));
  
      // Configure options for findOneAndUpdate
      const options = { upsert: true, new: true, setDefaultsOnInsert: true };
  
      // Perform the update operation
      const result = await Model.findOneAndUpdate(this.processCondition(keys), data, options);
  
      // Handle any post-save operations
      this.afterSave(result, entity, modelName);
    }
    removeModels();
    // Return a value indicating the operation is done
    return 0;
  }
  

  /**
     * Writes entities to the database by processing and executing write operations.
     * @param {Array<Object>} entities - An array of entity objects to be written to the database.
     * @returns {Promise<number>} A promise that resolves to the count of successful write operations.
     */
  async write(entities) {
    const _payload = this.processData(entities);
    return this.writes(Array.from(_payload.values()));
  }
}