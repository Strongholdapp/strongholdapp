/* ============================================================
   ReturnScreen.js , Return without shame (tela 6 das 7).

   Pra quem caiu: registra com honestidade, reinicia o streak SEM punição,
   volta no mesmo dia e recebe a oração de retorno (tom dado pelo faithImpact:
   shame -> conforto, resolve -> recomeço).

   Regra de copy do projeto: Deus é aliado, nunca juiz. O vício é o inimigo,
   nunca a pessoa. Voltar conta como progresso.
   ============================================================ */

import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dusk, TopBar, Display, Sub, Eyebrow, Card, CardTitle, Btn, Banner, Check } from "../components/ui";
import { colors, fonts, spacing } from "../theme/theme";
import { useApp } from "../state/AppContext";

export default function ReturnScreen() {
  const { state, go, recordRelapse, streakDay } = useApp();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const p = state.plan;
  if (!p) return null;

  // A oração de retorno é a 2a do plano (o tom oposto, o de recomeço).
  const prayer = (p.prayers && (p.prayers[1] || p.prayers[0])) || null;
  const daysBefore = streakDay();

  if (step === 0) {
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
            <Eyebrow>Return</Eyebrow>
          </View>
          <Display gold="the same day.">You come back </Display>
          <Sub>
            You fell. That is not the end of the plan, it is part of it. No lecture here, and
            nobody else has to know. Let's get you back on the same day.
          </Sub>

          <Card>
            <CardTitle>What happens now</CardTitle>
            <Check>Your streak restarts, without punishment</Check>
            <Check>
              {daysBefore === 1
                ? "The day you already walked still counts"
                : `The ${daysBefore} days you already walked still count`}
            </Check>
            <Check>Stronghold guards that moment harder next time</Check>
          </Card>

          <Card>
            <Text style={st.quote}>
              The addiction is the enemy here, not you. God is not waiting at the door with a
              list. He is waiting with an open house.
            </Text>
          </Card>

          <Btn
            title="Log it honestly and return"
            onPress={() => {
              recordRelapse();
              setStep(1);
            }}
          />
          <Btn title="Not now, take me home" variant="ghost" onPress={() => go("home")} />
        </ScrollView>
      </Dusk>
    );
  }

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
          <Eyebrow>Your prayer to return</Eyebrow>
        </View>
        <Display gold="Day 1 again.">Welcome back, </Display>

        {prayer ? (
          <Card>
            <Text style={st.prayer}>{prayer.text}</Text>
            <Text style={st.amen}>Amen.</Text>
            {prayer.verse ? <Text style={st.verse}>{prayer.verse}</Text> : null}
          </Card>
        ) : null}

        <Banner
          title="Coming back is progress."
          subtitle="Most men disappear for weeks after a fall. You came back the same day."
        />

        <Btn title="Back to my plan" onPress={() => go("home")} />
      </ScrollView>
    </Dusk>
  );
}

const st = StyleSheet.create({
  quote: { fontFamily: fonts.body, fontSize: 15.5, lineHeight: 24, color: colors.ink },
  prayer: { fontFamily: fonts.serifMedium, fontSize: 18, lineHeight: 29, color: colors.ink },
  amen: { fontFamily: fonts.serifItalic, fontSize: 19, color: colors.gold, marginTop: 16 },
  verse: {
    fontFamily: fonts.serifItalic, fontSize: 14.5, color: colors.muted,
    marginTop: 16, paddingLeft: 13, borderLeftWidth: 2, borderLeftColor: colors.gold,
  },
});
