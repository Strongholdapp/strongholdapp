/* ============================================================
   LoadingScreen.js , "Identifying your relapse pattern...".
   Os passos acendem um a um enquanto o motor gera o plano de verdade.
   ============================================================ */

import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { Screen } from "../components/ui";
import { colors, fonts } from "../theme/theme";
import { COPY } from "../data/copy";
import { useApp } from "../state/AppContext";

export default function LoadingScreen() {
  const { finishQuiz } = useApp();
  const L = COPY.loading || { title: "Identifying your relapse pattern...", steps: [] };
  const steps = L.steps || [];
  const [lit, setLit] = useState(0);
  const spin = useRef(new Animated.Value(0)).current;
  const done = useRef(false);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spin]);

  useEffect(() => {
    let i = 0;
    const timers = [];
    const tick = () => {
      if (i < steps.length) {
        i += 1;
        setLit(i);
        timers.push(setTimeout(tick, 850));
      } else if (!done.current) {
        done.current = true;
        timers.push(setTimeout(() => finishQuiz(), 500));
      }
    };
    timers.push(setTimeout(tick, 500));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  return (
    <Screen style={{ alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={[st.spinner, { transform: [{ rotate }] }]} />
      <Text style={st.title}>{L.title}</Text>
      <View style={st.steps}>
        {steps.map((s, i) => {
          const on = i < lit;
          return (
            <View key={i} style={[st.step, on && { opacity: 1 }]}>
              <View style={[st.tick, on && st.tickOn]}>
                <Text style={[st.tickTxt, on && { color: colors.onGold }]}>✓</Text>
              </View>
              <Text style={[st.stepTxt, on && { color: colors.ink }]}>{s.text}</Text>
            </View>
          );
        })}
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  spinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "rgba(224,180,103,0.25)",
    borderTopColor: colors.gold,
    marginBottom: 26,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 21,
    lineHeight: 27,
    color: colors.ink,
    textAlign: "center",
    maxWidth: 280,
    marginBottom: 28,
  },
  steps: { width: "100%", maxWidth: 320, gap: 14 },
  step: { flexDirection: "row", alignItems: "center", gap: 12, opacity: 0.35 },
  tick: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  tickOn: { backgroundColor: colors.gold, borderColor: colors.gold },
  tickTxt: { fontSize: 11, color: "transparent", fontFamily: fonts.bold },
  stepTxt: { flex: 1, fontFamily: fonts.body, fontSize: 15, color: colors.muted },
});
