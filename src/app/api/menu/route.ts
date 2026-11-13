import { connection } from "next/server";
import { loadLiveDoc } from "@/lib/menu";

/**
 * Live menu feed polled by open menus. The edge keeps each answer for a few seconds so a full
 * café of phones costs one database read, and the ETag turns unchanged polls into empty 304s.
 */
export async function GET(request: Request) {
  await connection();
  const doc = await loadLiveDoc();
  const etag = `"${doc.updatedAt}"`;
  const headers = {
    ETag: etag,
    "Cache-Control": "public, max-age=0, must-revalidate",
    "CDN-Cache-Control": "public, s-maxage=4, stale-while-revalidate=6",
  };
  if (request.headers.get("if-none-match") === etag) return new Response(null, { status: 304, headers });
  const visible = { ...doc, items: doc.items.filter((i) => i.available) };
  return Response.json(visible, { headers });
}
