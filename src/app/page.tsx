import { connection } from "next/server";
import { Suspense } from "react";
import { MenuExperience } from "@/components/menu/MenuExperience";
import { getMenu } from "@/lib/menu";

// The menu is read per request (from the in-memory cache that admin saves invalidate), so a
// build made without the live data file can never bake an outdated menu into the page.
async function Menu() {
  await connection();
  const doc = await getMenu();
  return <MenuExperience doc={doc} />;
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-espresso-950" />}>
      <Menu />
    </Suspense>
  );
}
