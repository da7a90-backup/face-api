export function extendWithFaceDescriptor(sourceObj, descriptor) {
    const extension = { descriptor };
    return { ...sourceObj, ...extension };
}
