/* ============================================================
   shared.js , peças usadas por várias telas do onboarding.

   Reveal    : entrada em stagger (80 a 140 ms), o que dá a sensação de
               "o app está montando isso agora" que o PRD pede na seção 12.
   ProofCard : depoimento real com foto. Nunca renderiza nada se o id não
               existir, pra não sobrar placeholder em produção.
   Shell     : moldura das telas (safe area, progress bar, botão voltar).
   ============================================================ */

import React, { useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, Animated, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dusk, Brand, Progress } from "../../components/ui";
import { colors, fonts, radius, spacing } from "../../theme/theme";
import { REVIEWS, REVIEW_PHOTOS } from "../proof";

/* ---------- Entrada em stagger ---------- */
export function Reveal({ children, index = 0, delay = 110, style, from = 10 }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const t = setTimeout(() => {
      Animated.timing(a, { toValue: 1, duration: 260, useNativeDriver: true }).start();
    }, index * delay);
    return () => clearTimeout(t);
  }, [a, index, delay]);

  return (
    <Animated.View
      style={[
        {
          opacity: a,
          transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [from, 0] }) }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

/* ---------- Depoimento real ---------- */
export function ProofCard({ id, tag, compact }) {
  const r = REVIEWS[id];
  if (!r) return null; // sem depoimento real, não inventa nada
  const photo = REVIEW_PHOTOS[r.photo];

  return (
    <View style={[st.proof, compact && { padding: 14 }]}>
      {tag ? <Text style={st.proofTag}>{String(tag).toUpperCase()}</Text> : null}
      <Text style={[st.proofText, compact && { fontSize: 14.5, lineHeight: 22 }]}>
        “{r.text}”
      </Text>
      <View style={st.proofFoot}>
        {photo ? <Image source={photo} style={st.proofPhoto} /> : null}
        <View style={{ flex: 1 }}>
          <Text style={st.proofName}>{r.name}</Text>
          <Text style={st.proofLoc}>{r.location}</Text>
        </View>
        {r.badge ? (
          <View style={st.proofBadge}>
            <Text style={st.proofBadgeTxt}>{r.badge}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

/* ---------- Moldura ---------- */
export function Shell({ children, progress, onBack, scroll = true, footer, contentStyle }) {
  const insets = useSafeAreaInsets();
  const showChrome = progress !== undefined && progress !== null;

  const body = (
    <>
      <View style={st.top}>
        {onBack ? (
          <Pressable onPress={onBack} hitSlop={14} style={st.back}>
            <Text style={st.backTxt}>‹</Text>
          </Pressable>
        ) : (
          <View style={st.back} />
        )}
        <Brand size={28} />
        <View style={st.back} />
      </View>
      {showChrome ? <Progress pct={Math.round(progress * 100)} /> : <View style={{ height: 8 }} />}
    </>
  );

  return (
    <Dusk>
      <View style={{ paddingTop: insets.top + 10, paddingHorizontal: spacing.screenX }}>{body}</View>
      {scroll ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            { paddingHorizontal: spacing.screenX, paddingBottom: 24, flexGrow: 1 },
            contentStyle,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1, paddingHorizontal: spacing.screenX }, contentStyle]}>
          {children}
        </View>
      )}
      {footer ? (
        <View
          style={{
            paddingHorizontal: spacing.screenX,
            paddingBottom: insets.bottom + 14,
            paddingTop: 6,
          }}
        >
          {footer}
        </View>
      ) : null}
    </Dusk>
  );
}

/* ---------- Cabeçalho de pergunta ---------- */
export function Head({ eyebrow, headline, subheadline, serif }) {
  return (
    <View style={{ marginTop: 22 }}>
      {eyebrow ? <Text style={st.eyebrow}>{String(eyebrow).toUpperCase()}</Text> : null}
      <Text style={[st.headline, serif && st.headlineSerif]}>{headline}</Text>
      {subheadline ? <Text style={st.sub}>{subheadline}</Text> : null}
    </View>
  );
}

export const st = StyleSheet.create({
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  back: { width: 34, alignItems: "flex-start" },
  backTxt: { color: colors.muted, fontSize: 30, lineHeight: 32, marginTop: -4 },

  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 11.5,
    letterSpacing: 1.5,
    color: colors.gold,
    marginBottom: 8,
  },
  headline: {
    fontFamily: fonts.bold,
    fontSize: 25,
    lineHeight: 31,
    color: colors.ink,
    letterSpacing: -0.4,
  },
  headlineSerif: {
    fontFamily: fonts.serif,
    fontSize: 31,
    lineHeight: 37,
    letterSpacing: -0.2,
  },
  sub: { fontFamily: fonts.body, fontSize: 15.5, lineHeight: 23, color: colors.muted, marginTop: 10 },

  proof: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: 18,
    marginTop: 16,
  },
  proofTag: {
    fontFamily: fonts.bold,
    fontSize: 10.5,
    letterSpacing: 1.4,
    color: colors.gold,
    marginBottom: 10,
  },
  proofText: {
    fontFamily: fonts.serifItalic,
    fontSize: 15.5,
    lineHeight: 24,
    color: colors.ink,
  },
  proofFoot: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 14 },
  proofPhoto: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.card2 },
  proofName: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  proofLoc: { fontFamily: fonts.body, fontSize: 12, color: colors.muted2 },
  proofBadge: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: "rgba(224,180,103,0.4)",
    backgroundColor: "rgba(224,180,103,0.08)",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  proofBadgeTxt: { fontFamily: fonts.semibold, fontSize: 11, color: colors.gold },
});

export default { Reveal, ProofCard, Shell, Head, st };
