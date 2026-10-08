export const first = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);
export const ids = (v?: string | string[]) => (Array.isArray(v) ? v : v ? [v] : []);
