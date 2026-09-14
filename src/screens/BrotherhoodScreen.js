/* ============================================================
   BrotherhoodScreen.js , a aba da comunidade.
   v1 é vitrine (feed de histórias reais) e ponte pra comunidade privada de
   fora. Postar de dentro do app fica pra depois: fora do escopo da v1.

   Os posts vêm de proof.js (grupo "brotherhood": Daniel, Noah, Matthew) ,
   os mesmos depoimentos reais e autorizados usados no funil e no
   onboarding. Nada de "encouragements" inventado: a auditoria pré-submissão
   pegou os dois posts fixos com contador fabricado que estavam aqui antes,
   e a badge de dias (quando existe) já é dado real do depoimento.
   ============================================================ */

import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dusk, TopBar, Display, Sub, Eyebrow, Pill, TabBar, useTabBarSpace } from "../components/ui";
import { colors, fonts, radius, spacing } from "../theme/theme";
import { REVIEWS, REVIEW_PHOTOS, PROOF_GROUPS } from "../onboarding/proof";
import { useApp } from "../state/AppContext";

export default function BrotherhoodScreen() {
  const { state, go } = useApp();
  const insets = useSafeAreaInsets();
  const tabBarSpace = useTabBarSpace();
  const p = state.plan || { name: "Brother" };
  const posts = (PROOF_GROUPS.brotherhood || [])
    .map((id) => REVIEWS[id])
    .filter(Boolean);

  return (
    <Dusk>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 6,
          paddingHorizontal: spacing.screenX,
          paddingBottom: tabBarSpace,
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

        {posts.map((r) => {
          const photo = REVIEW_PHOTOS[r.photo];
          return (
            <View key={r.id} style={st.post}>
              <View style={st.head}>
                {photo ? (
                  <Image source={photo} style={st.avImg} />
                ) : (
                  <View style={st.av}>
                    <Text style={st.avTxt}>{String(r.name).charAt(0)}</Text>
                  </View>
                )}
                <View>
                  <Text style={st.pn}>{r.name}</Text>
                  <Text style={st.pd}>{r.location}</Text>
                </View>
              </View>
              <Text style={st.body}>{r.text}</Text>
              {r.badge ? <Text style={st.enc}>{r.badge}</Text> : null}
            </View>
          );
        })}
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
  avImg: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.card2 },
  avTxt: { fontFamily: fonts.bold, fontSize: 15, color: colors.gold },
  pn: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  pd: { fontFamily: fonts.body, fontSize: 12.5, color: colors.gold },
  body: { fontFamily: fonts.body, fontSize: 14.5, lineHeight: 22, color: colors.muted, marginTop: 10 },
  enc: { fontFamily: fonts.body, fontSize: 12.5, color: colors.muted2, marginTop: 12 },
});
