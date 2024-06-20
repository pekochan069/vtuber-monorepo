import { hash, verify } from "@repo/auth/argon2";
import { generateIdFromEntropySize } from "@repo/auth/lucia";
import { lucia } from "@repo/auth/v-mama-admin";
import { db } from "@repo/db";
import { vmamaAdminUsers } from "@repo/db/schema/v-mama-admin";
import { defineAction, z } from "astro:actions";

export type LoginTags = CreateUserTags | "NoUserFound";

export const login = defineAction({
  input: z.object({
    username: z.string(),
    password: z.string(),
  }),
  handler: async ({ username, password }, context) => {
    if (
      username.length < 3 ||
      username.length > 32 ||
      !/^[a-zA-Z0-9_]+$/.test(username)
    ) {
      return {
        ok: false,
        _tag: "InvalidFormData" as LoginTags,
      };
    }

    if (password.length < 8 || password.length > 256) {
      return {
        ok: false,
        _tag: "InvalidFormData" as LoginTags,
      };
    }

    let user: { id: string; password: string } | undefined;
    try {
      user = await db.query.vmamaAdminUsers.findFirst({
        where: (user, { eq }) => eq(user.username, username),
      });
    } catch (error) {
      return {
        ok: false,
        _tag: "DatabaseError" as LoginTags,
      };
    }

    if (user === undefined) {
      return {
        ok: false,
        _tag: "NoUserFound" as LoginTags,
      };
    }

    const validPassword = await verify(user.password, password, {
      memoryCost: 2 ** 16,
      timeCost: 3,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) {
      return {
        ok: false,
        _tag: "NoUserFound" as LoginTags,
      };
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    context.redirect("/");

    return {
      ok: true,
      _tag: "Success" as LoginTags,
    };
  },
});

export type CreateUserTags = "InvalidFormData" | "DatabaseError" | "Success";

export const createUser = defineAction({
  input: z.object({
    username: z.string(),
    password: z.string(),
    role: z.enum(["user", "admin"]),
  }),
  handler: async ({ username, password, role }) => {
    if (
      username.length < 3 ||
      username.length > 32 ||
      !/^[a-zA-Z0-9_]+$/.test(username)
    ) {
      return {
        ok: false,
        _tag: "InvalidFormData" as CreateUserTags,
      };
    }

    if (password.length < 8 || password.length > 256) {
      return {
        ok: false,
        _tag: "InvalidFormData" as CreateUserTags,
      };
    }

    const userId = generateIdFromEntropySize(10);
    const passwordHash = await hash(password, {
      memoryCost: 2 ** 16,
      timeCost: 3,
      outputLen: 32,
      parallelism: 1,
    });

    try {
      await db.insert(vmamaAdminUsers).values({
        id: userId,
        username,
        password: passwordHash,
        role,
      });
    } catch (error) {
      return {
        ok: false,
        _tag: "DatabaseError" as CreateUserTags,
      };
    }

    return {
      ok: true,
      _tag: "Success" as CreateUserTags,
    };
  },
});

export type LogoutTags = "NoSession" | "Success";

export const logout = defineAction({
  handler: async (input, context) => {
    if (!context.locals.session) {
      return {
        ok: false,
        _tag: "NoSession" as LogoutTags,
      };
    }

    await lucia.invalidateSession(context.locals.session.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return {
      ok: true,
      _tag: "Success" as LogoutTags,
    };
  },
});
