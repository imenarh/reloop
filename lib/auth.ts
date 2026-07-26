import { betterAuth } from "better-auth/minimal";
import { emailOTP } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Resend } from "resend";
import { db } from "@/db";
import { user, session, account, verification } from "@/db/schema";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: { user, session, account, verification },
    }),
    plugins: [
      emailOTP({
          expiresIn: 5 * 60,
            async sendVerificationOTP({ email, otp, type }) {
                const subject =
                    type === "sign-in"
                        ? "Your ReLoop sign-in code"
                        : "Your ReLoop verification code";
                await resend.emails.send({
                    from: process.env.EMAIL_FROM ?? "ReLoop <reloop@0xherve.tech>",
                    to: email,
                    subject,
                    text: `Your ReLoop verification code is ${otp}. It expires in 5 minutes.`,
                });
            },
        }),
    ],
    user: {
        additionalFields: {
            role: {
                type: "string",
                input: false,
            },
            bio: {
                type: "string",
                required: false,
                input: true,
            },
            onboardedAt: {
                type: "date",
                required: false,
                input: false,
            },
        },
    },
});