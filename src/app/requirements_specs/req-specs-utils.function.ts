export function omitUndefinedDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .map(v => omitUndefinedDeep(v))
      .filter(v => v !== undefined) as unknown as T;
  }
  if (value && typeof value === 'object') {
    const out: any = {};
    for (const [k, v] of Object.entries(value as any)) {
      const cleaned = omitUndefinedDeep(v as any);
      if (cleaned !== undefined) out[k] = cleaned;
    }
    return out;
  }
  return (value === undefined ? undefined : value) as T;
}

