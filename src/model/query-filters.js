export default class QueryFilter {
    constructor(model, filter, filterType) {
        this._model = model;
        if(!this._model._config[filterType]){
            throw new Error(`${filterType} is not valid domain`);
        }
        this.columnName = filter.fieldName;
        this.columnValue = filter.value;
        this.comparator = filter.comparator;
        
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
}