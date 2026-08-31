import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Screen, Btn } from "../components/ui";
import { Logo } from "../components/Icons";
import { colors, fonts } from "../theme/theme";
import { useApp } from "../state/AppContext";

export default function WelcomeScreen() {
  const { go, update } = useApp();

  return (
    <Screen style={st.wrap}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Logo size={66} />
        <Text style={st.stars}>★★★★★</Text>
        <Text style={st.title}>Welcome to Stronghold</Text>
        <Text style={st.sub}>
          Let's find out your pattern, and build the plan that finally breaks it.
        </Text>
      </View>

      <Btn
        title="Start the test"
        onPress={() => {
          update({ qIndex: 0 });
          go("quiz");
        }}
      />
      <Text style={st.foot}>100% private. No judgment. Takes 60 seconds.</Text>
    </Screen>
  );
}

const st = StyleSheet.create({
  wrap: { alignItems: "stretch" },
  stars: { color: colors.gold, fontSize: 20, letterSpacing: 3, marginTop: 14 },
  title: {
    fontFamily: fonts.serif,
    fontSize: 40,
    lineHeight: 46,
    color: colors.ink,
    marginTop: 14,
    textAlign: "center",
  },
  sub: {
    fontFamily: fonts.body,
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
    maxWidth: 300,
    textAlign: "center",
  },
  foot: {
    fontFamily: fonts.body,
    color: colors.muted,
    fontSize: 13,
    marginTop: 14,
    textAlign: "center",
  },
});
