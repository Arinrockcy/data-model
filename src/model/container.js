import Entity from "./Entity.js";
import EntityCollection from './entity-collection.js';
import getKeys from "../util/get-keys.js";
import QueryObject from "./query-object.js";
import ReadController from '../controller/read-controller.js';
import WriteController from "../controller/write-controller.js";

class DataContainer {
  _model = {};

  /**
    * Constructor for DataContainer class.
    * @param {Object} model - The model object containing configurations.
    */
  constructor(model) {
    this._model = model;
    this._entityCollection = new EntityCollection(model);
    this.readController = new ReadController(this._model);
    this.writeController = new WriteController(this._model);
    this._model.on('readData', this._loadReadResult.bind(this));
  }
  /**
       * Getter for retrieving all entities from the collection.
       * @returns {Array} - Array of entities.
       */
  get entities() {
    return this._entityCollection.getAllFromCollection();
  }

  /**
       * Adds data to the entity collection based on the entity type and data provided.
       * @param {string} entityType - Type of the entity to add data to.
       * @param {Object} data - Data to be added to the entity.
       * @returns {Entity} - The updated or newly created entity.
       * @throws {Error} - Throws an error if entityType is not valid.
       */
  addData(entityType, data) {
    const { _config } = this._model;
    if (!this._hasProperty(_config, entityType)) {
      throw new Error(`${entityType} not valid`);
    }

    const entityKeys = getKeys(data, _config[entityType].metaData.keys.flat());
    const existEntity = this._entityCollection.get(entityType, entityKeys);

    if (!existEntity) {
      const entity = new Entity(entityType, this._model);
      entity.create(data);
      this._entityCollection.add(entity);
      return entity;
    } else {
      existEntity.update(data);
      this._entityCollection.add(existEntity);
      return existEntity;
    }
  }

  /**
       * Flattens query objects for easier processing.
       * @param {Array} objs - Array of query objects to flatten.
       * @param {Array} flatQueryObject - The resulting flattened query object array.
       * @throws {TypeError} - Throws a TypeError if objs or flatQueryObject is not an array.
       */
  flatQueryObjects(queryObjects, flatQueryObject) {
    if (!Array.isArray(queryObjects) || !Array.isArray(flatQueryObject)) {
      throw new TypeError('Expected arrays as parameters for flatQueryObjects');
    }

    for (let queryObject of queryObjects) {
      if (!this._hasProperty(queryObject, 'fields') || !this._hasProperty(queryObject, '_domainName') || !Array.isArray(queryObject._childQueryObject)) {
        throw new Error('Invalid object structure in flatQueryObjects');
      }

      flatQueryObject.push({ fields: queryObject.fields, _domainName: queryObject._domainName });
      this.flatQueryObjects(queryObject._childQueryObject, flatQueryObject);
    }
  }

  /**
       * Callback function executed after data is read.
       * Processes read data and adds/updates entities in the collection.
       * @param {Object} readResult - Object containing read records and query object.
       */
  _loadReadResult(readResult) {
    if (typeof readResult !== 'object' || !readResult.records || !readResult._queryObject) {
      throw new TypeError('Invalid read result format');
    }

    const { records, _queryObject } = readResult;
    const flatQueryObject = [{ fields: _queryObject.fields, _domainName: _queryObject._domainName }];
    this.flatQueryObjects(_queryObject._childQueryObject, flatQueryObject);

    for (const _data of records) {
      for (const queryObject of flatQueryObject) {
        const _payload = {};
        const entitySpec = this._model._config[queryObject._domainName];

        for (const field of queryObject.fields) {
          if (_data[field]) {
            if (!this._hasProperty(entitySpec.fields, field)) {
              continue;
            }

            if (this._hasProperty(_data, field)) {
              _payload[field] = _data[field];
              continue;
            }

            const tableSpec = entitySpec.fields[field].table;

            for (const { tableId } of tableSpec) {
              if (this._hasProperty(_data, tableId) && this._hasProperty(_data[tableId][0], field)) {
                _payload[field] = _data[tableId][0][field];
                continue;
              }
            }
          }
        }
        this.addData(queryObject._domainName, _payload);
      }
    }
  }

  _hasProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }
  /**
       * Writes entities to the data source using the write controller.
       * @returns {Promise} - Promise resolving to the result of the write operation.
       */
  async write() {
    return await this.writeController.write(this.entities);
  }

  /**
       * Reads data from the data source based on provided query objects.
       * @param {Object} queryObject - Query object for reading data.
       * @returns {Promise} - Promise resolving to the read data.
       * @throws {TypeError} - Throws a TypeError if readResult is not an object or if the structure is invalid.
  
       */
  async read(queryObject) {
    return await this.readController.read(new QueryObject(this._model, queryObject.query));
  }
}

export default DataContainer;
