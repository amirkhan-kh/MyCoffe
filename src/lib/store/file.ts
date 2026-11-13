import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { MenuDoc } from "../types";
import type { DocStore } from "./index";

const dir = process.env.DATA_DIR ?? path.join(process.cwd(), "data");
const file = path.join(dir, "menu.json");

export const fileStore: DocStore = {
  async read() {
    try {
      return JSON.parse(await readFile(file, "utf8")) as MenuDoc;
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw err;
    }
  },
  async write(doc) {
    await mkdir(dir, { recursive: true });
    const tmp = `${file}.${process.pid}.tmp`;
    await writeFile(tmp, JSON.stringify(doc, null, 2), "utf8");
    await rename(tmp, file);
  },
};
