/* ============================================================
   YouScreen.js , a aba "Profile" (ajustes).
   Perfil, atalho pro Return sem vergonha, modo demo pra gravar anúncio
   (força o streak em 30/90 dias) e recomeço do zero.
   ============================================================ */

import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dusk, TopBar, Display, Sub, Eyebrow, Card, CardTitle, Btn, TabBar, Pill } from "../components/ui";
import { colors, fonts, radius, spacing } from "../theme/theme";
import { useApp } from "../state/AppContext";

export default function YouScreen() {
  const { state, go, restart, streakDay, setDemoDay } = useApp();
  const insets = useSafeAreaInsets();
  const p = state.plan;
  if (!p) return null;

  const rows = [
    ["Archetype", p.archetype.title],
    ["Main trigger", p.pattern.triggerLabel],
    ["Highest risk", p.pattern.highRiskLabel],
    ["Frequency", p.pattern.frequencyLabel || "—"],
    ["Freedom date", p.freedomDate],
  ];

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
        <TopBar right={<Pill tone="gold">{`Day ${streakDay()}`}</Pill>} />

        <View style={{ marginTop: 22 }}>
          <Eyebrow>Your profile</Eyebrow>
        </View>
        <Display gold={p.name + "."}>Hello, </Display>
        <Sub>Everything here lives on this device. Your name never leaves it, and nothing here is shared with other users.</Sub>

        <Card>
          <CardTitle>Your pattern</CardTitle>
          {rows.map(([k, v], i) => (
            <View key={k} style={[st.row, i === rows.length - 1 && { borderBottomWidth: 0 }]}>
              <Text style={st.k}>{k}</Text>
              <Text style={st.v}>{v}</Text>
            </View>
          ))}
        </Card>

        <Card>
          <CardTitle>After a fall</CardTitle>
          <Sub style={{ marginTop: 0 }}>
            Fell? Come back the same day. No shame, no lecture, and your progress still counts.
          </Sub>
          <Btn title="Return without shame" variant="dark" onPress={() => go("return")} />
        </Card>

        {__DEV__ ? (
          <Card>
            <CardTitle>Demo mode (for recording)</CardTitle>
            <Sub style={{ marginTop: 0 }}>
              Forces the streak number, so the Home screen can be filmed at any day. Off by default.
              Dev builds only , never ships to the App Store.
            </Sub>
            <View style={st.demoRow}>
              {[0, 30, 90].map((n) => (
                <Pressable
                  key={n}
                  style={[st.demoBtn, state.demoDay === n && st.demoOn, n === 0 && !state.demoDay && st.demoOn]}
                  onPress={() => setDemoDay(n)}
                >
                  <Text style={st.demoTxt}>{n === 0 ? "Off" : `Day ${n}`}</Text>
                </Pressable>
              ))}
            </View>
          </Card>
        ) : null}

        <Btn
          title="Start over"
          variant="ghost"
          onPress={() =>
            Alert.alert(
              "Start over?",
              "This erases your answers, your plan and your streak from this device.",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Start over", style: "destructive", onPress: restart },
              ]
            )
          }
        />
      </ScrollView>

      <TabBar active="you" onNavigate={go} />
    </Dusk>
  );
}

const st = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.lineSoft,
    gap: 16,
  },
  k: { fontFamily: fonts.body, fontSize: 14.5, color: colors.muted },
  v: { flex: 1, fontFamily: fonts.bold, fontSize: 15, color: colors.ink, textAlign: "right" },
  demoRow: { flexDirection: "row", gap: 10, marginTop: 14 },
  demoBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
  },
  demoOn: { borderColor: colors.gold, backgroundColor: "rgba(224,180,103,0.1)" },
  demoTxt: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
});
