
// class imports
import DataContainer from './src/model/container.js';
import EventEmitter from 'events';
import ModelError from './src/model/model-error.js';
import DataBaseConnectionManager from './src/db/database-connection-manager.js';

// functions imports
import getKeys from './src/util/get-keys.js';

// constant imports
import domainModel from './src/constants/domain.model.js';
import DBTYPES from './src/constants/db-types.js';
import ERRORLABEL from './src/constants/error-label.js';

export default class DataModel extends EventEmitter {
  /**
   * Private properties:
   * - _config: Holds the configuration object.
   * - _dataBaseConnections: Map to store database connections.
   * - _fieldsSpcByConnection: Map to store domain field specifications by connection.
   */
  _config = {};

  /**
   * Constructor for DataModel.
   * Initializes the DataModel with the provided configuration.
   * @param {object} config - The configuration object containing domainModel and dbConfig.
   */
  constructor(config) {
    super();
    // Initialize the configuration with the provided domainModel.
    this._config = config.domainModel;
    // Map to store database connections.
    this._dataBaseConnections = new Map();
    // Map to store domain field specifications by connection.
    this._fieldsSpcByConnection = new Map();
    // Map to store list of DBTypes
    this._dataBaseTypeSet = new Map()

    // Process domain fields during initialization.
    this._processDomainFields();
  }

  /**
   * Getter method to retrieve the dataContainer.
   * @returns {DataContainer} - Returns a new instance of DataContainer using this DataModel instance.
   */
  get dataContainer() {
    return new DataContainer(this);
  }

  /**
   * Getter method to access the domainFields.
   * @returns {object} - Returns the domain spec configuration.
   */
  get domainSpec() {
    return this._config;
  }

  /**
   * Getter method to retrieve a sample domain model.
   * @returns {object} - Returns a sample domain model (assuming domainModel is defined elsewhere).
   */
  get sampleDomainModel() {
    return domainModel;
  }

  /**
   * Getter method to access keys.
   * @returns {function} - Returns keys function (assuming getKeys is defined elsewhere).
   */
  get keys() {
    return getKeys;
  }

  /**
   * Opens database connections based on the provided configurations.
   * @param {object[]} configs - Array of database configurations with dbType and other settings.
   * @throws {ModelError} - Throws an error if an invalid database type is provided.
   */
  openDataBaseConnection(configs) {
    for (const connectionName in configs) {
      const config = configs[connectionName]
      const { dbType, ...dbConfig } = config;
      if (!Object.values(DBTYPES).includes(dbType)) {
        throw new ModelError(ERRORLABEL.INVALID_VALUE, `${dbType} is should be one of ${Object.values(DBTYPES).join()}`);
      }
      const connectionManager = new DataBaseConnectionManager(this);
      connectionManager.openConnection(dbConfig, dbType)
      this._dataBaseConnections.set(connectionName, connectionManager);
      if (!this._dataBaseTypeSet.has(dbType)) {
        this._dataBaseTypeSet.set(dbType, new Set());
      }
      const dbSets = this._dataBaseTypeSet.get(dbType);
      dbSets.add(connectionName);
    }
  }

  /**
   * Processes domain fields to store information about connections and fields in _fieldsSpcByConnection.
   * @private
   */
  _processDomainFields() {
    for (const domainName in this.domainSpec) {
      const domainSpec = this.domainSpec[domainName];
      for (const fieldName in domainSpec.fields) {
        const { tables } = domainSpec.fields[fieldName];
        if (!tables) {
          continue;
        }
        for (const { connectionName } of tables) {
          if (!this._fieldsSpcByConnection.has(connectionName)) {
            this._fieldsSpcByConnection.set(connectionName, new Map());
          }
          const connectionSpec = this._fieldsSpcByConnection.get(connectionName);
          if (!connectionSpec.has(domainName)) {
            connectionSpec.set(domainName, new Set());
          }
          const fieldsSpec = connectionSpec.get(domainName);
          if (!fieldsSpec.has(domainName)) {
            fieldsSpec.add(fieldName)
          }
        }

      }
    }
  }

}