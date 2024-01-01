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
            columnName: '_id'
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
            columnName: 'customerId'
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
            columnName: 'fname'
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
            columnName: 'lname'
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
            columnName: 'created'
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
      customerId: {
        key: true,
        dataType: 'number',
        path: 'customerId',
        table: [
          {
            tableId: 'customer',
            columnName: 'customerId'
          }
        ]
      },
      orderId: {
        key: true,
        dataType: 'string',
        path: 'orderId',
        table: [
          {
            tableId: 'customer',
            columnName: 'orderId'
          },
          {
            tableId: 'customer',
            columnName: 'orderId'
          }
        ]
      },
      label: {
        key: false,
        path: 'label',
        dataType: 'string',
        table: [
          {
            tableId: 'customer',
            columnName: 'label'
          }
        ]
      },
      quantity: {
        key: false,
        dataType: 'number',
        path: 'orderdetails.quantity',
        table: [
          {
            tableId: 'customer',
            columnName: 'quantity'
          }
        ]
      },
      price: {
        key: false,
        path: 'orderdetails.price',
        dataType: 'number',
        table: [
          {
            tableId: 'customer',
            columnName: 'price'
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