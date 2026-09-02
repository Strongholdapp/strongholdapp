/* ============================================================
   StoryScreens.js , os tipos que não perguntam nada: eles devolvem valor,
   provam personalização e constroem o argumento até o paywall.

   PERSONALIZED_INTERSTITIAL · PATTERN_REVEAL · REFRAME · MECHANISM
   PRODUCT_DEMO · PRIVACY · RESULT_BRIDGE · RECOVERY_PROFILE · PLAN_90
   CELEBRATION · PERMISSION_PREPROMPT · PROOF_BRIDGE · PAYWALL

   Princípio da seção 12 do PRD: texto longo entra em blocos, nunca de uma
   vez. Por isso quase tudo aqui é embrulhado em <Reveal index=...>.
   ============================================================ */

import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { Btn, Pill } from "../../components/ui";
import { ShieldIcon } from "../../components/Icons";
import { colors, fonts, radius } from "../../theme/theme";
import { Shell, Head, Reveal, ProofCard, ProofMarquee, st as sh } from "./shared";
import { fill, labelFor, labelInline, GOAL_BENEFITS, edgeCopy, ninetyDayDate } from "../derive";

/* ============================================================
   05 , PERSONALIZED_INTERSTITIAL: primeira devolução de valor
   ============================================================ */
export function PersonalizedInterstitial({ screen, profile, onNext, onBack }) {
  const goals = profile.goals || [];
  return (
    <Shell
      onBack={onBack}
      footer={<Btn title={screen.cta} onPress={() => onNext()} />}
    >
      <Head headline={fill(screen.headline, profile)} serif />

      <Reveal index={0}>
        <ProofCard id={screen.proof} />
      </Reveal>

      <Reveal index={1}>
        <Text style={s.sectionLabel}>HERE'S WHAT STRONGHOLD WILL BUILD AROUND</Text>
      </Reveal>

      {goals.map((g, i) => (
        <Reveal key={g} index={2 + i}>
          <View style={s.goalRow}>
            <View style={s.goalDot} />
            <View style={{ flex: 1 }}>
              <Text style={s.goalTitle}>{labelFor("goals", g)}</Text>
              <Text style={s.goalBenefit}>{GOAL_BENEFITS[g]}</Text>
            </View>
          </View>
        </Reveal>
      ))}

      {profile.primary_desire ? (
        <Reveal index={2 + goals.length}>
          <View style={s.destination}>
            <Text style={s.destinationLabel}>{String(screen.destinationLabel).toUpperCase()}</Text>
            <Text style={s.destinationValue}>{labelFor("primary_desire", profile.primary_desire)}</Text>
          </View>
        </Reveal>
      ) : null}
    </Shell>
  );
}

/* ============================================================
   10 , PATTERN_REVEAL: as respostas viram insight
   ============================================================ */
export function PatternReveal({ screen, profile, onNext, onBack }) {
  return (
    <Shell onBack={onBack} footer={<Btn title={screen.cta} onPress={() => onNext()} />}>
      <Head headline={fill(screen.headline, profile)} subheadline={screen.subheadline} serif />

      {(screen.cards || []).map((c, i) => {
        const field = c.valueFrom === "primary_danger_moment" ? "danger_moments" : c.valueFrom;
        const val = labelFor(field, profile[c.valueFrom]);
        if (!val) return null;
        return (
          <Reveal key={c.valueFrom} index={i}>
            <View style={s.patternCard}>
              <Text style={s.patternValue}>{val}</Text>
              <Text style={s.patternCaption}>{c.caption}</Text>
            </View>
          </Reveal>
        );
      })}

      <Reveal index={2}>
        <Text style={s.goodNews}>{screen.closer}</Text>
        <Text style={s.goodNewsSub}>{screen.closerSub}</Text>
      </Reveal>

      <Reveal index={3}>
        <ProofCard id={screen.proof} />
      </Reveal>
    </Shell>
  );
}

/* ============================================================
   14 , REFRAME anti-willpower
   Branch da seção 11 do PRD: quem está na primeira tentativa não pode
   ouvir que "já tentou várias vezes".
   ============================================================ */
