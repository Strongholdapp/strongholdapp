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

const AppContext = createContext(null);

// Ordem do quiz do app (a mesma do PWA: 8 passos, o funil web tem 13).
export const QUIZ = [
  "name",
  "currentAgeRange",
  "frequency",
  "firstExposureAge",
  "highRiskTime",
  "primaryTrigger",
  "copingMechanism",
  "faithImpact",
];

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

      answer(key, value) {
        update((prev) => ({ ...prev, answers: { ...prev.answers, [key]: value } }));
      },

      nextQuestion() {
        const prev = stateRef.current;
        if (prev.qIndex < QUIZ.length - 1) {
          update({ qIndex: prev.qIndex + 1 });
        } else {
          update({ screen: "loading" });
        }
      },

      prevQuestion() {
        const prev = stateRef.current;
        if (prev.qIndex > 0) update({ qIndex: prev.qIndex - 1 });
        else update({ screen: "welcome" });
      },

      /** Fim do quiz: gera o plano com o motor e começa o streak. */
      finishQuiz() {
        const prev = stateRef.current;
        const plan = buildPlan(prev.answers);
        const startDate = prev.startDate || Date.now();
        update({ plan, startDate, screen: "profile" });
        saveLead(prev.answers, { intent: "app_onboarding" });
        setUserAttributes(plan);
        logEvent("plan_generated", "loading", {
          archetype: plan.archetype && plan.archetype.key,
          trigger: prev.answers.primaryTrigger,
          highRiskTime: prev.answers.highRiskTime,
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
        setState({ ...emptyState });
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
