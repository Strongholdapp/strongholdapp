/* ============================================================
   MockScreens.js , as três telas do mecanismo da V4.

   INTERRUPT · PRAYER_STEP · RESET_STEP

   Regra que vale pras três: o "print" NÃO é imagem. É a tela do app
   renderizada em miniatura dentro de uma moldura de iPhone (barra de
   status, ilha dinâmica, indicador de home), com os dados DELE.

   Por que renderizado e não PNG (pedido do Lucas de 02/09):
   um PNG fica idêntico ao app no dia em que foi tirado e mentira no dia
   seguinte. Renderizado, o print não tem como divergir: a notificação sai
   de `reminderCopy()` , a MESMA função que agenda a notificação de
   verdade , e a tela de bloqueio espelha a InterventionScreen, inclusive
   o botão "Continue to My Prayer". Se alguém mudar o produto, o print
   muda junto. E continua mostrando o nome e o contexto da pessoa, que era
   o outro pedido dele (item 17).

   Regra de copy (do PRD do Lucas): não prometer comportamento que o app
   não tem. O bloqueio de sistema é a Maximum Protection (perfil de DNS,
   instalado pela pessoa e removível nos Ajustes com a senha do aparelho).
   Nada aqui pode dizer que é impossível de desativar.
   ============================================================ */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { Btn, Pill } from "../../components/ui";
import { Logo } from "../../components/Icons";
import { colors, fonts, radius } from "../../theme/theme";
import { Shell, Head, Reveal, ProofCard, st as sh } from "./shared";
import { labelFor, edgeCopy, toLegacyAnswers, cleanName } from "../derive";
import { build } from "../../engine/planEngine";
import { reminderCopy } from "../../lib/notifications";

/* ============================================================
   MOLDURA , o que faz a coisa parecer print e não bloco
   ============================================================ */

/** Barra de status do iOS. Desenhada com View pra renderizar igual em
 *  qualquer aparelho (glifo unicode de bateria/wifi varia demais). */
function StatusBar({ time }) {
  return (
    <View style={s.statusBar}>
      <Text style={s.statusTime} numberOfLines={1}>
        {time}
      </Text>
      <View style={s.island} />
      <View style={s.statusRight}>
        <View style={s.bars}>
          <View style={[s.bar, { height: 4 }]} />
          <View style={[s.bar, { height: 6 }]} />
          <View style={[s.bar, { height: 8 }]} />
          <View style={[s.bar, { height: 10, opacity: 0.35 }]} />
        </View>
        <View style={s.wifi} />
        <View style={s.batt}>
          <View style={s.battFill} />
          <View style={s.battTip} />
        </View>
      </View>
    </View>
  );
}

function HomeIndicator() {
  return (
    <View style={s.homeWrap}>
      <View style={s.homeBar} />
    </View>
  );
}

/**
 * A "telinha": bezel escuro, cantos de iPhone, status bar e indicador de
 * home. `bare` tira o padding interno pra tela poder encostar nas bordas
 * (é o caso do bloqueio, que tem barra de navegador em cima).
 */
function Device({ children, time, bare = false, style }) {
  return (
    <View style={[s.bezel, style]}>
      <View style={s.screen}>
        <StatusBar time={time} />
        <View style={bare ? null : s.screenPad}>{children}</View>
        <HomeIndicator />
      </View>
    </View>
  );
}

/** Hora do aparelho, no formato do mockup. Nada de "11:42 PM" chumbado. */
function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 20000);
    return () => clearInterval(t);
  }, []);
  return now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

/** O momento de risco dele, com o fallback do edge case "sem padrão claro". */
function riskTag(profile) {
  const edge = edgeCopy(profile);
  if (edge.demoUnclearPattern) return null;
  return labelFor("danger_moments", profile.primary_danger_moment) || null;
}

