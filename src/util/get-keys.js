export default function getKeys(entity, keyySlots) {
    const keys = [];
    if (entity.ids) {
        for (const key in entity.ids) {
            if (Object.hasOwnProperty.call(entity.ids, key)) {
                const element = entity.ids[key];
                keys.push({
                    [key]: element
                });
            }
        }
    } else {
        for (const iterator of keyySlots) {
            if (entity[iterator]) {

                keys.push({
                    [iterator]: entity[iterator]
                })
            }
        }
    }
    return keys;
}