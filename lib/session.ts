import { headers } from 'next/headers';
import { auth } from './auth';

/**
 * Reads the current session from the incoming request's cookies.
 * Returns null if there's no valid session — callers decide how to react.
 */
export async function getCurrentSession() {
    const session = await auth.api.getSession({ headers: await headers() });
    return session;
}

/**
 * Throws if there's no logged-in user. Use at the top of any
 * server action or route handler that requires auth.
 */
export async function requireUser() {
    const session = await getCurrentSession();
    if (!session?.user) {
        throw new Error('UNAUTHENTICATED');
    }
    return session.user;
}

/**
 * Throws if there's no logged-in admin. Use for moderation/verification
 * actions (approving organizations, removing listings, etc.).
 */
export async function requireAdmin() {
    const user = await requireUser();
    if (user.role !== 'admin') {
        throw new Error('FORBIDDEN');
    }
    return user;
}
