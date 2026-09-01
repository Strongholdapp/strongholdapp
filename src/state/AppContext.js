/* ============================================================
   AppContext.js , estado global do app + router simples.

   Espelha o objeto S do PWA (answers, qIndex, plan, screen, startDate,
   pledgedDay). Tudo persiste no aparelho via AsyncStorage. Sem login,
   sem conta, sem nuvem: privacidade é o argumento nº1 do nicho.
   ============================================================ */

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { loadState, saveState, clearState, emptyState } from "../lib/storage";
import { build as buildPlan } from "../engine/planEngine";
import { logEvent, saveLead } from "../lib/supabase";
import { setUserAttributes } from "../lib/superwall";
import { toLegacyAnswers, cleanName } from "../onboarding/derive";
import { FIRST_SCREEN } from "../onboarding/screens";
import { scheduleRiskWindowReminder } from "../lib/notifications";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState(emptyState);
  const [ready, setReady] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    (async () => {
      const loaded = await loadState();
      setState(loaded);
      setReady(true);
      logEvent("app_opened", loaded.screen || "welcome");
    })();
  }, []);

  // Um só ponto de escrita: atualiza em memória e persiste.
  // O próximo estado sai do ref (não do updater do setState), então dois updates
  // no mesmo tick se encadeiam certo e a gravação fica fora da fase de render.
  function update(patch) {
    const prev = stateRef.current;
    const next = typeof patch === "function" ? patch(prev) : { ...prev, ...patch };
    stateRef.current = next;
    setState(next);
    saveState(next);
  }

  const api = useMemo(() => {
    return {
      go(screen, extra) {
        update({ screen, ...(extra || {}) });
        logEvent("screen_view", screen);
      },

      /* ---------- Onboarding (PRD V3) ---------- */

      /** Cada submit de tela grava o profile inteiro (persistência por tela). */
      setProfile(profile) {
        update({ profile });
      },

      /** Guarda o screen_id atual, pra retomar do ponto certo ao reabrir. */
      setOnboardingScreen(screenId) {
        update({ onboardingScreen: screenId });
      },

      /**
       * Fim do onboarding: o profile vira o plano do motor de orações,
       * o streak começa e o app entra na Home.
       */
      completeOnboarding() {
        const prev = stateRef.current;
        const profile = prev.profile || {};
        const answers = toLegacyAnswers(profile);
        const plan = buildPlan(answers);
        const startDate = prev.startDate || profile.started_at || Date.now();

        update({
          answers,
          plan,
          startDate,
          onboardingDone: true,
          subscribed: true,
          screen: "home",
        });

        saveLead(answers, { intent: "app_onboarding_v3" });
        setUserAttributes(plan);
        scheduleRiskWindowReminder(profile, cleanName(profile.name));
        logEvent("onboarding_completed", "screen_27_paywall", {
          archetype: plan.archetype && plan.archetype.key,
          primary_trigger: profile.primary_trigger,
          primary_danger_moment: profile.primary_danger_moment,
          deepest_cost: profile.deepest_cost,
          commitment_level: profile.commitment_level,
          first_goal: profile.first_goal,
        });
        return plan;
      },

      /** Dia do streak (1-based). demoDay força um número pra gravar anúncio. */
      streakDay() {
        const prev = stateRef.current;
        if (prev.demoDay > 0) return prev.demoDay;
        if (!prev.startDate) return 1;
        return Math.floor((Date.now() - prev.startDate) / 86400000) + 1;
      },

      setDemoDay(n) {
        update({ demoDay: n > 0 ? n : null });
      },

      pledge() {
        const prev = stateRef.current;
        const day = prev.demoDay > 0 ? prev.demoDay : Math.floor((Date.now() - (prev.startDate || Date.now())) / 86400000) + 1;
        update({ pledgedDay: day });
        logEvent("pledge_taken", "home", { day });
      },

      /** Return without shame: registra a queda e reinicia o streak SEM punição. */
      recordRelapse(note) {
        update((prev) => ({
          ...prev,
          startDate: Date.now(),
          pledgedDay: null,
          demoDay: null,
          relapses: [...(prev.relapses || []), { at: Date.now(), note: note || null }],
        }));
        logEvent("relapse_recorded", "return");
      },

      setSubscribed(v) {
        update({ subscribed: Boolean(v) });
      },

      async restart() {
        await clearState();
        const fresh = { ...emptyState, onboardingScreen: FIRST_SCREEN };
        stateRef.current = fresh;
        setState(fresh);
      },

      update,
    };
  }, []);

  return (
    <AppContext.Provider value={{ state, ready, ...api }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp precisa estar dentro de <AppProvider>");
  return ctx;
}

export default AppContext;
