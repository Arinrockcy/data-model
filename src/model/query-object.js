import QueryFilter from "./query-filters.js";
import QueryFilterGroup from "./query-filter-group.js";
export default class QueryObject {
    constructor(model, queryObject) {
        this._model = model;
        this._childQueryObject = new Map();
        this._filters = new Set();
        this._parent = undefined;
        this._fields = new Set();
        this._domainName = queryObject.domain;
        this._add(queryObject)
    }

    set fields(fields) {
        this._fields = new Set([...fields])
    }
    set parent(parent) {
        this._parent = parent;
    }
    _add(queryObject) {
        console.log(queryObject);
        this.fields = queryObject.fields;
        this.addFilters(queryObject.filter, []);
    }
    addFilters(filters, result = []) {
        let operator = 'and';
        for (const filter of filters) {
            if (Array.isArray(filter)) {
                return this.addFilters(filter, []);
            }
            operator = filter.operator;
            result.push(new QueryFilter(this._model, filter, this._domainName))
        }
        if(result.length === 1){
            result.push(Array.from(this._filters).pop());
        }
        this._filters.add(new QueryFilterGroup(this._model, operator, result));
    }
}