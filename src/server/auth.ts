import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { db } from "./drizzle";
import { passwordSchema } from "@/lib/zod-schema/validation";
import { user, session, verification, account } from "./schema/auth-schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema: { user, session, verification, account },
  }),

  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }) {
      await sendMail({
        to: user.email,
        subject: "Reset your password",
        text: "Click the link to reset your password: " + url,
      });
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false,
      },
    },
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // validate password in server sside

      if (
        ctx.path === "/sys/sign-up/email" ||
        ctx.path === "/sys/reset-password" ||
        ctx.path === "/sys/change-password"
      ) {
        const password = ctx.body.password || ctx.body.newPassword;
        const { error } = passwordSchema.safeParse(password);

        if (error) {
          throw new APIError("BAD_REQUEST", {
            message: "Password not strong enough",
          });
        }
      }
    }),
  },
});
function sendMail(arg0: { to: string; subject: string; text: string }) {
  throw new Error("Function not implemented.");
}
