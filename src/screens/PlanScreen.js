/* ============================================================
   PlanScreen.js , o plano de 90 dias em 4 fases (tela 3 das 7).
   Freedom date + marcos (Day 7/28/60/90) + as fases do COPY.plan.
   Saindo daqui, o próximo passo é a assinatura (Superwall).
   ============================================================ */

import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dusk, TopBar, Display, Sub, Eyebrow, Card, CardTitle, Btn } from "../components/ui";
import { colors, fonts, spacing } from "../theme/theme";
import { COPY } from "../data/copy";
import { useApp } from "../state/AppContext";
import { PAYWALL_ENABLED } from "../lib/env";

export default function PlanScreen() {
  const { state, go, restart } = useApp();
  const insets = useSafeAreaInsets();
  const p = state.plan;
  if (!p) return null;

  const PL = COPY.plan || {};
  const milestones = PL.milestones || ["Day 7", "Day 28", "Day 60", "Day 90"];

  return (
    <Dusk>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 18,
          paddingHorizontal: spacing.screenX,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <TopBar />
        <View style={{ marginTop: 22 }}>
          <Eyebrow>Your plan</Eyebrow>
        </View>
        <Display gold="Stronghold plan.">Your 90-day </Display>

        <Card>
          <View style={{ alignItems: "center", marginTop: 8 }}>
            <Text style={st.fl}>YOUR FREEDOM DATE</Text>
            <Text style={st.fv}>{p.freedomDate}</Text>
          </View>

          <View style={st.timeline}>
            {milestones.map((m, i) => (
              <View key={m} style={st.mile}>
                {i < milestones.length - 1 ? <View style={st.mileLine} /> : null}
                <View style={st.mileDot} />
                <Text style={st.mileTxt}>{m}</Text>
              </View>
            ))}
          </View>

          {PL.milestoneCaption ? (
            <Sub style={{ textAlign: "center", marginTop: 16 }}>{PL.milestoneCaption}</Sub>
          ) : null}
        </Card>

        <Card>
          <CardTitle>The four phases</CardTitle>
          {(p.phases || []).map((ph, i) => (
            <View key={i} style={[st.phase, i === (p.phases || []).length - 1 && { borderBottomWidth: 0 }]}>
              <View style={st.num}>
                <Text style={st.numTxt}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={st.pt}>{ph.title}</Text>
                <Text style={st.pd}>{ph.days}</Text>
              </View>
            </View>
          ))}
        </Card>

        <Sub style={{ marginTop: 18 }}>
          This is the plan. Next: the system that runs it for you, at the exact moment you are
          most likely to fall.
        </Sub>

        <Btn
          title="Enter Stronghold"
          onPress={() => go(PAYWALL_ENABLED && !state.subscribed ? "paywall" : "home")}
        />
        <Btn title="Start over" variant="ghost" onPress={restart} />
      </ScrollView>
    </Dusk>
  );
}

const st = StyleSheet.create({
  fl: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, letterSpacing: 1.1 },
  fv: { fontFamily: fonts.serif, fontSize: 23, color: colors.gold, marginTop: 6, textAlign: "center" },

  timeline: { flexDirection: "row", justifyContent: "space-between", marginTop: 18 },
  mile: { flex: 1, alignItems: "center" },
  mileLine: {
    position: "absolute",
    top: 7,
    left: "50%",
    right: -50,
    height: 2,
    backgroundColor: colors.line,
  },
  mileDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: colors.gold, marginBottom: 8 },
  mileTxt: { fontFamily: fonts.semibold, fontSize: 12, color: colors.muted },

  phase: {
    flexDirection: "row",
    gap: 14,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lineSoft,
  },
  num: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: colors.gold,
    alignItems: "center", justifyContent: "center",
  },
  numTxt: { fontFamily: fonts.bold, fontSize: 14, color: colors.onGold },
  pt: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 22, color: colors.ink },
  pd: { fontFamily: fonts.body, fontSize: 13.5, color: colors.muted, marginTop: 3 },
});
