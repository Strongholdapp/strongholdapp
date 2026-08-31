/* ============================================================
   PaywallScreen.js , a assinatura (Superwall + StoreKit).

   A tela em si é a "pré-paywall": mostra o valor do sistema de 90 dias com o
   nome e o padrão DELE, e dispara o paywall do Superwall (que é onde os
   produtos da App Store aparecem e a compra acontece).

   Sem a public key do Superwall configurada, esta tela avisa e deixa passar,
   pra o app rodar inteiro em desenvolvimento e na gravação de anúncio.

   Compliance Apple: a compra é 100% StoreKit via Superwall. Nada de link
   externo de pagamento dentro do app.
   ============================================================ */

import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dusk, TopBar, Display, Sub, Eyebrow, Card, CardTitle, Check, Btn, Pill } from "../components/ui";
import { colors, fonts, spacing } from "../theme/theme";
import { COPY } from "../data/copy";
import { useApp } from "../state/AppContext";
import { presentPaywall } from "../lib/superwall";
import { hasSuperwall, SUPERWALL_PLACEMENT } from "../lib/env";
import { logEvent } from "../lib/supabase";

export default function PaywallScreen() {
  const { state, go, setSubscribed } = useApp();
  const insets = useSafeAreaInsets();
  const [busy, setBusy] = useState(false);
  const p = state.plan;
  if (!p) return null;

  const PW = COPY.paywall || {};
  const checks = PW.systemChecks || [];
  const momentPhrase =
    (PW.momentPhrases && PW.momentPhrases[state.answers.highRiskTime]) ||
    "the exact moment it hits";
  const prayerFree = (PW.prayerFreeLine || "").replace("{momentPhrase}", momentPhrase);

  async function unlock() {
    setBusy(true);
    logEvent("paywall_cta", "paywall", { placement: SUPERWALL_PLACEMENT });
    const res = await presentPaywall(SUPERWALL_PLACEMENT, {
      firstName: p.name,
      archetype: p.archetype.title,
      trigger: p.pattern.triggerLabel,
      freedomDate: p.freedomDate,
    });
    setBusy(false);
    // Sem chave/módulo: segue o app (modo dev e gravação de anúncio).
    if (res.skipped) {
      setSubscribed(true);
      go("home");
      return;
    }
    // Com Superwall, o SDK controla a compra. O gate real de entitlement
    // entra aqui quando os produtos estiverem aprovados na App Store.
    setSubscribed(true);
    go("home");
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
        <TopBar right={<Pill tone="gold">Ready</Pill>} />

        <View style={{ marginTop: 22 }}>
          <Eyebrow>Your system</Eyebrow>
        </View>
        <Display gold="is ready.">{`${p.name}, your 90-day plan `}</Display>
        <Sub>
          {PW.freedomLabel || "Your freedom date:"} <Text style={st.free}>{p.freedomDate}</Text>
        </Sub>

        <Card>
          <CardTitle>{PW.systemTitle || "Your 90-Day Stronghold System"}</CardTitle>
          {checks.map((c) => (
            <Check key={c}>{c}</Check>
          ))}
        </Card>

        {prayerFree ? (
          <Card>
            <Text style={st.quote}>{prayerFree}</Text>
          </Card>
        ) : null}

        <Card>
          <CardTitle>{PW.guaranteeCardTitle || "Money-Back Guarantee"}</CardTitle>
          <Text style={st.body}>{PW.guaranteeCardBody}</Text>
        </Card>

        {busy ? (
          <ActivityIndicator color={colors.gold} style={{ marginTop: 24 }} />
        ) : (
          <Btn title={PW.stickyCta || "Get My 90-Day Plan"} onPress={unlock} />
        )}
        <Text style={st.fine}>{PW.discretion || "Purchase appears discretely · Cancel Anytime"}</Text>

        {!hasSuperwall() ? (
          <Text style={st.devnote}>
            Superwall key not set. This build continues without a purchase, so the whole app can be
            tested. Add EXPO_PUBLIC_SUPERWALL_API_KEY to turn the real paywall on.
          </Text>
        ) : null}
      </ScrollView>
    </Dusk>
  );
}

const st = StyleSheet.create({
  free: { fontFamily: fonts.serif, color: colors.gold },
  quote: { fontFamily: fonts.body, fontSize: 15.5, lineHeight: 24, color: colors.ink },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 23, color: colors.muted },
  fine: {
    fontFamily: fonts.body, fontSize: 12.5, color: colors.muted2,
    textAlign: "center", marginTop: 12,
  },
  devnote: {
    fontFamily: fonts.body, fontSize: 12, color: colors.muted2,
    textAlign: "center", marginTop: 22, lineHeight: 18,
  },
});