/* ============================================================
   PRINT 1 , A NOTIFICAÇÃO
   Texto e horário saem de reminderCopy(), a mesma função que agenda a
   notificação real. Não tem como o print prometer uma coisa e o app
   mandar outra.
   ============================================================ */
function NotificationPrint({ profile, label }) {
  const name = cleanName(profile && profile.name);
  const n = useMemo(() => reminderCopy(profile, name), [profile, name]);

  return (
    <View>
      <Text style={s.printLabel}>{label}</Text>
      <Device time={n.time}>
        <View style={s.lockWrap}>
          <View style={s.notif}>
            <View style={s.notifHead}>
              {/* A logo REAL do app (mesmo SVG do ícone e do funil). Antes era
                  uma cruz solta num quadrado, e ficava diferente do app , o
                  Lucas pegou isso no áudio de 02/09. */}
              <View style={s.appIcon}>
                <Logo size={15} />
              </View>
              <Text style={s.notifApp}>STRONGHOLD</Text>
              <Text style={s.notifWhen}>now</Text>
            </View>
            <Text style={s.notifTitle}>{n.title}</Text>
            <Text style={s.notifBody} numberOfLines={3}>
              {n.body}
            </Text>
          </View>
        </View>
      </Device>
    </View>
  );
}

/* ============================================================
   PRINT 2 , O BLOQUEIO DE CONTEÚDO
   Espelha a InterventionScreen (StepBlock): barra do navegador, folha
   subindo, os três selos e o botão que leva pra oração dele , que foi
   exatamente o que o Lucas descreveu no áudio.
   ============================================================ */
function BlockPrint({ profile, label, blockedLabel }) {
  const hr = (labelFor("danger_moments", profile && profile.primary_danger_moment) || "")
    .toLowerCase();
  const tr = (labelFor("primary_trigger", profile && profile.primary_trigger) || "").toLowerCase();

  return (
    <View>
      <Text style={s.printLabel}>{label}</Text>
      <Device bare>
        {/* barra do navegador */}
        <View style={s.browserBar}>
          <Text style={s.browserIco}>‹ ›</Text>
          <View style={s.browserUrl}>
            <Text style={s.browserUrlTxt}>⚠ Protected Website</Text>
          </View>
          <Text style={s.browserIco}>⤴</Text>
        </View>

        {/* Faixa fina em vez de card grande: o que importa nesta telinha é o
            botão que leva pra oração ficar visível sem rolar. */}
        <View style={s.blockGap}>
          <View style={s.blockBadge}>
            <Text style={s.blockBadgeIcon}>🔒</Text>
            <Text style={s.blockBadgeTxt}>{blockedLabel || "Blocked."}</Text>
          </View>
        </View>

        {/* a folha da Intervenção */}
        <View style={s.sheet}>
          <View style={s.grab} />
          <View style={s.sheetTop}>
            <Pill tone="gold">Active</Pill>
          </View>
          <Text style={s.sheetTitle}>
            Stronghold <Text style={s.sheetTitleGold}>stepped in.</Text>
          </Text>
          {hr && tr ? (
            <Text style={s.sheetBody} numberOfLines={2}>
              You told us {hr} and {tr} often come right before your difficult moments.
            </Text>
          ) : null}
          <View style={s.sheetPills}>
            <Pill tone="red">⊗ Site blocked</Pill>
            <Pill tone="gold">Pattern recognized</Pill>
          </View>
          <View style={s.fakeBtn}>
            <Text style={s.fakeBtnTxt}>Continue to My Prayer</Text>
          </View>
        </View>
      </Device>
    </View>
  );
}

/* ============================================================
   STEP 1 , INTERRUPT
   Os dois prints que o Lucas pediu: a notificação e o bloqueio.
   ============================================================ */
