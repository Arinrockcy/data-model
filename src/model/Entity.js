import Objetcs from "./object.js";
import getKeys from "../util/get-keys.js";
class Entity {
    _entityType = '';
    _action = 'U';
    _entitySpecs = {};
    _ids = {};
    /**
     * 
     * @param {*} entityType 
     * @param {*} entitySpecs 
     */
    constructor(entityType, model) {
        this._model = model
        this._relatedEntityMap = new Map();
        this.entityType = entityType;
        this._entitySpecs = model._config[entityType];
        for (const fieldName in this._entitySpecs.fields) {
            if (Object.hasOwnProperty.call(this._entitySpecs.fields, fieldName)) {
                const entitySpec = this._entitySpecs.fields[fieldName]; 4
                if (entitySpec.domain) {
                    this._relatedEntityMap.set(fieldName, { reload: true, value: undefined })
                    this.relativeEntitySetter(fieldName);
                }
            }
        }

    }

    /**
     * @readonly
     */
    get entitySpecs() {
        return this._entitySpecs;
    }
    set entityType(entityType) {
        this._entityType = entityType;
    }
    get entityType() {
        return this._entityType;
    }
    set action(action) {
        this._action = action;
    }
    get action() {
        return this._action;
    }
    get ids() {
        return this._ids;
    }

    relativeEntitySetter(field) {
        const entitySpec = this._entitySpecs.fields[field];
        const entityType = entitySpec.domain;
        Object.defineProperty(this, field, {
            get() {
                const cachedEntity = this._relatedEntityMap.get(field);
                if (cachedEntity.reload) {
                    const keySet = this._relatedEntityKeyPair(field);
                    const entities = this._model._dataContainer._entityCollection.get(entityType, keySet);
                    cachedEntity.value = undefined;
                    if (entities) {
                        if (entitySpec.isOneToMany) {
                            cachedEntity.value = entities;
                        } else {
                            cachedEntity.value = Array.isArray(entities) ? entities[0] : entities;
                        }
                    }
                }
                return cachedEntity.value;
            },
            enumerable: true,
            configurable: true
        });
    }

    create(data) {
        const validationErrors = this.validate(data);
        if (validationErrors.length != 0) {
            throw new Error('Entity Errors see data for more', {
                message: JSON.stringify(data),
                name: 'Entity Validation'
            })
        }
        for (const key in data) {
            const entitySpec = this._entitySpecs.fields[key];
            const current = data[key];
            if (key === 'action') {
                this.action = current;
            } else {
                if (entitySpec.key) {
                    this[key] = current;
                    this._ids[key] = current;
                }
                else if (entitySpec.dataType === 'date') {
                    const value = typeof current === 'object' && !current instanceof Date ? current.value : current;
                    const oldvalue = typeof current === 'object' && !current instanceof Date ? current.oldvalue : current.oldvalue;
                    this[key] = new Objetcs(value, oldvalue);
                }
                else if (entitySpec.dataType === 'boolean') {
                    const value = typeof current === 'object' ? current.value : current;
                    const oldvalue = typeof current === 'object' ? current.oldvalue : undefined;
                    this[key] = new Objetcs(value, oldvalue);
                } else {
                    const value = typeof current === 'object' ? current.value : current;
                    const oldvalue = typeof current === 'object' ? current.oldvalue : undefined;
                    this[key] = new Objetcs(value, oldvalue);
                }

            }

        }
    }

    update(data) {
        const validationErrors = this.validate(data);
        if (validationErrors.length != 0) {
            throw new Error('Entity Errors see data for more', {
                message: JSON.stringify(data),
                name: 'Entity Validation'
            })
        }
        for (const key in data) {
            const entitySpec = this._entitySpecs.fields[key];
            const current = data[key];
            if (key === 'action') {
                this.action = current;
            } else {
                if (entitySpec.key) {
                    if (this[key]) {
                        this._model.emit('Key_Updated', {
                            existing: getKeys(this, this.entitySpecs.metaData.keys.flat()),
                            toBeChanged: { key: key, oldvalue: this[key], value: current },
                            entityType: this.entityType
                        });
                    }
                    this[key] = current;
                    this._ids[key] = current;

                }
                else if (entitySpec.dataType === 'date') {
                    const value = typeof current === 'object' && !current instanceof Date ? current.value : current;
                    const oldvalue = typeof current === 'object' && !current instanceof Date ? current.oldvalue : current.oldvalue;
                    this[key] = new Objetcs(value, oldvalue);
                }
                else if (entitySpec.dataType === 'boolean') {
                    const value = typeof current === 'object' ? current.value : current;
                    const oldvalue = typeof current === 'object' ? current.oldvalue : undefined;
                    this[key] = new Objetcs(value, oldvalue);
                } else {
                    const value = typeof current === 'object' ? current.value : current;
                    const oldvalue = typeof current === 'object' ? current.oldvalue : undefined;
                    this[key] = new Objetcs(value, oldvalue);
                }

            }

        }
    }

    validate(data) {
        const errors = [];
        const keys = [];
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                if (key === 'action') {
                    continue;
                }
                const fieldValue = data[key];
                const entitySpec = this._entitySpecs.fields[key];
                if (entitySpec.key) {
                    keys.push(key);
                }
                if (!Object.keys(this._entitySpecs.fields).includes(key)) {
                    errors.push(`${key} not valid field for ${this._entityType}`);
                } else if (typeof fieldValue !== 'object') {
                    if (typeof fieldValue !== entitySpec.dataType) {
                        errors.push(`${typeof fieldValue} not valid data type for ${key}`);
                    }
                } else if (typeof fieldValue === 'object') {
                    if (fieldValue instanceof Date && entitySpec.dataType !== 'date') {
                        errors.push(`${typeof fieldValue} not valid data type for ${key}`);
                    }
                    if (fieldValue.value && (typeof fieldValue.value === entitySpec.dataType)) {
                        errors.push(`${typeof fieldValue.value} not valid data type for ${key}`);
                    }
                    if (fieldValue.oldvalue && (typeof fieldValue.value === entitySpec.dataType)) {
                        errors.push(`${typeof fieldValue.oldvalue} not valid data type for ${key}`);
                    }
                } else if (fieldValue === null && !entitySpec.isNullable) {
                    errors.push(`${typeof fieldValue.oldvalue} not valid data type for ${key}`);
                }
            }
        }
        for (const keySet of this._entitySpecs.metaData.keys) {
            if (!keySet.filter(key => keys.includes(key))) {
                throw new Error(`${this.entityType} missing one or more key fields ${keySet.join(', ')}`);
                break;
            } 
        }
        return errors;
    }
    /**
     * @readonly
     * @param {*} field entity name
     */
    _relatedEntityKeyPair(field) {
        const domainSpec = this._entitySpecs.fields[field];
        if (!domainSpec.domain) {
            throw new Error(`${field} is not valid entityType`);
        }
        const keySet = [];
        for (const key of domainSpec.keys.flat()) {
            if (this[key]) {
                keySet.push({
                    [key]: this[key]
                });
            }
        }
        return keySet;
    }
}
export default Entity;