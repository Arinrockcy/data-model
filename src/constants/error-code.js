const ERRORCONSTANTS = {
  "CONTINUE": {
    "code": 100,
    "message": "Continue."
  },
  "SWITCHING_PROTOCOLS": {
    "code": 101,
    "message": "Switching protocols."
  },
  "PROCESSING": {
    "code": 102,
    "message": "Processing."
  },
  "EARLY_HINTS": {
    "code": 103,
    "message": "Early hints."
  },
  "OK": {
    "code": 200,
    "message": "OK."
  },
  "CREATED": {
    "code": 201,
    "message": "Created."
  },
  "ACCEPTED": {
    "code": 202,
    "message": "Accepted."
  },
  "NON_AUTHORITATIVE_INFORMATION": {
    "code": 203,
    "message": "Non-authoritative information."
  },
  "NO_CONTENT": {
    "code": 204,
    "message": "No content."
  },
  "RESET_CONTENT": {
    "code": 205,
    "message": "Reset content."
  },
  "PARTIAL_CONTENT": {
    "code": 206,
    "message": "Partial content."
  },
  "MULTI_STATUS": {
    "code": 207,
    "message": "Multi-status."
  },
  "ALREADY_REPORTED": {
    "code": 208,
    "message": "Already reported."
  },
  "IM_USED": {
    "code": 226,
    "message": "IM used."
  },
  "MULTIPLE_CHOICES": {
    "code": 300,
    "message": "Multiple choices."
  },
  "MOVED_PERMANENTLY": {
    "code": 301,
    "message": "Moved permanently."
  },
  "FOUND": {
    "code": 302,
    "message": "Found."
  },
  "SEE_OTHER": {
    "code": 303,
    "message": "See other."
  },
  "NOT_MODIFIED": {
    "code": 304,
    "message": "Not modified."
  },
  "USE_PROXY": {
    "code": 305,
    "message": "Use proxy."
  },
  "TEMPORARY_REDIRECT": {
    "code": 307,
    "message": "Temporary redirect."
  },
  "PERMANENT_REDIRECT": {
    "code": 308,
    "message": "Permanent redirect."
  },
  "BAD_REQUEST": {
    "code": 400,
    "message": "Bad request."
  },
  "UNAUTHORIZED_ACCESS": {
    "code": 401,
    "message": "Unauthorized access."
  },
  "FORBIDDEN": {
    "code": 403,
    "message": "Access forbidden."
  },
  "NOT_FOUND": {
    "code": 404,
    "message": "Requested resource not found."
  },
  "METHOD_NOT_ALLOWED": {
    "code": 405,
    "message": "Method not allowed."
  },
  "NOT_ACCEPTABLE": {
    "code": 406,
    "message": "Not acceptable."
  },
  "PROXY_AUTHENTICATION_REQUIRED": {
    "code": 407,
    "message": "Proxy authentication required."
  },
  "REQUEST_TIMEOUT": {
    "code": 408,
    "message": "Request timeout."
  },
  "CONFLICT": {
    "code": 409,
    "message": "Conflict."
  },
  "GONE": {
    "code": 410,
    "message": "Resource no longer available."
  },
  "LENGTH_REQUIRED": {
    "code": 411,
    "message": "Length required."
  },
  "PRECONDITION_FAILED": {
    "code": 412,
    "message": "Precondition failed."
  },
  "PAYLOAD_TOO_LARGE": {
    "code": 413,
    "message": "Payload too large."
  },
  "URI_TOO_LONG": {
    "code": 414,
    "message": "URI too long."
  },
  "UNSUPPORTED_MEDIA_TYPE": {
    "code": 415,
    "message": "Unsupported media type."
  },
  "REQUESTED_RANGE_NOT_SATISFIABLE": {
    "code": 416,
    "message": "Requested range not satisfiable."
  },
  "EXPECTATION_FAILED": {
    "code": 417,
    "message": "Expectation failed."
  },
  "I_AM_A_TEAPOT": {
    "code": 418,
    "message": "I'm a teapot."
  },
  "UNPROCESSABLE_ENTITY": {
    "code": 422,
    "message": "Unprocessable entity."
  },
  "LOCKED": {
    "code": 423,
    "message": "Locked."
  },
  "FAILED_DEPENDENCY": {
    "code": 424,
    "message": "Failed dependency."
  },
  "TOO_EARLY": {
    "code": 425,
    "message": "Too early."
  },
  "UPGRADE_REQUIRED": {
    "code": 426,
    "message": "Upgrade required."
  },
  "PRECONDITION_REQUIRED": {
    "code": 428,
    "message": "Precondition required."
  },
  "TOO_MANY_REQUESTS": {
    "code": 429,
    "message": "Too many requests."
  },
  "REQUEST_HEADER_FIELDS_TOO_LARGE": {
    "code": 431,
    "message": "Request header fields too large."
  },
  "UNAVAILABLE_FOR_LEGAL_REASONS": {
    "code": 451,
    "message": "Unavailable for legal reasons."
  },
  "INTERNAL_ERROR": {
    "code": 500,
    "message": "Internal server error."
  },
  "NOT_IMPLEMENTED": {
    "code": 501,
    "message": "Not implemented."
  },
  "BAD_GATEWAY": {
    "code": 502,
    "message": "Bad gateway."
  },
  "SERVICE_UNAVAILABLE": {
    "code": 503,
    "message": "Service unavailable."
  },
  "GATEWAY_TIMEOUT": {
    "code": 504,
    "message": "Gateway timeout."
  },
  "HTTP_VERSION_NOT_SUPPORTED": {
    "code": 505,
    "message": "HTTP version not supported."
  },
  "VARIANT_ALSO_NEGOTIATES": {
    "code": 506,
    "message": "Variant also negotiates."
  },
  "INSUFFICIENT_STORAGE": {
    "code": 507,
    "message": "Insufficient storage."
  },
  "LOOP_DETECTED": {
    "code": 508,
    "message": "Loop detected."
  },
  "NOT_EXTENDED": {
    "code": 510,
    "message": "Not extended."
  },
  "NETWORK_AUTHENTICATION_REQUIRED": {
    "code": 511,
    "message": "Network authentication required."
  },
  "INVALID_INPUT": {
    "code": 400,
    "message": "Invalid input provided."
  },
  "INVALID_DATA_TYPE": {
    "code": 422,
    "message": "Invalid data type."
  },
  "INVALID_FORMAT": {
    "code": 422,
    "message": "Invalid data format."
  },
  "INVALID_LENGTH": {
    "code": 422,
    "message": "Invalid data length."
  },
  "INVALID_VALUE": {
    "code": 422,
    "message": "Invalid data value."
  },
  "WRONG_ORDER": {
    "code": 405,
    "message": "Wrong order."
  },
  "DB_CONNECTION_ERROR": {
    "code": 500,
    "message": "Database connection error."
  },
  "DB_QUERY_ERROR": {
    "code": 500,
    "message": "Database query error."
  }
};
  
export default ERRORCONSTANTS;
  