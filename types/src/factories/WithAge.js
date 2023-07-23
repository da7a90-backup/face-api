export function isWithAge(obj) {
    return typeof obj.age === 'number';
}
export function extendWithAge(sourceObj, age) {
    const extension = { age };
    return { ...sourceObj, ...extension };
}
