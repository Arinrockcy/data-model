export default  {
    customer: {
        metaData: {
            primaryKeys: ['customerId'],
            keys: [['customerId'], ['orderId']]
        },
        fields: {
            customerId: {
                key: true,
                dataType : 'number'
            },
            orderId: {
                key: true,
                dataType : 'string'
            },
            firstName : {
                key: false,
                dataType : 'string'
            },
            lastName : {
                key: false,
                dataType : 'string'
            },
            created : {
                key: false,
                dataType : 'date'
            }
        }
    }
}