import "server-only";
import { LANGS, type I18n, type Lang } from "./types";

export type TranslateKind = "name" | "description";

/** Uzbek Latin uses o‘ / g‘ — normalise the many apostrophe variants translators emit. */
export function normalizeUzbek(text: string) {
  return text
    .replace(/([oOgG])['`ʻʼ’]/g, "$1‘")
    .replace(/([a-fh-np-zA-FH-NP-Z])['`ʻʼ‘](?=[a-zA-Z])/g, "$1’");
}

function cleanResult(result: I18n): I18n {
  return {
    uz: normalizeUzbek(result.uz.trim()),
    ru: result.ru.trim(),
    en: result.en.trim(),
  };
}

async function translateWithGemini(text: string, kind: TranslateKind): Promise<I18n> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY missing");
  const model = process.env.GEMINI_MODEL ?? "gemini-flash-latest";

  const prompt = [
    "You translate menu content for a premium coffee shop in Andijan, Uzbekistan.",
    `The input is a menu ${kind === "name" ? "item or category NAME" : "item DESCRIPTION"} written in any language.`,
    "Return it in three languages: Uzbek (Latin script, use o‘ and g‘ with the ‘ character), Russian (Cyrillic) and English.",
    kind === "name"
      ? "Names must stay short. Transliterate drink names naturally (e.g. Капучино → Kapuchino / Cappuccino). Do not add descriptions."
      : "Keep the warm, appetising tone and the same length. Do not invent ingredients.",
    "If the input is already in one of the languages, keep that version faithful to the original (fix only obvious typos).",
    "",
    `Input: ${text}`,
  ].join("\n");

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: { uz: { type: "STRING" }, ru: { type: "STRING" }, en: { type: "STRING" } },
            required: ["uz", "ru", "en"],
          },
        },
      }),
      signal: AbortSignal.timeout(20000),
    },
  );
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const raw: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!raw) throw new Error("Gemini returned no text");
  const parsed = JSON.parse(raw) as Partial<I18n>;
  if (!parsed.uz || !parsed.ru || !parsed.en) throw new Error("Gemini returned incomplete JSON");
  return cleanResult(parsed as I18n);
}

type Provider = (text: string, target: Lang) => Promise<string>;

/** Rough source-language guess for providers that cannot auto-detect. */
function guessLang(text: string): Lang {
  if (/[\u0400-\u04FF]/.test(text)) return "ru";
  if (/[oOgG][‘'ʻʼ’`]|\b\w*(q|x|sh|ch)\w*\b|(lar|li|siz|dagi|bilan)\b/i.test(text)) return "uz";
  return "en";
}

const googleDict: Provider = async (text, target) => {
  const url = new URL("https://clients5.google.com/translate_a/t");
  url.searchParams.set("client", "dict-chrome-ex");
  url.searchParams.set("sl", "auto");
  url.searchParams.set("tl", target);
  url.searchParams.set("q", text);
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`Google dict ${res.status}`);
  const data = (await res.json()) as Array<string | [string, string]>;
  const out = data.map((chunk) => (Array.isArray(chunk) ? chunk[0] : chunk)).join(" ").trim();
  if (!out) throw new Error("Google dict returned no text");
  return out;
};

const googleGtx: Provider = async (text, target) => {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "auto");
  url.searchParams.set("tl", target);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", text);
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`Google gtx ${res.status}`);
  const data = (await res.json()) as [Array<[string]>];
  return data[0].map((chunk) => chunk[0]).join("");
};

const myMemory: Provider = async (text, target) => {
  const source = guessLang(text);
  if (source === target) return text;
  const url = new URL("https://api.mymemory.translated.net/get");
  url.searchParams.set("q", text);
  url.searchParams.set("langpair", `${source}|${target}`);
  const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
  if (!res.ok) throw new Error(`MyMemory ${res.status}`);
  const data = (await res.json()) as { responseStatus: number; responseData?: { translatedText?: string } };
  const out = data.responseData?.translatedText;
  if (data.responseStatus !== 200 || !out) throw new Error(`MyMemory status ${data.responseStatus}`);
  return out;
};

const FREE_PROVIDERS: Array<[string, Provider]> = [
  ["google-dict", googleDict],
  ["google-gtx", googleGtx],
  ["mymemory", myMemory],
];

async function translateFree(text: string): Promise<I18n> {
  let lastError: unknown;
  for (const [name, provider] of FREE_PROVIDERS) {
    try {
      const [uz, ru, en] = await Promise.all(LANGS.map((l) => provider(text, l)));
      return cleanResult({ uz, ru, en });
    } catch (err) {
      lastError = err;
      console.warn(`[translate] ${name} failed:`, err instanceof Error ? err.message : err);
    }
  }
  throw lastError;
}

export async function translateToAll(text: string, kind: TranslateKind): Promise<I18n> {
  const source = text.trim();
  if (!source) return { uz: "", ru: "", en: "" };
  if (process.env.GEMINI_API_KEY) {
    try {
      return await translateWithGemini(source, kind);
    } catch (err) {
      console.warn("[translate] Gemini failed, falling back to free providers:", err);
    }
  }
  return translateFree(source);
}

/**
 * Keep the three languages in step with an edit: if exactly one language changed since the
 * saved version, the other two are re-translated from it. Edits touching several languages are
 * treated as hand-written and kept; empty languages are always filled.
 */
export async function syncI18n(prev: I18n | null | undefined, next: I18n, kind: TranslateKind): Promise<I18n> {
  if (!prev) return completeI18n(next, kind);
  const changed = LANGS.filter((l) => next[l].trim() !== prev[l].trim());
  if (changed.length !== 1) return completeI18n(next, kind);
  const source = changed[0];
  const text = next[source].trim();
  if (!text) return completeI18n(next, kind);
  try {
    const translated = await translateToAll(text, kind);
    return { ...translated, [source]: next[source] };
  } catch (err) {
    console.warn("[translate] sync failed, keeping other languages as they were:", err);
    return next;
  }
}

/** Fill every empty language from the first filled one; filled values are kept as typed. */
export async function completeI18n(value: I18n, kind: TranslateKind): Promise<I18n> {
  const missing = LANGS.filter((l) => !value[l].trim());
  if (missing.length === 0 || missing.length === LANGS.length) return value;
  const source = LANGS.map((l) => value[l]).find((v) => v.trim())!;
  const translated = await translateToAll(source, kind).catch((err) => {
    console.warn("[translate] all providers failed, saving source text as-is:", err);
    return { uz: source, ru: source, en: source };
  });
  const result = { ...value };
  for (const l of missing) result[l] = translated[l];
  return result;
}
