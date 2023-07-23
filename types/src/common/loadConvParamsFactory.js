// eslint-disable-next-line no-unused-vars
export function loadConvParamsFactory(extractWeightEntry) {
    return (prefix) => {
        const filters = extractWeightEntry(`${prefix}/filters`, 4);
        const bias = extractWeightEntry(`${prefix}/bias`, 1);
        return { filters, bias };
    };
}
