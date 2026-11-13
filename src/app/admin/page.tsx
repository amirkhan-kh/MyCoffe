import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Dashboard } from "@/components/admin/Dashboard";
import { isAdmin } from "@/lib/admin-auth";
import { loadDoc } from "@/lib/menu";

export const metadata: Metadata = { title: "Admin — MY COFFEE", robots: { index: false } };

async function AdminContent() {
  if (!(await isAdmin())) redirect("/admin/login");
  const doc = await loadDoc();
  return <Dashboard initialDoc={doc} />;
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-dvh place-items-center bg-espresso-950">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-caramel-400/30 border-t-caramel-400" />
        </main>
      }
    >
      <AdminContent />
    </Suspense>
  );
}
