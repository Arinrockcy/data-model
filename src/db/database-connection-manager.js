import DBTYPES from "../constants/db-types.js"
import ERRORLABEL from "../constants/error-label.js";
import mongoose from "mongoose";
import ModelError from "../model/model-error.js";

export default class DataBaseConnectionManager {
  constructor(model) {
    this._model = model;
  }

  get model() {
    return this._model;
  }

  get dbType() {
    return this._dbType;
  }

  get dbConfig() {
    return this._dbConfig;
  }

  openConnection(dbConfig, dbType) {
    if (!dbType || typeof dbType != 'string') {
      throw new ModelError(ERRORLABEL.INVALID_INPUT, `dbType expected to be string, got ${typeof dbType}`)
    }
    this._dbType = dbType;
    if (!dbConfig || typeof dbConfig != 'object') {
      throw new ModelError(ERRORLABEL.INVALID_INPUT, `dbConfig expected to be Object, got ${typeof dbConfig}`)
    }
    this._dbConfig = dbConfig;

    this._openConnection();
  }

  getConnection() {
    if (!this._connection) {
      this.openConnection(this._dbConfig, this._dbType);
    }
    return this._connection;
  }

  async closeConnection() {
    switch (this._dbType) {
    case DBTYPES.MONGODB:
      await this._closeMongoose();
      break;
    }
  }

  _openMongoose() {
    const { connectionString } = this._dbConfig;
    if (!connectionString || typeof connectionString != 'string') {
      throw new ModelError(ERRORLABEL.INVALID_INPUT, `connectionString expected to be string, got ${typeof connectionString}`);
    }
    this._connection = mongoose.createConnection(connectionString); 
  }

  async _closeMongoose() {
    if (!this._connection) {
      throw new ModelError(ERRORLABEL.WRONG_ORDER, `connection not opened`)
    }
    await this.getConnection().close();
  }

  _openConnection() {
    switch (this._dbType) {
    case DBTYPES.MONGODB:
      this._openMongoose();
      break;
    }
  }
}
