import QueryFilter from "./query-filters.js";
import QueryFilterGroup from "./query-filter-group.js";
import { v1 } from 'uuid';
export default class QueryObject {
  /**
     * Creats queryObject instace based on given search critrion
     * @param {*} model current Molde query
     * @param {*} queryObject contains search and filter objects
     * @param {*} parentQueryObject parentQueryObject object, if query object created as child
     */
  constructor(model, queryObject, parentQueryObject = undefined) {
    if (!queryObject || !queryObject.domain) {
      throw new Error('Invalid queryObject. Domain is required.');
    }
    this._model = model;
    this._childQueryObject = new Set();
    this._filters = new Map();
    this._parentQueryObject = parentQueryObject;
    this._fields = new Set();
    this._domainName = queryObject.domain;
    this._queryObjectId = v1();
    this._add(queryObject);
  }
  /**
   * @returns {Array} array of fields
   */
  get fields() {
    return Array.from(this._fields.values());
  }

  /**
   * settter for fields list
   * @param {string[]} fields list of fields to fetch by this query onject
   */
  set fields(fields) {
    if (!Array.isArray(fields)) {
      throw new TypeError('Fields must be provided as an array.');
    }
    for (const field of fields) {
      if (this._model._config[this._domainName].fields[field].domain) {
        this.generateChildQuery(this._model._config[this._domainName].fields[field]);
        fields.splice(fields.indexOf(field), 1);
      }
    }

    this._fields = new Set([...this._model._config[this._domainName].metaData.keys.flat(), ...fields])
  }

  /**
   * setter for parentQueryObject
   * @param {QueryObject} parentQueryObject contains if this queryObject is created as child
   */
  set parentQueryObject(parentQueryObject) {
    if (!(parentQueryObject instanceof QueryObject)) {
      throw new TypeError('parentQueryObject must be instances of QueryObject.');
    }
    this._parentQueryObject = parentQueryObject;
  }

  get childQueryObject() {
    return [...this._childQueryObject]
  }
  /**
   * Generates a child query based on the provided domain.
   * @param {Object} param0 - Object containing domain information.
   */
  generateChildQuery({ domain }) {
    const entitySpec = this._model._config[domain];
    const fields = Object.keys(entitySpec.fields).filter(field=> !entitySpec.fields[field].domain)
    const queryObject = [{
      query: {
        filter: [],
        domain: domain,
        fields: fields,
        childQuery: []
      }
    }]
    this._addChildQuery(queryObject, this);
  }

  /**
   * Adds fields, filters, and child queries to the QueryObject.
   * @param {*} queryObject - QueryObject containing fields, filters, and child queries.
   */
  _add(queryObject) {
    this.fields = queryObject.fields;
    this.addFilters(queryObject.filter, []);
    this._addChildQuery(queryObject.childQuery, this);
  }

  /**
   * Adds filters to the QueryObject.
   * @param {Object[]} filters - Filters to be added to the QueryObject.
   * @param {Object[]} result - Placeholder for the result.
   */
  addFilters(filters, result = []) {
    if (!Array.isArray(filters)) {
      throw new TypeError('Filters must be provided as an array.');
    }
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

  /**
   * Adds child queries to the QueryObject.
   * @param {Object[]} filters - Child queries to be added to the QueryObject.
   * @param {QueryObject} parentQueryObject - Parent QueryObject.
   */
  _addChildQuery(filters, parentQueryObject) {
    if (!Array.isArray(filters)) {
      throw new TypeError('Child queries must be provided as an array.');
    }
    for (const filter of filters) {
      this._childQueryObject.add(new QueryObject(this._model, filter.query, parentQueryObject));
    }

  }
}