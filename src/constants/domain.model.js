export default {
    customer: {
        metaData: {
            primaryKeys: ['customerId'],
            keys: [['customerId']]
        },
        fields: {
            customerId: {
                key: true,
                dataType: 'number'
            },
            orderId: {
                key: true,
                dataType: 'string'
            },
            firstName: {
                key: false,
                dataType: 'string'
            },
            lastName: {
                key: false,
                dataType: 'string'
            },
            created: {
                key: false,
                dataType: 'date'
            },
            orders: {
                key: false,
                domain: 'order',
                isOneToMany: true,
                keys: [['customerId']]
            }
        }
    },
    order: {
        metaData: {
            primaryKeys: ['customerId'],
            keys: [['customerId'], ['orderId']]
        },
        fields: {
            customerId: {
                key: true,
                dataType: 'number'
            },
            orderId: {
                key: true,
                dataType: 'string'
            },
            label: {
                key: false,
                dataType: 'string'
            },
            qty: {
                key: false,
                dataType: 'number'
            },
            created: {
                key: false,
                dataType: 'date'
            },
            customer: {
                key: false,
                domain: 'customer',
                isOneToMany: false,
                keys: [['customerId']]
            }
        }
    }
}