export function renameObjectKey<T extends Record<string, unknown>>(
    obj: T,
    key: keyof T,
    newKey: string
): T {
    if (key !== newKey && obj.hasOwnProperty(key)) {
        Object.defineProperty(
            obj,
            newKey,
            Object.getOwnPropertyDescriptor(obj, key)!
        );
        delete obj[key];
    }

    return obj;
}
