/* ============================================================
   MaxProtectionScreen.js , o bloqueio DE VERDADE.

   É o mesmo mecanismo que o app 1.0 usava e que a Apple já aprovou: um
   perfil de configuração (maxprotect.mobileconfig) que aponta o DNS do
   aparelho pro Cloudflare Family (1.1.1.3). A partir daí, conteúdo adulto
   é barrado NO APARELHO INTEIRO, em qualquer app e qualquer navegador,
   não só dentro do Stronghold.

   Três coisas importantes, e todas estão escritas na tela pro usuário:

   1. A instalação é MANUAL. O app abre o Safari com o perfil, e a pessoa
      confirma em Ajustes. Nada é instalado em silêncio, e é isso que
      mantém o fluxo dentro das regras da Apple.
   2. Ela pode remover quando quiser, com a senha do aparelho. Não é uma
      armadilha, e prometer que é seria mentira.
   3. Isso é uma camada diferente da Intervenção. O DNS bloqueia sozinho e
      em silêncio; a Intervenção (oração + reset) é acionada por ela no
      momento da tentação. Vender as duas como a mesma coisa foi o que
      gerava incoerência entre a copy e o produto.

   Nada aqui é enviado pra gente: o app só abre uma URL.
   ============================================================ */

import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dusk, Btn, Pill, Sub, TabBar } from "../components/ui";
import { colors, fonts, radius } from "../theme/theme";
import { useApp } from "../state/AppContext";
import { logEvent } from "../lib/supabase";

export const MAXPROTECT_URL = "https://livestronghold.app/maxprotect.mobileconfig";

const STEPS = [
  {
    n: 1,
    title: "Tap the button below",
    body: "Safari opens and downloads the Stronghold Content Filter profile.",
  },
  {
    n: 2,
    title: "Open Settings",
    body: "A banner says “Profile Downloaded”. Tap it, or go to Settings and it will be at the top.",
  },
  {
    n: 3,
    title: "Tap Install, then enter your passcode",
    body: "iOS asks twice to confirm. That is normal for any profile.",
  },
];

