import { ORPCError } from "@orpc/server";
import { deleteCookie, setCookie } from "@tanstack/react-start/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { sessionsTable, usersTable } from "@/db/schema";
import { createSession, generateSessionToken } from "@/lib/auth";
import { authProcedure, baseProcedure } from "../utils";

const RegisterSchema = createInsertSchema(usersTable).pick({
	username: true,
	password: true,
});

const register = baseProcedure
	.input(RegisterSchema)
	.handler(async ({ input, context: { db } }) => {
		const existingUser = await db.query.usersTable.findFirst({
			where: eq(usersTable.username, input.username),
		});

		if (existingUser) {
			throw new ORPCError("CONFLICT", {
				message: "User already exists",
			});
		}

		const hashPassword = await bcrypt.hash(input.password, 10);

		const [user] = await db
			.insert(usersTable)
			.values({
				username: input.username,
				password: hashPassword,
			})
			.returning();

		const token = generateSessionToken();

		await createSession(token, user.id);

		setCookie("sessionToken", token, {
			httpOnly: true,
		});
	});

const LoginSchema = RegisterSchema;
const login = baseProcedure
	.input(LoginSchema)
	.handler(async ({ context, input }) => {
		const user = await context.db.query.usersTable.findFirst({
			where: eq(usersTable.username, input.username),
		});

		if (!user) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "Invalid credentials",
			});
		}

		const isValidPassword = await bcrypt.compare(input.password, user.password);

		if (!isValidPassword) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "Invalid credentials",
			});
		}

		const token = generateSessionToken();

		await createSession(token, user.id);

		setCookie("sessionToken", token, {
			httpOnly: true,
		});
	});

const logout = authProcedure.handler(async ({ context }) => {
	deleteCookie("sessionToken");
	context.db.delete(sessionsTable).where(eq(sessionsTable.id, context.user.id));
});

const currentUser = baseProcedure.handler(async ({ context: { user } }) => {
	if (!user) return null;

	return {
		id: user.id,
		username: user.username,
	};
});

export const auth = {
	register,
	login,
	currentUser,
	logout,
};
