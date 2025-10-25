import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// biome-ignore lint/style/noNonNullAssertion: key is provided
const sql = neon(process.env.VITE_DATABASE_URL!);
export const db = drizzle({ client: sql, schema });
