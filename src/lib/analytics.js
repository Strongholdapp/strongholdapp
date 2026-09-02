/* ============================================================
   analytics.js , os eventos da seção 5 do PRD.

   Regra de medição do PRD: a métrica principal é completion rate POR TELA,
   então todo screen_view carrega screen_id + screen_index, e todo submit
   carrega time_on_screen_ms. Sem isso não dá pra achar o degrau onde a
   pessoa desiste, que é o alerta mais importante do funil.

   Grava no mesmo Supabase do funil (tabela audit_logs), carimbado com
   project = stronghold-app-ios. Se a chave não estiver configurada, tudo
   aqui vira no-op: analytics nunca pode derrubar o produto.
   ============================================================ */

import { logEvent } from "./supabase";

let sessionStartedAt = Date.now();
let screenEnteredAt = Date.now();
let lastScreenId = null;

export function startSession() {
  sessionStartedAt = Date.now();
  screenEnteredAt = Date.now();
}

export function screenView(screenId, screenIndex, extra) {
  screenEnteredAt = Date.now();
  lastScreenId = screenId;
  logEvent("onboarding_screen_view", screenId, {
    screen_id: screenId,
    screen_index: screenIndex,
    ...(extra || {}),
  });
}

export function answerSubmitted(screenId, answerValue, extra) {
  logEvent("onboarding_answer_submitted", screenId, {
    screen_id: screenId,
    answer_value: answerValue,
    time_on_screen_ms: Date.now() - screenEnteredAt,
    ...(extra || {}),
  });
}

/**
 * Quanto tempo a pessoa ficou na tela, medido na saída.
 *
 * Junto com onboarding_screen_view (completion por tela) e onboarding_back
 * (back rate), é o que permite responder as três perguntas do Lucas depois
 * da subida: qual tela derruba, qual tela confunde, e quanto tempo leva até
 * o paywall. Sem isso a otimização vira opinião.
 */
export function screenTime(screenId, screenIndex, ms) {
  logEvent("onboarding_screen_time", screenId, {
    screen_id: screenId,
    screen_index: screenIndex,
    ms: Math.round(ms),
    seconds: Math.round(ms / 100) / 10,
  });
}

export function back(fromScreen, toScreen) {
  logEvent("onboarding_back", fromScreen, { from_screen: fromScreen, to_screen: toScreen });
}

export function startQuizTap() {
  logEvent("onboarding_start_quiz_tap", "screen_01_welcome", { source: "welcome" });
}

export function proofView(proofId, screenId) {
  logEvent("onboarding_proof_view", screenId, { proof_id: proofId, screen_id: screenId });
}

export function mechanismDemoView(screenId, personalized) {
  logEvent("onboarding_mechanism_demo_view", screenId, { personalized: Boolean(personalized) });
}

export function recoveryProfileView(profile) {
  logEvent("onboarding_recovery_profile_view", "screen_19_profile", {
    primary_danger_moment: profile.primary_danger_moment,
    primary_trigger: profile.primary_trigger,
    deepest_cost: profile.deepest_cost,
  });
}

export function firstGoalSelected(goal) {
  logEvent("onboarding_first_goal_selected", "screen_21_first_goal", { goal });
}

export function notificationPrepromptTap(action) {
  logEvent("onboarding_notification_preprompt_tap", "screen_23_notif_preprompt", { action });
}

export function notificationPermissionResult(granted) {
  logEvent("onboarding_notification_permission_result", "screen_24_native_permission", {
    result: granted ? "granted" : "denied",
  });
}

export function paywallView(variant, profile) {
  logEvent("onboarding_paywall_view", "screen_27_paywall", {
    variant: variant || "default",
    personalized: true,
    primary_danger_moment: profile && profile.primary_danger_moment,
    primary_trigger: profile && profile.primary_trigger,
    onboarding_ms: Date.now() - sessionStartedAt,
  });
}

export function planSelected(planId) {
  logEvent("onboarding_plan_selected", "screen_27_paywall", { plan_id: planId });
}

export function purchaseResult(result, extra) {
  logEvent("onboarding_purchase_result", "screen_27_paywall", {
    result, // success | cancel | fail
    ...(extra || {}),
  });
}

export default {
  startSession,
  screenView,
  answerSubmitted,
  back,
  startQuizTap,
  proofView,
  mechanismDemoView,
  recoveryProfileView,
  firstGoalSelected,
  notificationPrepromptTap,
  notificationPermissionResult,
  paywallView,
  planSelected,
  purchaseResult,
};
