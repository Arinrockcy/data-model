import DataModel from '../index.js';
import domainModel from '../src/constants/domain.model.js';
const mongoose = require('mongoose');
describe('Write test case', () => {
    let dataContainer = {};
    beforeAll(() => {
        jest.setTimeout(510000);
        const model = new DataModel(domainModel);
        dataContainer = model.DataContainer
    });
    test('order creation', async () => {
        dataContainer.addData('customer', {
            firstName: 'rockcy',
            customerId: 1234,
            created: new Date('2022/10/12'),
            action: 'I'
        });
        dataContainer.addData('order', {
            customerId: 1234,
            orderId: '12345',
            label: 'IPhone',
            created: new Date('2022/10/12'),
            quantity: 1,
            price: 123,
            action: 'I'
        });
        expect(dataContainer.entities).toHaveLength(2);
        expect(customer).not.toHaveProperty('insertedId')
        await dataContainer.write();
        const customer = dataContainer._entityCollection.get('customer')[0];
        expect(customer).toHaveProperty('insertedId')
    });
    afterAll(async (done) => {
        console.log(dataContainer.entities);
        await mongoose.connection.close();
        done()
    });
});