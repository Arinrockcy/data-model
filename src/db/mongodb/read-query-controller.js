import QueryObject from '../../model/query-object.js'
import QueryFilterGroup from '../../model/query-filter-group.js';
// import QueryFilter from '../model/query-filters.js';
import mongoose from 'mongoose';
import { dataTypeMap } from "../config.js";
import removeModels from '../../util/remove-models.js';

/**
 * ReadController class responsible for handling read operations from MongoDB.
 */
export default class ReadQueryController {
  /**
   * Constructor for ReadController.
   * @param {Object} model - The model for which the controller is created.
   */
  constructor(model) {
    this._model = model;
    this._DB = {};
  }

  /**
   * Get the data type based on the provided data type string.
   * @param {string} dataType - The data type string to retrieve from the dataTypeMap.
   * @returns {string} The retrieved data type.
   * @throws {Error} Throws an error if the provided data type is not found in the dataTypeMap.
   */
  getDBDataType(dataType) {
    if (!dataTypeMap.has(dataType)) {
      throw new Error(`${dataType} is not valid data type`);
    }
    return dataTypeMap.get(dataType);
  }

  /**
   * Construct query objects based on specified fields and domain name.
   * @param {Array} fields - Array of fields to construct query objects for.
   * @param {string} domainName - Name of the domain to get field configurations from.
   * @param {Map} _query - Map of query objects to update.
   * @returns {Map} Updated map of query objects based on fields and domains.
   */
  getModelBasedOnFields(fields, domainName, _query = new Map()) {
    const domainSpecs = this._model.domainSpec[domainName];
    for (const field of fields) {
      const { key, table, dataType } = domainSpecs.fields[field];
      const dataTypeDb = this.getDBDataType(dataType);
      for (const tableSpec of table) {
        if (!_query.has(tableSpec.tableId)) {
          _query.set(tableSpec.tableId, {
            _schema: {},
            _modelName: tableSpec.tableId,
            _baseModel: false,
            _match: {},
            _keys: [],
            _fields: [],
            _lookup: {
              from: tableSpec.tableId,
              localField: "",
              foreignField: "",
              as: tableSpec.tableId
            }
          });
        }
        const query = _query.get(tableSpec.tableId);
        query._schema[field] = {
          type: dataTypeDb
        }
        query._fields.push(field);
        if (key) {
          query._keys.push(field);
        }
      }
    }
    return _query;
  }

  /**
   * Set join keys between two models.
   * @param {Object} baseModel - The base model object.
   * @param {Object} model - The model object to set join keys for.
   */
  lookUpKeysOnOtherModel(baseModel, model) {
    let found = model._keys.find(key => baseModel[1]._keys.includes(key));
        
    model._lookup.localField = found;
    model._lookup.foreignField = baseModel[1]._modelName + '.' + found;
  }

  /**
   * Identify and set join keys between models based on their fields.
   * @param {Array} baseModelKeys - Array of keys in the base model.
   * @param {Array} models - Array of models involved in the query.
   */
  identifyJoinKey(baseModelKyes, models) {
    let index = 0;
    for (const modelObject of models) {
      const [, model] = modelObject;
      let found = model._keys.find(key => baseModelKyes.includes(key));
      if (!found) {
        this.lookUpKeysOnOtherModel(models[index - 1], model);
      } else {
        model._lookup.localField = found;
        model._lookup.foreignField = found;
      }
            
      index++;
    }
  }

  /**
   * Process QueryFilterGroup recursively and update query objects based on the filters.
   * @param {QueryFilterGroup} filterGroup - The QueryFilterGroup instance to process.
   * @param {Map} queryObjectsByFields - Map of query objects based on fields.
   * @param {Map} seenIds - Map to track seen IDs.
   */
  processQueryFilterGroup(filterGroup, queryObjectsByFileds, seenIds) {
    const {
      _queryFilters,
      _operator
    } = filterGroup;
    this.processFilters(_queryFilters, _operator, queryObjectsByFileds, seenIds);
  }

  /**
   * Process individual filter conditions and combine them based on the operator.
   * @param {Object} conditions - Current conditions to update.
   * @param {Object} condition - New condition to add.
   * @param {string} operator - Operator for combining conditions ('and' / 'or').
   * @param {string} alias - Alias for the field in the condition.
   * @returns {Object} Updated conditions after adding the new condition.
   */
  processConditions(conditions, condition, operator = 'and', alais) {
    const columnName = alais ? alais + '.' + condition.columnName : condition.columnName;
    if (Object.keys(conditions).length === 0) {
      conditions = { [columnName]: condition.columnValue };
      return conditions;
    }

    conditions = {
      ['$' + operator]: [
        conditions,
        { [columnName]: condition.columnValue }
      ]
    };

    return conditions;
  }

