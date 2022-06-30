import QueryObject from '../model/query-object.js'
import QueryFilterGroup from '../model/query-filter-group.js';
import QueryFilter from '../model/query-filters.js';
import { DB } from '../db/connect.js';
import mongoose from 'mongoose';
import { dataTypeMap } from "../db/config.js";
export default class Read {
    constructor(model) {
        this._model = model;
        this._DB = DB();
    }
    getDataType(dataType) {
        if (!dataTypeMap.has(dataType)) {
            throw new Error(`${dataType} is not valid data type`);
        }
        return dataTypeMap.get(dataType);
    }
    getModelBasedOnFields(fields, domainName) {
        const domainSpecs = this._model._config[domainName];
        const _query = new Map();
        for (const field of fields) {
            const { key, table, dataType } = domainSpecs.fields[field];
            const datatype = this.getDataType(dataType);
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
                    type: datatype
                }
                query._fields.push(field);
                if (key) {
                    query._keys.push(field);
                }
            }
        }
        return _query;
    }

    identifyJoinKey(baseModelKyes, models) {
        for (const modelObject of models) {
            const [, model] = modelObject;
            const found = model._keys.find(key => baseModelKyes.includes(key));
            model._lookup.localField = found;
            model._lookup.foreignField = found;
        }
    }

    processQueryFilterGroup(filterGroup, queryObjectsByFileds, seenIds) {
        const {
            _queryFilters,
            _operator
        } = filterGroup;
        this.processFilters(_queryFilters, _operator, queryObjectsByFileds, seenIds);
    }

    processConditions(conditions, condition, operator, alais) {
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

    buildQuery(baseModel, models) {
        let query = [];
        if (Object.keys(baseModel._match).length !=0) {
            query.push({ $match: baseModel._match });
        }
        for (const modelObject of models) {
            const [, model] = modelObject;
            query.push({
                "$lookup": model._lookup
            });
            if (Object.keys(model._match).length !=0) {
                query.push({ $match: model._match });
            }
        }
        return query;
    }

    processQueryObject(queryObject) {
        const queryObjectsByFileds = this.getModelBasedOnFields(queryObject.fields, queryObject._domainName);
        const filters = [...queryObject._filters.values()];
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

    async Read(queryObject) {
        if (!queryObject instanceof QueryObject) {
            throw new Error(`${typeof queryObject} is not valid QueryObject`)
        }
        const modelObjects = this.processQueryObject(queryObject);
        const [[, baseModel], ...models] = modelObjects;
        const query = this.buildQuery(baseModel, models);
        const result = await this.runQuery(query, baseModel, models);
        this._model.emit('readData', {
            _data: result,
             _queryObject:queryObject 
        });
    }

    async runQuery(query, baseModel, models) {
        for (const modelObject of models) {
            const [, model] = modelObject;
            this._DB.model(model._modelName, new mongoose.Schema(model._schema));
        }
        const _model = this._DB.model(baseModel._modelName, new mongoose.Schema(baseModel._schema));
        try {
            return await _model.aggregate(query).exec();
        } catch (error) {
            console.log(error)
        }
        
    }
}