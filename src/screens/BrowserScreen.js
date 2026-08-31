/* ============================================================
   BrowserScreen.js , Content filter + navegador seguro (tela 7 das 7).

   Rota A (a do PWA, e a que grava o clipe): o "site adulto" é uma paródia
   de milho 🌽 que a gente controla. Ao tocar/digitar algo que casa com o
   filtro, a paródia aparece por 1,9s e o Stronghold barra, emendando na
   INTERVENÇÃO.

   Rota B (fase 2, nativa): bloqueio DE VERDADE no Safari via Screen Time
   API / Family Controls. Não entra na v1.

   Compliance: usar 🌽 no lugar da palavra "porn" e nada de nudez, aqui e no
   texto público da App Store.
   ============================================================ */

import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dusk, Sub, Pill, TabBar } from "../components/ui";
import { colors, fonts, radius } from "../theme/theme";
import { useApp } from "../state/AppContext";
import { logEvent } from "../lib/supabase";

const BLOCK_RE = /porn|xxx|corn|adult|sex|hub|xvid|onlyfans|nsfw|nude/i;

const MARKS = [
  { key: "safe", emoji: "📖", label: "Bible" },
  { key: "safe", emoji: "🙏", label: "YouVersion" },
  { key: "safe", emoji: "🎧", label: "Sermons" },
  { key: "block", emoji: "🌽", label: "CornTube" },
  { key: "safe", emoji: "📰", label: "News" },
  { key: "block", emoji: "🌽", label: "Hot Feed" },
];

export default function BrowserScreen() {
  const { go } = useApp();
  const insets = useSafeAreaInsets();
  const [tripped, setTripped] = useState(false);
  const [url, setUrl] = useState("");
  const timer = useRef(null);

  useEffect(() => () => timer.current && clearTimeout(timer.current), []);

  const trip = () => {
    setTripped(true);
    logEvent("filter_tripped", "browser");
    timer.current = setTimeout(() => go("intervention", { ivStart: 0 }), 1900);
  };

  if (tripped) return <Parody insets={insets} />;

  return (
    <Dusk>
      <View style={[st.chrome, { paddingTop: insets.top + 12 }]}>
        <Text style={st.ico}>‹</Text>
        <Text style={st.ico}>›</Text>
        <View style={st.urlWrap}>
          <Text style={st.lock}>🔒</Text>
          <TextInput
            style={st.urlInput}
            value={url}
            onChangeText={setUrl}
            placeholder="Search or enter address"
            placeholderTextColor={colors.muted2}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="go"
            onSubmitEditing={() => {
              if (BLOCK_RE.test(url)) trip();
            }}
          />
        </View>
        <Text style={st.ico}>⤴</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 110 }}>
        <Pill tone="green">🛡️ Content filter active</Pill>
        <Text style={st.bmTitle}>FREQUENTLY VISITED</Text>
        <View style={st.grid}>
          {MARKS.map((m, i) => (
            <Pressable
              key={i}
              style={({ pressed }) => [st.bm, pressed && { transform: [{ scale: 0.96 }] }]}
              onPress={() => (m.key === "block" ? trip() : null)}
            >
              <Text style={st.bmi}>{m.emoji}</Text>
              <Text style={st.bml}>{m.label}</Text>
            </Pressable>
          ))}
        </View>
        <Sub style={{ fontSize: 13, marginTop: 22 }}>
          Try typing a site or tapping one. Stronghold blocks the ones that lead you back.
        </Sub>
      </ScrollView>

      <TabBar active="protection" onNavigate={go} />
    </Dusk>
  );
}

/* Paródia do "site": aparece por um instante e o filtro fecha a porta. */
function Parody({ insets }) {
  const cards = [1, 2, 3, 4, 5, 6];
  return (
    <View style={st.parody}>
      <View style={[st.parodyBar, { paddingTop: insets.top + 14 }]}>
        <Text style={st.pbTitle}>🌽 CornTube</Text>
        <Text style={st.pbUrl}>corntube.website</Text>
      </View>
      <Text style={st.parodyTag}>Hot Corn Videos Worldwide</Text>
      <View style={st.pvGrid}>
        {cards.map((i) => (
          <View key={i} style={{ width: "47%" }}>
            <View style={st.pvThumb}>
              <Text style={{ fontSize: 40 }}>🌽</Text>
            </View>
            <Text style={st.pvt}>Corn video {i}</Text>
            <Text style={st.pvm}>HD · {1 + i}M views</Text>
          </View>
        ))}
      </View>
      <Text style={st.parodyLoading}>Loading...</Text>
    </View>
  );
}

const st = StyleSheet.create({
  chrome: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingBottom: 12,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderBottomWidth: 1,
    borderBottomColor: colors.lineSoft,
  },
  ico: { color: colors.muted2, fontSize: 17 },
  urlWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  lock: { fontSize: 12, color: colors.green },
  urlInput: { flex: 1, paddingVertical: 9, fontFamily: fonts.body, fontSize: 14, color: colors.ink },

  bmTitle: {
    fontFamily: fonts.bold, fontSize: 12.5, letterSpacing: 1,
    color: colors.muted, marginTop: 24, marginBottom: 12,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 14 },
  bm: {
    width: "30%",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    paddingVertical: 16,
    alignItems: "center",
    gap: 8,
  },
  bmi: { fontSize: 28 },
  bml: { fontFamily: fonts.semibold, fontSize: 12.5, color: colors.ink },

  parody: { flex: 1, backgroundColor: "#0a0a0a" },
  parodyBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#111",
  },
  pbTitle: { fontFamily: fonts.extrabold, color: "#f5c518", fontSize: 18 },
  pbUrl: { fontFamily: fonts.body, fontSize: 12, color: "#888" },
  parodyTag: { fontFamily: fonts.semibold, fontSize: 14, color: "#ccc", padding: 16, paddingBottom: 8 },
  pvGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, paddingHorizontal: 16 },
  pvThumb: {
    aspectRatio: 16 / 10,
    backgroundColor: "#1c1c1c",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  pvt: { fontFamily: fonts.body, fontSize: 13, color: "#ddd", marginTop: 6 },
  pvm: { fontFamily: fonts.body, fontSize: 11, color: "#777" },
  parodyLoading: { textAlign: "center", color: "#888", padding: 18, fontFamily: fonts.body, fontSize: 13 },
});
