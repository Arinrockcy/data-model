export default {
  user: {
    metaData: {
      primaryKeys: ['userId'],
      keys: [['userId']]
    },
    fields: {
      insertedId: {
        key: false,
        path: 'insertedId',
        dataType: 'string',
        table: [
          {
            tableId: 'user',
            columnName: '_id'
          }
        ]
      },
      userId: {
        key: true,
        path: 'userId',
        dataType: 'number',
        table: [
          {
            tableId: 'user',
            columnName: 'userId'
          }
        ]
      },
      firstName: {
        key: false,
        path: 'firstName',
        dataType: 'string',
        table: [
          {
            tableId: 'user',
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
            tableId: 'user',
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
            tableId: 'user',
            columnName: 'created'
          }
        ]
      },
      orders: {
        key: false,
        path: 'orders',
        domain: 'order',
        isOneToMany: true,
        keys: [['userId']]
      }
    }
  },
  order: {
    metaData: {
      primaryKeys: ['userId'],
      keys: [['userId'], ['orderId']]
    },
    fields: {
      userId: {
        key: true,
        dataType: 'number',
        path: 'userId',
        table: [
          {
            tableId: 'user',
            columnName: 'userId'
          }
        ]
      },
      orderId: {
        key: true,
        dataType: 'string',
        path: 'orderId',
        table: [
          {
            tableId: 'user',
            columnName: 'orderId'
          },
          {
            tableId: 'user',
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
            tableId: 'user',
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
            tableId: 'user',
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
            tableId: 'user',
            columnName: 'price'
          }
        ]
      },
      user: {
        key: false,
        path: 'user',
        domain: 'user',
        isOneToMany: false,
        keys: [['userId']]
      }
    }
  }
}