export const logger = {
  info:  (...a: unknown[]) => console.log(JSON.stringify({ lvl: 'info',  at: new Date().toISOString(), a })),
  warn:  (...a: unknown[]) => console.warn(JSON.stringify({ lvl: 'warn',  at: new Date().toISOString(), a })),
  error: (...a: unknown[]) => console.error(JSON.stringify({ lvl: 'error', at: new Date().toISOString(), a })),
};