export function ReframeScreen({ screen, profile, onNext, onBack }) {
  const edge = edgeCopy(profile);
  const blocks = edge.firstAttempt
    ? [edge.firstAttemptReframe, "The moment does not wait for you to be ready.", "And willpower is the thing that runs out first."]
    : screen.blocks;
  const headline = edge.firstAttempt
    ? "You don't have to lose again before you build protection."
    : screen.headline;

  return (
    <Shell onBack={onBack} footer={<Btn title={screen.cta} onPress={() => onNext()} />}>
      <Head headline={headline} serif />

      <View style={{ marginTop: 8 }}>
        {blocks.map((b, i) => (
          <Reveal key={i} index={i} delay={240}>
            <Text style={s.reframeLine}>{b}</Text>
          </Reveal>
        ))}
      </View>

      <Reveal index={blocks.length} delay={240}>
        <View style={s.punchBox}>
          <Text style={s.punch}>{screen.punch}</Text>
          <Text style={s.punchSub}>{screen.punchSub}</Text>
        </View>
      </Reveal>

      {/* Mini-diagrama do loop: entrou aqui em vez de virar tela própria,
          porque depois de Interrupt/Prayer/Reset ele seria repetição. */}
      {screen.loop ? (
        <Reveal index={blocks.length + 1} delay={240}>
          <View style={s.loopBox}>
            <Text style={s.loopLabel}>{String(screen.loop.label).toUpperCase()}</Text>
            <View style={s.loopRow}>
              {screen.loop.steps.map((step, i) => (
                <React.Fragment key={step}>
                  <Text style={s.loopStep}>{step}</Text>
                  {i < screen.loop.steps.length - 1 ? (
                    <Text style={s.loopArrow}>→</Text>
                  ) : null}
                </React.Fragment>
              ))}
            </View>
            <Text style={s.loopBack}>{screen.loop.back}</Text>
          </View>
        </Reveal>
      ) : null}
    </Shell>
  );
}

/* ============================================================
   15 , MECHANISM: a big idea em passos sequenciais
   ============================================================ */
export function MechanismScreen({ screen, profile, onNext, onBack }) {
  return (
    <Shell onBack={onBack} footer={<Btn title={screen.cta} onPress={() => onNext()} />}>
      <Head headline={screen.headline} serif />

      <View style={{ marginTop: 22 }}>
        {(screen.steps || []).map((step, i) => (
          <Reveal key={step.label} index={i} delay={200}>
            <View style={s.mechRow}>
              <View style={[s.mechIcon, i === 0 && s.mechIconHot]}>
                <Text style={s.mechEmoji}>{step.icon}</Text>
              </View>
              <Text style={[s.mechLabel, i === 0 && s.mechLabelHot]}>{step.label}</Text>
            </View>
            {i < screen.steps.length - 1 ? <View style={s.mechConnector} /> : null}
          </Reveal>
        ))}
      </View>

      <Reveal index={(screen.steps || []).length} delay={200}>
        <Text style={s.mechCloser}>{screen.closer}</Text>
        <Text style={s.mechCloserSub}>{screen.closerSub}</Text>
        <ProofCard id={screen.proof} compact />
      </Reveal>
    </Shell>
  );
}

/* ============================================================
   16 , PRODUCT_DEMO: o mecanismo com os dados DELE
   ============================================================ */
export function ProductDemo({ screen, profile, onNext, onBack }) {
  const edge = edgeCopy(profile);
  const moment = edge.demoUnclearPattern
    ? edge.demoFallbackLine
    : labelFor("danger_moments", profile.primary_danger_moment);

  return (
    <Shell onBack={onBack} footer={<Btn title={screen.cta} onPress={() => onNext()} />}>
      <Head headline={screen.headline} serif />

      <View style={s.phone}>
        <Reveal index={0}>
          <View style={s.phoneTop}>
            <Text style={s.clock}>{screen.clock}</Text>
            <Pill tone="red">{screen.momentLabel}</Pill>
          </View>
          <Text style={s.momentValue}>{moment}</Text>
        </Reveal>

        <Reveal index={1}>
          <View style={s.blocked}>
            <Text style={s.blockedIcon}>🔒</Text>
            <Text style={s.blockedTxt}>{screen.blockedLabel}</Text>
          </View>
        </Reveal>

        <Reveal index={2}>
          <Text style={s.demoBody}>{fill(screen.body, profile)}</Text>
        </Reveal>

        <Reveal index={3}>
          <Text style={s.demoCost}>{fill(screen.costLine, profile)}</Text>
          <Text style={s.demoInvite}>{screen.invite}</Text>
        </Reveal>

        <Reveal index={4}>
          <View style={s.demoCta}>
            <Text style={s.demoCtaTxt}>🙏 {screen.prayerCta}</Text>
          </View>
          <View style={s.demoTimer}>
            <Text style={s.demoTimerNum}>02:00</Text>
            <Text style={s.demoTimerLabel}>{screen.resetLabel}</Text>
          </View>
        </Reveal>
      </View>
    </Shell>
  );
}

