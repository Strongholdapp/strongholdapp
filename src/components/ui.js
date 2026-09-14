/* ============================================================
   ui.js , primitivas visuais do Stronghold (porte do app.css do PWA).
   Screen, Brand, Btn, Card, Pill, Eyebrow, Display, Sub, TabBar, Banner.
   Toda tela do app é montada com essas peças, então o design fica coerente
   sem repetir estilo em lugar nenhum.
   ============================================================ */

import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, duskGradient, fonts, radius, spacing, shadows } from "../theme/theme";
import { Logo, HomeIcon, ReportIcon, ShieldIcon, UsersIcon, UserIcon } from "./Icons";

/* ---------- Fundo dusk (o pôr do sol da marca) ---------- */
export function Dusk({ children, style }) {
  return (
    <LinearGradient
      colors={duskGradient.colors}
      locations={duskGradient.locations}
      style={[{ flex: 1 }, style]}
    >
      {children}
    </LinearGradient>
  );
}

/* ---------- Screen: fundo + safe area + padding padrão ---------- */
export function Screen({ children, scroll = false, style, padded = true, contentStyle }) {
  const insets = useSafeAreaInsets();
  const pad = {
    paddingTop: insets.top + 18,
    paddingBottom: insets.bottom + 22,
    paddingHorizontal: padded ? spacing.screenX : 0,
  };
  if (scroll) {
    return (
      <Dusk>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[pad, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </Dusk>
    );
  }
  return <Dusk><View style={[{ flex: 1 }, pad, style]}>{children}</View></Dusk>;
}

/* ---------- Tipografia ---------- */
export function Display({ children, gold, style }) {
  return (
    <Text style={[s.display, style]}>
      {children}
      {gold ? <Text style={s.displayGold}>{gold}</Text> : null}
    </Text>
  );
}

export const Sub = ({ children, style }) => <Text style={[s.sub, style]}>{children}</Text>;
export const Eyebrow = ({ children, style }) => (
  <Text style={[s.eyebrow, style]}>{"• " + String(children).toUpperCase()}</Text>
);
export const Serif = ({ children, style }) => <Text style={[s.serif, style]}>{children}</Text>;

/* ---------- Header da marca ---------- */
export function Brand({ size = 34 }) {
  return (
    <View style={s.brand}>
      <Logo size={size} />
      <Text style={s.brandName}>Stronghold</Text>
    </View>
  );
}

export function TopBar({ right, style }) {
  return (
    <View style={[s.topbar, style]}>
      <Brand />
      {right || null}
    </View>
  );
}

/* ---------- Saída de emergência: telas de crise não podem prender ninguém ---------- */
export function CloseBtn({ onPress }) {
  return (
    <Pressable onPress={onPress} hitSlop={12} style={s.closeBtn}>
      <Text style={s.closeTxt}>×</Text>
    </Pressable>
  );
}

export function WhoMini({ name, caption }) {
  const letter = String(name || "S").charAt(0).toUpperCase();
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={s.whoName}>{name}</Text>
        <Text style={s.whoSub}>{caption}</Text>
      </View>
      <View style={s.avatar}>
        <Text style={s.avatarTxt}>{letter}</Text>
      </View>
    </View>
  );
}

