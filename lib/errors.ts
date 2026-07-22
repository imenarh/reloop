/**
 * Typed error for server action failures. Using `instanceof ActionError`
 * lets callers (and tests) distinguish our sentinel error codes from
 * unexpected exceptions, and keeps the `code` accessible in one place.
 *
 * Note: Next.js still redacts thrown error messages from the client in
 * production regardless of this class — a fuller fix would have server
 * actions return a discriminated union like `{ ok: false, code }` instead
 * of throwing at all. That's a larger refactor and left as a follow-up.
 */
export class ActionError extends Error {
    constructor(public code: string, message?: string) {
        super(message ?? code);
        this.name = 'ActionError';
    }
}
