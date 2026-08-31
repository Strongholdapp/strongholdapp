/* ============================================================
   QuizScreen.js , o onboarding (tela 1 das 7).
   Um card por pergunta, respostas alimentam TODA a personalização
   (oração, arquétipo, plano, paywall). Texto e opções vêm de COPY.
   ============================================================ */

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Screen, TopBar, Progress, Btn } from "../components/ui";
import { colors, fonts, radius } from "../theme/theme";
import { COPY } from "../data/copy";
import { useApp, QUIZ } from "../state/AppContext";

export default function QuizScreen() {
  const { state } = useApp();
  const qid = QUIZ[state.qIndex];
  if (qid === "name") return <NameStep />;
  return <ChoiceStep qid={qid} key={qid} />;
}

function Header() {
  const { state, prevQuestion } = useApp();
  const pct = Math.round((state.qIndex / QUIZ.length) * 100);
  return (
    <>
      <TopBar
        right={
          <Pressable onPress={prevQuestion} hitSlop={12}>
            <Text style={st.step}>
              {state.qIndex + 1} / {QUIZ.length}
            </Text>
          </Pressable>
        }
      />
      <Progress pct={pct} />
    </>
  );
}

function NameStep() {
  const { state, answer, nextQuestion } = useApp();
  const [value, setValue] = useState(state.answers.name || "");
  const ref = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => ref.current && ref.current.focus(), 350);
    return () => clearTimeout(t);
  }, []);

  const valid = value.trim().length >= 2;
  const submit = () => {
    if (!valid) return;
    answer("name", value.trim());
    nextQuestion();
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Header />
        <Text style={st.q}>First, what should we call you?</Text>
        <Text style={st.sub}>
          Your prayers and plan are written using your name. It stays on your device.
        </Text>
        <TextInput
          ref={ref}
          style={st.field}
          value={value}
          onChangeText={setValue}
          placeholder="Your first name"
          placeholderTextColor={colors.muted2}
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={submit}
          selectionColor={colors.gold}
        />
        <View style={{ flex: 1 }} />
        <Btn title="Continue" onPress={submit} disabled={!valid} />
      </KeyboardAvoidingView>
    </Screen>
  );
}

function ChoiceStep({ qid }) {
  const { state, answer, nextQuestion } = useApp();
  const q = COPY[qid] || {};
  const options = q.options || [];
  const [selected, setSelected] = useState(state.answers[qid] || null);

  const pick = (value) => {
    setSelected(value);
    answer(qid, value);
    Haptics.selectionAsync().catch(() => {});
    setTimeout(nextQuestion, 220);
  };

  return (
    <Screen>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <Text style={st.q}>{q.title || ""}</Text>
        <View style={st.options}>
          {options.map((o) => {
            const on = selected === o.value;
            return (
              <Pressable
                key={o.value}
                onPress={() => pick(o.value)}
                style={({ pressed }) => [
                  st.option,
                  on && st.optionOn,
                  pressed && { transform: [{ scale: 0.988 }] },
                ]}
              >
                {o.emoji ? <Text style={st.emoji}>{o.emoji}</Text> : null}
                <Text style={st.optionTxt}>{o.label}</Text>
                <View style={[st.radio, on && st.radioOn]} />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
}

const st = StyleSheet.create({
  step: { fontFamily: fonts.medium, fontSize: 12, color: colors.muted },
  q: {
    fontFamily: fonts.bold,
    fontSize: 26,
    lineHeight: 31,
    color: colors.ink,
    marginTop: 26,
    letterSpacing: -0.4,
  },
  sub: { fontFamily: fonts.body, color: colors.muted, fontSize: 15.5, lineHeight: 23, marginTop: 10 },
  field: {
    marginTop: 26,
    paddingVertical: 17,
    paddingHorizontal: 18,
    fontSize: 17,
    fontFamily: fonts.body,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    color: colors.ink,
  },
  options: { marginTop: 26, gap: 11 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingVertical: 17,
    paddingHorizontal: 18,
  },
  optionOn: { borderColor: colors.gold, backgroundColor: "rgba(224,180,103,0.1)" },
  optionTxt: { flex: 1, fontFamily: fonts.medium, fontSize: 16.5, color: colors.ink },
  emoji: { fontSize: 22 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.line,
  },
  radioOn: {
    borderColor: colors.gold,
    backgroundColor: colors.gold,
    borderWidth: 4,
  },
});
