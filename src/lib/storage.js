/* ============================================================
   storage.js , estado local do app (AsyncStorage).
   Equivale ao localStorage "sh_app_v1" do PWA. Tudo fica NO APARELHO:
   respostas do quiz, plano gerado, data de início do streak, pledge do dia.
   Privacidade é o argumento nº1 do nicho, então nada disso sai daqui
   sem o usuário pedir.
   ============================================================ */

import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "sh_app_v1";

export const emptyState = {
  // ---- onboarding (PRD V3, 27 telas) ----
  // profile é o estado global da seção 3.3 do PRD; onboardingScreen guarda
  // o último screen_id concluído, pra retomar exatamente onde parou se o
  // app for fechado no meio.
  profile: {},
  onboardingScreen: null,
  onboardingDone: false,

  // ---- app depois do onboarding ----
  answers: {}, // formato antigo, alimentado pelo profile (ponte do planEngine)
  plan: null,
  screen: "onboarding",
  startDate: null,
  pledgedDay: null,
  subscribed: false,
  relapses: [],
  demoDay: null,
};

export async function loadState() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return { ...emptyState };
    return { ...emptyState, ...JSON.parse(raw) };
  } catch (e) {
    return { ...emptyState };
  }
}

export async function saveState(state) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    // silencioso de propósito: o app nunca trava por causa de storage
  }
}

export async function clearState() {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (e) {}
}

export default { loadState, saveState, clearState, emptyState };
