import getDataType from "../util/get-data-type.js";
import { COMPARATOR, COMPARATORMAP } from "../constants/comparator.js";
export default class QueryFilter {
    constructor(model, filter, filterType) {
        /**
         * @private
         */
        this._model = model;
        if (!this._model._config[filterType]) {
            throw new Error(`${filterType} is not valid domain`);
        }
        const filedSpec = this._model._config[filterType].fields[filter.fieldName];
        if (!filedSpec) {
            throw new Error(`${filter.fieldName} is not valid fieldName for domain ${filterType}`);
        }

        /**
         * @readonly
         */
        this.columnName = filter.fieldName;
        const dataType = getDataType(filter.value);
        if (dataType === null || dataType === undefined) {
            throw new Error(`${dataType} is not valid dataType for field ${this.columnName}`);
        }
        if (dataType === 'boolean' && filedSpec.dataType !== 'boolean') {
            throw new Error(`${filter.value} is not valid value for field ${this.columnName}`);
        }
        if (dataType === 'number') {
            if (filedSpec.dataType === 'boolean' && filter.value > 1) {
                throw new Error(`${filter.value} is not valid value for field ${this.columnName}`);
            } else if (filedSpec.dataType !== 'number') {
                throw new Error(`${dataType} is not valid dataType for field ${this.columnName}`);
            }
        } else
            if (dataType != filedSpec.dataType) {
                throw new Error(`${dataType} is not valid dataType for field ${this.columnName}`);
            }

        /**
         * @readonly
         */
        this.columnValue = filter.value;
        if (!COMPARATOR.includes(filter.comparator)) {
            throw new Error(`${filter.comparator} is not valid comparator or Not supported yet`);
        }
        const comparatorMap = COMPARATORMAP.get(filter.comparator);
        if (comparatorMap.includes('array') && !Array.isArray(this.columnValue)) {
            throw new Error(`${filter.comparator} is not valid comparator for the type ${dataType}`);
        } else
            if (!comparatorMap.includes(dataType)) {
                throw new Error(`${filter.comparator} is not valid comparator for the type ${dataType}`);
            }

        /**
         * @readonly
         */
        this.comparator = filter.comparator;

        /**
         * @readonly
         */
        this.queryString = `${this.columnName}_${this.comparator}_${this.columnValue}`;

        /**
         * @readonly
         */
        this._tables = new Map(Array.from(filedSpec.table.map(table => Object.values(table))));
        /**
         * @readonly
         */
        this._tableNames = Array.from(this._tables.keys());
    }
    set columnName(columnName) {
        this._columnName = columnName;
    }
    set columnValue(columnValue) {
        this._columnValue = columnValue;
    }
    set comparator(comparator) {
        this._comparator = comparator;
    }
    get columnName() {
        return this._columnName;
    }
    get columnValue() {
        return this._columnValue;
    }
    get comparator() {
        return this._comparator;
    }

    get tableNames() {
        return this._tableNames;
    }

    getTableById(id) {
        if (this._tables.has(id)) {
            return this._tables.get(id);
        }
    }

    get primaryTable() {
        return this._tableNames[0];
    }
}