/* ============================================================
   17 , PRIVACY
   ============================================================ */
export function PrivacyScreen({ screen, onNext, onBack }) {
  return (
    <Shell onBack={onBack} footer={<Btn title={screen.cta} onPress={() => onNext()} />}>
      <Head headline={screen.headline} subheadline={screen.subheadline} serif />

      <View style={{ marginTop: 26 }}>
        {(screen.checks || []).map((c, i) => (
          <Reveal key={c} index={i} delay={130}>
            <View style={s.privacyRow}>
              <Text style={s.privacyCheck}>✓</Text>
              <Text style={s.privacyTxt}>{c}</Text>
            </View>
          </Reveal>
        ))}
      </View>

      <Reveal index={(screen.checks || []).length} delay={130}>
        <View style={s.seal}>
          <ShieldIcon size={18} color={colors.gold} />
          <Text style={s.sealTxt}>{screen.seal}</Text>
        </View>
      </Reveal>
    </Shell>
  );
}

/* ============================================================
   18 , RESULT_BRIDGE: suspense curto antes do diagnóstico
   ============================================================ */
export function ResultBridge({ screen, profile, onNext, onBack }) {
  return (
    <Shell
      onBack={onBack}
      scroll={false}
      contentStyle={{ justifyContent: "center" }}
      footer={<Btn title={screen.cta} onPress={() => onNext()} />}
    >
      <Reveal index={0}>
        <Text style={s.bridgeName}>{fill(screen.headline, profile)}</Text>
      </Reveal>
      <Reveal index={1}>
        <Text style={s.bridgeSub}>{screen.subheadline}</Text>
      </Reveal>
    </Shell>
  );
}

/* ============================================================
   19 , RECOVERY_PROFILE: o "isso é sobre mim"
   ============================================================ */
export function RecoveryProfile({ screen, profile, onNext, onBack }) {
  return (
    <Shell onBack={onBack} footer={<Btn title={screen.cta} onPress={() => onNext()} />}>
      <View style={{ marginTop: 20 }}>
        <Text style={s.eyebrowGold}>{String(screen.eyebrow).toUpperCase()}</Text>
      </View>

      {(screen.rows || []).map((r, i) => {
        const field = r.valueFrom === "primary_danger_moment" ? "danger_moments" : r.valueFrom;
        const val = labelFor(field, profile[r.valueFrom]);
        if (!val) return null;
        return (
          <Reveal key={r.valueFrom} index={i}>
            <View style={s.profileCard}>
              <Text style={s.profileEmoji}>{r.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.profileLabel}>{r.label}</Text>
                <Text style={s.profileValue}>{val}</Text>
              </View>
            </View>
          </Reveal>
        );
      })}

      <Reveal index={(screen.rows || []).length}>
        <View style={s.profileCloser}>
          <Text style={s.profileCloserTxt}>{screen.closer}</Text>
          <Text style={s.profileCloserGold}>{screen.closerSub}</Text>
        </View>
      </Reveal>
    </Shell>
  );
}

/* ============================================================
   20 , PLAN_90
   ============================================================ */
