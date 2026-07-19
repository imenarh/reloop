import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';
import { auth } from './auth';
import { db } from '@/db';
import { user } from '@/db/schema';


export async function getCurrentSession() {
    const session = await auth.api.getSession({ headers: await headers() });
    return session;
}

export async function requireUser() {
    const session = await getCurrentSession();
    if (!session?.user) {
        throw new Error('UNAUTHENTICATED');
    }
  
    const [dbUser] = await db
        .select()
        .from(user)
        .where(eq(user.id, session.user.id))
        .limit(1);
    
    if (!dbUser) {
        throw new Error('USER_NOT_FOUND');
    }
    
    return dbUser;
}

export async function requireAdmin() {
    const dbUser = await requireUser();
    if (dbUser.role !== 'admin') {
        throw new Error('FORBIDDEN');
    }
    return dbUser;
}