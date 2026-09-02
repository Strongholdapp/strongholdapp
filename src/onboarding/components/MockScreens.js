/* ============================================================
   MockScreens.js , as três telas do mecanismo da V4.

   INTERRUPT · PRAYER_STEP · RESET_STEP

   Regra que vale pras três: o "mockup" NÃO é imagem. É a tela do app
   renderizada em miniatura, com os dados DELE. A tela da oração precisa
   mostrar o nome real e o custo que ele respondeu, e a oração que aparece
   é a que o motor de fato escolheu pro perfil dele, não um exemplo. Se um
   dia alguém mudar a Intervenção, o mockup muda junto: ele não tem como
   divergir do produto, que é o problema de print estático.

   Regra de copy (do PRD do Lucas): não prometer comportamento que o app
   não tem. O app NÃO bloqueia conteúdo do sistema e NÃO detecta tentação
   sozinho. Quem dispara é a pessoa, no botão de pânico ou no SOS. A tela
   1 diz isso com todas as letras.
   ============================================================ */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { Btn, Pill } from "../../components/ui";
import { colors, fonts, radius } from "../../theme/theme";
import { Shell, Head, Reveal, ProofCard, st as sh } from "./shared";
import { labelFor, edgeCopy, toLegacyAnswers } from "../derive";
import { build } from "../../engine/planEngine";

/* ------------------------------------------------------------
   Moldura: a "telinha" do app dentro da tela do onboarding.
   ------------------------------------------------------------ */
function PhoneMock({ children, time, tag, tagTone = "red" }) {
  return (
    <View style={s.phone}>
      <View style={s.notch} />
      {time || tag ? (
        <View style={s.phoneTop}>
          <Text style={s.clock}>{time}</Text>
          {tag ? <Pill tone={tagTone}>{tag}</Pill> : null}
        </View>
      ) : null}
      <View style={{ paddingHorizontal: 14, paddingBottom: 16 }}>{children}</View>
    </View>
  );
}

/** Hora do aparelho, no formato do mockup. Nada de "11:42 PM" chumbado. */
function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 20000);
    return () => clearInterval(t);
  }, []);
  return now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

/** O momento de risco dele, com o fallback do edge case "sem padrão claro". */
function riskTag(profile) {
  const edge = edgeCopy(profile);
  if (edge.demoUnclearPattern) return null;
  return labelFor("danger_moments", profile.primary_danger_moment) || null;
}

/* ============================================================
   STEP 1 , INTERRUPT
   ============================================================ */
export function InterruptStep({ screen, profile, onNext, onBack }) {
  const time = useClock();
  const tag = riskTag(profile);

  return (
    <Shell
      progress={screen.progress}
      onBack={onBack}
      footer={<Btn title={screen.cta} onPress={() => onNext()} />}
    >
      <Head eyebrow={screen.eyebrow} headline={screen.headline} serif />

      <Reveal index={0}>
        <PhoneMock time={time} tag={tag}>
          <View style={s.blockCard}>
            <Text style={s.blockIcon}>🔒</Text>
            <Text style={s.blockWord}>{screen.blockedLabel}</Text>
          </View>
        </PhoneMock>
      </Reveal>

      <Reveal index={1} delay={200}>
        <Text style={s.stepBody}>{screen.body}</Text>
      </Reveal>

      <Reveal index={2} delay={200}>
        <View style={s.contrast}>
          <Text style={s.contrastMuted}>{screen.contrastA}</Text>
          <Text style={s.contrastStrong}>{screen.contrastB}</Text>
        </View>
      </Reveal>
    </Shell>
  );
}

/* ============================================================
   STEP 2 , PRAYER
   A tela mais importante do onboarding: é onde o diferencial aparece.
   ============================================================ */
