import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { admin } from "better-auth/plugins";
import { db } from "./db/drizzle";
import { user, session, verification, account } from "./db/schema/auth-schema";
import { ac, admin as adminRole, user as userRole, superAdmin, utility, ROLES, } from "./auth-utils/permissions";
import { eq } from "drizzle-orm";
import { passwordSchema } from "@/lib/zod-schema/validation";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema: { user, session, verification, account },
  }),

  plugins: [
    admin({
      ac,
      roles: {
        [ROLES.SUPERADMIN]: superAdmin,
        [ROLES.UTILITY]: utility,
        [ROLES.ADMIN]: adminRole,
      },
    }),
  ],

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
    // additionalFields removed as role is managed by admin plugin
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

    // auto promotion of first user to super admin

    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const usersCount = await db.select().from(user).execute();
        if (usersCount.length === 1) {
          const newUser = usersCount[0];
          await db
            .update(user)
            .set({
              role: ROLES.SUPERADMIN,
            })
            .where(eq(user.id, newUser.id));
        }
      }
    }),
  },
});

function sendMail(arg0: { to: string; subject: string; text: string }) {
  throw new Error("Function not implemented.");
}

export type Auth = typeof auth;
