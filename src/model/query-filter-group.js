import QueryFilter from './query-filters.js'
export default class QueryFilterGroup {
    constructor(model, operator, queryFilters, keyString) {
        this._model = model;
        this._queryFilters = new Set();
        this._operator = operator;
        this._keyString = keyString;
        this.add(queryFilters);
    }

    add(queryFilters) {
        queryFilters = Array.isArray(queryFilters) ? queryFilters : [queryFilters];
        for (const queryFilter of queryFilters) {
            if (!queryFilter instanceof QueryFilter || !queryFilter instanceof QueryFilterGroup) {
                throw new Error(`${typeof queryFilter} is not instanceof QueryFilter || QueryFilterGroup`);
            }
            this._queryFilters.add(queryFilter)
        }

    }
    get queryFilters() {
        return this._queryFilters;
    }
}