export function Plan90({ screen, profile, onNext, onBack }) {
  const date = profile.ninety_day_date || ninetyDayDate(profile.started_at);
  return (
    <Shell onBack={onBack} footer={<Btn title={screen.cta} onPress={() => onNext()} />}>
      <Head headline={screen.headline} serif />

      <Reveal index={0}>
        <View style={s.dateBox}>
          <Text style={s.dateLabel}>{String(screen.dateLabel).toUpperCase()}</Text>
          <Text style={s.dateValue}>{date}</Text>
        </View>
      </Reveal>

      {(screen.phases || []).map((ph, i) => (
        <Reveal key={ph.days} index={i + 1}>
          <View style={s.phaseRow}>
            <View style={s.phaseNum}>
              <Text style={s.phaseNumTxt}>{i + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.phaseDays}>{ph.days}</Text>
              <Text style={s.phaseTitle}>{ph.title}</Text>
              <Text style={s.phaseBody}>{ph.body}</Text>
            </View>
          </View>
        </Reveal>
      ))}

      {/* Streak: o plano vira mais visual sem virar texto novo. Os marcos
          são os mesmos da Celebration, então o que ele vê aqui é o que ele
          vai ver no app depois. */}
      {screen.streak ? (
        <Reveal index={5}>
          <View style={s.streakBox}>
            <Text style={s.streakLabel}>{String(screen.streak.label).toUpperCase()}</Text>
            <View style={s.streakRow}>
              {screen.streak.milestones.map((m, i) => (
                <View key={m} style={s.streakItem}>
                  <View style={[s.streakDot, i === 0 && s.streakDotHot]}>
                    <Text style={[s.streakDotTxt, i === 0 && s.streakDotTxtHot]}>{m}</Text>
                  </View>
                  {i < screen.streak.milestones.length - 1 ? (
                    <View style={s.streakLine} />
                  ) : null}
                </View>
              ))}
            </View>
            <Text style={s.streakFoot}>{screen.streak.foot}</Text>
          </View>
        </Reveal>
      ) : null}

      <Reveal index={6}>
        <ProofCard id={screen.proof} />
      </Reveal>
    </Shell>
  );
}

/* ============================================================
   22 , CELEBRATION: confetti curto (<= 1.5 s) + milestones
   ============================================================ */
export function Celebration({ screen, profile, onNext }) {
  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, []);

  return (
    <Shell scroll={false} contentStyle={{ justifyContent: "center" }} footer={<Btn title={screen.cta} onPress={() => onNext()} />}>
      <Confetti />
      <View style={{ alignItems: "center" }}>
        <Reveal index={0}>
          <View style={s.celebCheck}>
            <Text style={s.celebCheckTxt}>✓</Text>
          </View>
        </Reveal>
        <Reveal index={1}>
          <Text style={s.celebTitle}>{screen.headline}</Text>
        </Reveal>
        <Reveal index={2}>
          <Text style={s.celebGoal}>{fill(screen.goalLine, profile)}</Text>
          <Text style={s.celebSub}>{screen.subheadline}</Text>
        </Reveal>
        <Reveal index={3}>
          <View style={s.milestones}>
            {(screen.milestones || []).map((m, i) => (
              <View key={m} style={s.milestone}>
                <View style={[s.milestoneDot, i === 0 && s.milestoneDotOn]} />
                <Text
                  numberOfLines={1}
                  style={[s.milestoneTxt, i === 0 && { color: colors.gold }]}
                >
                  {m}
                </Text>
              </View>
            ))}
          </View>
        </Reveal>
        <Reveal index={4}>
          <Text style={s.celebCloser}>{screen.closer}</Text>
        </Reveal>
      </View>
    </Shell>
  );
}

function Confetti() {
  const pieces = useRef(
    Array.from({ length: 18 }, (_, i) => ({
      key: i,
      x: 8 + Math.random() * 84,
      delay: Math.random() * 260,
      color: [colors.gold, colors.goldLight, "#f4f1e8", colors.goldDeep][i % 4],
      a: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    const anims = pieces.map((p) =>
      Animated.timing(p.a, {
        toValue: 1,
        duration: 1300,
        delay: p.delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      })
    );
    Animated.parallel(anims).start();
  }, [pieces]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((p) => (
        <Animated.View
          key={p.key}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: 0,
            width: 7,
            height: 11,
            borderRadius: 2,
            backgroundColor: p.color,
            opacity: p.a.interpolate({ inputRange: [0, 0.75, 1], outputRange: [1, 1, 0] }),
            transform: [
              { translateY: p.a.interpolate({ inputRange: [0, 1], outputRange: [0, 420] }) },
              { rotate: p.a.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "420deg"] }) },
            ],
          }}
        />
      ))}
    </View>
  );
}

/* ============================================================
   23 , PERMISSION_PREPROMPT
   O CTA daqui é quem chama o prompt nativo (tela 24).
   ============================================================ */
export function PermissionPrePrompt({ screen, onEnable, onSkip }) {
  return (
    <Shell
      scroll={false}
      contentStyle={{ justifyContent: "center" }}
      footer={
        <>
          <Btn title={screen.cta} onPress={onEnable} />
          <Pressable onPress={onSkip} hitSlop={10}>
            <Text style={s.skip}>{screen.secondary}</Text>
          </Pressable>
        </>
      }
    >
      <View style={{ alignItems: "center" }}>
        <Reveal index={0}>
          <View style={s.bellBox}>
            <ShieldIcon size={30} color={colors.gold} />
          </View>
        </Reveal>
        <Reveal index={1}>
          <Text style={s.permTitle}>{screen.headline}</Text>
        </Reveal>
        <Reveal index={2}>
          <Text style={s.permSub}>{screen.subheadline}</Text>
        </Reveal>
      </View>
    </Shell>
  );
}

