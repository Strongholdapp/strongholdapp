/* ============================================================
   App.js , raiz do Stronghold (React Native / Expo).

   Carrega as fontes da marca (Inter + Lora), monta o estado global e faz o
   roteamento entre as telas. O roteador é o mesmo do PWA: uma tela por vez,
   guardada no aparelho, então o app sempre reabre exatamente onde parou.
   ============================================================ */

import React, { useEffect } from "react";
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
import { configure as configureSuperwall } from "./src/lib/superwall";

import WelcomeScreen from "./src/screens/WelcomeScreen";
import QuizScreen from "./src/screens/QuizScreen";
import LoadingScreen from "./src/screens/LoadingScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import PlanScreen from "./src/screens/PlanScreen";
import PaywallScreen from "./src/screens/PaywallScreen";
import HomeScreen from "./src/screens/HomeScreen";
import InterventionScreen from "./src/screens/InterventionScreen";
import SOSScreen from "./src/screens/SOSScreen";
import BrowserScreen from "./src/screens/BrowserScreen";
import ReturnScreen from "./src/screens/ReturnScreen";
import BrotherhoodScreen from "./src/screens/BrotherhoodScreen";
import YouScreen from "./src/screens/YouScreen";

SplashScreen.preventAutoHideAsync().catch(() => {});

function Router() {
  const { state, ready } = useApp();

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return <Dusk />;

  // Telas que só existem depois do quiz caem no welcome se não houver plano.
  const needsPlan = (Screen) => (state.plan ? <Screen /> : <WelcomeScreen />);

  switch (state.screen) {
    case "quiz":
      return <QuizScreen />;
    case "loading":
      return <LoadingScreen />;
    case "profile":
      return state.plan ? <ProfileScreen withTabs={Boolean(state.subscribed)} /> : <WelcomeScreen />;
    case "plan":
      return needsPlan(PlanScreen);
    case "paywall":
      return needsPlan(PaywallScreen);
    case "home":
      return needsPlan(HomeScreen);
    case "intervention":
      return needsPlan(InterventionScreen);
    case "sos":
      return needsPlan(SOSScreen);
    case "protection":
    case "browser":
      return needsPlan(BrowserScreen);
    case "return":
      return needsPlan(ReturnScreen);
    case "brotherhood":
      return needsPlan(BrotherhoodScreen);
    case "you":
      return needsPlan(YouScreen);
    default:
      return <WelcomeScreen />;
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
