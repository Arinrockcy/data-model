/**
 * Retrieves keys from the given entity object based on available slots.
 * @param {object} entity - The entity object from which keys are retrieved.
 * @param {Array} keySlots - Slots or keys to extract from the entity.
 * @returns {Array} - Array of objects containing keys and their corresponding values.
 * @throws {TypeError} - Throws a TypeError if entity is not an object or keySlots is not an array.
 */

export default function getKeys(entity, keySlots) {
  if (typeof entity !== 'object' || entity === null) {
    throw new TypeError('Entity should be an object.');
  }
    
  if (!Array.isArray(keySlots)) {
    throw new TypeError('Key slots should be provided as an array.');
  }
  const keys = [];
  
  if (entity.ids) {
    for (const [key, value] of Object.entries(entity.ids)) {
      keys.push({ [key]: value });
    }
  } else {
    for (const keySlot of keySlots) {
      if (entity[keySlot]) {
        keys.push({ [keySlot]: entity[keySlot] });
      }
    }
  }
  
  return keys;
}