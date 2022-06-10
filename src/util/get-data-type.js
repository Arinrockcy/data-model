export default function getDataType(value) {
    if (typeof value === 'object') {
        if (value.value) {
            return getDataType(value.value);
        } else if (value == null) {
            return null;
        } else if (value instanceof Date) {
            return 'date';
        } else if (Array.isArray(value)) {
            return getDataType(value[0]);
        }
    }
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || typeof value === 'symbol') {
        return typeof value;
    }
}