export function PrayerStep({ screen, profile, onNext, onBack }) {
  const name = (profile && profile.name) || "";
  const cost = labelFor("deepest_cost", profile.deepest_cost);

  // A oração REAL que o motor escolhe pro perfil dele. Se o motor não
  // conseguir montar (perfil ainda incompleto), a tela mostra só a moldura,
  // sem inventar texto de oração.
  const prayer = useMemo(() => {
    try {
      const plan = build(toLegacyAnswers(profile));
      const first = plan && plan.prayers && plan.prayers[0];
      return first || null;
    } catch (e) {
      return null;
    }
  }, [profile]);

  const snippet = prayer ? firstSentences(prayer.text, 2) : null;

  return (
    <Shell
      progress={screen.progress}
      onBack={onBack}
      footer={<Btn title={screen.cta} onPress={() => onNext()} />}
    >
      <Head eyebrow={screen.eyebrow} headline={screen.headline} serif />

      <Reveal index={0}>
        <PhoneMock>
          <Text style={s.prayerHi}>
            {name ? `${name}, ${screen.stayLine}` : cap(screen.stayLine)}
          </Text>
          {cost ? (
            <Text style={s.prayerCost}>
              {screen.costPrefix} <Text style={s.prayerCostHot}>{cost.toLowerCase()}</Text>.
            </Text>
          ) : null}

          <View style={s.prayerDivider} />

          <Text style={s.prayerIcon}>🙏</Text>
          <Text style={s.prayerTag}>{screen.prayerTag}</Text>
          {snippet ? <Text style={s.prayerText}>“{snippet}”</Text> : null}
          {prayer && prayer.verse ? (
            <Text style={s.prayerVerse}>{prayer.verse}</Text>
          ) : null}
        </PhoneMock>
      </Reveal>

      <Reveal index={1} delay={200}>
        <Text style={s.stepBody}>{screen.body}</Text>
      </Reveal>
    </Shell>
  );
}

/* ============================================================
   STEP 3 , RESET
   ============================================================ */
export function ResetStep({ screen, profile, onNext, onBack }) {
  const reset = useMemo(() => {
    try {
      const plan = build(toLegacyAnswers(profile));
      return (plan && plan.reset) || null;
    } catch (e) {
      return null;
    }
  }, [profile]);

  const steps = (reset && reset.steps ? reset.steps : []).slice(0, 2).map(shortStep);

  return (
    <Shell
      progress={screen.progress}
      onBack={onBack}
      footer={<Btn title={screen.cta} onPress={() => onNext()} />}
    >
      <Head eyebrow={screen.eyebrow} headline={screen.headline} serif />

      <Reveal index={0}>
        <PhoneMock>
          <Ticker />
          {reset && reset.title ? <Text style={s.resetTitle}>{reset.title}</Text> : null}
          {steps.map((t, i) => (
            <View key={i} style={s.resetRow}>
              <View style={s.resetDot}>
                <Text style={s.resetDotTxt}>{i + 1}</Text>
              </View>
              <Text style={s.resetStep}>{t}</Text>
            </View>
          ))}
        </PhoneMock>
      </Reveal>

      <Reveal index={1} delay={200}>
        <View style={s.punchBox}>
          <Text style={s.punch}>{screen.punch}</Text>
          <Text style={s.punchSub}>{screen.body}</Text>
        </View>
      </Reveal>

      <Reveal index={2} delay={200}>
        <ProofCard id={screen.proof} tag={screen.proofTag} compact />
      </Reveal>
    </Shell>
  );
}

