import Entity from "./Entity.js";
import EntityCollection from './entity-collection.js'
import getKeys from "../util/get-keys.js";
class DataContainer {
    _model = {}

    constructor(model) {
        this._model = model;
        this._entityCollection = new EntityCollection(model);
    }
    addData(entityType, data) {
        if (!Object.keys(this._model._config).includes(entityType)) {
            throw new Error(`${entityType} not valid`)
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
            return existEntity;
        }

        
    }
}
export default DataContainer;