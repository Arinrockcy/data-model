import Entity from "./Entity.js";

export default class EntityCollection {
    constructor(model) {
        this._model = model;
        this.collection = new Map();
        this._model.on('Key_Updated', this.updateKeys.bind(this))
    }
    updateKeys(keysToUpdate) {
        const entityType = keysToUpdate.entityType;
        if (!this.collection.has(entityType)) {
            throw new Error(`Not available on collection ${entityType}`)
        }
        this._updateKey(keysToUpdate.existing, this.collection.get(entityType), keysToUpdate.toBeChanged);

    }
    _updateKey(keyslot, collection, toBeChanged) {
        for (const key of keyslot) {
            if (!collection.has(Object.keys(key)[0])) {
                return undefined
            }
            collection = collection.get(Object.keys(key)[0]);
            if (Object.keys(key)[0] === toBeChanged.key && collection.has(toBeChanged.oldvalue)) {
                collection.set(toBeChanged.value, collection.get(toBeChanged.oldvalue));
                collection.delete(toBeChanged.oldvalue)
            }
        }
    }
    add(entity) {
        if (!entity instanceof Entity) {
            throw new Error(`Not valid Entity Object ${typeof entity}`);
        }
        const entityType = entity.entityType;
        if (!this.collection.has(entityType)) {
            this.collection.set(entityType, new Map());
        }
        this._add(
            this._model._config[entityType].metaData.keys.flat().entries(),
            entity,
            this.collection.get(entityType),
            null
        )
    }
    _add(keyslot, entity, collection, oldField = null) {
        const key = keyslot.next()
        if (key && !key.done) {
            const field = key.value[1];
            if (entity[field]) {
                if (oldField) {
                    collection = collection.get(oldField);
                }
                if (!collection.has(field)) {
                    collection.set(field, new Map())
                }
                collection = collection.get(field);
                collection.set(entity[field], new Map())
                oldField = entity[field] ? entity[field] : field;
            }
        } else {
            collection.set(oldField, entity);
        }
        if (!key.done) {
            this._add(keyslot, entity, collection, oldField)
        }

    }

    get(entityType, keyslot) {
        if (!this.collection.has(entityType)) {
            return undefined;
        }
        if (!keyslot || keyslot.length === 0) {
            return this.getAllFromCollection(this.collection.get(entityType));
        }

        return this._get(keyslot, this.collection.get(entityType));
    }

    getAllFromCollection(collection = this.collection, result = []) {
        if(collection instanceof Map){
            const entities = Array.from(collection.values());
            entities.map(entity => {
                if(entity instanceof Map){
                    return this.getAllFromCollection(entity, result);
                }else {
                    result.push(entity);
                    return result;
                }
            }); 
            return result;
        }else{
            return result;
        }
        
    }

    _get(keyslot, collection) {
        for (const key of keyslot) {
            const element = key[Object.keys(key)[0]];
            if (!collection.has(Object.keys(key)[0])) {
                return undefined
            }
            collection = collection.get(Object.keys(key)[0]);
            if (!collection.has(element)) {
                return undefined;
            }
            collection = collection.get(element);
            if (collection instanceof Entity) {
                return collection
            }
        }
    }
};