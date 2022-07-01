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
        dataContainer.addData('order', {
            customerId: 1234,
            orderId: '12347',
            label: 'IPhone',
            created: new Date('2022/10/12'),
            quantity: 1,
            price: 123,
            action: 'I'
        });
        expect(dataContainer.entities).toHaveLength(1);
        await dataContainer.write();
        const customer = dataContainer._entityCollection.get('order')[0];
        expect(customer).toHaveProperty('insertedId')
    });
});