import { dataTypeMap } from "../db/config.js";
import { DB } from '../db/connect.js';
import mongoose from 'mongoose';
export default class Write {
    constructor(model) {
        this._model = model;
        this.init()
    }
    init() {
        this._DB = DB();
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
                                _schema: {},
                                _modelName: table.tableId,
                                entity: entity
                            });
                        }
                        const payload = _payload.get(table.tableId);
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
    async writes(_payload) {
        if (_payload.length === 0) {
            return 0
        }
        const payload = _payload.pop();
        const _model = this._DB.model(payload._modelName, new mongoose.Schema(payload._schema));
        const result = await new _model(payload._data).save();
        this.afterSave(result, payload.entity, payload._modelName)
        return await this.writes(_payload);
    }
    async write(entities) {
        const _payload = this.processData(entities);
        return await this.writes(Array.from(_payload.values()));
    }

}