export default function MaxProtectionScreen() {
  const { go } = useApp();
  const insets = useSafeAreaInsets();
  const [opened, setOpened] = useState(false);

  const openProfile = async () => {
    logEvent("maxprotect_open", "protection", { url: MAXPROTECT_URL });
    setOpened(true);
    try {
      await Linking.openURL(MAXPROTECT_URL);
    } catch (e) {
      // Sem internet ou Safari indisponível: a tela continua explicando o
      // caminho manual em vez de travar sem dizer nada.
      setOpened(false);
    }
  };

  return (
    <Dusk>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 18,
          paddingHorizontal: 20,
          paddingBottom: 120,
        }}
      >
        <Pill tone="gold">🛡️ Maximum Protection</Pill>

        <Text style={st.h1}>Block it on the whole phone.</Text>
        <Text style={st.lede}>
          This turns on a content filter at the network level. Adult sites stop loading in every
          app and every browser on this iPhone, not just inside Stronghold.
        </Text>

        <View style={st.card}>
          <Text style={st.cardLabel}>HOW IT WORKS</Text>
          <Text style={st.cardBody}>
            Stronghold gives you a configuration profile that points your phone at Cloudflare's
            family DNS. Your phone stops resolving adult domains, so the page never loads.
          </Text>
          <Text style={st.cardBody}>
            You install it yourself in Settings, and you can remove it any time with your
            passcode. Nothing is installed silently, and nothing about your browsing is sent to us.
          </Text>
        </View>

        {/* Versão HONESTA do "difícil de desativar" que o Lucas pediu duas
            vezes. O iOS não deixa um app impedir a remoção de um perfil, e
            dizer que é impossível seria mentira pra quem está comprando por
            causa disso , além de contradizer as notas de revisão da Apple.
            O que É verdade: remover exige Ajustes e a senha, ou seja, não
            acontece no impulso. E dar a senha a um parceiro de
            responsabilidade é o que torna a remoção realmente difícil. */}
        <View style={st.card}>
          <Text style={st.cardLabel}>HARD TO UNDO IN THE MOMENT</Text>
          <Text style={st.cardBody}>
            Removing it is not one tap. It takes going into Settings and typing your device
            passcode , which is not something you do in the middle of an urge.
          </Text>
          <Text style={st.cardBody}>
            Want it harder still? Have your accountability partner set the passcode. Then taking
            the protection off stops being a decision you can make alone at 1 a.m.
          </Text>
        </View>

        <Text style={st.stepsTitle}>THREE STEPS</Text>
        {STEPS.map((s2) => (
          <View key={s2.n} style={st.stepRow}>
            <View style={st.stepNum}>
              <Text style={st.stepNumTxt}>{s2.n}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={st.stepTitle}>{s2.title}</Text>
              <Text style={st.stepBody}>{s2.body}</Text>
            </View>
          </View>
        ))}

        <Btn
          title={opened ? "Open Safari again" : "Turn on Maximum Protection"}
          onPress={openProfile}
        />

        {opened ? (
          <Text style={st.after}>
            Finish the install in Settings. Come back here when you are done, and try a blocked
            site in Safari to see it working.
          </Text>
        ) : null}

        <View style={st.divider} />

        <Text style={st.secondTitle}>This is one of two layers</Text>
        <Text style={st.secondBody}>
          Maximum Protection blocks quietly, all the time, without you doing anything. The
          Intervention is the other half: when the pull hits, you open Stronghold and it walks you
          through a prayer written for your moment and a two minute reset.
        </Text>
        <Pressable onPress={() => go("browser")} hitSlop={10}>
          <Text style={st.link}>See how the Intervention works</Text>
        </Pressable>
        <Pressable onPress={() => go("home")} hitSlop={10}>
          <Text style={[st.link, { color: colors.muted }]}>Back to Home</Text>
        </Pressable>

        <Sub style={{ fontSize: 12.5, marginTop: 22 }}>
          Filtering is provided by Cloudflare's public family DNS resolver. Stronghold does not see
          or store the sites you visit.
        </Sub>
      </ScrollView>

      <TabBar active="protection" onNavigate={go} />
    </Dusk>
  );
}

const st = StyleSheet.create({
  h1: {
    fontFamily: fonts.serif,
    fontSize: 30,
    lineHeight: 37,
    color: colors.ink,
    marginTop: 14,
    letterSpacing: -0.2,
  },
  lede: {
    fontFamily: fonts.body,
    fontSize: 15.5,
    lineHeight: 24,
    color: colors.muted,
    marginTop: 10,
  },
  card: {
    marginTop: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: 18,
  },
  cardLabel: {
    fontFamily: fonts.bold,
    fontSize: 10.5,
    letterSpacing: 1.4,
    color: colors.gold,
    marginBottom: 10,
  },
  cardBody: {
    fontFamily: fonts.body,
    fontSize: 14.5,
    lineHeight: 22,
    color: colors.muted,
    marginBottom: 10,
  },
  stepsTitle: {
    fontFamily: fonts.bold,
    fontSize: 10.5,
    letterSpacing: 1.4,
    color: colors.muted2,
    marginTop: 24,
    marginBottom: 12,
  },
  stepRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.goldSoft,
    borderWidth: 1,
    borderColor: colors.goldBorder,
  },
  stepNumTxt: { fontFamily: fonts.bold, fontSize: 12, color: colors.gold },
  stepTitle: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  stepBody: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 20,
    color: colors.muted,
    marginTop: 3,
  },
  after: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 21,
    color: colors.gold,
    marginTop: 14,
  },
  divider: { height: 1, backgroundColor: colors.lineSoft, marginVertical: 26 },
  secondTitle: { fontFamily: fonts.semibold, fontSize: 16, color: colors.ink },
  secondBody: {
    fontFamily: fonts.body,
    fontSize: 14.5,
    lineHeight: 22,
    color: colors.muted,
    marginTop: 8,
  },
  link: {
    fontFamily: fonts.semibold,
    fontSize: 14.5,
    color: colors.gold,
    marginTop: 16,
  },
});
