// lib/session.ts
import { sessionOptions } from "./sessionOptions";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers"; // App Router

export async function getSession() {
  const session = await getIronSession(cookies(), sessionOptions);
  return session;
}