/* ============================================================
   26 , PROOF_BRIDGE: proof concentrada + recap do mecanismo
   ============================================================ */
export function ProofBridge({ screen, profile, onNext, onBack }) {
  return (
    <Shell onBack={onBack} footer={<Btn title={screen.cta} onPress={() => onNext()} />}>
      <Head headline={screen.headline} serif />

      {screen.marqueeGroup ? (
        <Reveal index={0}>
          <ProofMarquee group={screen.marqueeGroup} />
        </Reveal>
      ) : null}

      {screen.rating ? (
        <Reveal index={0}>
          <View style={{ alignItems: "center", marginTop: 12 }}>
            <Text style={s.stars}>{"★".repeat(Math.round(screen.rating.stars))}</Text>
            <Text style={s.ratingTxt}>
              {screen.rating.stars} · {screen.rating.count} ratings
            </Text>
          </View>
        </Reveal>
      ) : null}

      {(screen.marqueeGroup ? [] : screen.reviews || []).map((r, i) => (
        <Reveal key={r.id} index={i}>
          <ProofCard id={r.id} tag={r.tag} />
        </Reveal>
      ))}

      <Reveal index={3}>
        <Text style={s.mechTitle}>{screen.mechanismTitle}</Text>
      </Reveal>

      {(screen.mechanism || []).map((m, i) => (
        <Reveal key={m.n} index={4 + i}>
          <View style={s.recapRow}>
            <View style={s.recapNum}>
              <Text style={s.recapNumTxt}>{m.n}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.recapTitle}>{m.title}</Text>
              <Text style={s.recapBody}>{m.body}</Text>
            </View>
          </View>
        </Reveal>
      ))}

      <Reveal index={7}>
        <View style={s.readyBox}>
          <Text style={s.readyTxt}>{screen.closer}</Text>
          <Text style={s.readyGold}>{screen.closerSub}</Text>
        </View>
      </Reveal>
    </Shell>
  );
}

/* ============================================================
   27 , PAYWALL: recebe o profile pronto e não pergunta mais nada
   ============================================================ */
export function PaywallBridge({ screen, profile, onStart, onBack, busy, note }) {
  return (
    <Shell
      onBack={onBack}
      footer={
        <>
          <Btn title={busy ? "Opening..." : screen.cta} disabled={busy} onPress={onStart} />
          <Text style={s.terms}>🔒 {screen.terms}</Text>
          {note ? <Text style={s.devnote}>{note}</Text> : null}
        </>
      }
    >
      <Head headline={fill(screen.headline, profile)} subheadline={screen.subheadline} serif />

      {(screen.rows || []).map((r, i) => {
        const field = r.valueFrom === "primary_danger_moment" ? "danger_moments" : r.valueFrom;
        const val = labelFor(field, profile[r.valueFrom]);
        if (!val) return null;
        return (
          <Reveal key={r.valueFrom} index={i}>
            <View style={s.pwRow}>
              <Text style={s.pwEmoji}>{r.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.pwLabel}>{r.label}</Text>
                <Text style={s.pwValue}>{val}</Text>
              </View>
            </View>
          </Reveal>
        );
      })}

      <Reveal index={3}>
        <Text style={s.whenTitle}>{screen.whenTitle}</Text>
      </Reveal>

      {(screen.features || []).map((f, i) => (
        <Reveal key={f.text} index={4 + i}>
          <View style={s.featRow}>
            <Text style={s.featEmoji}>{f.emoji}</Text>
            <Text style={s.featTxt}>{f.text}</Text>
          </View>
        </Reveal>
      ))}

      <Reveal index={9}>
        <View style={s.pwCloser}>
          <Text style={s.pwCloserTxt}>{screen.closer}</Text>
          <Text style={s.pwCloserGold}>{screen.closerSub}</Text>
        </View>
      </Reveal>

      {/* A tela de Final Proof deixou de existir e o proof veio pra cá, que é
          o pré-paywall. Três depoimentos cobrindo fé, momento e privacidade,
          que são as três objeções. Todos reais: ProofCard não renderiza id
          que não existe, então nunca sobra card vazio. */}
      {screen.marqueeGroup ? (
        <Reveal index={10}>
          <ProofMarquee group={screen.marqueeGroup} />
        </Reveal>
      ) : (
        (screen.proofs || (screen.proof ? [{ id: screen.proof }] : [])).map((p, i) => (
          <Reveal key={p.id} index={10 + i}>
            <ProofCard id={p.id} tag={p.tag} compact />
          </Reveal>
        ))
      )}
    </Shell>
  );
}

