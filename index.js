import DataContainer from './src/model/container.js';
import domainModel from './src/constants/domain.model.js';
import EventEmitter from 'events';
import getKeys from './src/util/get-keys.js';

export default class DataModel extends EventEmitter {
  _config = {};
  _dataContainer = {};
  constructor(config) {
    super();
    this._config = config;
    this._domainFields = config.domainModel;
    this._dbConfig = config.dbConfig;
    this._config = this._domainFields;
    this._dataContainer = new DataContainer(this);
  }

  get DataContainer() {
    return this._dataContainer;
  }

  get DomainFields() {
    return this._domainFields
  }

  get sampleDominModel() {
    return domainModel;
  }
  get keys() {
    return getKeys;
  }
}

// const model = new DataModel({
//     domainModel: domainModel,
//     dbConfig: 'mongodb+srv://data_model:data_model@cluster0.24asb.mongodb.net/data_model?retryWrites=true&w=majority'
// });
// const dataContainer = model.DataContainer
// try {
// const customer = dataContainer.addData('customer', {
//     firstName: 'rockcy',
//     customerId: 1234567,
//     created: new Date('2022/10/12'),
//     action: 'I'
// });
// const order = dataContainer.addData('order', {
//     customerId: 1234567,
//     orderId: '12345678',
//     label: 'IPhone',
//     quantity: 1,
//     price: 123,
//     action: 'I'
// });
// (async ()=> {
//     const result = await dataContainer.write();
//     console.log(result);
// })();
//     (async () => {
//         await dataContainer.read({
//             query: {
//                 filter: [
//                     {
//                         fieldName: 'customerId',
//                         comparator: '=',
//                         value: 1234567
//                     }
//                 ],
//                 domain: 'customer',
//                 fields: [ 'firstName', 'orders', 'lastName'],
//                 childQuery: []
//             }
//         });
//         const order = dataContainer._entityCollection.get('customer')[0];
//         const json = order.toJSON();
//         console.log(json);
//     })();
    
// } catch (e) {
//     console.log(e);
// }