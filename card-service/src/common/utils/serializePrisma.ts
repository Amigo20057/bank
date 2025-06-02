export function serializePrisma(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(serializePrisma);
    }

    if (obj instanceof Date) {
        return obj.toISOString();
    }

    if (
        obj &&
        typeof obj === "object" &&
        typeof obj.toFixed === "function" &&
        typeof obj.isZero === "function"
    ) {
        return obj.toString();
    }

    if (typeof obj === "bigint") {
        return obj.toString();
    }

    if (obj && typeof obj === "object") {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [
                key,
                serializePrisma(value),
            ]),
        );
    }

    return obj;
}
