"use client";

import Image from "next/image";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { Button, Field, inputClass } from "./ui";

export function QrPanel() {
  const [url, setUrl] = useState(() => process.env.NEXT_PUBLIC_SITE_URL || window.location.origin);
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;
    QRCode.toDataURL(url, {
      width: 1024,
      margin: 1,
      errorCorrectionLevel: "H",
      color: { dark: "#24150eff", light: "#fbf5eaff" },
    })
      .then(setDataUrl)
      .catch(() => setDataUrl(null));
  }, [url]);

  return (
    <div className="space-y-5">
      <section className="glass-card space-y-4 rounded-3xl p-5 print:hidden">
        <h3 className="font-display text-[22px] font-semibold text-crema-50">Stol uchun QR kod</h3>
        <Field label="Menyu manzili" hint="Sayt domenga ulangach, shu yerga domen manzilini yozing.">
          <input value={url} onChange={(e) => setUrl(e.target.value.trim())} className={inputClass} />
        </Field>
        <div className="flex gap-3">
          <a
            href={dataUrl ?? undefined}
            download="mycoffee-menu-qr.png"
            className="flex-1 rounded-full bg-gradient-to-b from-caramel-300 to-caramel-400 py-3 text-center text-[13.5px] font-bold text-espresso-950"
          >
            PNG yuklab olish
          </a>
          <Button onClick={() => window.print()} className="flex-1">
            Chop etish
          </Button>
        </div>
      </section>

      <div id="qr-card" className="mx-auto w-full max-w-[340px] rounded-[28px] bg-crema-50 px-7 pb-7 pt-8 text-center text-espresso-900 shadow-2xl">
        <div className="mx-auto h-16 w-16 overflow-hidden rounded-full">
          <Image src="/brand/logo-round.png" alt="" width={64} height={64} />
        </div>
        <p className="mt-3 font-display text-[24px] font-semibold leading-tight">Menyu · Меню · Menu</p>
        <div className="mx-auto mt-4 w-full max-w-[240px] rounded-2xl border border-espresso-900/10 p-3">
          {dataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={dataUrl} alt="QR" className="h-auto w-full" />
          ) : (
            <div className="aspect-square w-full animate-pulse rounded-xl bg-espresso-900/10" />
          )}
        </div>
        <p className="mt-4 font-sans text-[12.5px] leading-relaxed text-espresso-700">
          Kamerani QR kodga qarating
          <br />
          Наведите камеру на QR-код
          <br />
          Point your camera at the QR code
        </p>
        <p className="mt-3 font-script text-[20px] text-caramel-500">by Dilim</p>
      </div>
    </div>
  );
}
