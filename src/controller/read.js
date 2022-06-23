import QueryObject from '../model/query-object.js'
import QueryFilterGroup from '../model/query-filter-group.js';
import QueryFilter from '../model/query-filters.js';
import { DB } from '../db/connect.js';
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
                    });
                }
                const query = _query.get(tableSpec.tableId);
                query._schema[field] = {
                    type: datatype
                }
            }
        }
        return _query;
    }

    processQueryFilterGroup(filterGroup) {

    }

    processFilters() {

    }

    buildQuery(filter, parent){

    }

    
    processQuery(queryObject) {
        const queryObjectsByFileds = this.getModelBasedOnFields(queryObject.fields, queryObject._domainName);
        const filters = [...queryObject._filters.values()];
        const [[domainName, baseModel]] = queryObjectsByFileds;
        for (const query of filters) {

        }
        this.processFilters(queryObjects, new Map());
        console.log(filters);
    }

    async Read(queryObject) {
        if (!queryObject instanceof QueryObject) {
            throw new Error(`${typeof queryObject} is not valid QueryObject`)
        }
        const queries = this.processQuery(queryObject);
    }
}