import QueryObject from '../model/query-object.js'
import { DB } from '../db/connect.js';
export default class Read {
    constructor(model) {
        this._model = model;
    }
    async Read(queryObject) {
        if(!queryObject instanceof QueryObject) {
            throw new Error(`${typeof queryObject} is not valid QueryObject`)
        }
        const db = await DB();
    }
}