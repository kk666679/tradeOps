export function validate(schema, input) {
    const r = schema.safeParse(input);
    if (!r.success) {
        throw new Error(`validation failed: ${r.error.issues.map((i) => i.path.join(".") + ": " + i.message).join("; ")}`);
    }
    return r.data;
}
//# sourceMappingURL=validate.js.map