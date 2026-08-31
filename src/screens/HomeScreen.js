/* ============================================================
   HomeScreen.js , Home / Dashboard (tela 4 das 7).
   Streak que conta pra cima, barra de progresso do padrão, card da noite
   de risco, botão de pânico (dispara a Intervenção), hold-to-pledge,
   filtro de conteúdo "bulletproof" e o chip de SOS.
   ============================================================ */

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Dusk, TopBar, WhoMini, Sub, Card, Btn, TabBar, Pill } from "../components/ui";
import { ShieldIcon } from "../components/Icons";
import { colors, fonts, radius, spacing } from "../theme/theme";
import { COPY } from "../data/copy";
import { useApp } from "../state/AppContext";

function pad(n) {
  return n < 10 ? "0" + n : String(n);
}

export default function HomeScreen() {
  const { state, go, streakDay, pledge } = useApp();
  const insets = useSafeAreaInsets();
  const p = state.plan;
  const day = streakDay();
  const pct = Math.min(100, Math.round((day / 90) * 100));

  const [shown, setShown] = useState(0);
  const [clock, setClock] = useState("00h 00m 00s");
  const [filterModal, setFilterModal] = useState(false);
  const meter = useRef(new Animated.Value(0)).current;

  // Streak conta pra cima na entrada (o beat que mais vende no clipe).
  useEffect(() => {
    let cur = 0;
    const step = Math.max(1, Math.ceil(day / 34));
    const id = setInterval(() => {
      cur += step;
      if (cur >= day) {
        cur = day;
        clearInterval(id);
      }
      setShown(cur);
    }, 30);
    return () => clearInterval(id);
  }, [day]);

  useEffect(() => {
    Animated.timing(meter, {
      toValue: pct,
      duration: 1100,
      useNativeDriver: false,
    }).start();
  }, [pct, meter]);

  useEffect(() => {
    const tick = () => {
      const ms = (Date.now() - (state.startDate || Date.now())) % 86400000;
      const s = Math.floor(ms / 1000);
      setClock(
        `${pad(Math.floor(s / 3600))}h ${pad(Math.floor((s % 3600) / 60))}m ${pad(s % 60)}s`
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [state.startDate]);

  const timeOpt = useMemo(() => {
    const opts = (COPY.highRiskTime && COPY.highRiskTime.options) || [];
    return opts.find((o) => o.value === state.answers.highRiskTime);
  }, [state.answers.highRiskTime]);

  const dv = (COPY.todayVsMockup && COPY.todayVsMockup.left) || {
    tag: "TONIGHT REQUIRES EXTRA ATTENTION",
    lines: ["Stress is high", "You are alone", "It is late"],
  };

  if (!p) return null;

  return (
    <Dusk>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 6,
          paddingHorizontal: spacing.screenX,
          paddingBottom: 118,
        }}
      >
        <TopBar right={<WhoMini name={p.name} caption={`Day ${day}`} />} />

        <View style={st.hero}>
          <Text style={st.heroLabel}>YOU HAVE BEEN FREE FOR</Text>
          <Text style={st.heroNum}>{shown}</Text>
          <Text style={st.heroUnit}>{day === 1 ? "day" : "days"}</Text>
          <View style={st.clock}>
            <Text style={st.clockTxt}>{clock}</Text>
          </View>
        </View>

        <Card>
          <View style={st.meterRow}>
            <Text style={st.meterLabel}>Overcoming your pattern</Text>
            <Text style={st.meterPct}>{pct}%</Text>
          </View>
          <View style={st.meterTrack}>
            <Animated.View
              style={[
                st.meterFill,
                {
                  width: meter.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>
        </Card>

        <View style={st.danger}>
          <Text style={st.dangerTag}>{String(dv.tag).toUpperCase()}</Text>
          <View style={{ marginTop: 12, gap: 8 }}>
            {(dv.lines || []).map((l) => (
              <View key={l} style={st.dangerLine}>
                <View style={st.dangerDot} />
                <Text style={st.dangerTxt}>{l}</Text>
              </View>
            ))}
          </View>
        </View>

        <Btn
          variant="panic"
          title="I am being tempted right now"
          subtitle="Stronghold steps in. Tap before you open anything else."
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
            go("intervention", { ivStart: 0 });
          }}
        />

        <Pledge day={day} pledgedDay={state.pledgedDay} onPledge={pledge} />

        <Pressable style={st.filterRow} onPress={() => setFilterModal(true)}>
          <View style={st.filterIco}>
            <ShieldIcon size={20} color={colors.gold} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={st.filterT}>Content filter</Text>
            <Text style={st.filterS}>Blocking adult sites on this device</Text>
          </View>
          <View style={st.switchOn}>
            <View style={st.knob} />
          </View>
        </Pressable>

        <Sub style={{ marginTop: 18, fontSize: 14 }}>
          Your highest-risk window is{" "}
          <Text style={{ color: colors.ink, fontFamily: fonts.bold }}>
            {timeOpt ? timeOpt.resultLabel : "late night"}
          </Text>
          . Stronghold is watching that moment for you.
        </Sub>
      </ScrollView>

      <Pressable
        style={[st.sos, { bottom: insets.bottom + 82 }]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
          go("sos");
        }}
      >
        <Text style={st.sosTxt}>SOS</Text>
      </Pressable>

      <TabBar active="home" onNavigate={go} />

      <FilterModal
        visible={filterModal}
        name={p.name}
        onClose={() => setFilterModal(false)}
      />
    </Dusk>
  );
}

/* ---------- Hold-to-pledge: segurar enche a barra, soltar antes reseta ---------- */
function Pledge({ day, pledgedDay, onPledge }) {
  const done = pledgedDay === day;
  const fill = useRef(new Animated.Value(done ? 100 : 0)).current;
  const anim = useRef(null);

  const start = () => {
    if (done) return;
    anim.current = Animated.timing(fill, {
      toValue: 100,
      duration: 1500,
      useNativeDriver: false,
    });
    anim.current.start(({ finished }) => {
      if (finished) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        onPledge();
      }
    });
  };

  const cancel = () => {
    if (done) return;
    if (anim.current) anim.current.stop();
    Animated.timing(fill, { toValue: 0, duration: 160, useNativeDriver: false }).start();
  };

  return (
    <View style={st.pledgeCard}>
      <Text style={st.pledgeT}>Tonight's pledge</Text>
      <Text style={st.pledgeS}>
        {done
          ? "You committed. Stronghold has your back tonight."
          : 'Hold the button: "Not tonight. I\'m staying free."'}
      </Text>
      <Pressable
        style={st.pledgeBtn}
        onPressIn={start}
        onPressOut={cancel}
        disabled={done}
      >
        <Animated.View
          style={[
            st.pledgeFill,
            {
              width: fill.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] }),
            },
          ]}
        />
        <Text style={st.pledgeLabel}>{done ? "Pledged for tonight ✓" : "Hold to pledge"}</Text>
      </Pressable>
    </View>
  );
}