/* ---------- Botões ---------- */
export function Btn({ title, subtitle, onPress, disabled, variant = "gold", style, textStyle }) {
  const isGold = variant === "gold";
  const isPanic = variant === "panic";
  const isGhost = variant === "ghost";
  const isDark = variant === "dark";

  const content = (
    <>
      <Text
        style={[
          s.btnTxt,
          isGhost && { color: colors.muted, fontFamily: fonts.semibold },
          isDark && { color: colors.ink },
          isPanic && { color: "#fff", fontSize: 18 },
          disabled && { color: colors.muted },
          textStyle,
        ]}
      >
        {title}
      </Text>
      {subtitle ? <Text style={s.btnSub}>{subtitle}</Text> : null}
    </>
  );

  const inner = (pressed) => [
    s.btn,
    isPanic && s.btnPanic,
    isGhost && s.btnGhost,
    isDark && s.btnDark,
    disabled && s.btnDisabled,
    pressed && !disabled && { transform: [{ scale: 0.985 }] },
    style,
  ];

  if (isGold && !disabled) {
    return (
      <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [
        pressed && { transform: [{ scale: 0.985 }] }, style,
      ]}>
        <LinearGradient
          colors={[colors.goldLight, "#c6a054"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[s.btn, shadows.gold]}
        >
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  if (isPanic) {
    return (
      <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [
        pressed && { transform: [{ scale: 0.985 }] }, style,
      ]}>
        <LinearGradient
          colors={["#d0554c", colors.redDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[s.btn, s.btnPanicBox, shadows.red]}
        >
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => inner(pressed)}>
      {content}
    </Pressable>
  );
}

/* ---------- Card / Pill / Banner ---------- */
export const Card = ({ children, style }) => <View style={[s.card, style]}>{children}</View>;
export const CardTitle = ({ children }) => <Text style={s.cardTitle}>{String(children).toUpperCase()}</Text>;

export function Pill({ children, tone = "default", style }) {
  return (
    <View
      style={[
        s.pill,
        tone === "gold" && s.pillGold,
        tone === "red" && s.pillRed,
        tone === "green" && s.pillGreen,
        style,
      ]}
    >
      <Text
        style={[
          s.pillTxt,
          tone === "gold" && { color: colors.gold },
          tone === "red" && { color: colors.red },
          tone === "green" && { color: colors.green },
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

export function Banner({ title, subtitle, style }) {
  return (
    <View style={[s.banner, style]}>
      <Text style={s.bannerT}>{title}</Text>
      {subtitle ? <Text style={s.bannerS}>{subtitle}</Text> : null}
    </View>
  );
}

export function Check({ children }) {
  return (
    <View style={s.checkRow}>
      <View style={s.checkDot}><Text style={s.checkTick}>✓</Text></View>
      <Text style={s.checkTxt}>{children}</Text>
    </View>
  );
}

/* ---------- Tab bar (5 abas, igual ao PWA) ---------- */
const TABS = [
  { key: "home", label: "Home", Icon: HomeIcon },
  { key: "profile", label: "Report", Icon: ReportIcon },
  { key: "protection", label: "Protection", Icon: ShieldIcon },
  { key: "brotherhood", label: "Brotherhood", Icon: UsersIcon },
  { key: "you", label: "Profile", Icon: UserIcon },
];

/* ============================================================
   Altura da TabBar, somada do estilo dela (s.tabbar / s.tab / s.tabTxt):

     borda de cima .............  1
     paddingTop ................  9
     ícone (size 23) ........... 23
     marginBottom do ícone .....  3
     texto (fontSize 10.5) ..... ~14
     paddingBottom ............   9
     ─────────────────────────────
     total ..................... 59  + insets.bottom

   A safe area fica de fora porque varia por aparelho: 0 em iPhone com
   botão físico, ~34 em iPhone com home indicator.
   ============================================================ */
export const TAB_BAR_HEIGHT = 59;

/** Folga entre o fim do conteúdo e o topo da barra. */
const RESPIRO = 16;

/**
 * Quanto reservar no fim de um ScrollView pra o conteúdo não terminar
 * escondido atrás da TabBar.
 *
 * Existe porque cada tela tinha seu próprio número chumbado (118, 110,
 * 120...), nenhum deles derivado de insets: funcionavam por sorte no
 * aparelho em que foram ajustados e escondiam conteúdo nos outros. Qualquer
 * coisa nova adicionada no fim de uma tela caía atrás da barra.
 *
 * @param extra pra tela que tem algo flutuando MAIS ALTO que a TabBar,
 *              como o botão SOS da Home.
 */
export function useTabBarSpace(extra = 0) {
  const insets = useSafeAreaInsets();
  return insets.bottom + TAB_BAR_HEIGHT + RESPIRO + extra;
}

export function TabBar({ active, onNavigate }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.tabbar, { paddingBottom: insets.bottom + 9 }]}>
      {TABS.map(({ key, label, Icon }) => {
        const on = key === active;
        return (
          <Pressable key={key} style={s.tab} onPress={() => onNavigate(key)}>
            <View style={{ opacity: on ? 1 : 0.5, marginBottom: 3 }}>
              <Icon color={on ? colors.gold : colors.muted2} />
            </View>
            <Text style={[s.tabTxt, on && { color: colors.gold }]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ---------- Barra de progresso do quiz ---------- */
export function Progress({ pct }) {
  return (
    <View style={s.progressWrap}>
      <View style={[s.progressBar, { width: `${Math.max(0, Math.min(100, pct))}%` }]} />
    </View>
  );
}

export const s = StyleSheet.create({
  brand: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandName: {
    fontFamily: fonts.serif,
    fontSize: 20,
    color: colors.ink,
    letterSpacing: -0.2,
  },
  topbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },

  closeBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center", justifyContent: "center",
  },
  closeTxt: { fontSize: 20, lineHeight: 22, color: colors.muted, fontFamily: fonts.semibold },

  whoName: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  whoSub: { fontFamily: fonts.body, fontSize: 12, color: colors.gold },
  avatar: {
    width: 38, height: 38, borderRadius: 19, marginLeft: 10,
    alignItems: "center", justifyContent: "center", backgroundColor: colors.goldLight,
  },
  avatarTxt: { fontFamily: fonts.serif, color: colors.onGold, fontSize: 17 },

  display: {
    fontFamily: fonts.serif,
    fontSize: 34,
    lineHeight: 38,
    color: colors.ink,
    marginTop: 8,
    letterSpacing: -0.3,
  },
  displayGold: { fontFamily: fonts.serifItalic, color: colors.gold },
  sub: { fontFamily: fonts.body, color: colors.muted, fontSize: 15.5, lineHeight: 23, marginTop: 10 },
  eyebrow: {
    fontFamily: fonts.bold, fontSize: 12, letterSpacing: 1.6, color: colors.gold,
  },
  serif: { fontFamily: fonts.serif, color: colors.ink },

  btn: {
    borderRadius: radius.md,
    paddingVertical: 18,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  btnTxt: { fontFamily: fonts.bold, fontSize: 17, color: colors.onGold, textAlign: "center" },
  btnSub: { fontFamily: fonts.medium, fontSize: 12.5, color: "rgba(255,255,255,0.9)", marginTop: 3, textAlign: "center" },
  btnPanicBox: { paddingVertical: 20 },
  btnPanic: {},
  btnGhost: { backgroundColor: "transparent", marginTop: 8 },
  btnDark: { backgroundColor: "rgba(255,255,255,0.1)", borderWidth: 1, borderColor: colors.line },
  btnDisabled: { backgroundColor: "rgba(255,255,255,0.08)", opacity: 0.5 },

  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.xl,
    padding: spacing.card,
    marginTop: 18,
  },
  cardTitle: {
    fontFamily: fonts.bold, fontSize: 12.5, letterSpacing: 1.2,
    color: colors.muted, marginBottom: 14,
  },

  pill: {
    borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line,
    paddingVertical: 7, paddingHorizontal: 13, alignSelf: "flex-start",
  },
  pillGold: { borderColor: colors.goldBorder, backgroundColor: "rgba(224,180,103,0.08)" },
  pillRed: { borderColor: "rgba(214,86,76,0.5)", backgroundColor: "rgba(214,86,76,0.08)" },
  pillGreen: { borderColor: "rgba(95,174,126,0.35)", backgroundColor: "rgba(95,174,126,0.12)" },
  pillTxt: { fontFamily: fonts.semibold, fontSize: 13, color: colors.muted },

  banner: {
    marginTop: 16, borderWidth: 1, borderColor: "rgba(224,180,103,0.4)",
    backgroundColor: "rgba(224,180,103,0.08)", borderRadius: radius.md,
    paddingVertical: 15, paddingHorizontal: 18, alignItems: "center",
  },
  bannerT: { fontFamily: fonts.bold, fontSize: 15, color: colors.gold, textAlign: "center" },
  bannerS: { fontFamily: fonts.body, fontSize: 13.5, color: colors.muted, marginTop: 4, textAlign: "center" },

  checkRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 },
  checkDot: {
    width: 26, height: 26, borderRadius: 13, backgroundColor: colors.gold,
    alignItems: "center", justifyContent: "center",
  },
  checkTick: { color: colors.onGold, fontSize: 14, fontFamily: fonts.bold },
  checkTxt: { fontFamily: fonts.body, fontSize: 16, color: colors.ink, flex: 1 },

  tabbar: {
    position: "absolute", left: 0, right: 0, bottom: 0,
    flexDirection: "row", backgroundColor: colors.tabbar,
    borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 9,
  },
  tab: { flex: 1, alignItems: "center" },
  tabTxt: { fontFamily: fonts.semibold, fontSize: 10.5, color: colors.muted2 },

  progressWrap: {
    height: 4, backgroundColor: colors.line, borderRadius: 4,
    marginTop: 16, marginBottom: 4, overflow: "hidden",
  },
  progressBar: { height: "100%", backgroundColor: colors.gold, borderRadius: 4 },
});

export default {
  Dusk, Screen, Display, Sub, Eyebrow, Serif, Brand, TopBar, WhoMini,
  Btn, Card, CardTitle, Pill, Banner, Check, TabBar, Progress, CloseBtn,
};
