/* ============================================================
   supabase.js , mesmo projeto Supabase do funil (Lucas), só leitura/escrita
   client-side com a anon key. RLS já protege: a anon key só INSERE em
   audit_logs / leads e LÊ experiments.

   Se a anon key não estiver configurada, tudo aqui vira no-op silencioso,
   o app funciona 100% offline. Analytics nunca pode quebrar o produto.
   ============================================================ */

import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SUPABASE_URL, SUPABASE_ANON_KEY, hasSupabase } from "./env";

let client = null;

export function supabase() {
  if (!hasSupabase()) return null;
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  }
  return client;
}

const PROJECT_ID = "stronghold-app-ios";

let cachedSessionId = null;
async function sessionId() {
  if (cachedSessionId) return cachedSessionId;
  try {
    const k = "sh_session_id";
    let v = await AsyncStorage.getItem(k);
    if (!v) {
      v = "app_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 10);
      await AsyncStorage.setItem(k, v);
    }
    cachedSessionId = v;
    return v;
  } catch (e) {
    return "app_anon";
  }
}

/**
 * Evento de funil do app. Mesma tabela audit_logs do funil web,
 * carimbada com project = "stronghold-app-ios" pra separar no dashboard.
 */
export async function logEvent(eventType, pageId, extra) {
  const db = supabase();
  if (!db) return;
  try {
    const sid = await sessionId();
    await db.from("audit_logs").insert({
      session_id: sid,
      event_type: eventType,
      page_id: pageId || null,
      metadata: { project: PROJECT_ID, platform: "ios", ...(extra || {}) },
    });
  } catch (e) {
    // analytics nunca derruba o app
  }
}

/**
 * Snapshot das respostas do quiz ao final do onboarding (tabela leads).
 * Sem e-mail e sem nome completo por padrão: o nome fica só no aparelho.
 */
export async function saveLead(answers, extra) {
  const db = supabase();
  if (!db) return;
  try {
    const sid = await sessionId();
    const safe = { ...(answers || {}) };
    delete safe.name; // privacidade: o nome não sai do aparelho
    await db.from("leads").insert({
      session_id: sid,
      answers: { ...safe, __project: PROJECT_ID, __platform: "ios" },
      intent_label: (extra && extra.intent) || "app_onboarding",
      checkout_clicked: Boolean(extra && extra.checkoutClicked),
    });
  } catch (e) {}
}

export default { supabase, logEvent, saveLead };
