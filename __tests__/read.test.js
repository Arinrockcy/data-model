import DataModel from '../index.js';
import domainModel from '../src/constants/domain.model.js';
const mongoose = require('mongoose');
describe('Read Test Case', () => {
    let dataContainer = {};
    beforeAll(() => {
        jest.setTimeout(1510000);
        const model = new DataModel(domainModel);
        dataContainer = model.DataContainer
    });
    test('order Read', async () => {
        await dataContainer.read({
            query: {
                filter: [
                    {
                        fieldName: 'customerId',
                        comparator: '=',
                        value: 1234
                    }
                ],
                domain: 'customer',
                fields: ['customerId', 'firstName', 'lastName', 'created'],
                childQuery: [
                    {
                    filter: [
                        {
                            fieldName: 'orderId',
                            comparator: '=',
                            value: '12347'
                        }
                    ],
                    domain: 'customer',
                    fields: ['label', 'quantity', 'price', 'status'],
                    childQuery: []
                }
            ]
            }
        });
        const order = dataContainer._entityCollection.get('customer')[0];
        const json = order.toJSON();
        expect(order).toHaveProperty('insertedId')
    });
});