  /**
   * Process query filters and update match criteria in query objects based on the filters.
   * @param {Map} queryFilters - Map of QueryFilter instances.
   * @param {string} operator - Operator for combining filters ('and' / 'or').
   * @param {Map} queryObjectsByFields - Map of query objects based on fields.
   * @param {Map} seenIds - Map to track seen IDs.
   */
  processFilters(queryFilters, operator, queryObjectsByFileds, seenIds) {
    for (const queryFilter of [...queryFilters.values()]) {
      if (queryFilter instanceof QueryFilterGroup) {
        this.processQueryFilterGroup(queryFilter, queryObjectsByFileds, seenIds);
        continue;
      }
      for (const model of [...queryObjectsByFileds.values()]) {
        if (model._fields.includes(queryFilter.columnName)) {
          let alais = !model._baseModel ? model._modelName : null;
          model._match = this.processConditions(model._match, queryFilter, operator, alais)
        }
      }
    }
  }

  /**
   * Build a query array based on base and associated models for MongoDB aggregation pipeline.
   * @param {Object} baseModel - The base model for the query.
   * @param {Array} models - Array of associated models involved in the query.
   * @returns {Array} Array representing the MongoDB aggregation pipeline.
   */
  buildQuery(baseModel, models) {
    let query = [];
    if (Object.keys(baseModel._match).length != 0) {
      query.push({ $match: baseModel._match });
    }
    for (const modelObject of models) {
      const [, model] = modelObject;
      query.push({
        "$lookup": model._lookup
      });
      if (Object.keys(model._match).length != 0) {
        query.push({ $match: model._match });
      }
    }
    return query;
  }

  /**
   * @todo add logic to process and get query filters
   */
  getFilters(queryObject) {
    return queryObject;
  }
  /**
   * Get query objects based on specified fields and domain name from a QueryObject and its child query objects.
   * @param {QueryObject} queryObject - The main QueryObject to extract fields and domain from.
   * @returns {Map} Map of query objects based on fields and domain names.
   */
  getQueryObjectsByFields(queryObject) {
    const queryObjectsByFileds = this.getModelBasedOnFields(queryObject.fields, queryObject._domainName);
    for (const childQueryObject of [...queryObject._childQueryObject.values()]) {
      this.getModelBasedOnFields(childQueryObject.fields, childQueryObject._domainName, queryObjectsByFileds);
    }
    return queryObjectsByFileds;
  }
  
  /**
   * Get all fields from the provided QueryObject and its child query objects.
   * @param {QueryObject} queryObject - The main QueryObject to extract fields from.
   * @returns {Array} Array of fields obtained from the QueryObject and its children.
   */
  getAllFields(queryObject) {
    const filters = [...queryObject._filters.values()];
    for (const childQueryObject of [...queryObject._childQueryObject.values()]) {
      filters.push(...childQueryObject._filters.values())
    }
    return filters;
  }

  /**
   * Process a given QueryObject to create models and construct queries.
   * @param {QueryObject} queryObject - The query object to process.
   * @returns {Array} Array of model objects created from the query.
   */
  processQueryObject(queryObject) {
    const queryObjectsByFileds = this.getQueryObjectsByFields(queryObject);
    const filters = this.getAllFields(queryObject);
    const [[, baseModel], ...models] = queryObjectsByFileds;
    baseModel._baseModel = true;
    this.identifyJoinKey(baseModel._keys, models);
    let filter = filters.pop();
    const seenIds = new Map();
    while (filter) {
      if (filter instanceof QueryFilterGroup) {
        this.processQueryFilterGroup(filter, queryObjectsByFileds, seenIds);
      }
      filter = filters.pop();
    }
    return queryObjectsByFileds;
  }


  /**
   * Perform a read operation based on the provided QueryObject.
   * Emits 'readData' event upon completion.
   * @param {QueryObject} queryObject - The query object to execute.
   * @returns {Promise<Array>} Resulting data from the read operation.
   */
  async read(queryObject) {
    if (!(queryObject instanceof QueryObject)) {
      throw new Error(`${typeof queryObject} is not valid QueryObject`)
    }
    const modelObjects = this.processQueryObject(queryObject);
    const [[, baseModel], ...models] = modelObjects;
    const query = this.buildQuery(baseModel, models);
    const result = await this.runQuery(query, baseModel, models);
    this._model.emit('readData', {
      records: result,
      _queryObject: queryObject 
    });
    removeModels();
    return result;
  }

  /**
   * Run a constructed query against the MongoDB database.
   * @param {Array} query - The query to run against the database.
   * @param {Object} baseModel - The base model for the query.
   * @param {Array} models - Array of models involved in the query.
   * @returns {Promise<Array>} Result of the database query execution.
   */
  async runQuery(query, baseModel, models) {
    for (const modelObject of models) {
      const [, model] = modelObject;
      if (!mongoose.models[model._modelName]) {
        this._DB.model(model._modelName, new mongoose.Schema(model._schema));
      }
            
    }
    const _model = mongoose.models[baseModel._modelName] || this._DB.model(baseModel._modelName, new mongoose.Schema(baseModel._schema));
    try {
      return await _model.aggregate(query).exec();
    } catch (error) {
      console.log(error)
    }
        
  }
}