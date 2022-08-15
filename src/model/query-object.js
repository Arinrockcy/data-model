import QueryFilter from "./query-filters.js";
import QueryFilterGroup from "./query-filter-group.js";
import { v1 } from 'uuid';
export default class QueryObject {
    constructor(model, queryObject, parent = undefined) {
        this._model = model;
        this._childQueryObject = new Set();
        this._filters = new Map();
        this._parent = parent;
        this._fields = new Set();
        this._domainName = queryObject.domain;
        this._queryObjectId = v1();
        this._add(queryObject);
    }
    get fields() {
        return Array.from(this._fields.values());
    }
    set fields(fields) {
        for (const field of fields) {
            if (this._model._config[this._domainName].fields[field].domain) {
                this.generateChildQuery(this._model._config[this._domainName].fields[field]);
                fields.splice(fields.indexOf(field), 1);
            }
        }

        this._fields = new Set([...this._model._config[this._domainName].metaData.keys.flat(), ...fields])
    }
    set parent(parent) {
        this._parent = parent;
    }

    generateChildQuery({ domain }) {
        const entitySpec = this._model._config[domain];
        const fields = Object.keys(entitySpec.fields).filter(field=> !entitySpec.fields[field].domain)
        const queryObject = [{
            query: {
                filter: [ ],
                domain: domain,
                fields: fields,
                childQuery: []
            }
        }]
        this._addChildQuery(queryObject, this);
    }
    _add(queryObject) {
        this.fields = queryObject.fields;
        this.addFilters(queryObject.filter, []);
        this._addChildQuery(queryObject.childQuery, this);
    }
    addFilters(filters, result = []) {
        let operator = 'and';
        let keyString = this._domainName;
        for (const filter of filters) {
            if (Array.isArray(filter)) {
                this.addFilters(filter, []);
                continue;
            }
            operator = filter.operator;
            const qyeryFilter = new QueryFilter(this._model, filter, this._domainName);
            keyString += '_' + qyeryFilter.queryString
            result.push(qyeryFilter);
        }
        if (result.length === 1 && this._filters.size !== 0) {
            const queryFilterGroup = Array.from(this._filters.values()).pop();
            keyString += '_' + operator + '_' + queryFilterGroup._keyString
            result.push(queryFilterGroup);
        }
        if (result.length !== 0) {
            this._filters.set(keyString, new QueryFilterGroup(this._model, operator, result, keyString));
        }

    }
    _addChildQuery(filters, parent) {
        for (const filter of filters) {
            this._childQueryObject.add(new QueryObject(this._model, filter.query, parent));
        }

    }
}