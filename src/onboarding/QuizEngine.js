/* ============================================================
   QuizEngine.js , o renderer do onboarding.

   Uma tela por vez, montada a partir de screens.js. Ele cuida de:
   navegação (next/back), persistência a cada submit, derivações,
   analytics de view/submit, permissão de notificação e a ponte pro paywall.

   Adicionar, remover ou reordenar tela é mexer em screens.js. Este arquivo
   só ganha código novo quando aparece um TIPO de tela novo.
   ============================================================ */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, Animated } from "react-native";
import { Dusk } from "../components/ui";
import { SCREENS, SCREEN_BY_ID, FIRST_SCREEN, indexOf } from "./screens";
import { derivePrimaryDangerMoment, ninetyDayDate, cleanName, prayerContext } from "./derive";
import * as A from "../lib/analytics";
import { requestPermission } from "../lib/notifications";
import { InterruptStep, PrayerStep, ResetStep } from "./components/MockScreens";

import {
  WelcomeScreen,
  TextInputScreen,
  SingleSelectScreen,
  MultiSelectScreen,
  CommitmentScreen,
} from "./components/QuestionScreens";

import {
  PersonalizedInterstitial,
  PatternReveal,
  ReframeScreen,
  MechanismScreen,
  ProductDemo,
  PrivacyScreen,
  ResultBridge,
  RecoveryProfile,
  Plan90,
  Celebration,
  PermissionPrePrompt,
  ProofBridge,
  PaywallBridge,
} from "./components/StoryScreens";

