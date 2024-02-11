import DBTYPES from "../constants/db-types.js"
import ERRORLABEL from "../constants/error-label.js";

import mongoose  from "mongoose";

import ModelError from "../model/model-error.js";

/**
 * Class representing a manager for opening and closing database connections.
 */
export default class DataBaseConnectionManager {
  
  /**
   * Creates a new instance of DataBaseConnectionManager.
   * @param {Object} model - The model associated with the database connection.
   */
  constructor(model) {
    this._model = model;
  }

  /**
   * Opens a database connection based on the provided configuration and type.
   * @param {Object} dbConfig - The configuration for the database connection.
   * @param {string} dbType - The type of the database (e.g., 'mongodb').
   * @throws {ModelError} If the input parameters are invalid.
   */
  openConnection(dbConfig, dbType) {
    // Validate the input parameters
    if (!dbType || typeof dbType != 'string') {
      throw new ModelError(ERRORLABEL.INVALID_INPUT, `dbType expected to be string, got ${typeof dbType}`)
    }
    this._dbType = dbType;
    if (!dbConfig || typeof dbConfig != 'object') {
      throw new ModelError(ERRORLABEL.INVALID_INPUT, `dbConfig expected to be Object, got ${typeof dbConfig}`)
    }
    this._dbConfig = dbConfig;

    // Call the method to open the actual database connection
    this._openConnection();
  }

  /**
   * Gets the existing database connection or opens a new one if not present.
   * @returns {Object} The database connection.
   */
  getConnection() {
    if (!this._connection) {
      this.openConnection(this._dbConfig, this._dbType);
    }
    return this._connection;
  }

  /**
   * Closes the database connection based on the specified type.
   * @throws {ModelError} If the connection is not opened.
   */
  async closeConnection() {
    switch (this._dbType) {
    case DBTYPES.MONGODB:
      await this._closeMongoose();
      break;
    }
  }

  /**
   * Opens a Mongoose database connection based on the configuration.
   * @throws {ModelError} If the connectionString is invalid.
   */
  _openMongoose() {
    // Extract connectionString from dbConfig
    // for Mongoose model experts to pass connectionString as part of dbConfig
    const { connectionString } = this._dbConfig;

    // Validate the connectionString
    if (!connectionString || typeof connectionString != 'string') {
      throw new ModelError(ERRORLABEL.INVALID_INPUT, `connectionString expected to be string, got ${typeof connectionString}`);
    }

    // Create a Mongoose connection
    this._connection = mongoose.createConnection(connectionString); 
  }

  /**
   * Closes a Mongoose database connection.
   * @throws {ModelError} If the connection is not opened.
   */
  async _closeMongoose() {
    // Check if the connection is opened
    if (!this._connection) {
      throw new ModelError(ERRORLABEL.WRONG_ORDER, `connection not opened`)
    }

    // Close the Mongoose connection
    await this.getConnection().close();
  }

  /**
   * Opens a database connection based on the specified type.
   */
  _openConnection() {
    switch (this._dbType) {
    case DBTYPES.MONGODB:
      this._openMongoose();
      break;
    }
  }

}