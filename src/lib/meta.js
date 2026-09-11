/* ============================================================
   meta.js , medição do app no Meta (App Events + SKAdNetwork).

   Existe porque o funil web já tem Pixel/CAPI, mas o APP não tinha nada: a
   campanha CP10 (16/08, US$ 40) rodou sem nenhuma medição, e o Meta não teve
   como saber que alguém instalou ou assinou. Este arquivo é o lado do app.

   ── A ORDEM IMPORTA, E É CONTRA-INTUITIVA ─────────────────────────────────
   O SDK sobe com `autoLogAppEventsEnabled: false` (ver app.json). Isso é de
   propósito: no iOS, evento disparado ANTES do ATT sai sem IDFA e sem o sinal
   de "advertiser tracking enabled", e o Meta o trata como não-atribuível.
   Então a sequência é sempre:

     1. pedir ATT (requestTracking), longe do cold start
     2. Settings.setAdvertiserTrackingEnabled(resposta do usuário)
     3. só aí Settings.setAutoLogAppEventsEnabled(true)

   Só depois do passo 3 é que o `fb_mobile_activate_app` (a instalação) sai.
   Mesma sequência usada no Attune.

   O SKAdNetwork é independente disso: funciona mesmo com ATT negado, e vem
   dos SKAdNetworkItems do app.json, não deste arquivo.

   Como todo lib/ deste app: se o módulo nativo não estiver no build, tudo
   aqui vira no-op silencioso. Medição nunca derruba o produto.
   ============================================================ */

import { purchaseValue } from "./metaValue";

let sdk = null;
let trackingResolved = false;
let eventsEnabled = false;

// require preguiçoso: no Expo Go / web o módulo nativo não existe, e importar
// no topo derrubaria o app inteiro na primeira tela.
function getSdk() {
  if (sdk !== null) return sdk;
  try {
    sdk = require("react-native-fbsdk-next");
  } catch (e) {
    sdk = false;
  }
  return sdk;
}

function logger() {
  const mod = getSdk();
  return mod ? mod.AppEventsLogger : null;
}

/**
 * Pede o ATT e liga a medição do Meta. Idempotente: só roda de verdade uma vez.
 *
 * Chamar DEPOIS da primeira tela do onboarding, nunca no boot frio: no cold
 * start a janela do iOS ainda não está ativa e o alerta do ATT simplesmente
 * não aparece (o sistema devolve "denied" sem perguntar nada, e aí queimou a
 * única chance que o app tem de perguntar).
 *
 * @returns {Promise<boolean>} se o usuário autorizou o rastreamento
 */
export async function requestTracking() {
  if (trackingResolved) return eventsEnabled;
  trackingResolved = true;

  let granted = false;
  try {
    const att = require("expo-tracking-transparency");
    const res = await att.requestTrackingPermissionsAsync();
    granted = Boolean(res && res.granted);
  } catch (e) {
    // Sem o módulo de ATT (web, Expo Go), segue sem rastreamento.
    granted = false;
  }

  const mod = getSdk();
  if (!mod) return false;

  try {
    // No iOS isto é o que diz ao SDK se ele pode usar o IDFA. Precisa refletir
    // a resposta REAL do usuário: forçar true com ATT negado é violação de
    // política da Apple, e o Meta descarta o evento do mesmo jeito.
    await mod.Settings.setAdvertiserTrackingEnabled(granted);

    // Só agora. O app.json deixou isto desligado justamente pra este momento.
    mod.Settings.setAutoLogAppEventsEnabled(true);
    eventsEnabled = true;
  } catch (e) {
    // silencioso de propósito
  }

  return granted;
}

/**
 * Manda um evento com valor quando dá pra confiar no valor, e sem valor
 * quando não dá. Nunca com valor inventado.
 *
 * Sem valor a Meta otimiza por quantidade: pior, e honesto. Um número na
 * moeda errada envenena o aprendizado da campanha sem aparecer em painel
 * nenhum (ver metaValue.js).
 */
function logWithValue(eventName, product) {
  const log = logger();
  if (!log) return;
  try {
    const v = purchaseValue(product);
    if (v) log.logEvent(eventName, v.valueToSum, { fb_currency: v.currency });
    else log.logEvent(eventName);
  } catch (e) {}
}

/** Fim do onboarding (as 27 telas), quando o plano é gerado. */
export function completeRegistration() {
  const log = logger();
  if (!log) return;
  try {
    log.logEvent("fb_mobile_complete_registration");
  } catch (e) {}
}

/** Início do teste grátis. Superwall: EventType.freeTrialStart */
export function startTrial(product) {
  logWithValue("StartTrial", product);
}

/** Assinatura iniciada. Superwall: EventType.subscriptionStart */
export function subscribe(product) {
  logWithValue("Subscribe", product);
}

/**
 * Compra concluída. Superwall: EventType.transactionComplete
 *
 * `logPurchase` é o caminho certo quando há valor: é ele que emite o
 * fb_mobile_purchase com valueToSum e moeda juntos. Sem valor confiável,
 * cai pro evento cru, sem número.
 */
export function purchase(product) {
  const log = logger();
  if (!log) return;
  try {
    const v = purchaseValue(product);
    if (v) log.logPurchase(v.valueToSum, v.currency);
    else log.logEvent("fb_mobile_purchase");
  } catch (e) {}
}

export default {
  requestTracking,
  completeRegistration,
  startTrial,
  subscribe,
  purchase,
};
