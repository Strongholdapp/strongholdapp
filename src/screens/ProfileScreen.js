/* ============================================================
   ProfileScreen.js , Pattern Report / Recovery Profile (tela 2 das 7).
   "It shows you what it learned": arquétipo + o mapa do padrão dele,
   tirado direto das respostas. É o clipe de anúncio nº2.
   ============================================================ */

import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dusk, TopBar, WhoMini, Display, Sub, Eyebrow, Card, CardTitle, Pill, Banner, Check, Btn, TabBar } from "../components/ui";
import { colors, fonts, spacing } from "../theme/theme";
import { useApp } from "../state/AppContext";

const RISK_WINDOW = {
  lateNight: "10:30 PM to 12:30 AM",
  earlyMorning: "5:30 AM to 7:00 AM",
  afterWork: "6:00 PM to 8:00 PM",
  alone: "When the house goes quiet",
  varies: "Unpredictable hours",
};
const EMO_STATE = {
  stress: "Stress and pressure",
  loneliness: "Isolation",
  boredom: "Emptiness",
  anxiety: "Anxiety",
  scrolling: "Restlessness",
  urges: "Raw desire",
};
const AFTER_FALL = {
  avoidPrayer: "Avoiding prayer",
  ashamed: "Shame",
  numb: "Going numb",
  disconnected: "Pulling away",
  notMuch: "Trying to ignore it",
};
const PROTECT_TIME = {
  lateNight: "11:47 PM",
  earlyMorning: "6:15 AM",
  afterWork: "6:30 PM",
  alone: "the quiet hour",
  varies: "your weakest moment",
};

export default function ProfileScreen({ withTabs = false }) {
  const { state, go, streakDay } = useApp();
  const insets = useSafeAreaInsets();
  const p = state.plan;
  const a = state.answers || {};
  if (!p) return null;

  const rows = [
    ["Highest risk time", RISK_WINDOW[a.highRiskTime] || p.pattern.highRiskLabel],
    ["Most common trigger", p.pattern.triggerLabel],
    ["Emotional state", EMO_STATE[a.primaryTrigger] || "Stress and isolation"],
    ["After a fall", AFTER_FALL[a.faithImpact] || "Trying to ignore it"],
  ];

  return (
    <Dusk>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 6,
          paddingHorizontal: spacing.screenX,
          paddingBottom: withTabs ? 110 : 24,
        }}
      >
        <TopBar right={<WhoMini name={p.name} caption={`Day ${streakDay()} streak`} />} />

        <View style={{ marginTop: 22 }}>
          <Eyebrow>Pattern report</Eyebrow>
        </View>
        <Display gold="listening.">We've been </Display>
        <Sub>Based on your answers, here's what we've learned about your pattern.</Sub>

        <Card>
          <CardTitle>Based on your answers</CardTitle>
          {rows.map(([k, v], i) => (
            <View key={k} style={[st.row, i === rows.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={st.rowK}>
                <View style={st.dot} />
                <Text style={st.k}>{k}</Text>
              </View>
              <Text style={st.v}>{v}</Text>
            </View>
          ))}
          <View style={{ marginTop: 16 }}>
            <Pill tone="gold">Pattern confirmed</Pill>
          </View>
        </Card>

        <Card>
          <CardTitle>{p.archetype.title}</CardTitle>
          <Text style={st.archeMsg}>{p.archetype.message}</Text>
          <View style={st.scripture}>
            <Text style={st.scriptureTxt}>{p.scripture.text}</Text>
            <Text style={st.scriptureRef}>{p.scripture.ref}</Text>
          </View>
        </Card>

        <Card>
          <CardTitle>The cycle that holds you</CardTitle>
          <View style={st.cycle}>
            {(p.pattern.cycle || []).map((node, i) => (
              <React.Fragment key={i}>
                {i > 0 ? <Text style={st.arrow}>→</Text> : null}
                <View style={[st.node, i === (p.pattern.cycle || []).length - 1 && st.nodeHot]}>
                  <Text style={[st.nodeTxt, i === (p.pattern.cycle || []).length - 1 && { color: "#e98a82" }]}>
                    {node}
                  </Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        </Card>

        <Card>
          <CardTitle>Tonight, Stronghold prepares</CardTitle>
          <Check>Personalized prayer</Check>
          <Check>Scripture for this moment</Check>
          <Check>Practical 2-minute reset</Check>
        </Card>

        <Banner title={`Protection Window Active · ${PROTECT_TIME[a.highRiskTime] || "tonight"}`} />

        {!withTabs ? (
          <Btn title="See my 90-day plan" onPress={() => go("plan")} />
        ) : null}
      </ScrollView>
      {withTabs ? <TabBar active="profile" onNavigate={go} /> : null}
    </Dusk>
  );
}

const st = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.lineSoft,
    gap: 16,
  },
  rowK: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.gold },
  k: { fontFamily: fonts.body, fontSize: 14.5, color: colors.muted },
  v: { flex: 1, fontFamily: fonts.bold, fontSize: 15.5, color: colors.ink, textAlign: "right" },

  archeMsg: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24, color: colors.ink },
  scripture: {
    marginTop: 16,
    paddingLeft: 15,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
  },
  scriptureTxt: { fontFamily: fonts.serifItalic, fontSize: 17, lineHeight: 26, color: colors.ink },
  scriptureRef: { fontFamily: fonts.body, fontSize: 13, color: colors.gold, marginTop: 8 },

  cycle: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8 },
  node: { backgroundColor: "rgba(255,255,255,0.07)", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  nodeHot: { backgroundColor: "rgba(214,86,76,0.16)" },
  nodeTxt: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },
  arrow: { color: colors.gold, fontSize: 14 },
});
