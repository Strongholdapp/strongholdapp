/* ============================================================
   notifications.js , permissão de notificação (telas 23 e 24 do PRD).

   Regras do PRD que este arquivo respeita:
   - o prompt NATIVO só é chamado depois do pre-prompt (tela 23);
   - se o usuário negar, o onboarding CONTINUA normalmente;
   - nunca repetir o prompt do sistema depois de negado (o iOS só mostra
     uma vez de qualquer jeito; aqui a gente nem tenta e manda pros Ajustes).
   ============================================================ */

import { Platform } from "react-native";

let mod = null;
function getMod() {
  if (mod !== null) return mod;
  try {
    mod = require("expo-notifications");
  } catch (e) {
    mod = false;
  }
  return mod;
}

/**
 * Pede a permissão de verdade.
 * @returns {Promise<{granted:boolean, status:string, asked:boolean}>}
 */
export async function requestPermission() {
  const N = getMod();
  if (!N) return { granted: false, status: "unavailable", asked: false };
  try {
    const current = await N.getPermissionsAsync();
    // Já respondido antes: não insiste, só devolve o que já existe.
    if (current.status !== "undetermined") {
      return { granted: current.status === "granted", status: current.status, asked: false };
    }
    const res = await N.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });
    return { granted: res.status === "granted", status: res.status, asked: true };
  } catch (e) {
    return { granted: false, status: "error", asked: false };
  }
}

export async function getStatus() {
  const N = getMod();
  if (!N) return "unavailable";
  try {
    const res = await N.getPermissionsAsync();
    return res.status;
  } catch (e) {
    return "error";
  }
}

/**
 * Como as notificações aparecem com o app aberto. Chamado uma vez no boot.
 */
export function configureHandler() {
  const N = getMod();
  if (!N) return;
  try {
    N.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  } catch (e) {}
}

/**
 * Lembrete diário na janela de risco da pessoa. Só agenda se a permissão
 * já foi concedida. O horário sai do primary_danger_moment do onboarding.
 */
export const HOUR_BY_DANGER = {
  late_night: { hour: 22, minute: 30 },
  alone: { hour: 20, minute: 0 },
  stressed: { hour: 18, minute: 30 },
  bored: { hour: 21, minute: 0 },
  lonely: { hour: 21, minute: 30 },
  conflict: { hour: 19, minute: 30 },
  triggering_content: { hour: 21, minute: 0 },
  no_pattern: { hour: 21, minute: 0 },
};

/**
 * O texto EXATO do lembrete diário e o horário em que ele vai chegar.
 *
 * Existe separado porque o mockup da notificação no onboarding (tela 15)
 * renderiza a partir daqui. É o mesmo motivo de os mockups não serem
 * imagem: se alguém mudar a copy do lembrete, o "print" que a pessoa viu
 * antes de comprar muda junto, em vez de virar promessa velha.
 */
export function reminderCopy(profile, firstName) {
  const when =
    HOUR_BY_DANGER[profile && profile.primary_danger_moment] || HOUR_BY_DANGER.no_pattern;
  const name = firstName ? `, ${firstName}` : "";
  const h12 = when.hour % 12 === 0 ? 12 : when.hour % 12;
  const suffix = when.hour >= 12 ? "PM" : "AM";
  return {
    title: "Your difficult window is starting",
    body: `This is usually when it gets hardest${name}. I'm watching this moment with you. Tap the second you feel the pull.`,
    hour: when.hour,
    minute: when.minute,
    time: `${h12}:${String(when.minute).padStart(2, "0")} ${suffix}`,
  };
}

export async function scheduleRiskWindowReminder(profile, firstName) {
  const N = getMod();
  if (!N || Platform.OS === "web") return false;
  try {
    const status = await getStatus();
    if (status !== "granted") return false;

    await N.cancelAllScheduledNotificationsAsync();
    const when = reminderCopy(profile, firstName);

    await N.scheduleNotificationAsync({
      content: {
        title: when.title,
        body: when.body,
        sound: true,
      },
      trigger: {
        type: N.SchedulableTriggerInputTypes
          ? N.SchedulableTriggerInputTypes.DAILY
          : "daily",
        hour: when.hour,
        minute: when.minute,
      },
    });
    return true;
  } catch (e) {
    return false;
  }
}

export default { requestPermission, getStatus, configureHandler, scheduleRiskWindowReminder };
