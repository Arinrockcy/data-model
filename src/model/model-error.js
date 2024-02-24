import ERRORCONSTANTS from "../constants/error-code.js";
/**
 * Represents a custom error class for modeling specific errors.
 */
class ModelError extends Error {
  /**
     * @typedef {Object} ModelErrorData
     * @property {any} [customData] - Any custom data related to the error.
     */
  
  /**
     * Custom error class for modeling specific errors.
     * @param {string} code - The error code.
     * @param {string} message - The error message.
     * @param {ModelErrorData} [data] - Additional data related to the error.
     * @throws {Error} Throws an error if the provided error code is invalid.
     */
  constructor(code, message, data) {
    super(message);
    
    /**
       * The name of the error class.
       * @type {string}
       */
    this.name = this.constructor.name;
  
    /**
       * The error code.
       * @type {string}
       * @private
       */
    this._code = code;
  
    /**
       * Additional data related to the error.
       * @type {ModelErrorData}
       * @private
       */
    this._data = data || {};
  
    if (!this.isValidErrorCode(code)) {
      throw new Error(`Invalid error code: ${code}`);
    }
  
    Error.captureStackTrace(this, this.constructor);
  }
  
  /**
     * Gets the error code.
     * @returns {number} The error code.
     */
  get code() {
    return this._code;
  }
  
  /**
     * Sets the error code.
     * @param {number} code - The error code to set.
     * @throws {Error} Throws an error if the provided error code is invalid.
     */
  set code(code) {
    if (!this.isValidErrorCode(code)) {
      throw new Error(`Invalid error code: ${code}`);
    }
    this._code = ERRORCONSTANTS[code].code;
  }
  
  /**
     * Checks if the provided error code is valid.
     * @param {number} code - The error code to validate.
     * @returns {boolean} Returns true if the code is valid; otherwise, false.
     * @private
     */
  isValidErrorCode(code) {
    // Add your logic to check if the code exists in error constants or any other validation
    return Object.prototype.hasOwnProperty.call(ERRORCONSTANTS, code)
  }
  
  /**
     * Get specific data properties from the error.
     * @returns {ModelErrorData} Object containing the data properties.
     */
  get data() {
    return this._data;
  }
  
  /**
     * Get a string representation of the error object, including data.
     * @returns {string} String representation of the error with data.
     */
  toString() {
    const dataString = this._data ? `Data: ${JSON.stringify(this._data)}` : '';
    return `${this.name} (Code: ${this._code}): ${this.message}. ${dataString}`;
  }
  
  /**
     * Get the file name and line number where the error occurred.
     * @returns {Object} Object containing the fileName and lineNumber.
     */
  getErrorLocation() {
    const stackLines = (this.stack || '').split('\n').slice(1);
  
    if (stackLines.length > 0) {
      const [firstLine] = stackLines;
      const matchResult = firstLine.match(/\(([^)]+)\)/);
  
      if (matchResult && matchResult.length > 1) {
        const [fileNameWithLine] = matchResult[1].split(':');
        const lineNumber = parseInt(fileNameWithLine.split(':').pop(), 10);
        const fileName = fileNameWithLine.replace(`:${lineNumber}`, '');
  
        return { fileName, lineNumber };
      }
    }
  
    return { fileName: 'Unknown', lineNumber: -1 };
  }
  
  // Other methods and properties...
}
  
export default ModelError;
  
  