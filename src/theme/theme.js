/* ============================================================
   theme.js , tokens do DESIGN SYSTEM do Stronghold (tema DARK DUSK).
   Espelha app.css do PWA: fundo pôr do sol, dourado como acento,
   headline serif com a 2a linha em itálico dourado, cards frosted.
   ============================================================ */

export const colors = {
  ink: "#f4f1e8",
  muted: "#b3b6a8",
  muted2: "#8b8f82",
  gold: "#e0b467",
  gold2: "#d4a24f",
  goldDeep: "#b98a3c",
  goldLight: "#e6c074",
  red: "#d6564c",
  redDeep: "#a83229",
  green: "#5fae7e",
  onGold: "#1a130a",
  card: "rgba(255,255,255,0.055)",
  card2: "rgba(20,15,11,0.34)",
  line: "rgba(255,255,255,0.12)",
  lineSoft: "rgba(255,255,255,0.08)",
  goldSoft: "rgba(224,180,103,0.10)",
  goldBorder: "rgba(224,180,103,0.50)",
  sheet: "#0f0c0a",
  tabbar: "rgba(16,20,26,0.86)",
};

// Gradiente "dusk": azul no topo -> laranja/marrom quente embaixo.
export const duskGradient = {
  colors: ["#16232f", "#1e2a35", "#3a3128", "#241a13"],
  locations: [0, 0.26, 0.6, 1],
};

export const fonts = {
  body: "Inter_400Regular",
  medium: "Inter_500Medium",
  semibold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
  extrabold: "Inter_800ExtraBold",
  serif: "Lora_600SemiBold",
  serifMedium: "Lora_500Medium",
  serifItalic: "Lora_500Medium_Italic",
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 16,
  xl: 20,
  sheet: 26,
  pill: 999,
};

export const spacing = {
  screenX: 22,
  gap: 12,
  card: 20,
};

export const shadows = {
  gold: {
    shadowColor: "#c6a054",
    shadowOpacity: 0.28,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  red: {
    shadowColor: "#a83229",
    shadowOpacity: 0.4,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
};

export default { colors, duskGradient, fonts, radius, spacing, shadows };