export default function QuizEngine({
  profile,
  currentScreenId,
  onProfileChange,
  onScreenChange,
  onFinish,
  paywall,
}) {
  const screenId = currentScreenId || FIRST_SCREEN;
  const screen = SCREEN_BY_ID[screenId] || SCREENS[0];
  const index = indexOf(screenId);
  const historyRef = useRef([]);

  // Transição de 180 a 280 ms entre telas (PRD seção 4).
  const fade = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  }, [screenId, fade]);

  // Um screen_view por tela, com screen_index, pra dar completion rate por tela.
  useEffect(() => {
    A.screenView(screenId, index);
    if (screen.analytics && screen.analytics.proof_id) {
      A.proofView(screen.analytics.proof_id, screenId);
    }
    if (screen.type === "INTERRUPT" || screen.type === "PRAYER_STEP" || screen.type === "RESET_STEP") {
      A.mechanismDemoView(screenId, true);
    }
    if (screen.type === "RECOVERY_PROFILE") A.recoveryProfileView(profile);
    if (screen.type === "PAYWALL") A.paywallView("onboarding_v4", profile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenId]);

  const goTo = useCallback(
    (nextId) => {
      if (!nextId) return;
      historyRef.current = [...historyRef.current, screenId];
      onScreenChange(nextId);
    },
    [screenId, onScreenChange]
  );

  const goBack = useCallback(() => {
    const prev = historyRef.current[historyRef.current.length - 1];
    const target = prev || SCREENS[Math.max(0, index - 1)].id;
    historyRef.current = historyRef.current.slice(0, -1);
    A.back(screenId, target);
    onScreenChange(target);
  }, [index, screenId, onScreenChange]);

  /**
   * Um submit: guarda a resposta, recalcula os derivados e avança.
   * Recalcular sempre cobre o caso do PRD "usuário volta e muda resposta".
   */
  const submit = useCallback(
    (value, extra) => {
      const patch = {};
      if (screen.store) patch[screen.store] = value;

      const merged = { ...profile, ...patch };

      // Derivações (PRD seção 8)
      if (screen.store === "danger_moments") {
        merged.primary_danger_moment = derivePrimaryDangerMoment(value);
      }
      if (screen.store === "name") {
        merged.name = cleanName(value);
      }
      if (!merged.started_at) merged.started_at = Date.now();
      merged.ninety_day_date = ninetyDayDate(merged.started_at);
      merged.prayer_context = prayerContext(merged);

      // O nome nunca sai do aparelho. Ele é a única resposta do quiz que
      // identifica a pessoa, e a política de privacidade promete que ele fica
      // local. Mandamos só o fato de que a tela foi respondida.
      if (screen.store) {
        const reported = screen.store === "name" ? "[redacted]" : value;
        A.answerSubmitted(screenId, reported, extra);
      }
      if (screen.analytics && screen.analytics.submit === "onboarding_first_goal_selected") {
        A.firstGoalSelected(value);
      }

      onProfileChange(merged);
      goTo(screen.next);
    },
    [screen, screenId, profile, onProfileChange, goTo]
  );

  const stored = screen.store ? profile[screen.store] : undefined;
  const canGoBack = index > 0 && screen.type !== "WELCOME" && screen.type !== "CELEBRATION";
  const onBack = canGoBack ? goBack : null;

  const body = useMemo(() => {
    switch (screen.type) {
      case "WELCOME":
        return (
          <WelcomeScreen
            screen={screen}
            profile={profile}
            onNext={() => {
              A.startQuizTap();
              goTo(screen.next);
            }}
          />
        );

      case "TEXT_INPUT":
        return (
          <TextInputScreen
            screen={screen}
            profile={profile}
            value={stored}
            onSubmit={submit}
            onBack={onBack}
          />
        );

      case "SINGLE_SELECT":
        return (
          <SingleSelectScreen
            screen={screen}
            profile={profile}
            value={stored}
            onSubmit={submit}
            onBack={onBack}
          />
        );

      case "MULTI_SELECT":
        return (
          <MultiSelectScreen
            screen={screen}
            profile={profile}
            value={stored}
            onSubmit={submit}
            onBack={onBack}
          />
        );

      case "COMMITMENT":
        return (
          <CommitmentScreen
            screen={screen}
            profile={profile}
            value={stored}
            onSubmit={submit}
            onBack={onBack}
          />
        );

      case "PERSONALIZED_INTERSTITIAL":
        return (
          <PersonalizedInterstitial
            screen={screen}
            profile={profile}
            onNext={() => goTo(screen.next)}
            onBack={onBack}
          />
        );

      case "PATTERN_REVEAL":
        return (
          <PatternReveal
            screen={screen}
            profile={profile}
            onNext={() => goTo(screen.next)}
            onBack={onBack}
          />
        );

      case "REFRAME":
        return (
          <ReframeScreen
            screen={screen}
            profile={profile}
            onNext={() => goTo(screen.next)}
            onBack={onBack}
          />
        );

      /* --- V4: o mecanismo virou sequência de três telas com mockup --- */
      case "INTERRUPT":
        return (
          <InterruptStep
            screen={screen}
            profile={profile}
            onNext={() => goTo(screen.next)}
            onBack={onBack}
          />
        );

      case "PRAYER_STEP":
        return (
          <PrayerStep
            screen={screen}
            profile={profile}
            onNext={() => goTo(screen.next)}
            onBack={onBack}
          />
        );

      case "RESET_STEP":
        return (
          <ResetStep
            screen={screen}
            profile={profile}
            onNext={() => goTo(screen.next)}
            onBack={onBack}
          />
        );

      case "PRIVACY":
        return (
          <PrivacyScreen screen={screen} onNext={() => goTo(screen.next)} onBack={onBack} />
        );

      case "RESULT_BRIDGE":
        return (
          <ResultBridge
            screen={screen}
            profile={profile}
            onNext={() => goTo(screen.next)}
            onBack={onBack}
          />
        );

      case "RECOVERY_PROFILE":
        return (
          <RecoveryProfile
            screen={screen}
            profile={profile}
            onNext={() => goTo(screen.next)}
            onBack={onBack}
          />
        );

      case "PLAN_90":
        return (
          <Plan90
            screen={screen}
            profile={profile}
            onNext={() => goTo(screen.next)}
            onBack={onBack}
          />
        );

      case "CELEBRATION":
        return (
          <Celebration screen={screen} profile={profile} onNext={() => goTo(screen.next)} />
        );

      case "PERMISSION_PREPROMPT":
        return (
          <PermissionPrePrompt
            screen={screen}
            onEnable={async () => {
              A.notificationPrepromptTap("enable");
              // Tela 24: o prompt NATIVO, só depois do pre-prompt.
              const res = await requestPermission();
              A.notificationPermissionResult(res.granted);
              // Negado não interrompe o funil, é regra do PRD.
              onProfileChange({
                ...profile,
                notification_permission: res.granted ? "granted" : "denied",
              });
              goTo(screen.next);
            }}
            onSkip={() => {
              A.notificationPrepromptTap("skip");
              onProfileChange({ ...profile, notification_permission: "skipped" });
              goTo(screen.next);
            }}
          />
        );

      case "PROOF_BRIDGE":
        return (
          <ProofBridge
            screen={screen}
            profile={profile}
            onNext={() => goTo(screen.next)}
            onBack={onBack}
          />
        );

      case "PAYWALL":
        return (
          <PaywallBridge
            screen={screen}
            profile={profile}
            busy={paywall && paywall.busy}
            note={paywall && paywall.note}
            onStart={onFinish}
            onBack={onBack}
          />
        );

      default:
        return <Dusk />;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, profile, stored, onBack, paywall && paywall.busy]);

  return (
    <Animated.View style={{ flex: 1, opacity: fade }}>
      <View style={{ flex: 1 }}>{body}</View>
    </Animated.View>
  );
}