/* ---------- "Bulletproof": tentar desligar o filtro dispara a recusa ---------- */
function FilterModal({ visible, name, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={st.overlay}>
        <View style={st.fxCard}>
          <View style={st.fxIcon}>
            <ShieldIcon size={26} color={colors.gold} />
          </View>
          <Text style={st.fxTitle}>Stay strong, {name}.</Text>
          <Text style={st.fxBody}>
            You asked us to keep this locked, so we will. The filter can't be switched off in a
            weak moment. That's the whole point.
          </Text>
          <Btn title="You're right. Keep it on." onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const st = StyleSheet.create({
  hero: { alignItems: "center", paddingTop: 26, paddingBottom: 10 },
  heroLabel: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, letterSpacing: 1.2 },
  heroNum: { fontFamily: fonts.serif, fontSize: 78, lineHeight: 84, color: colors.ink, marginTop: 8 },
  heroUnit: { fontFamily: fonts.body, fontSize: 15, color: colors.muted },
  clock: {
    marginTop: 12,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: "rgba(224,180,103,0.35)",
    backgroundColor: "rgba(224,180,103,0.1)",
    paddingVertical: 7,
    paddingHorizontal: 16,
  },
  clockTxt: { fontFamily: fonts.semibold, fontSize: 14, color: colors.gold },

  meterRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 7 },
  meterLabel: { fontFamily: fonts.body, fontSize: 13.5, color: colors.muted },
  meterPct: { fontFamily: fonts.bold, fontSize: 13.5, color: colors.gold },
  meterTrack: { height: 8, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 8, overflow: "hidden" },
  meterFill: { height: "100%", backgroundColor: colors.goldLight, borderRadius: 8 },

  danger: {
    backgroundColor: "rgba(214,130,60,0.1)",
    borderWidth: 1,
    borderColor: "rgba(224,180,103,0.3)",
    borderRadius: radius.xl,
    padding: 18,
    marginTop: 18,
  },
  dangerTag: { fontFamily: fonts.bold, fontSize: 11.5, letterSpacing: 1.1, color: colors.gold },
  dangerLine: { flexDirection: "row", alignItems: "center", gap: 10 },
  dangerDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.gold },
  dangerTxt: { fontFamily: fonts.body, fontSize: 15, color: colors.ink },

  pledgeCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.xl,
    padding: 18,
    marginTop: 18,
  },
  pledgeT: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  pledgeS: { fontFamily: fonts.body, fontSize: 13.5, color: colors.muted, marginTop: 4, lineHeight: 20 },
  pledgeBtn: {
    marginTop: 14,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    backgroundColor: "rgba(224,180,103,0.08)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  pledgeFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(224,180,103,0.35)",
  },
  pledgeLabel: { fontFamily: fonts.bold, fontSize: 15, color: colors.gold },

  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingVertical: 15,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  filterIco: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: "rgba(224,180,103,0.16)",
    alignItems: "center", justifyContent: "center",
  },
  filterT: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  filterS: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
  switchOn: {
    width: 46, height: 28, borderRadius: 14, backgroundColor: colors.gold,
    justifyContent: "center", alignItems: "flex-end", paddingRight: 3,
  },
  knob: { width: 22, height: 22, borderRadius: 11, backgroundColor: "#fff" },

  sos: {
    position: "absolute",
    right: 16,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#c0392b",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#c0392b",
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  sosTxt: { fontFamily: fonts.extrabold, fontSize: 17, color: "#fff", letterSpacing: 1.5 },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(8,6,5,0.72)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  fxCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: colors.sheet,
    borderRadius: radius.sheet,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 24,
    alignItems: "center",
  },
  fxIcon: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: "rgba(224,180,103,0.16)",
    alignItems: "center", justifyContent: "center", marginBottom: 16,
  },
  fxTitle: { fontFamily: fonts.serif, fontSize: 24, color: colors.ink, textAlign: "center" },
  fxBody: {
    fontFamily: fonts.body, fontSize: 15, lineHeight: 23,
    color: colors.muted, textAlign: "center", marginTop: 10,
  },
});
