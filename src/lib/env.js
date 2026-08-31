/* ============================================================
   env.js , todas as chaves do app num lugar só.

   No Expo, qualquer variável que começa com EXPO_PUBLIC_ é injetada no bundle
   em tempo de build. Local: arquivo .env na raiz. Codemagic: variáveis de
   ambiente do workflow (ver codemagic.yaml).

   Todas essas chaves são CLIENT-SIDE por natureza (anon key do Supabase e
   public key do Superwall). Não existe segredo aqui, podem ir no build.
   Nada de service_role key, nunca.
   ============================================================ */

export const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL || "https://eivbtkcmifznjsirjhfr.supabase.co";

// Lucas entrega essa (a mesma anon key do tracker.js do funil).
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

// Lucas entrega essa quando a tela de assinatura entrar em cena.
export const SUPERWALL_API_KEY = process.env.EXPO_PUBLIC_SUPERWALL_API_KEY || "";

// Placement do Superwall que abre o paywall (configurável no dashboard deles).
export const SUPERWALL_PLACEMENT =
  process.env.EXPO_PUBLIC_SUPERWALL_PLACEMENT || "unlock_stronghold";

// Product IDs criados na App Store Connect.
export const PRODUCT_IDS = {
  monthly: "stronghold_monthly",
  annual: "stronghold_annual",
};

// Liga/desliga o paywall inteiro (útil pra gravar clipe de anúncio e pra revisão da Apple).
export const PAYWALL_ENABLED = process.env.EXPO_PUBLIC_PAYWALL_ENABLED !== "false";

export const hasSupabase = () => Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
export const hasSuperwall = () => Boolean(SUPERWALL_API_KEY);

export default {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPERWALL_API_KEY,
  SUPERWALL_PLACEMENT,
  PRODUCT_IDS,
  PAYWALL_ENABLED,
  hasSupabase,
  hasSuperwall,
};
