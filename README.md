# MY COFFEE by Dilim — QR menyu

Stol ustidagi QR kod orqali ochiladigan 3 tilli (uz / ru / en) menyu. Fon Andijon vaqti, fasli va jonli ob-havosiga qarab o‘zgaradi. Menyuni `/admin` panelidan boshqarish mumkin.

## Ishga tushirish

```bash
npm install
cp .env.example .env.local   # qiymatlarni to‘ldiring
npm run dev                  # http://localhost:3000
```

Development rejimida `.env.local` bo‘lmasa admin kirish ma’lumotlari: `admin` / `mycoffee2026`. Production rejimida `ADMIN_LOGIN`, `ADMIN_PASSWORD` va `SESSION_SECRET` majburiy.

## Admin panel — `/admin`

- **Menyu:** kategoriya va mahsulotlarni qo‘shish, tahrirlash, o‘chirish va tartibini o‘zgartirish. Mahsulotni vaqtincha yashirish, "mavsumiy" yoki "qo‘shimcha" deb belgilash ham mumkin.
- **Tarjima:** istalgan bitta tilda yozing. "AI tarjima" tugmasi yoki saqlash paytida bo‘sh tillar avtomatik to‘ldiriladi:
  1. `GEMINI_API_KEY` berilgan bo‘lsa, Gemini ishlatiladi (bepul kalit: <https://aistudio.google.com/apikey>);
  2. aks holda bepul Google Translate, u ishlamasa MyMemory ishlatiladi;
  3. hech biri javob bermasa, matn asl holicha saqlanadi va keyin tahrirlash mumkin.
- **Sozlamalar:** telefon, Instagram, ish vaqti, fasl dizayni (avto yoki qo‘lda) va jonli ob-havoni yoqish/o‘chirish.
- **QR kod:** PNG yuklab olish yoki chop etish uchun tayyor karta.

## Ko‘rinishni sinab ko‘rish

Fasl, ob-havo va vaqtni URL orqali majburlash mumkin (mijozlarga ta’sir qilmaydi):

```
/?season=winter&weather=snow&time=dusk&temp=-4
```

- `season`: `autumn | winter | spring | summer`
- `weather`: `clear | partly | cloudy | fog | drizzle | rain | storm | sleet | snow`
- `time`: `night | dawn | sunrise | morning | day | noon | golden | sunset | dusk` yoki `HH:MM`
- `temp`: harorat, °C

## Deploy

### Vercel + Supabase (serversiz, bepul)

Vercel’da fayl tizimi faqat o‘qish uchun, shuning uchun menyu Supabase’da saqlanadi (bepul tarif yetarli).

1. **Supabase:** <https://supabase.com> → New project, region **Central EU (Frankfurt)**. SQL Editor’da `supabase/schema.sql` ni bajaring. Project Settings → API bo‘limidan `Project URL` va `service_role` kalitini oling.
2. **Lokal menyuni ko‘chirish:** `.env.local` ga `SUPABASE_URL` va `SUPABASE_SERVICE_ROLE_KEY` ni yozing, so‘ng `npm run db:push`.
3. **GitHub:** yangi private repo yarating va loyihani push qiling.
4. **Vercel:** Add New → Project → repo’ni import qiling. Environment Variables bo‘limiga `ADMIN_LOGIN`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `WEATHER_CONTACT` (ixtiyoriy: `GEMINI_API_KEY`) ni kiriting va Deploy bosing. Region `vercel.json` da Frankfurt (`fra1`) qilib belgilangan.
5. `NEXT_PUBLIC_SITE_URL` ni yakuniy manzilga (masalan `https://mycoffee.vercel.app`) moslang, Redeploy qiling va QR kodni admin paneldan qayta yuklab oling.

Admin paneldagi o‘zgarishlar ochiq turgan menyularda sahifani yangilamasdan ko‘rinadi: shu brauzerda darhol, boshqa telefonlarda ~15 soniya ichida.

### VPS (o‘z serveringiz)

`npm run build && npm start`. Menyu `./data/menu.json` faylida saqlanadi (yoki `DATA_DIR` papkasida). Shu papkani zaxiralab turing.

## Manbalar

Ob-havo ma’lumotlari: [MET Norway](https://api.met.no/) (CC BY 4.0), zaxira manba: [Open-Meteo](https://open-meteo.com/).
