import databases from "../db/db.js";

/**
 * ReadController class responsible for handling read operations from MongoDB.
 * @class
 */
export default class ReadController {
  /**
   * Constructor for ReadController.
   * @constructor
   * @param {Object} model - The model for which the controller is created.
   */
  constructor(model) {
    // Store the model for which the controller is created
    /** @private */
    this._model = model;

    // Map to store database controllers based on database types
    /** @private */
    this._dbControllers = new Map();

    // Map to store query objects based on their corresponding database types
    /** @private */
    this._dbTypes = new Map();

    // Initialize database controllers during construction
    this._processDBControllers();
  }

  /**
   * Process query fields and determine the corresponding database types.
   * @private
   * @param {Object} queryObject - The query object containing fields and domain information.
   */
  _processQueryFields(queryObject) {
    const { fields, domainName } = queryObject;
    const domainSpec = this._model.domainSpec[domainName].fields;

    // Loop through fields in the query object
    for (const field of fields) {
      const { tables } = domainSpec[field];

      // Find the connection name associated with the field
      const connectionName = tables.find(table => table.connectionName).connectionName;

      // Find the database type for the given connection name
      const [dbType] = [...this._model._dataBaseTypeSet].find(
        ([, connectionNameSet]) => connectionNameSet.has(connectionName)
      ) || [];

      // If a matching database type is found, add the query object to the corresponding set
      if (dbType) {
        if (!this._dbTypes.has(dbType)) {
          this._dbTypes.set(dbType, new Set());
        }

        const _dbType = this._dbTypes.get(dbType);
        _dbType.add(queryObject);
      }
    }
  }

  /**
   * Process child queries recursively.
   * @private
   * @param {Array} queryObjects - Array of child query objects.
   */
  _processChildQuery(queryObjects) {
    let queryObject = queryObjects.pop();

    // Process each child query object
    while (queryObject) {
      this._processQueryFields(queryObject);

      // If the child query object has more child queries, add them to the stack
      if (queryObject.childQueryObjects) {
        queryObjects.push(...queryObject.childQueryObjects);
        queryObject = queryObjects.pop();
      }
    }
  }

  /**
   * Process the main query object, including its fields and child queries.
   * @private
   * @param {Object} queryObject - The main query object to be processed.
   * @returns {Object} - The processed query object.
   */
  _processQueryObject(queryObject) {
    this._processQueryFields(queryObject);
    this._processChildQuery(queryObject.childQueryObjects);
    return queryObject;
  }

  /**
   * Initialize database controllers based on the configuration.
   * @private
   */
  _processDBControllers() {
    // Iterate through the configured database types and initialize corresponding controllers
    for (const [dbType, ReadQueryController] of databases.get('read')) {
      this._dbControllers.set(dbType, new ReadQueryController(this._model));
    }
  }

  _processDBTypesQueries() {
    for (const [, queryObjects] of this._dbTypes) {
      for (const queryObject of queryObjects) {
        if (queryObject.parentQueryObject && queryObjects.has(queryObject.parentQueryObject)) {
          queryObjects.delete(queryObject)
        }
      }
    }
  }

  /**
   * Perform read operation based on the provided query object.
   * @public
   * @async
   * @param {Object} queryObject - The query object for the read operation.
   */
  async read(queryObject) {
    this._processQueryObject(queryObject);
    // Additional processing or logging can be added here.

    this._processDBTypesQueries();
    for (const [dbType, queryObjects] of this._dbTypes) {
      for (const queryObject of queryObjects) {
        await this._dbControllers.get(dbType).read(queryObject);
      }
    }
  }
}
