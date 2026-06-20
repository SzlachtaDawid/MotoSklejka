"use server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/db";
import { signIn } from "@/auth";

export async function signUp(data: { name: string; email: string; password: string }) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    return { error: "Ten email jest już zajęty" };
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);
  await prisma.user.create({
    data: { name: data.name, email: data.email, password: hashedPassword },
  });

  await signIn("credentials", { email: data.email, password: data.password, redirectTo: "/" });
}
