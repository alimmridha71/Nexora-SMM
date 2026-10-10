import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const db = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";
  if (!email || password.length < 10) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (10+ chars) in .env first");
  const passwordHash = await bcrypt.hash(password, 11);
  await db.user.upsert({
    where: { email },
    update: { role: "ADMIN", passwordHash, active: true },
    create: { email, name: "Admin", role: "ADMIN", passwordHash, apiKey: randomBytes(24).toString("hex") },
  });
  console.log(`Admin ready: ${email}`);
}

main().finally(() => db.$disconnect());
