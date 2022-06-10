export const COMPARATOR = ['=', '>', '<', '>=', '<=', '!=', 'IN']
export const COMPARATORMAP = new Map([
    ['=', ['number', 'string', 'boolean']], 
    ['>', ['number']],
    ['<', ['number']],
    ['>=', ['number']],
    ['!=', ['number']],
    ['IN', ['array']]
]);