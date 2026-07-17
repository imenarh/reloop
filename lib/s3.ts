import { S3Client } from '@aws-sdk/client-s3';

// Cloudflare R2 speaks the S3 API, so the standard AWS SDK client works
// as-is — just point endpoint at the R2 account URL.
export const r2 = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT, // e.g. https://<account_id>.r2.cloudflarestorage.com
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
    },
});

export const R2_BUCKET = process.env.R2_BUCKET_NAME as string;
// Public base URL for reading uploaded objects (R2 public bucket URL or
// a custom domain fronting the bucket via Cloudflare).
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL as string;
