export default class ModelError extends Error {
  /**
     * Custom error class for modeling specific errors.
     * @param {number} code - The error code.
     * @param {string} message - The error message.
     * @param {object} data - Additional data related to the error.
     */
  constructor(code, message, data) {
    // Call the Error class constructor with the provided message
    super(message);
  
    // Set the name, code, and data properties
    this.name = this.constructor.name;
    this.code = code;
    this._data = data; // Using _data to store the error-related data
  
    // Capture the stack trace for debugging purposes
    Error.captureStackTrace(this, this.constructor);
  }
  
  /**
     * Get the stack trace of the error.
     * @returns {string} - The stack trace.
     */
  get stack() {
    return this.stack;
  }
  
  /**
     * Get a string representation of the error object.
     * Handles circular references if present.
     * @returns {string} - String representation of the error.
     */
  get string() {
    const getCircularReplacer = () => {
      const seen = new WeakSet();
      return (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            return '[Circular]';
          }
          seen.add(value);
        }
        return value;
      };
    };
  
    return JSON.stringify(
      {
        name: this.name,
        code: this.code,
        message: this.message,
        data: this.data, // Using the data getter here to access _data property
        stack: this.stack,
      },
      getCircularReplacer()
    );
  }
  
  /**
     * Get specific data properties from the error.
     * @returns {Object} - Object containing the data properties.
     */
  get data() {
    return this._data || {};
  }
  
  /**
     * Get the file name and line number where the error occurred.
     * @returns {Object} - Object containing the fileName and lineNumber.
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
}
  