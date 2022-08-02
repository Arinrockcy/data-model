const {
    NODE_ENV = 'development',
    PORT = 3000,
    HOST = '0.0.0.0',
    DB_PORT = 3306,
    DB_DATABASE = 'games_expo',
    DB_USERNAME = 'root',
    DB_PASSWORD = '7411041413 * !',
    DB_HOST = ''
  } = process.env;
  
  //export the required constant
  export default {
    env: NODE_ENV,
    port: PORT,
    host: HOST,
    pinLen: 8,
    defaultUser: 1,
    DB: {
      host: DB_HOST,
      user: DB_USERNAME,
      pass: DB_PASSWORD,
      database: DB_DATABASE,
      port: DB_PORT
    }
  };

  export const dataTypeMap = new Map(
    [
      ["string", String], 
      ["number", Number],
      ["date", Date],
      ["object", Object],
      ["boolean", Boolean],
      ["array", Array]
    ]
    );
  