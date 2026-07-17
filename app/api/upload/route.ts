import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';
import { r2, R2_BUCKET, R2_PUBLIC_URL } from '@/lib/s3';
import { requireUser } from '@/lib/session';

const requestSchema = z.object({
    fileName: z.string().min(1),
    contentType: z.string().regex(/^image\/(jpeg|jpg|png|webp)$/, 'Only JPEG, PNG, or WEBP images are allowed'),
});

/**
 * POST /api/upload
 * Returns a presigned PUT URL the client uploads directly to R2 with —
 * the file bytes never pass through our server. The client then sends
 * the returned `publicUrl` to the listing_images action to save it.
 */
export async function POST(request: NextRequest) {
    try {
        await requireUser();
    } catch {
        return NextResponse.json({ message: 'You must be logged in to upload images.' }, { status: 401 });
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ message: 'Invalid JSON body.' }, { status: 400 });
    }

    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { message: 'Validation failed.', errors: parsed.error.flatten().fieldErrors },
            { status: 400 }
        );
    }

    const { fileName, contentType } = parsed.data;
    const extension = fileName.split('.').pop();
    const objectKey = `listings/${createId()}.${extension}`;

    try {
        const command = new PutObjectCommand({
            Bucket: R2_BUCKET,
            Key: objectKey,
            ContentType: contentType,
        });

        const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 300 }); // 5 minutes

        return NextResponse.json({
            uploadUrl,
            objectKey,
            publicUrl: `${R2_PUBLIC_URL}/${objectKey}`,
        });
    } catch (err) {
        console.error('Presign error:', err);
        return NextResponse.json({ message: 'Could not generate upload URL.' }, { status: 500 });
    }
}
