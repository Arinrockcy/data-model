import databases from "../db/db.js";

/**
 * BaseController class serving as a base for ReadController and WriteController.
 * @class
 */
export default class BaseController {
  /**
   * Constructor for BaseController.
   * @constructor
   * @param {Object} model - The model for which the controller is created.
   * @param {String} operationType - The type of operation, either 'read' or 'write'.
   */
  constructor(model, operationType) {
    // Store the model for which the controller is created
    /** @protected */
    this._model = model;

    // Map to store database controllers based on database types
    /** @protected */
    this._dbControllers = new Map();

    // Map to store query objects based on their corresponding database types
    /** @protected */
    this._connectionSets = new Map();

    // Operation type: 'read' or 'write'
    /** @protected */
    this._operationType = operationType;

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
      const connectionName = tables.find(table => table.connectionName)?.connectionName;

      // If a matching database type is found, add the query object to the corresponding set
      if (connectionName) {
        if (!this._connectionSets.has(connectionName)) {
          this._connectionSets.set(connectionName, new Set());
        }
        const _connectionSet = this._connectionSets.get(connectionName);
        _connectionSet.add(queryObject);
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
    for (const [connectionName, dataBaseConnectionManager] of this._model._dataBaseConnections) {
      const { dbType } = dataBaseConnectionManager;
      const QueryController = databases.get(this._operationType).get(dbType);
      this._dbControllers.set(connectionName, new QueryController(this._model));
    }
  }

  /**
   * Clean up unnecessary queries in the _connectionSets set.
   * @private
   */
  _processQueries() {
    for (const [, queryObjects] of this._connectionSets) {
      for (const queryObject of queryObjects) {
        // Remove the query if it has a parent and the parent is present in the set
        if (queryObject.parentQueryObject && queryObjects.has(queryObject.parentQueryObject)) {
          queryObjects.delete(queryObject);
        }
      }
    }
  }

  /**
   * Perform operation based on the provided query object.
   * @public
   * @async
   * @param {Object} queryObject - The query object for the operation.
   */
  async execute(queryObject) {
    // Process the query object and its children
    this._processQueryObject(queryObject);

    // Additional processing or logging can be added here.

    // Clean up unnecessary queries in the _connectionSets set
    this._processQueries();

    // Perform operation for each database type and associated query objects
    for (const [connectionName, queryObjects] of this._connectionSets) {
      for (const queryObject of queryObjects) {
        // Call the appropriate method (read/write) on the corresponding database controller
        await this._dbControllers.get(connectionName)[this._operationType](queryObject);
      }
    }
  }
}
