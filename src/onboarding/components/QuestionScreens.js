/* ============================================================
   QuestionScreens.js , os tipos que fazem pergunta.
   WELCOME · TEXT_INPUT · SINGLE_SELECT · MULTI_SELECT · COMMITMENT

   Comportamento vem da seção 4 do PRD:
   - SINGLE_SELECT: feedback visual imediato e auto-advance em ~300 ms
   - MULTI_SELECT: toggling livre, CTA só habilita no minSelections,
     estado preservado ao voltar
   - TEXT_INPUT: CTA desabilitado enquanto vazio, trim, sem sobrenome
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
} from "react-native";
import * as Haptics from "expo-haptics";
import { Btn } from "../../components/ui";
import { Logo } from "../../components/Icons";
import { colors, fonts, radius } from "../../theme/theme";
import { Shell, Head, Reveal, ProofCard, Stars } from "./shared";
import { fill } from "../derive";

const tap = () => Haptics.selectionAsync().catch(() => {});

/* ============================================================
   WELCOME , tela 01
   Sem progress bar. Estrelas só se o rating for real (PRD seção 6).
   ============================================================ */
export function WelcomeScreen({ screen, onNext, profile }) {
  return (
    <Shell scroll={false} contentStyle={{ justifyContent: "center" }}>
      <View style={{ alignItems: "center" }}>
        <Reveal index={0}>
          <Logo size={64} />
        </Reveal>

        <Reveal index={1}>
          {screen.rating ? (
            <View style={{ alignItems: "center", marginTop: 16 }}>
              <Text style={s.stars}>{"★".repeat(Math.round(screen.rating.stars))}</Text>
              <Text style={s.ratingTxt}>
                {screen.rating.stars} · {screen.rating.count} ratings
              </Text>
            </View>
          ) : (
            // Mesmo fallback do funil (`storeProofHTML() || stars-row`): sem
            // nota real na loja, entra a fileira decorativa de 5 estrelas.
            <View style={{ alignItems: "center", marginTop: 16 }}>
              <Text style={s.identity}>{screen.identityLine}</Text>
              <Stars size={18} center />
            </View>
          )}
        </Reveal>

        <Reveal index={2}>
          <Text style={s.welcomeTitle}>{fill(screen.headline, profile)}</Text>
        </Reveal>

        <Reveal index={3}>
          <Text style={s.welcomeSub}>{fill(screen.subheadline, profile)}</Text>
        </Reveal>

        {/* Versículo que dá nome ao produto, abrindo o onboarding. */}
        {screen.scripture ? (
          <Reveal index={4} delay={220}>
            <View style={s.welcomeScripture}>
              <View style={s.welcomeRule} />
              <Text style={s.welcomeScriptureText}>“{screen.scripture.text}”</Text>
              <Text style={s.welcomeScriptureRef}>{screen.scripture.ref}</Text>
            </View>
          </Reveal>
        ) : null}
      </View>

      <View style={{ position: "absolute", left: 0, right: 0, bottom: 24 }}>
        <Reveal index={5}>
          <Btn title={screen.cta} onPress={() => onNext()} />
          <Pressable onPress={() => onNext()} hitSlop={10}>
            <Text style={s.secondary}>{screen.secondary}</Text>
          </Pressable>
        </Reveal>
      </View>
    </Shell>
  );
}

/* ============================================================
   TEXT_INPUT , tela 02
   ============================================================ */
export function TextInputScreen({ screen, value, onSubmit, onBack, profile }) {
  const [text, setText] = useState(value || "");
  const ref = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => ref.current && ref.current.focus(), 350);
    return () => clearTimeout(t);
  }, []);

  const clean = text.trim();
  const valid = clean.length >= 2;

  return (
    <Shell
      progress={screen.progress}
      onBack={onBack}
      scroll={false}
      footer={<Btn title={screen.cta} disabled={!valid} onPress={() => valid && onSubmit(clean)} />}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <Head eyebrow={screen.eyebrow} headline={fill(screen.headline, profile)} />
        <TextInput
          ref={ref}
          style={s.field}
          value={text}
          onChangeText={setText}
          placeholder={screen.placeholder}
          placeholderTextColor={colors.muted2}
          autoCapitalize="words"
          autoCorrect={false}
          textContentType="givenName"
          returnKeyType="done"
          onSubmitEditing={() => valid && onSubmit(clean)}
          selectionColor={colors.gold}
        />
        <Text style={s.privacyHint}>It stays on your device.</Text>
      </KeyboardAvoidingView>
    </Shell>
  );
}