export function InterruptStep({ screen, profile, onNext, onBack }) {
  const L = screen.printLabels || {};

  return (
    <Shell
      progress={screen.progress}
      onBack={onBack}
      footer={<Btn title={screen.cta} onPress={() => onNext()} />}
    >
      <Head eyebrow={screen.eyebrow} headline={screen.headline} serif />

      <Reveal index={0}>
        <NotificationPrint profile={profile} label={L.notification || "The reminder"} />
      </Reveal>

      <Reveal index={1} delay={220}>
        <BlockPrint
          profile={profile}
          label={L.block || "The block"}
          blockedLabel={screen.blockedLabel}
        />
      </Reveal>

      {/* Uma frase e o CTA. O bloco de contraste saiu pra tela andar mais
          rápido (pedido do Lucas, 03/09). */}
      <Reveal index={2} delay={220}>
        <Text style={s.stepBody}>{screen.body}</Text>
      </Reveal>
    </Shell>
  );
}

/* ============================================================
   STEP 2 , PRAYER
   A tela mais importante do onboarding: é onde o diferencial aparece.
   ============================================================ */
export function PrayerStep({ screen, profile, onNext, onBack }) {
  const time = useClock();
  const name = (profile && profile.name) || "";
  const cost = labelFor("deepest_cost", profile.deepest_cost);

  // A oração REAL que o motor escolhe pro perfil dele. Se o motor não
  // conseguir montar (perfil ainda incompleto), a tela mostra só a moldura,
  // sem inventar texto de oração.
  const prayer = useMemo(() => {
    try {
      const plan = build(toLegacyAnswers(profile));
      const first = plan && plan.prayers && plan.prayers[0];
      return first || null;
    } catch (e) {
      return null;
    }
  }, [profile]);

  const snippet = prayer ? firstSentences(prayer.text, 2) : null;

  return (
    <Shell
      progress={screen.progress}
      onBack={onBack}
      footer={<Btn title={screen.cta} onPress={() => onNext()} />}
    >
      <Head eyebrow={screen.eyebrow} headline={screen.headline} serif />

      <Reveal index={0}>
        <Device time={time}>
          <Text style={s.prayerHi}>
            {name ? `${name}, ${screen.stayLine}` : cap(screen.stayLine)}
          </Text>
          {cost ? (
            <Text style={s.prayerCost}>
              {screen.costPrefix} <Text style={s.prayerCostHot}>{cost.toLowerCase()}</Text>.
            </Text>
          ) : null}

          <View style={s.prayerDivider} />

          <Text style={s.prayerIcon}>🙏</Text>
          {screen.personalTag ? (
            <View style={s.personalTag}>
              <Text style={s.personalTagTxt}>✦ {screen.personalTag}</Text>
            </View>
          ) : null}
          <Text style={s.prayerTag}>{screen.prayerTag}</Text>
          {snippet ? <Text style={s.prayerText}>“{snippet}”</Text> : null}
          {prayer && prayer.verse ? (
            <Text style={s.prayerVerse}>{prayer.verse}</Text>
          ) : null}
        </Device>
      </Reveal>

      <Reveal index={1} delay={200}>
        <Text style={s.stepBody}>{screen.body}</Text>
      </Reveal>
    </Shell>
  );
}

/* ============================================================
   STEP 3 , RESET
   ============================================================ */
export function ResetStep({ screen, profile, onNext, onBack }) {
  const time = useClock();
  const reset = useMemo(() => {
    try {
      const plan = build(toLegacyAnswers(profile));
      return (plan && plan.reset) || null;
    } catch (e) {
      return null;
    }
  }, [profile]);

  const howMany = screen.resetSteps || 3;
  const steps = (reset && reset.steps ? reset.steps : []).slice(0, howMany).map(shortStep);

  return (
    <Shell
      progress={screen.progress}
      onBack={onBack}
      footer={<Btn title={screen.cta} onPress={() => onNext()} />}
    >
      <Head eyebrow={screen.eyebrow} headline={screen.headline} serif />

      <Reveal index={0}>
        <Device time={time}>
          <Ticker />
          {reset && reset.title ? <Text style={s.resetTitle}>{reset.title}</Text> : null}
          {steps.map((t, i) => (
            <View key={i} style={s.resetRow}>
              <View style={s.resetDot}>
                <Text style={s.resetDotTxt}>{i + 1}</Text>
              </View>
              <Text style={s.resetStep}>{t}</Text>
            </View>
          ))}
        </Device>
      </Reveal>

      {/* Só o depoimento pequeno depois do timer. A explicação saiu: o
          Lucas pediu tela de produto, não de texto (03/09). */}
      <Reveal index={1} delay={200}>
        <ProofCard id={screen.proof} tag={screen.proofTag} compact />
      </Reveal>
    </Shell>
  );
}