/** Contador 02:00 descendo, pra telinha não parecer estática. */
function Ticker() {
  const [left, setLeft] = useState(120);
  useEffect(() => {
    const t = setInterval(() => setLeft((v) => (v <= 0 ? 120 : v - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return (
    <View style={s.tickerWrap}>
      <Text style={s.ticker}>
        {mm}:{ss}
      </Text>
    </View>
  );
}


/* ============================================================
   MiniMocks , a montagem dos três mockups da tela de proof final.

   Mesma regra das telas grandes: nada de imagem. São as três telas do
   produto em miniatura, com o nome real e o streak real da pessoa, então
   a montagem não tem como divergir do app.
   ============================================================ */
export function MiniMocks({ profile, labels }) {
  const name = (profile && profile.name) || "";
  const L = labels || {};
  return (
    <View style={s.miniRow}>
      <View style={s.mini}>
        <View style={s.miniNotch} />
        <View style={s.miniBlock}>
          <Text style={s.miniIcon}>🔒</Text>
        </View>
        <Text style={s.miniLabel}>{L.block || "Blocked"}</Text>
      </View>

      <View style={s.mini}>
        <View style={s.miniNotch} />
        <View style={s.miniBody}>
          <Text style={s.miniIcon}>🙏</Text>
          <Text style={s.miniPrayer} numberOfLines={3}>
            {name ? `${name}, stay here for a moment.` : "Stay here for a moment."}
          </Text>
        </View>
        <Text style={s.miniLabel}>{L.pray || "Your prayer"}</Text>
      </View>

      <View style={s.mini}>
        <View style={s.miniNotch} />
        <View style={s.miniBody}>
          <Text style={s.miniDay}>1</Text>
          <Text style={s.miniDayLabel}>DAY</Text>
        </View>
        <Text style={s.miniLabel}>{L.progress || "Your streak"}</Text>
      </View>
    </View>
  );
}

/* ------------------------------------------------------------
   Utilidades de texto
   ------------------------------------------------------------ */
function firstSentences(text, n) {
  if (!text) return "";
  const parts = String(text).match(/[^.!?]+[.!?]+/g);
  if (!parts) return String(text);
  return parts.slice(0, n).join(" ").trim();
}

function shortStep(text) {
  const one = firstSentences(text, 1);
  return one.length > 96 ? one.slice(0, 93).trimEnd() + "..." : one;
}

function cap(t) {
  const s2 = String(t || "");
  return s2.charAt(0).toUpperCase() + s2.slice(1);
}

const s = StyleSheet.create({
  miniRow: { flexDirection: "row", gap: 8, marginTop: 18 },
  mini: { flex: 1, alignItems: "center" },
  miniNotch: {
    width: 22,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.16)",
    marginBottom: 8,
  },
  miniBlock: {
    width: "100%",
    height: 92,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(214,86,76,0.42)",
    backgroundColor: "rgba(214,86,76,0.10)",
  },
  miniBody: {
    width: "100%",
    height: 92,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card2,
  },
  miniIcon: { fontSize: 20 },
  miniPrayer: {
    fontFamily: fonts.serifItalic,
    fontSize: 10.5,
    lineHeight: 15,
    color: colors.ink,
    textAlign: "center",
    marginTop: 6,
  },
  miniDay: { fontFamily: fonts.extrabold, fontSize: 30, color: colors.gold },
  miniDayLabel: {
    fontFamily: fonts.bold,
    fontSize: 9,
    letterSpacing: 1.4,
    color: colors.muted2,
    marginTop: 2,
  },
  miniLabel: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    color: colors.muted,
    marginTop: 8,
    textAlign: "center",
  },

  phone: {
    marginTop: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card2,
    overflow: "hidden",
    paddingTop: 10,
  },
  notch: {
    alignSelf: "center",
    width: 54,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.16)",
    marginBottom: 10,
  },
  phoneTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  clock: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },

  blockCard: {
    alignItems: "center",
    paddingVertical: 26,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "rgba(214,86,76,0.42)",
    backgroundColor: "rgba(214,86,76,0.10)",
  },
  blockIcon: { fontSize: 30 },
  blockWord: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: colors.ink,
    marginTop: 10,
    letterSpacing: 0.2,
  },

  stepBody: {
    fontFamily: fonts.body,
    fontSize: 15.5,
    lineHeight: 24,
    color: colors.muted,
    marginTop: 18,
  },
  contrast: { marginTop: 14 },
  contrastMuted: { fontFamily: fonts.body, fontSize: 14, color: colors.muted2 },
  contrastStrong: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.gold,
    marginTop: 2,
  },

  prayerHi: { fontFamily: fonts.serif, fontSize: 19, lineHeight: 26, color: colors.ink },
  prayerCost: {
    fontFamily: fonts.body,
    fontSize: 14.5,
    lineHeight: 22,
    color: colors.muted,
    marginTop: 8,
  },
  prayerCostHot: { fontFamily: fonts.semibold, color: colors.ink },
  prayerDivider: {
    height: 1,
    backgroundColor: colors.lineSoft,
    marginVertical: 16,
  },
  prayerIcon: { fontSize: 22 },
  prayerTag: {
    fontFamily: fonts.bold,
    fontSize: 11,
    letterSpacing: 1.3,
    color: colors.gold,
    marginTop: 8,
  },
  prayerText: {
    fontFamily: fonts.serifItalic,
    fontSize: 15,
    lineHeight: 24,
    color: colors.ink,
    marginTop: 10,
  },
  prayerVerse: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    lineHeight: 19,
    color: colors.muted2,
    marginTop: 10,
  },

  tickerWrap: { alignItems: "center", paddingVertical: 8 },
  ticker: {
    fontFamily: fonts.extrabold,
    fontSize: 40,
    letterSpacing: 1,
    color: colors.gold,
  },
  resetTitle: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.ink,
    textAlign: "center",
    marginBottom: 14,
  },
  resetRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  resetDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.goldSoft,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    marginTop: 1,
  },
  resetDotTxt: { fontFamily: fonts.bold, fontSize: 11, color: colors.gold },
  resetStep: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 20,
    color: colors.muted,
  },

  punchBox: {
    marginTop: 20,
    borderLeftWidth: 2,
    borderLeftColor: colors.gold,
    paddingLeft: 14,
  },
  punch: { fontFamily: fonts.serif, fontSize: 20, lineHeight: 28, color: colors.ink },
  punchSub: {
    fontFamily: fonts.body,
    fontSize: 14.5,
    lineHeight: 22,
    color: colors.muted,
    marginTop: 8,
  },
});

export default { InterruptStep, PrayerStep, ResetStep, MiniMocks };