/* ============================================================
   SINGLE_SELECT , telas 04, 06, 07, 09, 11, 13, 21
   ============================================================ */
export function SingleSelectScreen({ screen, value, onSubmit, onBack, profile }) {
  const [selected, setSelected] = useState(value || null);

  const pick = (v) => {
    setSelected(v);
    tap();
    if (screen.autoAdvance !== false) setTimeout(() => onSubmit(v), 300);
  };

  return (
    <Shell
      progress={screen.progress}
      onBack={onBack}
      footer={
        screen.autoAdvance === false ? (
          <Btn
            title={screen.cta || "Continue"}
            disabled={!selected}
            onPress={() => onSubmit(selected)}
          />
        ) : null
      }
    >
      <Head
        eyebrow={screen.eyebrow}
        headline={fill(screen.headline, profile)}
        subheadline={screen.subheadline ? fill(screen.subheadline, profile) : null}
      />
      <View style={s.options}>
        {(screen.options || []).map((o, i) => (
          <Reveal key={o.value} index={i} delay={45}>
            <Pressable
              onPress={() => pick(o.value)}
              style={({ pressed }) => [
                s.option,
                selected === o.value && s.optionOn,
                pressed && { transform: [{ scale: 0.988 }] },
              ]}
            >
              {o.emoji ? <Text style={s.emoji}>{o.emoji}</Text> : null}
              <View style={{ flex: 1 }}>
                <Text style={s.optionTxt}>{o.label}</Text>
                {o.recommended ? <Text style={s.recommended}>Recommended</Text> : null}
              </View>
              <View style={[s.radio, selected === o.value && s.radioOn]} />
            </Pressable>
          </Reveal>
        ))}
      </View>
    </Shell>
  );
}

/* ============================================================
   MULTI_SELECT , telas 03, 08, 12
   ============================================================ */
export function MultiSelectScreen({ screen, value, onSubmit, onBack, profile }) {
  const [picked, setPicked] = useState(Array.isArray(value) ? value : []);
  const min = screen.minSelections || 1;
  const max = screen.maxSelections || null;

  const toggle = (v) => {
    tap();
    setPicked((prev) => {
      if (prev.includes(v)) return prev.filter((x) => x !== v);
      if (max && prev.length >= max) return prev; // respeita o teto (ex.: até 3)
      return [...prev, v];
    });
  };

  const enough = picked.length >= min;
  const counter = max ? `${picked.length} of ${max}` : `${picked.length} selected`;

  return (
    <Shell
      progress={screen.progress}
      onBack={onBack}
      footer={
        <>
          {picked.length > 0 ? <Text style={s.counter}>{counter}</Text> : null}
          <Btn title={screen.cta || "Continue"} disabled={!enough} onPress={() => onSubmit(picked)} />
        </>
      }
    >
      <Head
        headline={fill(screen.headline, profile)}
        subheadline={screen.subheadline ? fill(screen.subheadline, profile) : null}
      />
      <View style={s.options}>
        {(screen.options || []).map((o, i) => {
          const on = picked.includes(o.value);
          const blocked = !on && max && picked.length >= max;
          return (
            <Reveal key={o.value} index={i} delay={40}>
              <Pressable
                onPress={() => toggle(o.value)}
                style={({ pressed }) => [
                  s.option,
                  on && s.optionOn,
                  blocked && { opacity: 0.45 },
                  pressed && { transform: [{ scale: 0.988 }] },
                ]}
              >
                {o.emoji ? <Text style={s.emoji}>{o.emoji}</Text> : null}
                <Text style={s.optionTxt}>{o.label}</Text>
                <View style={[s.check, on && s.checkOn]}>
                  {on ? <Text style={s.checkTxt}>✓</Text> : null}
                </View>
              </Pressable>
            </Reveal>
          );
        })}
      </View>
    </Shell>
  );
}

