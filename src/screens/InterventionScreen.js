/* ============================================================
   InterventionScreen.js , A INTERVENÇÃO (tela 5 das 7). É o produto.

   Sequência: bloqueio -> oração escrita pro momento dele (com o nome,
   revelada palavra a palavra) -> reset prático de 2 minutos -> retorno.

   Entra por: botão de pânico da Home, pelo SOS (começa na oração) ou pelo
   navegador seguro quando o filtro barra um site.
   ============================================================ */

import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Speech from "expo-speech";
import * as Haptics from "expo-haptics";
import { Dusk, TopBar, Display, Eyebrow, Pill, Btn, Banner } from "../components/ui";
import { colors, fonts, radius, spacing } from "../theme/theme";
import { useApp } from "../state/AppContext";
import { logEvent } from "../lib/supabase";

export default function InterventionScreen() {
  const { state, go } = useApp();
  const [step, setStep] = useState(state.ivStart || 0);
  const p = state.plan;

  useEffect(() => {
    logEvent("intervention_step", "intervention", { step });
    return () => {
      Speech.stop();
    };
  }, [step]);

  if (!p) return null;

  const prayer = (p.prayers && p.prayers[0]) || {
    text: "Lord, meet me in this moment.",
    verse: "",
  };
  const reset = p.reset || {
    title: "The Reset",
    tag: "Two minutes to break the pattern",
    steps: p.protocol ? p.protocol.steps : [],
  };

  if (step === 0) return <StepBlock plan={p} onNext={() => setStep(1)} />;
  if (step === 1) return <StepPray plan={p} prayer={prayer} onNext={() => setStep(2)} />;
  if (step === 2) return <StepReset reset={reset} onNext={() => setStep(3)} />;
  return <StepDone onDone={() => go("home")} />;
}

/* ---------- Passo 1: BLOQUEIO ---------- */
function StepBlock({ plan, onNext }) {
  const insets = useSafeAreaInsets();
  const hr = String(plan.pattern.highRiskLabel || "late nights").toLowerCase();
  const tr = String(plan.pattern.triggerLabel || "stress").toLowerCase();

  return (
    <View style={st.blockWrap}>
      <View style={[st.browserBar, { paddingTop: insets.top + 12 }]}>
        <Text style={st.browserIco}>‹ ›</Text>
        <View style={st.browserUrl}>
          <Text style={st.browserUrlTxt}>⚠ Protected Website</Text>
        </View>
        <Text style={st.browserIco}>⤴</Text>
      </View>

      <View style={{ flex: 1 }} />

      <View style={[st.sheet, { paddingBottom: insets.bottom + 22 }]}>
        <View style={st.grab} />
        <TopBar right={<Pill tone="gold">Active</Pill>} />
        <Display gold="stepped in." style={{ fontSize: 30, marginTop: 16 }}>
          Stronghold{" "}
        </Display>
        <Text style={st.blockedSub}>This protected site has been blocked.</Text>
        <Text style={st.blockedBody}>
          You told us {hr} and {tr} often come right before your difficult moments. Before this
          goes any further, Stronghold has prepared your next step.
        </Text>
        <View style={st.pills}>
          <Pill tone="red">⊗ Site blocked</Pill>
          <Pill tone="gold">Pattern recognized</Pill>
          <Pill>Personalized intervention ready</Pill>
        </View>
        <Btn title="Continue to My Prayer" onPress={onNext} />
      </View>
    </View>
  );
}

