/* ============================================================
   superwall.js , assinatura (paywall) via Superwall + StoreKit.

   Estado atual: TUDO PRONTO, faltando só a public key do Superwall.
   Sem a chave, `configure()` não faz nada e `presentPaywall()` devolve
   { skipped: true }, então o app roda inteiro (bom pra gravar clipe de anúncio
   e pra revisão da Apple antes dos produtos serem aprovados).

   Quando o Lucas mandar a chave:
     1. cole em EXPO_PUBLIC_SUPERWALL_API_KEY (.env local e variável no Codemagic)
     2. crie a campanha no dashboard do Superwall com o placement
        "unlock_stronghold" (ou mude EXPO_PUBLIC_SUPERWALL_PLACEMENT)
     3. produtos: stronghold_monthly / stronghold_annual (App Store Connect)
   ============================================================ */

import { SUPERWALL_API_KEY, SUPERWALL_PLACEMENT, hasSuperwall } from "./env";

let sdk = null;
let configured = false;

// require preguiçoso: se o módulo nativo não estiver no build, o app não quebra.
function getSdk() {
  if (sdk !== null) return sdk;
  try {
    sdk = require("@superwall/react-native-superwall");
  } catch (e) {
    sdk = false;
  }
  return sdk;
}

export async function configure() {
  if (configured || !hasSuperwall()) return false;
  const mod = getSdk();
  if (!mod) return false;
  try {
    const Superwall = mod.default || mod.Superwall;
    await Superwall.configure({ apiKey: SUPERWALL_API_KEY });
    configured = true;
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Abre o paywall do Superwall.
 * @param {string} placement placement da campanha (default: unlock_stronghold)
 * @param {object} params atributos pro paywall personalizado (nome, arquétipo, gatilho...)
 * @returns {Promise<{skipped:boolean, error?:string}>}
 */
export async function presentPaywall(placement, params) {
  if (!hasSuperwall()) return { granted: false, skipped: true, error: "no_api_key" };
  const mod = getSdk();
  if (!mod) return { granted: false, skipped: true, error: "no_native_module" };
  try {
    if (!configured) await configure();
    const Superwall = mod.default || mod.Superwall;
    let granted = false;
    await Superwall.shared.register({
      placement: placement || SUPERWALL_PLACEMENT,
      params: params || {},
      feature: () => { granted = true; },
    });
    return { granted, skipped: false };
  } catch (e) {
    return { granted: false, skipped: true, error: String(e && e.message ? e.message : e) };
  }
}

export async function isSubscribed() {
  if (!hasSuperwall()) return null;
  const mod = getSdk();
  if (!mod) return null;
  try {
    if (!configured) await configure();
    const Superwall = mod.default || mod.Superwall;
    const s = await Superwall.shared.getSubscriptionStatus();
    return Boolean(s && s.status === "ACTIVE");
  } catch (e) {
    return null;
  }
}

/**
 * Atributos do usuário pro Superwall montar o paywall personalizado
 * (o paywall que fala do arquétipo e do gatilho DELE converte muito mais).
 */
export async function setUserAttributes(plan) {
  if (!hasSuperwall() || !plan) return;
  const mod = getSdk();
  if (!mod) return;
  try {
    if (!configured) await configure();
    const Superwall = mod.default || mod.Superwall;
    await Superwall.shared.setUserAttributes({
      firstName: plan.name || "",
      archetype: (plan.archetype && plan.archetype.title) || "",
      trigger: (plan.pattern && plan.pattern.triggerLabel) || "",
      highRisk: (plan.pattern && plan.pattern.highRiskLabel) || "",
      freedomDate: plan.freedomDate || "",
    });
  } catch (e) {}
}

export default { configure, presentPaywall, setUserAttributes };