/* ============================================================
   COMMITMENT , tela 25
   Depois de escolher, mostra "Stronghold is ready." e segue.
   ============================================================ */
export function CommitmentScreen({ screen, value, onSubmit, onBack, profile }) {
  const [selected, setSelected] = useState(value || null);
  const [confirming, setConfirming] = useState(false);

  const pick = (v) => {
    setSelected(v);
    tap();
    setConfirming(true);
    setTimeout(() => onSubmit(v), 1100);
  };

  return (
    <Shell progress={screen.progress} onBack={onBack}>
      <Head
        headline={fill(screen.headline, profile)}
        subheadline={fill(screen.subheadline, profile)}
        serif
      />
      {confirming ? (
        <View style={s.confirmBox}>
          <Reveal index={0}>
            <Text style={s.confirmTxt}>{screen.confirm}</Text>
          </Reveal>
        </View>
      ) : (
        <View style={s.options}>
          {(screen.options || []).map((o, i) => (
            <Reveal key={o.value} index={i} delay={50}>
              <Pressable
                onPress={() => pick(o.value)}
                style={({ pressed }) => [
                  s.option,
                  selected === o.value && s.optionOn,
                  pressed && { transform: [{ scale: 0.988 }] },
                ]}
              >
                <Text style={s.optionTxt}>{o.label}</Text>
                <View style={[s.radio, selected === o.value && s.radioOn]} />
              </Pressable>
            </Reveal>
          ))}
        </View>
      )}
    </Shell>
  );
}

const s = StyleSheet.create({
  stars: { color: colors.gold, fontSize: 18, letterSpacing: 3 },
  ratingTxt: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, marginTop: 6 },
  identity: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    letterSpacing: 0.3,
    color: colors.gold,
    marginTop: 18,
    textAlign: "center",
  },
  welcomeTitle: {
    fontFamily: fonts.serif,
    fontSize: 40,
    lineHeight: 46,
    color: colors.ink,
    textAlign: "center",
    marginTop: 14,
  },
  welcomeSub: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.muted,
    textAlign: "center",
    marginTop: 12,
    maxWidth: 300,
  },
  welcomeScripture: { alignItems: "center", marginTop: 30, maxWidth: 320 },
  welcomeRule: {
    width: 34,
    height: 1,
    backgroundColor: colors.goldBorder,
    marginBottom: 16,
  },
  welcomeScriptureText: {
    fontFamily: fonts.serifItalic,
    fontSize: 15,
    lineHeight: 24,
    color: colors.muted,
    textAlign: "center",
  },
  welcomeScriptureRef: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    letterSpacing: 0.6,
    color: colors.gold,
    marginTop: 10,
  },
  secondary: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
    marginTop: 16,
  },

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
  privacyHint: { fontFamily: fonts.body, fontSize: 13, color: colors.muted2, marginTop: 12 },

  options: { marginTop: 24, gap: 10, paddingBottom: 10 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingVertical: 16,
    paddingHorizontal: 17,
  },
  optionOn: { borderColor: colors.gold, backgroundColor: "rgba(224,180,103,0.1)" },
  optionTxt: { flex: 1, fontFamily: fonts.medium, fontSize: 16, lineHeight: 21, color: colors.ink },
  emoji: { fontSize: 21 },
  recommended: {
    fontFamily: fonts.bold,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.gold,
    marginTop: 3,
  },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.line },
  radioOn: { borderColor: colors.gold, backgroundColor: colors.gold, borderWidth: 4 },
  check: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  checkOn: { borderColor: colors.gold, backgroundColor: colors.gold },
  checkTxt: { color: colors.onGold, fontFamily: fonts.bold, fontSize: 13 },
  counter: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.muted,
    textAlign: "center",
  },

  confirmBox: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 60 },
  confirmTxt: { fontFamily: fonts.serif, fontSize: 30, color: colors.gold, textAlign: "center" },
});

export default {
  WelcomeScreen,
  TextInputScreen,
  SingleSelectScreen,
  MultiSelectScreen,
  CommitmentScreen,
};
