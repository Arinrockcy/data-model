import DataContainer from './src/model/container.js';
import domainModel from './src/constants/domain.model.js';
import EventEmitter from 'events';
import Joi from 'joi';
const domainSchema = {

}
class DataModel extends EventEmitter {
    _config = {};
    _dataContainer = {};
    constructor(config) {
        super();
        this._config = config;
        this._dataContainer = new DataContainer(this);
    }

    get DataContainer() {
        return this._dataContainer;
    }
}

const model = new DataModel(domainModel);
const dataContainer = model.DataContainer
try {
    const customer1 = dataContainer.addData('customer', {
        firstName: 'arin',
        customerId: 123,
        created: new Date('2022/10/12')
    });
    const customer = dataContainer.addData('customer', {
        firstName: 'rockcy',
        customerId: 1234,
        created: new Date('2022/10/12'),
        action: 'I'
    });
    const order = dataContainer.addData('order', {
        customerId: 1234,
        orderId: '12345',
        label: 'IPhone',
        created: new Date('2022/10/12'),
        quantity: 1,
        price: 123,
        action: 'I'
    });
    customer.orders;
    order.customer
    customer1.update({ customerId: 1235 });
    (async ()=> {
        const result = await dataContainer.write();
        console.log(result);
    })();
    
    // dataContainer.read({
    //     query: {
    //         filter: [
    //             [[{
    //                 fieldName: 'customerId',
    //                 comparator: '=',
    //                 value: 1235
    //             },
    //             {
    //                 fieldName: 'orderId',
    //                 comparator: '=',
    //                 value: '12345',
    //                 operator: 'and'
    //             }], {
    //                 fieldName: 'orderId',
    //                 comparator: '=',
    //                 value: '12346',
    //                 operator: 'or'
    //             }]
    //         ],
    //         domain: 'order',
    //         fields: ['orderId', 'label', 'created'],
    //         childQuery: [{
    //             query: {
    //                 filter: [
    //                     {
    //                         fieldName: 'customerId',
    //                         comparator: '=',
    //                         value: 123
    //                     }
    //                 ],
    //                 domain: 'order',
    //                 fields: ['firstName', 'customerId', 'created'],
    //                 childQuery: []
    //             }
    //         }]
    //     }
    // })
} catch (e) {
    console.log(e);
}