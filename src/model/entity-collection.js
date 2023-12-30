import Entity from './entity.js';

export default class EntityCollection {
  /**
   * Creates an EntityCollection instance.
   * @param {Model} model - The model associated with the EntityCollection.
   */
  constructor(model) {
    this._model = model;
    this.collection = new Map();
    this._model.on('Key_Updated', this.updateKeys.bind(this))
  }
  
  /**
   * Updates keys in the collection based on the provided information.
   * @param {Object} keysToUpdate - The keys information to be updated.
   */
  updateKeys(keysToUpdate) {
    const entityType = keysToUpdate.entityType;
    if (!this.collection.has(entityType)) {
      throw new Error(`Not available on collection ${entityType}`)
    }
    this._updateKey(keysToUpdate.existing, this.collection.get(entityType), keysToUpdate.toBeChanged);

  }

  /**
   * Updates a specific key in the collection.
   * @param {Array} keyslot - The key slot to be updated.
   * @param {Map} collection - The collection to update.
   * @param {Object} toBeChanged - The key information to be changed.
   */
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

  /**
   * Adds an entity to the collection.
   * @param {Entity} entity - The entity to be added.
   */
  add(entity) {
    if (!(entity instanceof Entity)) {
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
        if (!collection.has(entity[field])) {
          collection.set(entity[field], new Map())
        }
        oldField = entity[field] ? entity[field] : field;
      }
    } else {
      collection.set(oldField, entity);
    }
    if (!key.done) {
      this._add(keyslot, entity, collection, oldField)
    }

  }

  /**
   * Gets entities based on the entity type and keyslot.
   * @param {string} entityType - The type of the entity.
   * @param {Array} keyslot - The key slot to search for.
   * @returns {Entity|Array|undefined} - The retrieved entity/entities or undefined if not found.
   */
  get(entityType, keyslot) {
    if (!this.collection.has(entityType)) {
      return undefined;
    }
    if (!keyslot || keyslot.length === 0) {
      return this.getAllFromCollection(this.collection.get(entityType));
    }

    return this._get(keyslot, this.collection.get(entityType));
  }

  /**
   * Retrieves all entities from a collection.
   * @param {Map} collection - The collection to retrieve entities from.
   * @param {Array} result - The array to store the retrieved entities.
   * @returns {Array} - The array of retrieved entities.
   */
  getAllFromCollection(collection = this.collection, result = []) {
    if (collection instanceof Map) {
      const entities = Array.from(collection.values());
      entities.map(entity => {
        if (entity instanceof Map) {
          return this.getAllFromCollection(entity, result);
        } else {
          result.push(entity);
          return result;
        }
      }); 
      return result;
    } else {
      return result;
    }
        
  }

  /**
   * Gets an entity from the collection based on the keyslot.
   * @param {Array} keyslot - The key slot to search for.
   * @param {Map} collection - The collection to search within.
   * @returns {Entity|Array|undefined} - The retrieved entity/entities or undefined if not found.
   */
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
    if (collection instanceof Map)
    {
      return this.getAllFromCollection(collection)
    }
  }
}