export default {
    customer: {
        metaData: {
            primaryKeys: ['customerId'],
            keys: [['customerId']]
        },
        fields: {
            insertedId: {
                key: false,
                path: 'insertedId',
                dataType: 'string',
                table: [
                    {
                        tableId: 'customer',
                        columnName : '_id'
                    }
                ]
            },
            customerId: {
                key: true,
                path: 'customerId',
                dataType: 'number',
                table: [
                    {
                        tableId: 'customer',
                        columnName : 'customerId'
                    }
                ]
            },
            firstName: {
                key: false,
                path: 'firstName',
                dataType: 'string',
                table: [
                    {
                        tableId: 'customer',
                        columnName : 'fname'
                    }
                ]
            },
            lastName: {
                key: false,
                path: 'lastName',
                dataType: 'string',
                table: [
                    {
                        tableId: 'customer',
                        columnName : 'lname'
                    }
                ]
            },
            created: {
                key: false,
                path: 'created',
                dataType: 'date',
                table: [
                    {
                        tableId: 'customer',
                        columnName : 'created'
                    }
                ]
            },
            orders: {
                key: false,
                path: 'orders',
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
            insertedId: {
                key: false,
                dataType: 'string',
                path: 'insertedId',
                table: [
                    {
                        tableId: 'order',
                        columnName : '_id'
                    }
                ]
            },
            orderDetailsinsertedId: {
                key: false,
                path: 'orderDetailsinsertedId',
                dataType: 'string',
                table: [
                    {
                        tableId: 'orderDetails',
                        columnName : '_id'
                    }
                ]
            },
            customerId: {
                key: true,
                dataType: 'number',
                path: 'customerId',
                table: [
                    {
                        tableId: 'order',
                        columnName : 'customerId'
                    }
                ]
            },
            orderId: {
                key: true,
                dataType: 'string',
                path: 'orderId',
                table: [
                    {
                        tableId: 'order',
                        columnName : 'orderId'
                    },
                    {
                        tableId: 'orderDetails',
                        columnName : 'orderId'
                    }
                ]
            },
            label: {
                key: false,
                path: 'label',
                dataType: 'string',
                table: [
                    {
                        tableId: 'order',
                        columnName : 'label'
                    }
                ]
            },
            quantity: {
                key: false,
                dataType: 'number',
                path: 'quantity',
                table: [
                    {
                        tableId: 'orderDetails',
                        columnName : 'quantity'
                    }
                ]
            },
            price:{
                key: false,
                path: 'price',
                dataType: 'number',
                table: [
                    {
                        tableId: 'orderDetails',
                        columnName : 'price'
                    }
                ]
            },
            created: {
                key: false,
                path: 'created',
                dataType: 'date',
                table: [
                    {
                        tableId: 'orderDetails',
                        columnName : 'created'
                    },
                    {
                        tableId: 'order',
                        columnName : 'created'
                    }
                ]
            },
            status: {
                key: false,
                dataType: 'string',
                path: 'status',
                table: [
                    {
                        tableId: 'orderDetails',
                        columnName : 'status'
                    },
                    {
                        tableId: 'order',
                        columnName : 'status'
                    }
                ]
            },
            customer: {
                key: false,
                path: 'customer',
                domain: 'customer',
                isOneToMany: false,
                keys: [['customerId']]
            }
        }
    }
}