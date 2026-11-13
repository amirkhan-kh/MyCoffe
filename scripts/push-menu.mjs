// Copies the local menu (data/menu.json) into Supabase so the deployed site starts with it.
// Usage: npm run db:push   (reads SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local)
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DATA_DIR } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("SUPABASE_URL va SUPABASE_SERVICE_ROLE_KEY .env.local faylida bo'lishi kerak.");
  process.exit(1);
}

const file = path.join(DATA_DIR || path.join(process.cwd(), "data"), "menu.json");
const doc = JSON.parse(await readFile(file, "utf8"));
doc.updatedAt = new Date().toISOString();

const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const { error } = await db.from("mycoffee_store").upsert({ id: "menu", doc, updated_at: doc.updatedAt });
if (error) {
  console.error("Supabase'ga yozib bo'lmadi:", error.message);
  if (/relation|does not exist|schema cache/i.test(error.message)) {
    console.error("Avval supabase/schema.sql ni Supabase SQL Editor'da bajaring.");
  }
  process.exit(1);
}
console.log(`Tayyor: ${doc.categories.length} kategoriya, ${doc.items.length} mahsulot Supabase'ga yuklandi.`);