/** Contador 02:00 descendo, pra telinha não parecer estática. */
function Ticker() {
  const [left, setLeft] = useState(120);
  useEffect(() => {
    const t = setInterval(() => setLeft((v) => (v <= 0 ? 120 : v - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return (
    <View style={s.tickerWrap}>
      <Text style={s.ticker}>
        {mm}:{ss}
      </Text>
    </View>
  );
}

/* ============================================================
   PRINT 3 , A COMUNIDADE (Brotherhood)

   Pedido do Lucas: "tem o de comunidade também, faz sentido incrementar".
   Espelha a BrotherhoodScreen: selo Private, o cabeçalho da aba e dois
   posts com avatar, dia e os encorajamentos. Mesma regra dos outros
   prints , sai do produto, não é imagem.
   ============================================================ */
export function CommunityPrint({ screen }) {
  const c = screen && screen.community;
  if (!c) return null;
  return (
    <View>
      <Text style={s.printLabel}>{c.label}</Text>
      <Device time={c.time || "9:41 PM"}>
        <View style={s.commTop}>
          <Text style={s.commEyebrow}>{String(c.eyebrow || "Brotherhood").toUpperCase()}</Text>
          <Pill>🔒 Private</Pill>
        </View>
        <Text style={s.commTitle}>{c.title}</Text>

        {(c.posts || []).map((po, i) => (
          <View key={i} style={s.commPost}>
            <View style={s.commHead}>
              <View style={s.commAv}>
                <Text style={s.commAvTxt}>{String(po.name).charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.commName}>{po.name}</Text>
                <Text style={s.commDay}>{po.status}</Text>
              </View>
            </View>
            <Text style={s.commQuote} numberOfLines={3}>
              “{po.quote}”
            </Text>
            <Text style={s.commEnc}>{po.encouragements}</Text>
          </View>
        ))}
      </Device>
    </View>
  );
}

/* ============================================================
   MiniMocks , a montagem dos três prints da tela de proof final.

   Mesma regra e mesma moldura das telas grandes, em miniatura: bloqueio,
   oração com o nome real e o streak. É o "montagem bonita com 3 mockups"
   do item 29 do Lucas.
   ============================================================ */
export function MiniMocks({ profile, labels }) {
  const name = cleanName(profile && profile.name) || "";
  const L = labels || {};
  return (
    <View style={s.miniRow}>
      <View style={s.miniCol}>
        <View style={s.miniBezel}>
          <View style={s.miniScreen}>
            <View style={s.miniIsland} />
            <View style={s.miniBlock}>
              <Text style={s.miniIcon}>🔒</Text>
              <Text style={s.miniBlockTxt}>Blocked.</Text>
            </View>
            <View style={s.miniHome} />
          </View>
        </View>
        <Text style={s.miniLabel}>{L.block || "Blocked"}</Text>
      </View>

      <View style={s.miniCol}>
        <View style={s.miniBezel}>
          <View style={s.miniScreen}>
            <View style={s.miniIsland} />
            <View style={s.miniBody}>
              <Text style={s.miniIcon}>🙏</Text>
              <Text style={s.miniPrayer} numberOfLines={3}>
                {name ? `${name}, stay here for a moment.` : "Stay here for a moment."}
              </Text>
            </View>
            <View style={s.miniHome} />
          </View>
        </View>
        <Text style={s.miniLabel}>{L.pray || "Your prayer"}</Text>
      </View>

      <View style={s.miniCol}>
        <View style={s.miniBezel}>
          <View style={s.miniScreen}>
            <View style={s.miniIsland} />
            <View style={s.miniBody}>
              <Text style={s.miniDay}>1</Text>
              <Text style={s.miniDayLabel}>DAY</Text>
            </View>
            <View style={s.miniHome} />
          </View>
        </View>
        <Text style={s.miniLabel}>{L.progress || "Your streak"}</Text>
      </View>
    </View>
  );
}

/* ------------------------------------------------------------
   Utilidades de texto
   ------------------------------------------------------------ */
function firstSentences(text, n) {
  if (!text) return "";
  const parts = String(text).match(/[^.!?]+[.!?]+/g);
  if (!parts) return String(text);
  return parts.slice(0, n).join(" ").trim();
}

function shortStep(text) {
  const one = firstSentences(text, 1);
  return one.length > 96 ? one.slice(0, 93).trimEnd() + "..." : one;
}

function cap(t) {
  const s2 = String(t || "");
  return s2.charAt(0).toUpperCase() + s2.slice(1);
}

const s = StyleSheet.create({
  /* ---------- moldura ---------- */
  bezel: {
    marginTop: 16,
    borderRadius: 30,
    borderWidth: 5,
    borderColor: "#0a0908",
    backgroundColor: "#0a0908",
    overflow: "hidden",
  },
  screen: {
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: "#14100c",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  screenPad: { paddingHorizontal: 14, paddingBottom: 6 },

  statusBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 9,
    paddingBottom: 5,
  },
  statusTime: { fontFamily: fonts.bold, fontSize: 12, color: colors.ink, width: 60 },
  island: {
    width: 62,
    height: 16,
    borderRadius: 10,
    backgroundColor: "#000",
  },
  statusRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    width: 60,
    justifyContent: "flex-end",
  },
  bars: { flexDirection: "row", alignItems: "flex-end", gap: 1.5 },
  bar: { width: 2.5, borderRadius: 1, backgroundColor: colors.ink },
  // Triângulo (o "leque" do wifi). Arco de verdade não sai limpo em RN.
  wifi: {
    width: 0,
    height: 0,
    borderLeftWidth: 5.5,
    borderRightWidth: 5.5,
    borderBottomWidth: 9,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: colors.ink,
  },
  batt: {
    width: 17,
    height: 9,
    borderRadius: 2.5,
    borderWidth: 1,
    borderColor: "rgba(244,241,232,0.55)",
    padding: 1.5,
    flexDirection: "row",
  },
  battFill: { flex: 0.7, borderRadius: 1, backgroundColor: colors.ink },
  battTip: {
    position: "absolute",
    right: -3,
    top: 3,
    width: 1.5,
    height: 3,
    borderRadius: 1,
    backgroundColor: "rgba(244,241,232,0.55)",
  },

  homeWrap: { alignItems: "center", paddingTop: 6, paddingBottom: 7 },
  homeBar: {
    width: 96,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.28)",
  },

  printLabel: {
    fontFamily: fonts.bold,
    fontSize: 10.5,
    letterSpacing: 1.4,
    color: colors.muted2,
    marginTop: 16,
    textTransform: "uppercase",
  },

  /* ---------- print 1: notificação ---------- */
  lockWrap: { paddingTop: 0, paddingBottom: 4 },
  lockTime: {
    fontFamily: fonts.extrabold,
    fontSize: 30,
    color: colors.ink,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  notif: {
    marginTop: 8,
    borderRadius: 16,
    padding: 11,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.13)",
  },
  notifHead: { flexDirection: "row", alignItems: "center", gap: 7 },
  appIcon: {
    width: 18,
    height: 18,
    borderRadius: 4.5,
    backgroundColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  notifApp: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 10,
    letterSpacing: 0.8,
    color: colors.muted,
  },
  notifWhen: { fontFamily: fonts.body, fontSize: 10, color: colors.muted2 },
  notifTitle: {
    fontFamily: fonts.bold,
    fontSize: 13.5,
    color: colors.ink,
    marginTop: 8,
  },
  notifBody: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    lineHeight: 18,
    color: colors.muted,
    marginTop: 3,
  },

  /* ---------- print 2: bloqueio ---------- */
  browserBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  browserIco: { fontSize: 12, color: colors.muted2 },
  browserUrl: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 5,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  browserUrlTxt: { fontFamily: fonts.medium, fontSize: 10.5, color: colors.muted },
  blockGap: { alignItems: "center", paddingVertical: 8, paddingHorizontal: 12 },
  blockBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: "rgba(214,86,76,0.42)",
    backgroundColor: "rgba(214,86,76,0.10)",
  },
  blockBadgeIcon: { fontSize: 13 },
  blockBadgeTxt: {
    fontFamily: fonts.bold,
    fontSize: 12.5,
    color: colors.ink,
  },
  sheet: {
    backgroundColor: colors.sheet,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  grab: {
    alignSelf: "center",
    width: 34,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.20)",
    marginBottom: 10,
  },
  sheetTop: { flexDirection: "row", justifyContent: "flex-end" },
  sheetTitle: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.ink,
    marginTop: 6,
  },
  sheetTitleGold: { fontFamily: fonts.serifItalic, color: colors.gold },
  sheetSub: {
    fontFamily: fonts.semibold,
    fontSize: 12.5,
    color: colors.muted,
    marginTop: 6,
  },
  sheetBody: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: colors.muted2,
    marginTop: 6,
  },
  sheetPills: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
  fakeBtn: {
    marginTop: 9,
    borderRadius: radius.pill,
    backgroundColor: colors.gold,
    paddingVertical: 11,
    alignItems: "center",
  },
  fakeBtnTxt: { fontFamily: fonts.bold, fontSize: 13, color: colors.onGold },

  /* ---------- print 3: comunidade ---------- */
  commTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  commEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 10,
    letterSpacing: 1.4,
    color: colors.gold,
  },
  commTitle: {
    fontFamily: fonts.serif,
    fontSize: 17,
    lineHeight: 24,
    color: colors.ink,
    marginTop: 10,
    marginBottom: 4,
  },
  commPost: {
    marginTop: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card2,
    padding: 11,
  },
  commHead: { flexDirection: "row", alignItems: "center", gap: 8 },
  commAv: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.goldSoft,
    borderWidth: 1,
    borderColor: colors.goldBorder,
  },
  commAvTxt: { fontFamily: fonts.bold, fontSize: 11, color: colors.gold },
  commName: { fontFamily: fonts.semibold, fontSize: 12.5, color: colors.ink },
  commDay: { fontFamily: fonts.body, fontSize: 10.5, color: colors.muted2 },
  commQuote: {
    fontFamily: fonts.serifItalic,
    fontSize: 12.5,
    lineHeight: 19,
    color: colors.muted,
    marginTop: 8,
  },
  commEnc: {
    fontFamily: fonts.semibold,
    fontSize: 10.5,
    color: colors.gold,
    marginTop: 8,
  },

  /* ---------- mini montagem ---------- */
  miniRow: { flexDirection: "row", gap: 8, marginTop: 18 },
  miniCol: { flex: 1, alignItems: "center" },
  miniBezel: {
    width: "100%",
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: "#0a0908",
    backgroundColor: "#0a0908",
    overflow: "hidden",
  },
  miniScreen: {
    borderRadius: 11,
    overflow: "hidden",
    backgroundColor: "#14100c",
    paddingTop: 5,
    paddingHorizontal: 5,
    paddingBottom: 4,
  },
  miniIsland: {
    alignSelf: "center",
    width: 26,
    height: 6,
    borderRadius: 4,
    backgroundColor: "#000",
    marginBottom: 5,
  },
  miniHome: {
    alignSelf: "center",
    width: 30,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.28)",
    marginTop: 5,
  },
  miniBlock: {
    width: "100%",
    height: 86,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(214,86,76,0.42)",
    backgroundColor: "rgba(214,86,76,0.10)",
  },
  miniBlockTxt: {
    fontFamily: fonts.bold,
    fontSize: 9.5,
    color: colors.ink,
    marginTop: 4,
  },
  miniBody: {
    width: "100%",
    height: 86,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card2,
  },
  miniIcon: { fontSize: 18 },
  miniPrayer: {
    fontFamily: fonts.serifItalic,
    fontSize: 9.5,
    lineHeight: 13,
    color: colors.ink,
    textAlign: "center",
    marginTop: 5,
  },
  miniDay: { fontFamily: fonts.extrabold, fontSize: 28, color: colors.gold },
  miniDayLabel: {
    fontFamily: fonts.bold,
    fontSize: 8.5,
    letterSpacing: 1.4,
    color: colors.muted2,
    marginTop: 2,
  },
  miniLabel: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    color: colors.muted,
    marginTop: 8,
    textAlign: "center",
  },

  /* ---------- conteúdo das telas ---------- */
  stepBody: {
    fontFamily: fonts.body,
    fontSize: 15.5,
    lineHeight: 24,
    color: colors.muted,
    marginTop: 20,
  },
  contrast: { marginTop: 14 },
  contrastMuted: { fontFamily: fonts.body, fontSize: 14, color: colors.muted2 },
  contrastStrong: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.gold,
    marginTop: 2,
  },

  prayerHi: { fontFamily: fonts.serif, fontSize: 19, lineHeight: 26, color: colors.ink, marginTop: 6 },
  prayerCost: {
    fontFamily: fonts.body,
    fontSize: 14.5,
    lineHeight: 22,
    color: colors.muted,
    marginTop: 8,
  },
  prayerCostHot: { fontFamily: fonts.semibold, color: colors.ink },
  prayerDivider: {
    height: 1,
    backgroundColor: colors.lineSoft,
    marginVertical: 16,
  },
  prayerIcon: { fontSize: 22 },
  personalTag: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    backgroundColor: colors.goldSoft,
  },
  personalTagTxt: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    letterSpacing: 0.3,
    color: colors.gold,
  },
  prayerTag: {
    fontFamily: fonts.bold,
    fontSize: 11,
    letterSpacing: 1.3,
    color: colors.gold,
    marginTop: 8,
  },
  prayerText: {
    fontFamily: fonts.serifItalic,
    fontSize: 15,
    lineHeight: 24,
    color: colors.ink,
    marginTop: 10,
  },
  prayerVerse: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    lineHeight: 19,
    color: colors.muted2,
    marginTop: 10,
  },

  tickerWrap: { alignItems: "center", paddingVertical: 8 },
  ticker: {
    fontFamily: fonts.extrabold,
    fontSize: 40,
    letterSpacing: 1,
    color: colors.gold,
  },
  resetTitle: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.ink,
    textAlign: "center",
    marginBottom: 14,
  },
  resetRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  resetDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.goldSoft,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    marginTop: 1,
  },
  resetDotTxt: { fontFamily: fonts.bold, fontSize: 11, color: colors.gold },
  resetStep: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 20,
    color: colors.muted,
  },

  punchBox: {
    marginTop: 20,
    borderLeftWidth: 2,
    borderLeftColor: colors.gold,
    paddingLeft: 14,
  },
  punch: { fontFamily: fonts.serif, fontSize: 20, lineHeight: 28, color: colors.ink },
  punchSub: {
    fontFamily: fonts.body,
    fontSize: 14.5,
    lineHeight: 22,
    color: colors.muted,
    marginTop: 8,
  },
});

export default { InterruptStep, PrayerStep, ResetStep, MiniMocks, CommunityPrint };
