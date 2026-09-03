/* ============================================================
   SOSScreen.js , o chip vermelho da Home.
   O app "fala" com o cara pelo nome, digitando ao vivo, no instante da
   tentação, e emenda direto na oração (pula o passo do bloqueio).
   ============================================================ */

import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { TopBar, Pill, Btn, CloseBtn } from "../components/ui";
import { colors, fonts, spacing } from "../theme/theme";
import { useApp } from "../state/AppContext";

export default function SOSScreen() {
  const { state, go, streakDay } = useApp();
  const insets = useSafeAreaInsets();
  const p = state.plan;
  const name = (p && p.name) || "brother";
  const day = streakDay();

  const full = useMemo(
    () =>
      [
        `${name}, stop for one second.`,
        `You've come ${day} ${day === 1 ? "day" : "days"}. That's real, and it's yours.`,
        "Don't trade it for four minutes you'll regret by morning.",
        "You're not weak. You're just alone right now, so let's not be.",
        "Breathe. I'm right here with you. Let's pray.",
      ].join("\n"),
    [name, day]
  );

  const [n, setN] = useState(0);
  const done = n >= full.length;

  useEffect(() => {
    const id = setInterval(() => {
      setN((v) => {
        if (v >= full.length) {
          clearInterval(id);
          return v;
        }
        return v + 1;
      });
    }, 34);
    return () => clearInterval(id);
  }, [full]);

  if (!p) return null;

  return (
    <LinearGradient colors={["#301722", "#0c0910"]} locations={[0, 0.62]} style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top + 18,
          paddingBottom: insets.bottom + 26,
          paddingHorizontal: spacing.screenX,
        }}
      >
        <TopBar
          right={
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Pill tone="red">● SOS live</Pill>
              <CloseBtn onPress={() => go("home")} />
            </View>
          }
        />

        <View style={{ flex: 1, justifyContent: "center" }}>
          <View style={st.halo} />
          <Text style={st.msg}>
            {full.slice(0, n)}
            {!done ? <Text style={st.caret}>|</Text> : null}
          </Text>
        </View>

        <Btn
          title={done ? "Continue to my prayer" : "Stronghold is with you..."}
          onPress={() => go("intervention", { ivStart: 1 })}
        />
      </View>
    </LinearGradient>
  );
}

const st = StyleSheet.create({
  halo: {
    position: "absolute",
    alignSelf: "center",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(192,57,43,0.12)",
  },
  msg: {
    fontFamily: fonts.serifMedium,
    fontSize: 24,
    lineHeight: 36,
    color: colors.ink,
  },
  caret: { color: colors.gold },
});
