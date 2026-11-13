import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { MenuDoc } from "../types";
import type { DocStore } from "./index";

const TABLE = "mycoffee_store";
const ROW_ID = "menu";

let client: SupabaseClient | null = null;

function db() {
  client ??= createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
  return client;
}

export const supabaseStore: DocStore = {
  async read() {
    const { data, error } = await db().from(TABLE).select("doc").eq("id", ROW_ID).maybeSingle();
    if (error) throw new Error(`Supabase read failed: ${error.message}`);
    return (data?.doc as MenuDoc | undefined) ?? null;
  },
  async version() {
    const { data, error } = await db().from(TABLE).select("updated_at").eq("id", ROW_ID).maybeSingle();
    if (error) throw new Error(`Supabase read failed: ${error.message}`);
    return (data?.updated_at as string | undefined) ?? null;
  },
  async write(doc) {
    const { error } = await db()
      .from(TABLE)
      .upsert({ id: ROW_ID, doc, updated_at: new Date().toISOString() });
    if (error) throw new Error(`Supabase write failed: ${error.message}`);
  },
};
