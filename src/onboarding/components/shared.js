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
import { REVIEWS, REVIEW_PHOTOS, PROOF_GROUPS, PROOF_TITLES } from "../proof";

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
/* ---------- Avaliação: 5 estrelas + "5/5" ----------
   Vem do funil web (reviewCardHTML e as stars-row do quiz.js). Aqui entra
   como AVALIAÇÃO, com a nota escrita ao lado: nos cards de depoimento fica
   embaixo, depois do nome, que é a leitura natural de "fulano avaliou".

   Não confundir com a nota da App Store: essa é `screen.rating`, que segue
   `APP_RATING = null` em proof.js até existir avaliação real na loja. Não
   preencher com número inventado. ---------- */
export function Stars({ size = 13, center, style }) {
  return (
    <View style={[st.starsRow, center && { justifyContent: "center" }, style]}>
      <Text accessible={false} importantForAccessibility="no" style={[st.stars, { fontSize: size }]}>
        ★★★★★
      </Text>
      <Text style={[st.starsScore, { fontSize: Math.max(10.5, size - 2) }]}>5/5</Text>
    </View>
  );
}

export function ProofCard({ id, tag, compact }) {
  const r = REVIEWS[id];
  if (!r) return null; // sem depoimento real, não inventa nada
  const photo = REVIEW_PHOTOS[r.photo];

  return (
    <View style={[st.proof, compact && { padding: 14 }]}>
      {tag ? <Text style={st.proofTag}>{String(tag).toUpperCase()}</Text> : null}
      {/* compact corta em 4 linhas: onde o depoimento é acessório (tela do
          reset, por exemplo) ele não pode dominar a tela. */}
      <Text
        style={[st.proofText, compact && { fontSize: 14.5, lineHeight: 22 }]}
        numberOfLines={compact ? 4 : undefined}
      >
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
      {/* A avaliação fecha o card, depois de quem avaliou. */}
      <Stars />
    </View>
  );
}


/* ---------- Carrossel de depoimentos ----------
   Mesmo formato do funil (reviewMarqueeHTML): cards lado a lado, deslize
   horizontal. `group` puxa de PROOF_GROUPS, então a estratégia de quem
   aparece onde mora em proof.js, num lugar só.

   hideBadges existe porque o funil não mostra "91 days free" no começo do
   quiz de propósito: prova de duração antes de a pessoa entender o produto
   soa inventada. Cedo sem badge, no paywall com badge. ---------- */
export function ProofMarquee({ group, title, hideBadges }) {
  const ids = (PROOF_GROUPS[group] || []).filter((id) => REVIEWS[id]);
  if (!ids.length) return null;
  const heading = title || PROOF_TITLES[group];

  return (
    <View style={{ marginTop: 18 }}>
      {heading ? <Text style={st.marqueeTitle}>{heading}</Text> : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={286}
        contentContainerStyle={{ paddingRight: 8 }}
      >
        {ids.map((id) => {
          const r = REVIEWS[id];
          const photo = REVIEW_PHOTOS[r.photo];
          return (
            <View key={id} style={st.marqueeCard}>
              <Text style={st.proofText} numberOfLines={7}>
                “{r.text}”
              </Text>
              <View style={st.proofFoot}>
                {photo ? <Image source={photo} style={st.proofPhoto} /> : null}
                <View style={{ flex: 1 }}>
                  <Text style={st.proofName}>{r.name}</Text>
                  <Text style={st.proofLoc}>{r.location}</Text>
                </View>
              </View>
              {!hideBadges && r.badge ? (
                <View style={[st.proofBadge, { alignSelf: "flex-start", marginTop: 10 }]}>
                  <Text style={st.proofBadgeTxt}>{r.badge}</Text>
                </View>
              ) : null}
              <Stars />
            </View>
          );
        })}
      </ScrollView>
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

  marqueeTitle: {
    fontFamily: fonts.bold,
    fontSize: 11.5,
    letterSpacing: 1.4,
    color: colors.gold,
    marginBottom: 12,
  },
  marqueeCard: {
    width: 274,
    marginRight: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: 16,
  },

  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 12,
  },
  stars: { color: colors.gold, letterSpacing: 2 },
  starsScore: { fontFamily: fonts.semibold, color: colors.muted },
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

export default { Reveal, ProofCard, ProofMarquee, Shell, Head, st };
