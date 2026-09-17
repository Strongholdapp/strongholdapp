/* ============================================================
   App.js , raiz do Stronghold (React Native / Expo).

   Carrega as fontes da marca (Inter + Lora), monta o estado global e faz o
   roteamento entre as telas. O roteador é o mesmo do PWA: uma tela por vez,
   guardada no aparelho, então o app sempre reabre exatamente onde parou.
   ============================================================ */

import React, { useEffect, useState } from "react";
import { View, StatusBar as RNStatusBar } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
// Import por subpasta de propósito: puxar do índice do pacote arrastaria TODOS os
// pesos das duas famílias pro bundle (uns 6 MB de fonte que o app não usa).
import { useFonts } from "expo-font";
import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular";
import { Inter_500Medium } from "@expo-google-fonts/inter/500Medium";
import { Inter_600SemiBold } from "@expo-google-fonts/inter/600SemiBold";
import { Inter_700Bold } from "@expo-google-fonts/inter/700Bold";
import { Inter_800ExtraBold } from "@expo-google-fonts/inter/800ExtraBold";
import { Lora_500Medium } from "@expo-google-fonts/lora/500Medium";
import { Lora_500Medium_Italic } from "@expo-google-fonts/lora/500Medium_Italic";
import { Lora_600SemiBold } from "@expo-google-fonts/lora/600SemiBold";

import { AppProvider, useApp } from "./src/state/AppContext";
import { Dusk } from "./src/components/ui";
import { configure as configureSuperwall, presentPaywall } from "./src/lib/superwall";
import { configureHandler } from "./src/lib/notifications";
import { hasSuperwall, SUPERWALL_PLACEMENT, PAYWALL_ENABLED } from "./src/lib/env";
import * as A from "./src/lib/analytics";
import { verifyRedemptionCode } from "./src/lib/redeem";
import QuizEngine from "./src/onboarding/QuizEngine";
import { FIRST_SCREEN } from "./src/onboarding/screens";
import { vars } from "./src/onboarding/derive";

import ProfileScreen from "./src/screens/ProfileScreen";
import PlanScreen from "./src/screens/PlanScreen";
import HomeScreen from "./src/screens/HomeScreen";
import InterventionScreen from "./src/screens/InterventionScreen";
import SOSScreen from "./src/screens/SOSScreen";
import BrowserScreen from "./src/screens/BrowserScreen";
import MaxProtectionScreen from "./src/screens/MaxProtectionScreen";
import ReturnScreen from "./src/screens/ReturnScreen";
import BrotherhoodScreen from "./src/screens/BrotherhoodScreen";
import YouScreen from "./src/screens/YouScreen";

SplashScreen.preventAutoHideAsync().catch(() => {});

function Router() {
  const {
    state,
    ready,
    setProfile,
    setOnboardingScreen,
    completeOnboarding,
  } = useApp();
  const [payingBusy, setPayingBusy] = useState(false);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  // Código de resgate offline pra quem já comprou pelo funil web (sem
  // servidor: ver src/lib/redeem.js). Mesmo formato de retorno do
  // presentPaywall ({ granted }), pra PaywallBridge tratar os dois igual.
  async function redeemAccess(code) {
    const ok = verifyRedemptionCode(code);
    if (!ok) {
      A.purchaseResult("fail", { source: "redeem", reason: "invalid_code" });
      return { granted: false };
    }
    A.purchaseResult("success", { source: "redeem" });
    completeOnboarding();
    return { granted: true };
  }

  if (!ready) return <Dusk />;

  /* ---------- Onboarding: as 27 telas do PRD ----------
     Enquanto não terminar, é ele quem manda. Retoma exatamente no
     screen_id em que a pessoa parou, mesmo depois de fechar o app. */
  if (!state.onboardingDone) {
    return (
      <QuizEngine
        profile={state.profile || {}}
        currentScreenId={state.onboardingScreen || FIRST_SCREEN}
        onProfileChange={setProfile}
        onScreenChange={setOnboardingScreen}
        paywall={{
          busy: payingBusy,
          note: hasSuperwall()
            ? null
            : "Superwall key not set: this build unlocks without a purchase so the whole app can be tested.",
          onRedeem: redeemAccess,
        }}
        onFinish={async () => {
          setPayingBusy(true);
          const profile = state.profile || {};

          // Build sem paywall (desenvolvimento, gravação de anúncio): segue direto.
          if (!PAYWALL_ENABLED || !hasSuperwall()) {
            A.purchaseResult("skipped_no_key");
            setPayingBusy(false);
            completeOnboarding();
            return;
          }

          // vars() traduz as chaves do quiz ("alone", "loneliness") nos rótulos
          // que a pessoa leu na tela ("When I'm alone", "Loneliness"), com
          // fallback neutro quando falta resposta. Sem isso o paywall
          // personalizado mostraria a chave crua.
          const v = vars(profile);
          const res = await presentPaywall(SUPERWALL_PLACEMENT, {
            firstName: v.name,
            trigger: v.primary_trigger,
            dangerMoment: v.primary_danger_moment,
            desire: v.primary_desire,
          });
          setPayingBusy(false);

          // Só entra quem tem direito. Fechar o paywall sem assinar mantém a
          // pessoa aqui, e ela pode tentar de novo pelo mesmo botão.
          if (res.granted) {
            A.purchaseResult("success");
            completeOnboarding();
            return;
          }

          A.purchaseResult(res.skipped ? "fail" : "cancel", { error: res.error || null });
        }}
      />
    );
  }

  /* ---------- App depois do onboarding ---------- */
  const needsPlan = (Screen) => (state.plan ? <Screen /> : <HomeScreen />);

  switch (state.screen) {
    case "profile":
      return state.plan ? <ProfileScreen withTabs /> : <HomeScreen />;
    case "plan":
      return needsPlan(PlanScreen);
    case "home":
      return needsPlan(HomeScreen);
    case "intervention":
      return needsPlan(InterventionScreen);
    case "sos":
      return needsPlan(SOSScreen);
    case "protection":
      return needsPlan(MaxProtectionScreen);
    case "browser":
      return needsPlan(BrowserScreen);
    case "return":
      return needsPlan(ReturnScreen);
    case "brotherhood":
      return needsPlan(BrotherhoodScreen);
    case "you":
      return needsPlan(YouScreen);
    default:
      return needsPlan(HomeScreen);
  }
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Lora_500Medium,
    Lora_500Medium_Italic,
    Lora_600SemiBold,
  });

  useEffect(() => {
    configureSuperwall();
    configureHandler();
    A.startSession();
  }, []);

  if (!fontsLoaded) {
    return (
      <SafeAreaProvider>
        <Dusk />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <StatusBar style="light" />
        <AppProvider>
          <Router />
        </AppProvider>
      </View>
    </SafeAreaProvider>
  );
}
