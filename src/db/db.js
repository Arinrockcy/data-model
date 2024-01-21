import DBTYPES from "../constants/db-types.js";

import ReadQueryController from "./mongodb/read-query-controller.js";
import WriteQueryController from "./mongodb/write-query-controller.js";

const databases = new Map();
databases.set('read', new Map(
  [
    [DBTYPES.MONGODB, ReadQueryController],
  ]
));

databases.set('write', new Map(
  [
    [
      DBTYPES.MONGODB, WriteQueryController
    ]
  ]
))
export default databases;