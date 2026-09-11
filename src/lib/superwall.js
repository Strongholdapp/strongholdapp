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
import * as Meta from "./meta";

let sdk = null;
let configured = false;
let delegateAttached = false;

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
    await attachMetaDelegate(mod, Superwall);
    return true;
  } catch (e) {
    return false;
  }
}

/* ============================================================
   Ponte Superwall -> Meta App Events.

   O Superwall é quem sabe que a compra aconteceu (é ele que fala com o
   StoreKit), então é dele que os eventos de receita saem. A ponte é o
   SuperwallDelegate: `handleSuperwallEvent` recebe TODOS os eventos do SDK, e
   a gente filtra os três que interessam.

   Os tipos e o formato do payload foram conferidos no código do pacote, não
   chutados:
     node_modules/@superwall/react-native-superwall/src/public/SuperwallEventInfo.ts
       -> EventType.freeTrialStart | subscriptionStart | transactionComplete
       -> os três carregam `product: StoreProduct`
     node_modules/@superwall/react-native-superwall/src/public/StoreProduct.ts
       -> `price: number` e `currencyCode?: string | null`  (preço POR LOJA)

   O delegate é uma classe abstrata com 12 métodos. Os listeners nativos
   chamam `delegate?.metodo(...)` sem checar se o método existe, então faltar
   um vira TypeError dentro do listener. Por isso todos estão aqui, mesmo os
   que não fazem nada.
   ============================================================ */
async function attachMetaDelegate(mod, Superwall) {
  if (delegateAttached) return;
  try {
    const { EventType } = mod;
    const noop = () => {};

    await Superwall.shared.setDelegate({
      handleSuperwallEvent(info) {
        try {
          const ev = info && info.event;
          if (!ev) return;
          switch (ev.type) {
            case EventType.freeTrialStart:
              Meta.startTrial(ev.product);
              break;
            case EventType.subscriptionStart:
              Meta.subscribe(ev.product);
              break;
            case EventType.transactionComplete:
              Meta.purchase(ev.product);
              break;
            default:
              break;
          }
        } catch (e) {}
      },
      subscriptionStatusDidChange: noop,
      willRedeemLink: noop,
      didRedeemLink: noop,
      handleCustomPaywallAction: noop,
      willDismissPaywall: noop,
      willPresentPaywall: noop,
      didDismissPaywall: noop,
      didPresentPaywall: noop,
      paywallWillOpenURL: noop,
      paywallWillOpenDeepLink: noop,
      handleLog: noop,
    });
    delegateAttached = true;
  } catch (e) {
    // Sem delegate o paywall continua funcionando; só a medição é que não sai.
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