/* ---------- Passo 2: ORAÇÃO (revela palavra a palavra) ---------- */
function StepPray({ plan, prayer, onNext }) {
  const insets = useSafeAreaInsets();
  const words = String(prayer.text).split(/\s+/);
  const [lit, setLit] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const ready = lit >= words.length;

  useEffect(() => {
    const id = setInterval(() => {
      setLit((n) => {
        if (n >= words.length) {
          clearInterval(id);
          return n;
        }
        return n + 1;
      });
    }, 130);
    return () => clearInterval(id);
  }, [words.length]);

  useEffect(() => {
    if (ready) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, [ready]);

  const toggleSpeak = () => {
    if (speaking) {
      Speech.stop();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    Speech.speak(prayer.text, {
      rate: 0.9,
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  };

  return (
    <Dusk>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top + 22,
          paddingBottom: insets.bottom + 22,
          paddingHorizontal: spacing.screenX,
        }}
      >
        <TopBar />
        <View style={{ marginTop: 20 }}>
          <Eyebrow>Tonight's prayer</Eyebrow>
        </View>
        <Display gold="this exact moment." style={{ fontSize: 32 }}>
          A prayer for{" "}
        </Display>

        <ScrollView style={{ flex: 1, marginTop: 18 }} showsVerticalScrollIndicator={false}>
          <View style={st.pcard}>
            <Text style={st.ptext}>
              {words.map((w, i) => (
                <Text key={i} style={{ opacity: i < lit ? 1 : 0.22 }}>
                  {w + " "}
                </Text>
              ))}
            </Text>
            <Text style={st.pamen}>Amen.</Text>
            {prayer.verse ? <Text style={st.pverse}>{prayer.verse}</Text> : null}
          </View>

          <Pressable style={st.audio} onPress={toggleSpeak}>
            <View style={st.play}>
              <Text style={st.playTxt}>{speaking ? "■" : "▶"}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={st.atxt}>
                {speaking ? "Reading your prayer..." : `Listen to your prayer, ${plan.name}`}
              </Text>
              <View style={st.atrack}>
                <View style={st.afill} />
              </View>
            </View>
          </Pressable>

          <View style={{ flexDirection: "row", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <Pill tone="gold">{`Generated for ${plan.name}`}</Pill>
            <Pill>Written for this moment</Pill>
          </View>
        </ScrollView>

        <Btn
          title={ready ? "I prayed it. Now the reset." : "Read it slowly..."}
          disabled={!ready}
          onPress={onNext}
        />
      </View>
    </Dusk>
  );
}

/* ---------- Passo 3: RESET de 2 minutos ---------- */
function StepReset({ reset, onNext }) {
  const insets = useSafeAreaInsets();
  const [left, setLeft] = useState(120);

  useEffect(() => {
    const id = setInterval(() => setLeft((n) => Math.max(0, n - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const mm = Math.floor(left / 60);
  const ss = left % 60;

  return (
    <Dusk>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top + 22,
          paddingBottom: insets.bottom + 22,
          paddingHorizontal: spacing.screenX,
        }}
      >
        <TopBar />
        <View style={{ marginTop: 20 }}>
          <Eyebrow>2-minute reset</Eyebrow>
        </View>
        <Display gold="before it grows." style={{ fontSize: 32 }}>
          Break the pattern{" "}
        </Display>

        <Text style={st.timer}>{`${mm}:${ss < 10 ? "0" + ss : ss}`}</Text>
        {reset.tag ? <Text style={st.resetTag}>{reset.tag}</Text> : null}

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={st.rcard}>
            {(reset.steps || []).map((s, i) => (
              <View
                key={i}
                style={[st.rstep, i === (reset.steps || []).length - 1 && { borderBottomWidth: 0 }]}
              >
                <View style={st.rck}>
                  <Text style={st.rckTxt}>✓</Text>
                </View>
                <Text style={st.rstepTxt}>{s}</Text>
              </View>
            ))}
          </View>
          <Banner
            title="You interrupted the pattern."
            subtitle="Every victory starts with a pause."
          />
        </ScrollView>

        <Btn title="I'm Ready" onPress={onNext} />
      </View>
    </Dusk>
  );
}

/* ---------- Passo 4: RETORNO ---------- */
function StepDone({ onDone }) {
  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, []);
  return (
    <Dusk>
      <View style={st.doneWrap}>
        <View style={st.check}>
          <Text style={st.checkTxt}>✓</Text>
        </View>
        <Text style={st.doneTitle}>You made it.</Text>
        <Text style={st.doneBody}>
          The wave passed and you are still here. That is a win, and it counts. Your streak is
          safe.
        </Text>
        <Btn title="Back to home" onPress={onDone} style={{ width: "100%", maxWidth: 360 }} />
      </View>
    </Dusk>
  );
}

const st = StyleSheet.create({
  blockWrap: { flex: 1, backgroundColor: "#0d0908" },
  browserBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  browserIco: { color: colors.muted2, fontSize: 18 },
  browserUrl: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: "center",
  },
  browserUrlTxt: { fontFamily: fonts.semibold, fontSize: 14, color: colors.red },

  sheet: {
    backgroundColor: colors.sheet,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: spacing.screenX,
    paddingTop: 22,
  },
  grab: {
    width: 42, height: 5, borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "center", marginBottom: 18,
  },
  blockedSub: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink, marginTop: 8 },
  blockedBody: { fontFamily: fonts.body, fontSize: 15, lineHeight: 23, color: colors.muted, marginTop: 12 },
  pills: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 18 },

  pcard: {
    backgroundColor: colors.card2,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.xl,
    padding: 22,
  },
  ptext: { fontFamily: fonts.serifMedium, fontSize: 18, lineHeight: 29, color: colors.ink },
  pamen: { fontFamily: fonts.serifItalic, fontSize: 19, color: colors.gold, marginTop: 16 },
  pverse: {
    fontFamily: fonts.serifItalic, fontSize: 14.5, color: colors.muted,
    marginTop: 16, paddingLeft: 13, borderLeftWidth: 2, borderLeftColor: colors.gold,
  },

  audio: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line,
    borderRadius: radius.md, paddingVertical: 12, paddingHorizontal: 14, marginTop: 14,
  },
  play: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.gold,
    alignItems: "center", justifyContent: "center",
  },
  playTxt: { color: colors.onGold, fontSize: 15 },
  atxt: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
  atrack: { height: 4, backgroundColor: "rgba(255,255,255,0.14)", borderRadius: 4, marginTop: 6, overflow: "hidden" },
  afill: { height: "100%", width: "22%", backgroundColor: colors.gold },

  timer: {
    textAlign: "center", fontFamily: fonts.serif, fontSize: 44,
    color: colors.gold, marginTop: 18,
  },
  resetTag: { textAlign: "center", fontFamily: fonts.body, fontSize: 13.5, color: colors.muted, marginBottom: 6 },
  rcard: {
    backgroundColor: colors.card2, borderWidth: 1, borderColor: colors.line,
    borderRadius: radius.xl, padding: 20, marginTop: 10,
  },
  rstep: {
    flexDirection: "row", alignItems: "flex-start", gap: 12,
    paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: colors.lineSoft,
  },
  rck: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: colors.gold,
    alignItems: "center", justifyContent: "center", marginTop: 1,
  },
  rckTxt: { color: colors.onGold, fontSize: 12, fontFamily: fonts.bold },
  rstepTxt: { flex: 1, fontFamily: fonts.body, fontSize: 15.5, lineHeight: 23, color: colors.ink },

  doneWrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  check: {
    width: 92, height: 92, borderRadius: 46, backgroundColor: colors.gold,
    alignItems: "center", justifyContent: "center", marginBottom: 24,
  },
  checkTxt: { fontSize: 46, color: colors.onGold },
  doneTitle: { fontFamily: fonts.serif, fontSize: 34, color: colors.ink },
  doneBody: {
    fontFamily: fonts.body, fontSize: 16.5, lineHeight: 26, color: colors.muted,
    marginTop: 12, textAlign: "center", maxWidth: 300,
  },
});
