import DataContainer from './src/model/container.js';
import domainModel from './src/constants/domain.model.js';
import EventEmitter from 'events';
class DataModel extends EventEmitter{
    _config = {};
    _dataContainer = {};
    constructor(config){
        super();
        this._config = config;
        this._dataContainer = new DataContainer(this);
    }
}

const model = new DataModel(domainModel);
try{
   const customer1 =  model._dataContainer.addData('customer',{
        firstName: 'arin',
        customerId: 123,
        created: new Date('2022/10/12'),
        orderId: '12134'
    });
    model._dataContainer.addData('customer',{
        firstName: 'rockcy',
        customerId: 1234,
        created: new Date('2022/10/12'),
        orderId: '123',
        action: 'I'
    })
    customer1.update({customerId: 1235});
}catch(e){
console.log(e);
}

console.log(model);