const s = StyleSheet.create({
  /* ---- mini-diagrama do loop (tela do reframe) ---- */
  loopBox: {
    marginTop: 22,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    padding: 16,
  },
  loopLabel: {
    fontFamily: fonts.bold,
    fontSize: 10.5,
    letterSpacing: 1.4,
    color: colors.muted2,
    marginBottom: 10,
  },
  loopRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 6 },
  loopStep: { fontFamily: fonts.semibold, fontSize: 13.5, color: colors.ink },
  loopArrow: { fontFamily: fonts.body, fontSize: 13, color: colors.muted2 },
  loopBack: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted2,
    marginTop: 10,
    fontStyle: "italic",
  },

  /* ---- streak do plano de 90 dias ---- */
  streakBox: {
    marginTop: 20,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    padding: 16,
  },
  streakLabel: {
    fontFamily: fonts.bold,
    fontSize: 10.5,
    letterSpacing: 1.4,
    color: colors.gold,
    marginBottom: 14,
  },
  streakRow: { flexDirection: "row", alignItems: "center" },
  streakItem: { flexDirection: "row", alignItems: "center" },
  streakDot: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card2,
  },
  streakDotHot: { borderColor: colors.goldBorder, backgroundColor: colors.goldSoft },
  streakDotTxt: { fontFamily: fonts.semibold, fontSize: 11.5, color: colors.muted },
  streakDotTxtHot: { color: colors.gold },
  streakLine: { width: 12, height: 1, backgroundColor: colors.lineSoft },
  streakFoot: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted2,
    marginTop: 12,
  },

  sectionLabel: {
    fontFamily: fonts.bold,
    fontSize: 11.5,
    letterSpacing: 1.4,
    color: colors.muted,
    marginTop: 26,
    marginBottom: 4,
  },
  goalRow: { flexDirection: "row", gap: 12, alignItems: "flex-start", marginTop: 14 },
  goalDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.gold, marginTop: 7 },
  goalTitle: { fontFamily: fonts.semibold, fontSize: 16, color: colors.ink },
  goalBenefit: { fontFamily: fonts.body, fontSize: 14, lineHeight: 21, color: colors.muted, marginTop: 3 },
  destination: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: "rgba(224,180,103,0.4)",
    backgroundColor: "rgba(224,180,103,0.08)",
    borderRadius: radius.lg,
    padding: 18,
  },
  destinationLabel: { fontFamily: fonts.bold, fontSize: 11, letterSpacing: 1.4, color: colors.gold },
  destinationValue: { fontFamily: fonts.serif, fontSize: 20, lineHeight: 27, color: colors.ink, marginTop: 8 },

  patternCard: {
    marginTop: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: 18,
  },
  patternValue: { fontFamily: fonts.serif, fontSize: 22, color: colors.gold },
  patternCaption: { fontFamily: fonts.body, fontSize: 14, color: colors.muted, marginTop: 5 },
  goodNews: { fontFamily: fonts.serif, fontSize: 24, color: colors.ink, marginTop: 26 },
  goodNewsSub: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24, color: colors.muted, marginTop: 6 },

  reframeLine: { fontFamily: fonts.body, fontSize: 17, lineHeight: 27, color: colors.muted, marginTop: 14 },
  punchBox: {
    marginTop: 30,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
    paddingLeft: 16,
  },
  punch: { fontFamily: fonts.serif, fontSize: 27, lineHeight: 34, color: colors.ink },
  punchSub: { fontFamily: fonts.serifItalic, fontSize: 25, lineHeight: 33, color: colors.gold, marginTop: 4 },

  mechRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  mechIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  mechIconHot: { backgroundColor: "rgba(214,86,76,0.14)", borderColor: "rgba(214,86,76,0.4)" },
  mechEmoji: { fontSize: 21 },
  mechLabel: { flex: 1, fontFamily: fonts.semibold, fontSize: 16.5, color: colors.ink },
  mechLabelHot: { fontFamily: fonts.bold, letterSpacing: 0.8, color: colors.red },
  mechConnector: {
    width: 2,
    height: 16,
    backgroundColor: colors.line,
    marginLeft: 22,
    marginVertical: 3,
  },
  mechCloser: { fontFamily: fonts.serif, fontSize: 21, color: colors.ink, marginTop: 26 },
  mechCloserSub: { fontFamily: fonts.body, fontSize: 15.5, lineHeight: 24, color: colors.muted, marginTop: 6 },

  phone: {
    marginTop: 22,
    backgroundColor: "rgba(12,9,7,0.55)",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 24,
    padding: 20,
  },
  phoneTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  clock: { fontFamily: fonts.serif, fontSize: 19, color: colors.ink },
  momentValue: { fontFamily: fonts.semibold, fontSize: 16, color: colors.gold, marginTop: 10 },
  blocked: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 16,
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderRadius: radius.md,
    backgroundColor: "rgba(214,86,76,0.12)",
    borderWidth: 1,
    borderColor: "rgba(214,86,76,0.35)",
  },
  blockedIcon: { fontSize: 17 },
  blockedTxt: { fontFamily: fonts.bold, fontSize: 15, color: colors.red },
  demoBody: { fontFamily: fonts.serif, fontSize: 21, lineHeight: 29, color: colors.ink, marginTop: 20 },
  demoCost: { fontFamily: fonts.body, fontSize: 15, lineHeight: 23, color: colors.muted, marginTop: 12 },
  demoInvite: { fontFamily: fonts.serifItalic, fontSize: 17, color: colors.gold, marginTop: 8 },
  demoCta: {
    marginTop: 18,
    borderRadius: radius.md,
    backgroundColor: "rgba(224,180,103,0.16)",
    borderWidth: 1,
    borderColor: colors.goldBorder,
    paddingVertical: 14,
    alignItems: "center",
  },
  demoCtaTxt: { fontFamily: fonts.bold, fontSize: 15, color: colors.gold },
  demoTimer: { alignItems: "center", marginTop: 16 },
  demoTimerNum: { fontFamily: fonts.serif, fontSize: 32, color: colors.ink },
  demoTimerLabel: { fontFamily: fonts.body, fontSize: 13, color: colors.muted2, marginTop: 2 },

  privacyRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 16 },
  privacyCheck: { color: colors.gold, fontSize: 16, fontFamily: fonts.bold, marginTop: 1 },
  privacyTxt: { flex: 1, fontFamily: fonts.body, fontSize: 16, lineHeight: 24, color: colors.ink },
  seal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 18,
    paddingVertical: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    backgroundColor: "rgba(224,180,103,0.08)",
  },
  sealTxt: { fontFamily: fonts.bold, fontSize: 14, color: colors.gold },

  bridgeName: { fontFamily: fonts.serif, fontSize: 36, lineHeight: 44, color: colors.ink },
  bridgeSub: { fontFamily: fonts.body, fontSize: 17, lineHeight: 26, color: colors.muted, marginTop: 14 },

  eyebrowGold: { fontFamily: fonts.bold, fontSize: 11.5, letterSpacing: 1.6, color: colors.gold },
  profileCard: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    marginTop: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: 18,
  },
  profileEmoji: { fontSize: 22 },
  profileLabel: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
  profileValue: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 23, color: colors.ink, marginTop: 3 },
  profileCloser: { marginTop: 28 },
  profileCloserTxt: { fontFamily: fonts.serif, fontSize: 23, color: colors.ink },
  profileCloserGold: { fontFamily: fonts.serifItalic, fontSize: 23, color: colors.gold, marginTop: 2 },

  dateBox: {
    marginTop: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.goldBorder,
    backgroundColor: "rgba(224,180,103,0.08)",
    borderRadius: radius.lg,
    paddingVertical: 18,
  },
  dateLabel: { fontFamily: fonts.body, fontSize: 12, letterSpacing: 1.2, color: colors.muted },
  dateValue: { fontFamily: fonts.serif, fontSize: 23, color: colors.gold, marginTop: 6 },
  phaseRow: { flexDirection: "row", gap: 14, marginTop: 20 },
  phaseNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  phaseNumTxt: { fontFamily: fonts.bold, fontSize: 13, color: colors.onGold },
  phaseDays: { fontFamily: fonts.bold, fontSize: 12, letterSpacing: 1, color: colors.gold },
  phaseTitle: { fontFamily: fonts.semibold, fontSize: 17, color: colors.ink, marginTop: 4 },
  phaseBody: { fontFamily: fonts.body, fontSize: 14.5, lineHeight: 22, color: colors.muted, marginTop: 4 },

  celebCheck: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  celebCheckTxt: { fontSize: 38, color: colors.onGold },
  celebTitle: {
    fontFamily: fonts.serif,
    fontSize: 29,
    lineHeight: 36,
    color: colors.ink,
    textAlign: "center",
    marginTop: 20,
  },
  celebGoal: { fontFamily: fonts.serifItalic, fontSize: 24, color: colors.gold, textAlign: "center", marginTop: 12 },
  celebSub: { fontFamily: fonts.body, fontSize: 15.5, color: colors.muted, textAlign: "center", marginTop: 4 },
  milestones: { flexDirection: "row", gap: 6, marginTop: 30, alignItems: "center" },
  milestone: { alignItems: "center", flex: 1 },
  milestoneDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.line, marginBottom: 7 },
  milestoneDotOn: { backgroundColor: colors.gold },
  milestoneTxt: { fontFamily: fonts.bold, fontSize: 9, letterSpacing: 0, color: colors.muted2 },
  celebCloser: { fontFamily: fonts.semibold, fontSize: 16, color: colors.ink, marginTop: 26 },

  bellBox: {
    width: 78,
    height: 78,
    borderRadius: 24,
    backgroundColor: "rgba(224,180,103,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  permTitle: {
    fontFamily: fonts.serif,
    fontSize: 29,
    lineHeight: 36,
    color: colors.ink,
    textAlign: "center",
    marginTop: 24,
  },
  permSub: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 25,
    color: colors.muted,
    textAlign: "center",
    marginTop: 14,
  },
  skip: { fontFamily: fonts.semibold, fontSize: 14, color: colors.muted, textAlign: "center", marginTop: 14 },

  stars: { color: colors.gold, fontSize: 18, letterSpacing: 3 },
  ratingTxt: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, marginTop: 6 },
  mechTitle: { fontFamily: fonts.serif, fontSize: 21, lineHeight: 29, color: colors.ink, marginTop: 30 },
  recapRow: { flexDirection: "row", gap: 14, marginTop: 18 },
  recapNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  recapNumTxt: { fontFamily: fonts.bold, fontSize: 12, color: colors.gold },
  recapTitle: { fontFamily: fonts.bold, fontSize: 14, letterSpacing: 1.2, color: colors.gold },
  recapBody: { fontFamily: fonts.body, fontSize: 15, lineHeight: 23, color: colors.muted, marginTop: 4 },
  readyBox: { marginTop: 28 },
  readyTxt: { fontFamily: fonts.body, fontSize: 15.5, lineHeight: 24, color: colors.muted },
  readyGold: { fontFamily: fonts.serif, fontSize: 24, color: colors.gold, marginTop: 10 },

  pwRow: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    marginTop: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: 16,
  },
  pwEmoji: { fontSize: 20 },
  pwLabel: { fontFamily: fonts.body, fontSize: 12.5, color: colors.muted },
  pwValue: { fontFamily: fonts.bold, fontSize: 16, color: colors.ink, marginTop: 2 },
  whenTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink, marginTop: 28 },
  featRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 12 },
  featEmoji: { fontSize: 17 },
  featTxt: { flex: 1, fontFamily: fonts.body, fontSize: 15.5, color: colors.ink },
  pwCloser: { marginTop: 28 },
  pwCloserTxt: { fontFamily: fonts.body, fontSize: 16, color: colors.muted },
  pwCloserGold: { fontFamily: fonts.serif, fontSize: 22, lineHeight: 30, color: colors.gold, marginTop: 6 },
  terms: { fontFamily: fonts.body, fontSize: 12.5, color: colors.muted2, textAlign: "center", marginTop: 12 },
  devnote: {
    fontFamily: fonts.body,
    fontSize: 11.5,
    lineHeight: 17,
    color: colors.muted2,
    textAlign: "center",
    marginTop: 12,
  },
});

export default {
  PersonalizedInterstitial,
  PatternReveal,
  ReframeScreen,
  MechanismScreen,
  ProductDemo,
  PrivacyScreen,
  ResultBridge,
  RecoveryProfile,
  Plan90,
  Celebration,
  PermissionPrePrompt,
  ProofBridge,
  PaywallBridge,
};
