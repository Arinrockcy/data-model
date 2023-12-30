class Field {

  /**
   * Create a Field instance.
   * @param {*} value - The initial value for the Field.
   * @param {*} oldvalue - The initial old value for the Field.
   * @param {boolean} read - The initial read status for the Field.
   */
  constructor(value, oldvalue, read) {
    this.value = value;
    this.oldvalue = oldvalue;
    this._read = read;   
    this._modifiedDate = new Date(); // Set initial modifiedDate to current date/time

  }

  /**
   * Setter method for the 'value' property.
   * @param {*} value - The new value to set.
   */
  set value(value) {
    this._value = value;
    this._modifiedDate = new Date(); // Update modifiedDate when value changes

  }

  /**
   * Setter method for the 'oldvalue' property.
   * @param {*} oldvalue - The new old value to set.
   */
  set oldvalue(oldvalue) {
    this._oldvalue = typeof oldvalue !== 'undefined' ? oldvalue : null;
  }

  /**
   * Getter method for the 'value' property.
   * @returns {*} - The current value of the Field.
   */
  get value() {
    return this._value;
  }

  /**
   * Getter method for the 'oldvalue' property.
   * @returns {*} - The current old value of the Field.
   */
  get oldvalue() {
    return this._oldvalue;
  }

  /**
   * Setter method for the 'read' property.
   * @param {boolean} read - The new read status to set.
   */
  set read(read) {
    this._read = read;
  }

  /**
   * Getter method for the 'read' property.
   * @returns {boolean} - The current read status of the Field.
   */
  get read() {
    return this._read;
  }

  /**
   * Getter method for the 'modifiedDate' property.
   * @returns {Date} - The date/time when the Field was last modified.
   */
  get modifiedDate() {
    return this._modifiedDate;
  }
}
export default Field;