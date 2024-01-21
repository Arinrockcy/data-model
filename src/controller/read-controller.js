import databases from "../db/db.js";
/**
 * ReadController class responsible for handling read operations from MongoDB.
 */
export default class ReadController {
  /**
   * Constructor for ReadController.
   * @param {Object} model - The model for which the controller is created.
   */
  constructor(model) {
    this._model = model;
    this._dbControllers = new Map();
    this._dbTypes = new Map();

    this._processDBControllers();

  }

  _processQueryFields(queryObject) {
    const { fields, domainName } = queryObject;
    const domainSpec = this._model.domainSpec[domainName].fields;
    for (const field of fields) {
      const { tables } = domainSpec[field];
      const connectionName = tables.find(table=>table.connectionName).connectionName;
      const dbTypeMap = [...this._model._dataBaseTypeSet].find(([, connectionNameSet])=>connectionNameSet.has(connectionName))
      if (dbTypeMap) {
        const dbType = [...dbTypeMap.keys()].pop()
        if (!this._dbTypes.has(dbType)) {
          this._dbTypes.set(dbType, new Set())
        }
        const _dbType = this._dbTypes.get(dbType);
        _dbType.add(queryObject)
      }
    }
  }

  _processChildQuery(queryObjects) {
    let queryObject = queryObjects.pop();
    while (queryObject) {
      this._processQueryFields(queryObject);
      if (queryObject.childQueryObjects) {
        queryObjects.push(...queryObject.childQueryObjects);
        queryObject = queryObjects.pop();
      }
    }
  }

  _processQueryObject(queryObject) {
    this._processQueryFields(queryObject);
    this._processChildQuery(queryObject.childQueryObjects)
    return queryObject;
  }

  _processDBControllers() {
    for (const [dbType, ReadQueryController] of databases.get('read')) {
      this._dbControllers.set(dbType, new ReadQueryController(this))
    }
  }

  async read(queryObject) {
    this._processQueryObject(queryObject);
  }

}