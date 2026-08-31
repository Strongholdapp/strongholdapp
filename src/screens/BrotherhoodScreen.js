/* ============================================================
   BrotherhoodScreen.js , a aba da comunidade.
   v1 é vitrine (feed de histórias) e ponte pra comunidade privada de fora.
   Postar de dentro do app fica pra depois: fora do escopo da v1.
   ============================================================ */

import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dusk, TopBar, Display, Sub, Eyebrow, Pill, TabBar } from "../components/ui";
import { colors, fonts, radius, spacing } from "../theme/theme";
import { COPY } from "../data/copy";
import { useApp } from "../state/AppContext";

const FALLBACK_POSTS = [
  {
    name: "Marcus",
    status: "Day 14",
    quote:
      "Last night Stronghold warned me before I started scrolling. This time I used the reset instead.",
    encouragements: "Encouraged by 23 brothers",
  },
  {
    name: "Daniel",
    status: "Day 31",
    quote:
      "First night in months that I recognized the pattern before it got stronger. I didn't need more willpower.",
    encouragements: "Encouraged by 40 brothers",
  },
];

export default function BrotherhoodScreen() {
  const { state, go } = useApp();
  const insets = useSafeAreaInsets();
  const p = state.plan || { name: "Brother" };
  const C = COPY.interstitialCommunity || {};
  const posts = C.posts && C.posts.length ? C.posts : FALLBACK_POSTS;

  return (
    <Dusk>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 6,
          paddingHorizontal: spacing.screenX,
          paddingBottom: 110,
        }}
      >
        <TopBar right={<Pill>🔒 Private</Pill>} />

        <View style={{ marginTop: 22 }}>
          <Eyebrow>Brotherhood</Eyebrow>
        </View>
        <Display gold="fight this alone.">You don't have to </Display>
        <Sub>
          A private community of Christian men learning to recognize patterns, stand firm, and
          return to God, one day at a time.
        </Sub>

        <Text style={st.divider}>REAL STORIES FROM THE BROTHERHOOD</Text>

        {posts.map((po, i) => (
          <View key={i} style={st.post}>
            <View style={st.head}>
              <View style={st.av}>
                <Text style={st.avTxt}>{String(po.name).charAt(0)}</Text>
              </View>
              <View>
                <Text style={st.pn}>{po.name}</Text>
                <Text style={st.pd}>{po.status}</Text>
              </View>
            </View>
            <Text style={st.body}>{po.quote}</Text>
            <Text style={st.enc}>🙏 {po.encouragements}</Text>
          </View>
        ))}
      </ScrollView>

      <TabBar active="brotherhood" onNavigate={go} />
    </Dusk>
  );
}

const st = StyleSheet.create({
  divider: {
    textAlign: "center", fontFamily: fonts.bold, fontSize: 11, letterSpacing: 1.3,
    color: colors.muted2, marginTop: 22, marginBottom: 4,
  },
  post: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: 16,
    marginTop: 12,
  },
  head: { flexDirection: "row", alignItems: "center", gap: 10 },
  av: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: "rgba(224,180,103,0.2)",
    alignItems: "center", justifyContent: "center",
  },
  avTxt: { fontFamily: fonts.bold, fontSize: 15, color: colors.gold },
  pn: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  pd: { fontFamily: fonts.body, fontSize: 12.5, color: colors.gold },
  body: { fontFamily: fonts.body, fontSize: 14.5, lineHeight: 22, color: colors.muted, marginTop: 10 },
  enc: { fontFamily: fonts.body, fontSize: 12.5, color: colors.muted2, marginTop: 12 },
});
