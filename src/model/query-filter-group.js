import QueryFilter from './query-filters.js'
export default class QueryFilterGroup {
  
  /**
   * Creates a QueryFilterGroup instance.
   * @param {any} model - The model.
   * @param {string} operator - The operator.
   * @param {QueryFilter[]|QueryFilter} queryFilters - The query filters or a single query filter.
   * @param {string} keyString - The key string.
   */
  constructor(model, operator, queryFilters, keyString) {
    this._model = model;
    this._queryFilters = new Set();
    this._operator = operator;
    this._keyString = keyString;
    this.add(queryFilters);
  }

  /**
   * Adds query filters to the group.
   * @param {QueryFilter[]|QueryFilter} queryFilters - The query filters or a single query filter to add.
   * @throws {Error} Throws an error if the queryFilter is not an instance of QueryFilter or QueryFilterGroup.
   */

  add(queryFilters) {
    queryFilters = Array.isArray(queryFilters) ? queryFilters : [queryFilters];
    for (const queryFilter of queryFilters) {
      if (!(queryFilter instanceof QueryFilter) && !(queryFilter instanceof QueryFilterGroup)) {
        throw new Error(`${typeof queryFilter} is not instanceof QueryFilter || QueryFilterGroup`);
      }
      this._queryFilters.add(queryFilter)
    }

  }

  /**
   * Retrieves the query filters in the group.
   * @returns {QueryFilter[]} An array of query filters.
   */
  get queryFilters() {
    return [...this._queryFilters.values()];
  }

  /**
   * Retrieves the ID/key string.
   * @returns {string} The ID/key string.
   */
  get id() {
    return this._keyString;
  }

  /**
   * Retrieves the operator.
   * @returns {string} The operator.
   */
  get operator() {
    return this._operator;
  }
}