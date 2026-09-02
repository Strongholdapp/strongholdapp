/* ============================================================
   screens.js , as 27 telas do onboarding como CONFIGURAÇÃO.

   O PRD (seção 3) manda não criar 27 páginas hardcoded: existe um
   renderer que monta a tela a partir daqui. Mudar copy, ordem, opção ou
   ponto de proof é mexer neste arquivo, nunca em componente.

   Cada tela segue o contrato da seção 3.2:
     id, type, progress, headline, subheadline, options, cta,
     autoAdvance, minSelections/maxSelections, store, next, analytics.

   Regras de copy do projeto, valem pra tudo aqui:
   sem travessão, sem promessa médica, Deus é aliado e nunca juiz,
   privacidade é argumento nº 1, e nenhum número ou review inventado.
   ============================================================ */

import { APP_RATING, IDENTITY_LINE } from "./proof";

// Progresso: só corre durante o bloco de perguntas (telas 02 a 13 e 21/25).
// O PRD proíbe mostrar 100% antes do diagnóstico.
const P = (n) => Math.round((n / 16) * 100) / 100;

export const SCREENS = [
  /* ---------- 01 ---------- */
  {
    id: "screen_01_welcome",
    type: "WELCOME",
    rating: APP_RATING, // null enquanto não houver avaliação real na loja
    identityLine: IDENTITY_LINE,
    headline: "Welcome to Stronghold",
    subheadline: "Take a 3-minute quiz to start your journey to freedom.",
    cta: "Start Quiz",
    secondary: "Already have an account? Log in",
    analytics: { view: "onboarding_screen_view", submit: "onboarding_start_quiz_tap" },
    next: "screen_02_name",
  },

  /* ---------- 02 ---------- */
  {
    id: "screen_02_name",
    type: "TEXT_INPUT",
    progress: P(1),
    eyebrow: "Make Stronghold yours",
    headline: "What should we call you?",
    placeholder: "First name",
    cta: "Continue",
    store: "name",
    next: "screen_03_goals",
  },

  /* ---------- 03 ---------- */
  {
    id: "screen_03_goals",
    type: "MULTI_SELECT",
    progress: P(2),
    headline: "So tell us, {name}, what do you want most right now?",
    subheadline: "Choose up to 3.",
    minSelections: 1,
    maxSelections: 3,
    cta: "Continue",
    store: "goals",
    options: [
      { value: "god", emoji: "🙏", label: "Get close to God again" },
      { value: "control", emoji: "🛡", label: "Take back control" },
      { value: "peace", emoji: "🌙", label: "Have peace at night" },
      { value: "shame", emoji: "🕊", label: "Break free from shame" },
      { value: "marriage", emoji: "❤️", label: "Protect my marriage or relationships" },
      { value: "calling", emoji: "🧭", label: "Become the man God called me to be" },
      { value: "focus", emoji: "🧠", label: "Get my focus and clarity back" },
    ],
    next: "screen_04_desire",
  },

  /* ---------- 04 ---------- */
  {
    id: "screen_04_desire",
    type: "SINGLE_SELECT",
    progress: P(3),
    headline: "If Stronghold worked exactly how you need it to, what would matter most?",
    autoAdvance: true,
    store: "primary_desire",
    options: [
      { value: "close_no_hiding", label: "Feeling close to God without hiding" },
      { value: "in_control", label: "Knowing I'm finally in control" },
      { value: "clear_conscience", label: "Going to sleep with a clear conscience" },
      { value: "present", label: "Being fully present with my wife or family" },
      { value: "who_i_should_be", label: "Becoming who I know I'm supposed to be" },
    ],
    next: "screen_05_goals_bridge",
  },

  /* ---------- 05 , proof #1 (identidade) ---------- */
  {
    id: "screen_05_goals_bridge",
    type: "PERSONALIZED_INTERSTITIAL",
    headline: "You're not the only Christian man who wants this back.",
    proof: "ethan",
    goalsRecap: true,
    destinationLabel: "Your destination",
    cta: "Continue",
    analytics: { view: "onboarding_proof_view", proof_id: "ethan" },
    next: "screen_06_frequency",
  },

  /* ---------- 06 ---------- */
  {
    id: "screen_06_frequency",
    type: "SINGLE_SELECT",
    progress: P(4),
    headline: "How often do you currently watch porn?",
    autoAdvance: true,
    store: "frequency",
    options: [
      { value: "multi_daily", label: "More than once a day" },
      { value: "daily", label: "Once a day" },
      { value: "few_weekly", label: "A few times a week" },
      { value: "weekly", label: "About once a week" },
      { value: "less_weekly", label: "Less than once a week" },
      { value: "stopped", label: "I've recently stopped" },
    ],
    next: "screen_07_duration",
  },

  /* ---------- 07 ---------- */
  {
    id: "screen_07_duration",
    type: "SINGLE_SELECT",
    progress: P(5),
    headline: "How long has porn been part of your life?",
    autoAdvance: true,
    store: "struggle_duration",
    options: [
      { value: "under_1", label: "Less than a year" },
      { value: "y1_3", label: "1 to 3 years" },
      { value: "y3_5", label: "3 to 5 years" },
      { value: "y5_10", label: "5 to 10 years" },
      { value: "over_10", label: "More than 10 years" },
    ],
    next: "screen_08_danger_moments",
  },

  /* ---------- 08 ---------- */
  {
    id: "screen_08_danger_moments",
    type: "MULTI_SELECT",
    progress: P(6),
    headline: "When does temptation hit hardest?",
    subheadline: "Pick all that apply.",
    minSelections: 1,
    cta: "Continue",
    store: "danger_moments",
    derive: ["primary_danger_moment"],
    options: [
      { value: "late_night", emoji: "🌙", label: "Late at night" },
      { value: "alone", emoji: "🏠", label: "When I'm alone" },
      { value: "stressed", emoji: "😣", label: "When I'm stressed" },
      { value: "bored", emoji: "⏸", label: "When I'm bored" },
      { value: "lonely", emoji: "😔", label: "When I feel lonely" },
      { value: "conflict", emoji: "💔", label: "After conflict or rejection" },
      { value: "triggering_content", emoji: "📱", label: "After seeing triggering content" },
      { value: "no_pattern", emoji: "❓", label: "There's no clear pattern" },
    ],
    next: "screen_09_trigger",
  },

  /* ---------- 09 ---------- */
  {
    id: "screen_09_trigger",
    type: "SINGLE_SELECT",
    progress: P(7),
    headline: "What usually starts the cycle?",
    autoAdvance: true,
    store: "primary_trigger",
    options: [
      { value: "scrolling", label: "Scrolling on my phone" },
      { value: "stress", label: "Stress or anxiety" },
      { value: "boredom", label: "Boredom" },
      { value: "loneliness", label: "Loneliness" },
      { value: "sexual_content", label: "Sexual content online" },
      { value: "cant_sleep", label: "I can't sleep" },
      { value: "before_realize", label: "It happens before I even realize it" },
    ],
    next: "screen_10_pattern_reveal",
  },

  /* ---------- 10 , proof #2 (contextual) ---------- */
  {
    id: "screen_10_pattern_reveal",
    type: "PATTERN_REVEAL",
    headline: "Your temptation isn't random, {name}.",
    subheadline: "It follows a pattern.",
    cards: [
      { valueFrom: "primary_danger_moment", caption: "Your highest-risk window." },
      { valueFrom: "primary_trigger", caption: "Your strongest trigger." },
    ],
    closer: "That's good news.",
    closerSub: "Because a predictable pattern can be interrupted.",
    proof: "noah",
    cta: "Continue",
    analytics: { view: "onboarding_proof_view", proof_id: "noah" },
    next: "screen_11_deepest_cost",
  },

  /* ---------- 11 ---------- */
  {
    id: "screen_11_deepest_cost",
    type: "SINGLE_SELECT",
    progress: P(8),
    headline: "When you fall, what hurts the most afterward?",
    autoAdvance: true,
    store: "deepest_cost",
    options: [
      { value: "distant_god", emoji: "🙏", label: "Feeling distant from God" },
      { value: "shame", emoji: "😔", label: "Shame or guilt" },
      { value: "numb", emoji: "🕊", label: "Feeling spiritually numb" },
      { value: "trapped", emoji: "🔁", label: "Feeling trapped in the same cycle" },
      { value: "letting_down", emoji: "❤️", label: "Letting someone I love down" },
      { value: "focus", emoji: "🧠", label: "Losing focus and motivation" },
      { value: "regret", emoji: "🌅", label: "Regret the next morning" },
    ],
    next: "screen_12_past_attempts",
  },

  /* ---------- 12 ---------- */
  {
    id: "screen_12_past_attempts",
    type: "MULTI_SELECT",
    progress: P(9),
    headline: "What have you already tried to quit?",
    subheadline: "Pick all that apply.",
    minSelections: 1,
    cta: "Continue",
    store: "past_attempts",
    options: [
      { value: "prayer", label: "Prayer" },
      { value: "blockers", label: "Content blockers" },
      { value: "partner", label: "Accountability partner" },
      { value: "confession", label: "Confession or talking to someone" },
      { value: "fasting", label: "Fasting" },
      { value: "deleting", label: "Deleting apps" },
      { value: "cold_turkey", label: "Cold turkey" },
      { value: "streak_apps", label: "Streak or habit apps" },
      { value: "other", label: "Something else" },
    ],
    next: "screen_13_attempt_count",
  },

  /* ---------- 13 ---------- */
  {
    id: "screen_13_attempt_count",
    type: "SINGLE_SELECT",
    progress: P(10),
    headline: "How many times have you seriously tried to stop?",
    autoAdvance: true,
    store: "quit_attempt_count",
    options: [
      { value: "first", label: "This is my first serious attempt" },
      { value: "few", label: "A few times" },
      { value: "many", label: "Many times" },
      { value: "lost_count", label: "I've lost count" },
    ],
    next: "screen_14_reframe",
  },

  /* ---------- 14 ---------- */
  {
    id: "screen_14_reframe",
    type: "REFRAME",
    headline: "Then this probably isn't because you don't want freedom badly enough.",
    // Blocos revelados um a um. O primeiro é trocado quando é a primeira
    // tentativa dele (edge case da seção 11 do PRD).
    blocks: [
      "You've prayed.",
      "You've promised yourself this time would be different.",
      "Maybe you blocked websites, deleted apps or started another streak.",
      "But when the moment came, you were still alone with the urge.",
    ],
    punch: "Eventually, the pattern starts to feel automatic.",
    punchSub: "And automatic patterns can be interrupted.",
    // O diagrama do loop entrou aqui em vez de virar tela própria: depois de
    // Block/Prayer/Reset ele seria repetição (decisão do Lucas, 02/09).
    loop: {
      label: "The loop today",
      steps: ["Trigger", "Urge", "Fall", "Relief", "Shame"],
      back: "and back to the trigger.",
    },
    cta: "Show me how",
    next: "screen_15_block",
  },

  /* ---------- 15 , STEP 1: BLOCK ----------
     Copy conferida contra o que o app faz, que agora são DUAS camadas:
     o Maximum Protection (perfil de DNS, bloqueia sozinho no aparelho
     inteiro) e a Intervenção (acionada por ela no momento). A copy fala
     das duas sem fundir uma na outra, que era a incoerência antiga. ---------- */
  {
    id: "screen_15_block",
    type: "INTERRUPT",
    eyebrow: "Step 1",
    headline: "Interrupt the path",
    blockedLabel: "Blocked.",
    body: "Maximum Protection blocks adult sites across your whole phone, quietly, without you doing anything. And when the pull hits anyway, one tap stops the moment before it goes further.",
    contrastA: "Not after the fall.",
    contrastB: "Before the cycle continues.",
    cta: "Continue",
    analytics: { view: "onboarding_mechanism_demo_view", personalized: true },
    next: "screen_16_prayer",
  },

  /* ---------- 16 , STEP 2: PRAYER ----------
     A tela mais importante do onboarding. O mockup mostra a oração que o
     motor de fato escolheu pro perfil dele, não um exemplo. ---------- */
  {
    id: "screen_16_prayer",
    type: "PRAYER_STEP",
    eyebrow: "Step 2",
    headline: "Come back to God",
    stayLine: "stay here for a moment.",
    costPrefix: "You told us the hardest part of this struggle is",
    prayerTag: "A prayer written for this exact moment",
    body: "Built from your trigger, your struggle and what you're fighting for.",
    cta: "Continue",
    analytics: { view: "onboarding_mechanism_demo_view", personalized: true },
    next: "screen_17_reset",
  },

  /* ---------- 17 , STEP 3: RESET , proof #3 (mecanismo) ---------- */
  {
    id: "screen_17_reset",
    type: "RESET_STEP",
    eyebrow: "Step 3",
    headline: "Get through the next 2 minutes",
    punch: "One practical reset.",
    body: "A short guided action to help you step out of the automatic pattern and choose differently.",
    proof: "caleb",
    proofTag: "The moment",
    cta: "Continue",
    analytics: { view: "onboarding_proof_view", proof_id: "caleb" },
    next: "screen_18_privacy",
  },

  /* ---------- 17 ---------- */
  {
    id: "screen_18_privacy",
    type: "PRIVACY",
    headline: "And nobody needs to know.",
    subheadline: "Your struggle stays private.",
    checks: [
      "No mandatory accountability partner",
      "No public confession",
      "No exposing your history",
      "Your recovery stays between you, Stronghold and God",
    ],
    seal: "Private. No judgment.",
    cta: "Continue",
    next: "screen_19_profile",
  },

  /* ---------- 19 ---------- */
  {
    id: "screen_19_profile",
    type: "RECOVERY_PROFILE",
    eyebrow: "Your recovery profile",
    rows: [
      { emoji: "🌙", label: "Highest-risk moment", valueFrom: "primary_danger_moment" },
      { emoji: "😣", label: "Main trigger", valueFrom: "primary_trigger" },
      { emoji: "🙏", label: "Deepest cost", valueFrom: "deepest_cost" },
      { emoji: "🔁", label: "Previous attempts", valueFrom: "quit_attempt_count" },
    ],
    closer: "Your pattern is predictable.",
    closerSub: "That makes it interruptible.",
    cta: "Continue",
    analytics: { view: "onboarding_recovery_profile_view" },
    next: "screen_20_plan",
  },

  /* ---------- 20 , proof #4 (progresso) ---------- */
  {
    id: "screen_20_plan",
    type: "PLAN_90",
    headline: "Your 90-Day Stronghold Plan",
    dateLabel: "90 days from today",
    phases: [
      {
        days: "Days 1 to 7",
        title: "Break the automatic pattern",
        body: "Catch the cycle earlier and interrupt it.",
      },
      {
        days: "Days 8 to 28",
        title: "Protect your danger moments",
        body: "Build protection around the times you're most vulnerable.",
      },
      {
        days: "Days 29 to 60",
        title: "Build a new response",
        body: "Replace the old reaction with prayer and reset.",
      },
      {
        days: "Days 61 to 90",
        title: "Make freedom your default",
        body: "Strengthen the new pattern and your relationship with God.",
      },
    ],
    // Marcos iguais aos da Celebration: o que ele vê aqui é o que vai ver
    // no app depois, não uma ilustração.
    streak: {
      label: "Your streak",
      milestones: ["Day 1", "Day 3", "Day 7", "Day 28", "Day 90"],
      foot: "Day 1 starts the moment you finish here.",
    },
    proof: "nathan",
    cta: "Continue",
    analytics: { view: "onboarding_proof_view", proof_id: "nathan" },
    next: "screen_21_first_goal",
  },

  /* ---------- 21 ---------- */
  {
    id: "screen_21_first_goal",
    type: "SINGLE_SELECT",
    progress: P(13),
    eyebrow: "Forget 90 days for a second",
    headline: "What's the first win you're willing to commit to?",
    store: "first_goal",
    autoAdvance: true,
    options: [
      { value: "h12", label: "12 hours" },
      { value: "d1", label: "1 day", recommended: true },
      { value: "d3", label: "3 days" },
    ],
    analytics: { submit: "onboarding_first_goal_selected" },
    next: "screen_22_celebration",
  },

  /* ---------- 22 ---------- */
  {
    id: "screen_22_celebration",
    type: "CELEBRATION",
    headline: "Your first Stronghold is set.",
    goalLine: "{first_goal}.",
    subheadline: "One temptation at a time.",
    milestones: ["DAY 1", "DAY 3", "DAY 7", "DAY 28", "DAY 90"],
    closer: "Day 1 starts now.",
    cta: "Continue",
    next: "screen_23_notif_preprompt",
  },

  /* ---------- 23 ---------- */
  {
    id: "screen_23_notif_preprompt",
    type: "PERMISSION_PREPROMPT",
    headline: "Let Stronghold reach you when it matters.",
    subheadline:
      "Notifications help Stronghold deliver prayers, resets and protection prompts around your highest-risk moments.",
    cta: "Enable Protection",
    secondary: "Not now",
    analytics: { submit: "onboarding_notification_preprompt_tap" },
    next: "screen_25_commitment", // a 24 é o prompt nativo, disparado pela 23
  },

  /* ---------- 24 , prompt nativo do iOS (não é tela desenhada) ---------- */
  {
    id: "screen_24_native_permission",
    type: "NATIVE_PERMISSION",
    store: "notification_permission",
    analytics: { submit: "onboarding_notification_permission_result" },
    next: "screen_25_commitment",
  },

  /* ---------- 25 ---------- */
  {
    id: "screen_25_commitment",
    type: "COMMITMENT",
    progress: P(15),
    headline: "One last thing, {name}.",
    subheadline: "How committed are you to making this attempt different?",
    store: "commitment_level",
    confirm: "Stronghold is ready.",
    options: [
      { value: "extremely", label: "Extremely committed" },
      { value: "very", label: "Very committed" },
      { value: "somewhat", label: "Somewhat committed" },
      { value: "exploring", label: "Just exploring" },
    ],
    next: "screen_26_final_proof",
  },

  /* ---------- 26 , proof concentrada ---------- */
  {
    id: "screen_26_final_proof",
    type: "PROOF_BRIDGE",
    headline: "You're not the only Christian man fighting this.",
    rating: APP_RATING,
    // Carrossel com o grupo do funil (cardsPaywall: Caleb, Nathan, Joshua).
    // A ordem é a das objeções: mecanismo, casamento, Deus.
    marqueeGroup: "paywall",
    reviews: [
      { id: "joshua", tag: "Faith" },
      { id: "caleb", tag: "The moment" },
      { id: "nathan", tag: "Living without the secret" },
    ],
    mechanismTitle: "Stronghold was built for the moment other solutions miss.",
    mechanism: [
      { n: 1, title: "STOP", body: "One tap stops the moment before the cycle continues." },
      {
        n: 2,
        title: "PRAY",
        body: "A prayer personalized to your struggle, with your name.",
      },
      { n: 3, title: "RESET", body: "Two minutes to get through the urge." },
    ],
    closer:
      "You've already told Stronghold where you struggle, what triggers you and why freedom matters to you.",
    closerSub: "Your protection is ready.",
    cta: "See My Plan",
    analytics: { view: "onboarding_proof_view" },
    next: "screen_27_paywall",
  },

  /* ---------- 27 ---------- */
  {
    id: "screen_27_paywall",
    type: "PAYWALL",
    headline: "Your Stronghold is ready, {name}.",
    subheadline: "Built around your pattern.",
    rows: [
      { emoji: "🌙", label: "Your danger moment", valueFrom: "primary_danger_moment" },
      { emoji: "😣", label: "Your trigger", valueFrom: "primary_trigger" },
      { emoji: "🙏", label: "What you're fighting for", valueFrom: "primary_desire" },
    ],
    whenTitle: "When temptation hits:",
    features: [
      { emoji: "🔒", text: "One tap stops the moment" },
      { emoji: "🙏", text: "Your personalized prayer appears" },
      { emoji: "⏱", text: "Your 2-minute reset begins" },
      { emoji: "📖", text: "Scripture matched to the moment" },
      { emoji: "📈", text: "Your progress stays private" },
    ],
    closer: "It's not about more willpower.",
    closerSub: "It's about having Stronghold there when willpower is weakest.",
    // Segundo carrossel do funil (cardsPaywallSecondary), mesma função que
    // ele tem lá: "More stories from the brotherhood".
    marqueeGroup: "brotherhood",
    proofs: [
      { id: "daniel", tag: "Faith" },
      { id: "noah", tag: "The moment" },
    ],
    cta: "Start My Stronghold",
    terms: "Private purchase · Cancel anytime",
    analytics: { view: "onboarding_paywall_view" },
    next: null,
  },
];

export const SCREEN_BY_ID = SCREENS.reduce((acc, s) => {
  acc[s.id] = s;
  return acc;
}, {});

export const FIRST_SCREEN = SCREENS[0].id;

/** Índice da tela, usado no analytics (screen_index) e no back. */
export function indexOf(id) {
  return SCREENS.findIndex((s) => s.id === id);
}

export default SCREENS;
