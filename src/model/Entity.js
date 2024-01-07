// imports class instaance
import Field from "./field.js";
import ModelError from "./model-error.js";

// import functions
import getKeys from "../util/get-keys.js";

// imports constant
import ERRORLABEL from "../constants/error-lable.js";

class Entity {
  // Properties
  _entityType = ''; // Type of the entity
  _action = null; // Default action for entity (e.g., null if read)
  _entitySpecs = {}; // Specifications and metadata of the entity
  _ids = {}; // IDs associated with the entity
  
  /**
   * Constructor for Entity class.
   * @param {string} entityType - Type of the entity.
   * @param {Object} dataContainer - The model object containing entity configurations.
   */
  constructor(entityType, dataContainer) {
    this._model = dataContainer._model;
    this._dataContainer = dataContainer;
    this._relatedEntityMap = new Map();
    this.entityType = entityType;
    this._entitySpecs = this._model._config[entityType];
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

  // Getters and Setters

  /**
   * Getter for retrieving entity specifications.
   * @returns {Object} - Entity specifications.
   */
  get entitySpecs() {
    return this._entitySpecs;
  }

  /**
   * Setter for entity type.
   * @param {string} entityType - Type of the entity.
   */
  set entityType(entityType) {
    this._entityType = entityType;
  }

  /**
   * Getter for retrieving entity type.
   * @returns {string} - Type of the entity.
   */
  get entityType() {
    return this._entityType;
  }

  /**
   * Setter for entity action.
   * @param {string} action - Action for the entity.
   */
  set action(action) {
    this._action = action;
  }

  /**
   * Getter for retrieving entity action.
   * @returns {string} - Action for the entity.
   */
  get action() {
    return this._action;
  }

  /**
   * Getter for retrieving entity IDs.
   * @returns {Object} - Entity IDs.
   */
  get ids() {
    return this._ids;
  }

  get entityFields() {
    return this.entitySpecs.fields;
  }

  // Other Methods

  /**
  * Sets up a dynamic getter for fetching related entity data based on the provided field.
  * @param {string} field - The field representing the related entity.
  */
  relativeEntitySetter(field) {
    const entitySpec = this._entitySpecs.fields[field];
    const entityType = entitySpec.domain;
    Object.defineProperty(this, field, {
      get() {
        const cachedEntity = this._relatedEntityMap.get(field);
        if (cachedEntity.reload) {
          const keySet = this._relatedEntityKeyPair(field);
          const entities = this._dataContainer._entityCollection.get(entityType, keySet);
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

  /**
  * Creates or updates entity data based on the provided data object.
  * @param {Object} data - The data object containing fields for creation or update.
  */
  create(data) {
    const validationErrors = this.validate(data);
    if (validationErrors.length != 0) {
      throw new ModelError(ERRORLABEL.INVALID_INPUT, 'See data for more', validationErrors);
    }
    for (const key in data) {
      const entitySpec = this._entitySpecs.fields[key];
      const current = data[key];
      if (key === 'action') {
        this.action = current;
      } else if (entitySpec) {
        if (entitySpec.key) {
          this[key] = current;
          this._ids[key] = current;
        }
        else if (entitySpec.dataType === 'date') {
          const value = typeof current === 'object' && !(current instanceof Date) ? current.value : current;
          const oldvalue = typeof current === 'object' && !(current instanceof Date) ? current.oldvalue : current.oldvalue;
          this[key] = new Field(value, oldvalue);
        }
        else if (entitySpec.dataType === 'boolean') {
          const value = typeof current === 'object' ? current.value : current;
          const oldvalue = typeof current === 'object' ? current.oldvalue : undefined;
          this[key] = new Field(value, oldvalue);
        }
        else if (entitySpec.dataType === 'array' && Array.isArray(current)) {
          this[key] = current;
        } else {
          const value = typeof current === 'object' ? current.value : current;
          const oldvalue = typeof current === 'object' ? current.oldvalue : undefined;
          this[key] = new Field(value, oldvalue);
        }

      }

    }
  }

  /**
  * Updates entity data based on the provided data object.
  * @param {Object} data - The data object containing fields to be updated.
    */
  update(data) {
    const validationErrors = this.validate(data);
    if (validationErrors.length != 0) {
      throw new ModelError(ERRORLABEL.INVALID_INPUT, 'See data for more', validationErrors);
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
          const value = typeof current === 'object' && !(current instanceof Date) ? current.value : current;
          const oldvalue = typeof current === 'object' && !(current instanceof Date) ? current.oldvalue : current.oldvalue;
          this[key] = new Field(value, oldvalue);
        }
        else if (entitySpec.dataType === 'boolean') {
          const value = typeof current === 'object' ? current.value : current;
          const oldvalue = typeof current === 'object' ? current.oldvalue : undefined;
          this[key] = new Field(value, oldvalue);
        }
        else if (entitySpec.dataType === 'array' && Array.isArray(current)) {
          this[key] = current;
        } else {
          const value = typeof current === 'object' ? current.value : current;
          const oldvalue = typeof current === 'object' ? current.oldvalue : undefined;
          this[key] = new Field(value, oldvalue);
        }

      }

    }
  }

  /**
 * Validates the provided data against the entity's specifications.
 * @param {Object} data - The data object to be validated.
 * @returns {Array} - An array containing error messages from the validation process.
 */
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
        if (!entitySpec) {
          continue;
        }
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
          if (Array.isArray(fieldValue) && entitySpec.dataType !== 'array') {
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
        throw new ModelError(ERRORLABEL.INVALID_INPUT, `${this.entityType} missing one or more key fields ${keySet.join(', ')}`);
      }
    }
    return errors;
  }

  /**
 * Generates key-value pairs for related entities based on domain specifications of a field.
 * @param {string} field - The name of the entity field.
 * @returns {Array} - Array containing key-value pairs.
 */
  _relatedEntityKeyPair(field) {
    const domainSpec = this._entitySpecs.fields[field];
    if (!domainSpec.domain) {
      throw new ModelError(ERRORLABEL.INVALID_INPUT, `${this.field} is not valid in ${this.entityType}`);

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

  /**
 * Checks if the provided value is an object (excluding Date instances and null).
 * @param {*} value - The value to be checked.
 * @returns {boolean} - Returns true if the value is an object (excluding Date instances and null), otherwise false.
 */
  isObject(value) {
    return typeof value === 'object' && false === value instanceof Date && value !== null;
  }

  /**
 * Recursively converts Entity data into JSON format.
 * @param {Object} json - JSON object to be populated with converted data.
 * @param {Object} spec - Specifications object for the entity.
 * @param {Object} dataObject - Entity data object to be converted.
 * @param {Set} seen - Set to track processed dataObjects to avoid infinite loops.
 */
  recursiveJSON(json, spec, dataObject, seen) {
    if (seen.has(dataObject)) {
      return;
    }
    seen.add(dataObject)
    for (const field of Object.keys(spec.fields)) {
      if (!dataObject[field]) {
        continue;
      }
      const fieldSpec = spec.fields[field];
      const fieldValue = this.isObject(dataObject[field]) && fieldSpec.dataType != 'object' && fieldSpec.dataType != 'array' ? dataObject[field].value : dataObject[field]
      if (!fieldSpec.domain) {
        const paths = fieldSpec.path.split('.');
        let data = json;
        let iterations = paths.length;
        for (const path of paths) {
          const isLast = !--iterations;
          if (Object.hasOwnProperty.call(data, path)) {
            data = data[path];
          } else {
            data[path] = isLast ? fieldValue : {};
            data = data[path];
            if (isLast) {
              data = json;
            }
          }
        }
      } else if (dataObject[field]) {
        const relatedNode = Array.isArray(dataObject[field]) ? dataObject[field] : [dataObject[field]];
        for (const node of relatedNode) {
          let datapoint = {};
          if (fieldSpec.isOneToMany) {
            json[field] ? json[field].push({}) : json[field] = [{}];
            datapoint = json[field][json[field].length - 1];
          }
          else {
            json[field] = {};
            datapoint = json[field]
          }
          this.recursiveJSON(datapoint, this._model._config[fieldSpec.domain], node, seen);
        }

      }
    }
  }
  /**
   * Method to convert Entity data into JSON format.
   * @returns {Object} - JSON representation of the Entity.
   */
  toJSON() {
    const json = {};
    this.recursiveJSON(json, this.entitySpecs, this, new Set())
    return json;
  }
}
export default Entity;