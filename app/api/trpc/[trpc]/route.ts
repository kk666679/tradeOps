/**
 * Legacy single-segment catch route — delegates to the catch-all proxy at
 * /api/trpc/[[...trpc]]/route.ts so both URL shapes work.
 */
export { GET, POST, PUT, PATCH, DELETE } from '../[[...trpc]]/route';
