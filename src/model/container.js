import Entity from "./Entity.js";
import EntityCollection from './entity-collection.js'
import getKeys from "../util/get-keys.js";
import QueryObject from "./query-object.js";
import Read from '../controller/read.js'
import Write from "../controller/write.js";
class DataContainer {
    _model = {};
    constructor(model) {
        this._model = model;
        this._entityCollection = new EntityCollection(model);
        this.readController = new Read(this._model); 
        this.writeController = new Write(this._model);
        this._model.on('readData', this.afterRead.bind(this));
    }
    get entities() {
        return this._entityCollection.getAllFromCollection();
    }

    addData(entityType, data) {
        if (!Object.keys(this._model._config).includes(entityType)) {
            throw new Error(`${entityType} not valid`);
        }
        const entityKeys = getKeys(data, this._model._config[entityType].metaData.keys.flat());
        const existEntity = this._entityCollection.get(entityType, entityKeys);
        if (!existEntity) {
            const entity = new Entity(entityType, this._model);
            entity.create(data);
            this._entityCollection.add(entity);
            return entity;
        } else {
            existEntity.update(data);
            this._entityCollection.add(existEntity);
            return existEntity;
        }


    }

    afterRead({ records, _queryObject }) {
        const entitySpec = this._model._config[_queryObject._domainName];
        const _payload = {};
        for (const _data of records) {
            for (const field of _queryObject.fields) {
                if (!Object.keys(entitySpec.fields).includes(field)) {
                    continue;
                }
                if (Object.keys(_data).includes(field)) {
                    _payload[field] = _data[field];
                    continue;
                }
                const tableSpec = entitySpec.fields[field].table;

                for (const { tableId } of tableSpec) {
                    if (!Object.keys(_data).includes(tableId)) {
                        continue;
                    }
                    if (Object.keys(_data[tableId][0]).includes(field)) {
                        _payload[field] = _data[tableId][0][field];
                        continue;
                    }
                }

            }
            this.addData(_queryObject._domainName, _payload);
        }
    }

    async write() {
        return await this.writeController.write(this.entities) 
    }

    async read(queryObjects) {
        const queryObject = new QueryObject(this._model, queryObjects.query);
        return await this.readController.Read(queryObject);
    }
}
export default DataContainer;