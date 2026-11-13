import "server-only";
import type { MenuDoc } from "../types";
import { fileStore } from "./file";
import { supabaseStore } from "./supabase";

export interface DocStore {
  read(): Promise<MenuDoc | null>;
  write(doc: MenuDoc): Promise<void>;
  /** Cheap change marker; lets frequent readers skip downloading an unchanged document. */
  version?(): Promise<string | null>;
}

export function getStore(): DocStore {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return supabaseStore;
  }
  return fileStore;
}
