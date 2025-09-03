import { User } from "./schema";
import { mutation, query } from "./_generated/server";

export const getUserExistence = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }

        if (!identity.emailVerified) {
            return null;
        }

        const user = await ctx.db
            .query("users")
            .withIndex("indexEmail", (q) =>
                q.eq("email", identity.email as string)
            )
            .first();

        if (user !== null) {
            return { email: user.email, exists: true };
        }
        return { email: identity.email, exists: false };
    },
});

export const createUser = mutation({
    args: {
        userData: User,
    },
    handler: async (ctx, { userData }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return false;
        }

        if (!identity.emailVerified) {
            return false;
        }

        const existingUser = await ctx.db
            .query("users")
            .withIndex("indexEmail", (q) =>
                q.eq("email", identity.email as string)
            )
            .first();

        if (existingUser) {
            return false;
        }

        try {
            const userDataWithCorrectEmail = {
                ...userData,
                email: identity.email as string,
            };

            await ctx.db.insert("users", userDataWithCorrectEmail);
            return true;
        } catch (error) {
            console.error("[User Creation Error]", error);
            return false;
        }
    },
});
