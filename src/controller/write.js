import { dataTypeMap } from "../db/config.js";
import { DB } from '../db/connect.js';
import mongoose from 'mongoose';
import removeModels from "../util/remove-models.js";
export default class Write {
    constructor(model) {
        this._model = model;
        this.init()
    }
    init() {
        this._DB = DB(this._model._dbConfig);
    }
    getDataType(dataType) {
        if (!dataTypeMap.has(dataType)) {
            throw new Error(`${dataType} is not valid data type`);
        }
        return dataTypeMap.get(dataType);
    }
    processData(entities) {
        const _payload = new Map();
        for (const entity of entities) {
            for (const key in entity) {
                if (entity.entitySpecs.fields[key]) {
                    const entitySpec = entity.entitySpecs.fields[key];
                    if (entitySpec.hasOwnProperty("isOneToMany")) {
                        continue;
                    }
                    const element = typeof entity[key] === 'object' && entity[key].value ? entity[key].value : entity[key];
                    const dataType = this.getDataType(entitySpec.dataType);
                    for (const table of entitySpec.table) {
                        if (!_payload.has(table.tableId)) {
                            _payload.set(table.tableId, {
                                _data: {},
                                _keys: [],
                                _schema: {},
                                _modelName: table.tableId,
                                entity: entity
                            });
                        }
                        const payload = _payload.get(table.tableId);
                        if (entitySpec.key) {
                            payload._keys.push({
                                [key]: element
                            });    
                        }
                        payload._data[key] = element;
                        payload._schema[key] = {
                            type: dataType
                        }
                    }

                }
            }
        }
        return _payload;
    }
    afterSave(result, entity, modelName) {
        const insertedId = result.id;
        const fieldSpec = Object.values(entity._entitySpecs.fields).find(
            field =>
                field.table.filter(
                    table =>
                        table.tableId === modelName
                        &&
                        table.columnName === '_id'
                )
        );
        if(fieldSpec){
            entity.update({ [fieldSpec.path]: insertedId });
        }
        
    }
    processCondition(filters, operator = 'and') {
        let conditions = filters.pop();
        const seen = new Set();
        seen.add(Object.keys(conditions)[0]);
        for (const filter of filters) {
            if (seen.has(Object.keys(filter)[0])) {
                continue;
            }
            seen.add(Object.keys(filter)[0]);
            conditions = {
                ['$' + operator]: [
                    conditions,
                    filter
                ]
            }
        };
        return conditions;
    }
    async writes(_payload) {
        if (_payload.length === 0) {
            removeModels();
            return 0
        }
        const payload = _payload.pop();
        const _model = mongoose.models[payload._modelName] || this._DB.model(payload._modelName, new mongoose.Schema(payload._schema));
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const result = await _model.findOneAndUpdate(this.processCondition(payload._keys), payload._data, options);
        this.afterSave(result, payload.entity, payload._modelName)
        return await this.writes(_payload);
    }
    async write(entities) {
        const _payload = this.processData(entities);
        return await this.writes(Array.from(_payload.values()));
    }

}