/* ============================================================
   derive.js , tudo que transforma respostas em perfil utilizável.

   1. Derivações determinísticas (PRD seção 8): de várias respostas para um
      "primary". Regra auditável e por prioridade, sem IA nesta etapa.
   2. Motor de placeholders (PRD seção 3.4): substitui {name} e companhia
      com fallback neutro. Nunca deixa chave crua na tela, que é critério
      de aceite do PRD.
   3. Ponte pro prayer-engine (PRD seção 9) e pro planEngine que já existe.
   ============================================================ */

/* ------------------------------------------------------------
   1. DERIVAÇÕES
   ------------------------------------------------------------ */

// Prioridade do PRD, seção 8. O primeiro selecionado nesta ordem vence.
export const DANGER_PRIORITY = [
  "late_night",
  "alone",
  "stressed",
  "triggering_content",
  "lonely",
  "bored",
  "conflict",
  "no_pattern",
];

export function derivePrimaryDangerMoment(dangerMoments) {
  const picked = dangerMoments || [];
  for (const key of DANGER_PRIORITY) {
    if (picked.includes(key)) return key;
  }
  return picked[0] || "no_pattern";
}

export function ninetyDayDate(fromMs) {
  const d = new Date(fromMs || Date.now());
  d.setDate(d.getDate() + 90);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

/** Nome sanitizado (PRD, edge case "nome vazio / caracteres estranhos"). */
export function cleanName(raw) {
  if (!raw) return "";
  const only = String(raw)
    .replace(/[^\p{L}' -]/gu, "")
    .trim()
    .split(/\s+/)[0];
  if (!only || only.length < 2) return "";
  return only.charAt(0).toUpperCase() + only.slice(1);
}

/* ------------------------------------------------------------
   2. RÓTULOS , o texto que o usuário vê para cada valor guardado.
   Guardamos chaves, não frases, para o texto poder mudar sem
   quebrar dado já salvo no aparelho.
   ------------------------------------------------------------ */

export const LABELS = {
  goals: {
    god: "Get close to God again",
    control: "Take back control",
    peace: "Have peace at night",
    shame: "Break free from shame",
    marriage: "Protect my marriage or relationships",
    calling: "Become the man God called me to be",
    focus: "Get my focus and clarity back",
  },
  primary_desire: {
    close_no_hiding: "Feeling close to God without hiding",
    in_control: "Knowing I'm finally in control",
    clear_conscience: "Going to sleep with a clear conscience",
    present: "Being fully present with my wife or family",
    who_i_should_be: "Becoming who I know I'm supposed to be",
  },
  frequency: {
    multi_daily: "More than once a day",
    daily: "Once a day",
    few_weekly: "A few times a week",
    weekly: "About once a week",
    less_weekly: "Less than once a week",
    stopped: "I've recently stopped",
  },
  struggle_duration: {
    under_1: "Less than a year",
    y1_3: "1 to 3 years",
    y3_5: "3 to 5 years",
    y5_10: "5 to 10 years",
    over_10: "More than 10 years",
  },
  danger_moments: {
    late_night: "Late at night",
    alone: "When I'm alone",
    stressed: "When I'm stressed",
    bored: "When I'm bored",
    lonely: "When I feel lonely",
    conflict: "After conflict or rejection",
    triggering_content: "After seeing triggering content",
    no_pattern: "There's no clear pattern",
  },
  primary_trigger: {
    scrolling: "Scrolling on my phone",
    stress: "Stress or anxiety",
    boredom: "Boredom",
    loneliness: "Loneliness",
    sexual_content: "Sexual content online",
    cant_sleep: "I can't sleep",
    before_realize: "It happens before I even realize it",
  },
  deepest_cost: {
    distant_god: "Feeling distant from God",
    shame: "Shame or guilt",
    numb: "Feeling spiritually numb",
    trapped: "Feeling trapped in the same cycle",
    letting_down: "Letting someone I love down",
    focus: "Losing focus and motivation",
    regret: "Regret the next morning",
  },
  past_attempts: {
    prayer: "Prayer",
    blockers: "Content blockers",
    partner: "Accountability partner",
    confession: "Confession or talking to someone",
    fasting: "Fasting",
    deleting: "Deleting apps",
    cold_turkey: "Cold turkey",
    streak_apps: "Streak or habit apps",
    other: "Something else",
  },
  quit_attempt_count: {
    first: "This is my first serious attempt",
    few: "A few times",
    many: "Many times",
    lost_count: "I've lost count",
  },
  first_goal: {
    h12: "12 hours",
    d1: "1 day",
    d3: "3 days",
  },
  commitment_level: {
    extremely: "Extremely committed",
    very: "Very committed",
    somewhat: "Somewhat committed",
    exploring: "Just exploring",
  },
};

/**
 * O benefício que o Stronghold promete para cada objetivo escolhido na
 * tela 03. É o que a tela 05 devolve: "você pediu isto, o app vai construir
 * em volta disto". Nada aqui pode virar promessa clínica ou de cura.
 */
export const GOAL_BENEFITS = {
  god: "Prayer in the moment you would normally hide, not after.",
  control: "Protection that shows up at your weakest hour, so it is not all on you.",
  peace: "A guarded night routine, so the late hours stop belonging to the urge.",
  shame: "A way back the same day, with no lecture and nobody else knowing.",
  marriage: "Fewer secrets to carry, and presence you do not have to fake.",
  calling: "Small daily wins that rebuild who you already know you are.",
  focus: "The loop interrupted early, before it eats the rest of your day.",
};

export function labelFor(field, value) {
  const dict = LABELS[field];
  if (!dict) return value || "";
  if (Array.isArray(value)) return value.map((v) => dict[v] || v);
  return dict[value] || value || "";
}

/* Versões em minúscula pra caber no meio de uma frase.
   "You told us the hardest part is shame or guilt." */
export function labelInline(field, value) {
  const l = labelFor(field, value);
  if (!l || Array.isArray(l)) return l;
  // "I'm" e "I" precisam continuar maiúsculos
  return l.charAt(0).toLowerCase() + l.slice(1);
}

/* ------------------------------------------------------------
   3. PLACEHOLDERS
   ------------------------------------------------------------ */

const FALLBACKS = {
  name: "you",
  goal_1: "what you're fighting for",
  goal_2: "",
  goal_3: "",
  primary_desire: "the life you're aiming at",
  primary_danger_moment: "your hardest moment",
  primary_trigger: "what usually starts it",
  deepest_cost: "what it costs you",
  quit_attempt_count: "your past attempts",
  first_goal: "your first goal",
  "90_day_date": "90 days from today",
};

export function vars(profile) {
  const p = profile || {};
  const goals = labelFor("goals", p.goals || []);
  return {
    name: cleanName(p.name) || FALLBACKS.name,
    goal_1: goals[0] || FALLBACKS.goal_1,
    goal_2: goals[1] || FALLBACKS.goal_2,
    goal_3: goals[2] || FALLBACKS.goal_3,
    primary_desire: labelFor("primary_desire", p.primary_desire) || FALLBACKS.primary_desire,
    primary_danger_moment:
      labelFor("danger_moments", p.primary_danger_moment) || FALLBACKS.primary_danger_moment,
    primary_trigger: labelFor("primary_trigger", p.primary_trigger) || FALLBACKS.primary_trigger,
    deepest_cost: labelInline("deepest_cost", p.deepest_cost) || FALLBACKS.deepest_cost,
    quit_attempt_count:
      labelFor("quit_attempt_count", p.quit_attempt_count) || FALLBACKS.quit_attempt_count,
    first_goal: labelFor("first_goal", p.first_goal) || FALLBACKS.first_goal,
    "90_day_date": p.ninety_day_date || ninetyDayDate(p.started_at),
  };
}

/**
 * Substituição segura. Chave sem valor cai no fallback neutro;
 * chave desconhecida some da frase em vez de vazar "{algo}".
 */
export function fill(template, profile) {
  if (!template) return "";
  const v = vars(profile);
  return String(template).replace(/\{([a-z0-9_]+)\}/gi, (_, key) => {
    const val = v[key];
    if (val === undefined || val === null || val === "") return FALLBACKS[key] || "";
    return String(val);
  });
}

/* ------------------------------------------------------------
   4. PONTES , prayer-engine (PRD 9) e planEngine que já existe
   ------------------------------------------------------------ */

export function prayerContext(profile) {
  const p = profile || {};
  return {
    first_name: cleanName(p.name) || "",
    primary_danger_moment: labelFor("danger_moments", p.primary_danger_moment),
    primary_trigger: labelFor("primary_trigger", p.primary_trigger),
    deepest_cost: labelFor("deepest_cost", p.deepest_cost),
    primary_desire: labelFor("primary_desire", p.primary_desire),
    tone: "supportive_christian_no_shame",
    constraints: [
      "God as present ally, never condemning judge",
      "no medical diagnosis",
      "no shaming language",
      "short enough for in-the-moment use",
    ],
  };
}

// O planEngine (motor do funil) fala as chaves antigas. Este mapa deixa o
// onboarding novo alimentar o motor sem tocar em nada dele.
const TRIGGER_TO_LEGACY = {
  scrolling: "scrolling",
  stress: "stress",
  boredom: "boredom",
  loneliness: "loneliness",
  sexual_content: "urges",
  cant_sleep: "stress",
  before_realize: "urges",
};

const DANGER_TO_LEGACY_TIME = {
  late_night: "lateNight",
  alone: "alone",
  stressed: "varies",
  bored: "varies",
  lonely: "alone",
  conflict: "varies",
  triggering_content: "varies",
  no_pattern: "varies",
};

// deepest_cost define o TOM da oração (shame = conforto, resolve = recomeço).
const COST_TO_LEGACY_FAITH = {
  distant_god: "disconnected",
  shame: "ashamed",
  numb: "numb",
  trapped: "ashamed",
  letting_down: "ashamed",
  focus: "notMuch",
  regret: "ashamed",
};

const FREQ_TO_LEGACY = {
  multi_daily: "multipleDaily",
  daily: "daily",
  few_weekly: "severalWeekly",
  weekly: "weekly",
  less_weekly: "rarely",
  stopped: "rarely",
};

const DURATION_TO_YEARS = {
  under_1: 1,
  y1_3: 2,
  y3_5: 4,
  y5_10: 7,
  over_10: 12,
};

/** Perfil novo -> objeto de respostas que o planEngine já sabe ler. */
export function toLegacyAnswers(profile) {
  const p = profile || {};
  return {
    name: cleanName(p.name),
    primaryTrigger: TRIGGER_TO_LEGACY[p.primary_trigger] || "stress",
    highRiskTime: DANGER_TO_LEGACY_TIME[p.primary_danger_moment] || "varies",
    faithImpact: COST_TO_LEGACY_FAITH[p.deepest_cost] || "ashamed",
    frequency: FREQ_TO_LEGACY[p.frequency] || "daily",
    copingMechanism: p.past_attempts && p.past_attempts.includes("streak_apps") ? "habit" : "escape",
    // yearsFighting vem do tempo de luta, já que o quiz novo não pergunta idade
    __yearsFighting: DURATION_TO_YEARS[p.struggle_duration] || null,
  };
}

/** Edge cases da seção 11 do PRD, resolvidos num lugar só. */
export function edgeCopy(profile) {
  const p = profile || {};
  return {
    // "There's no clear pattern": o demo não pode fingir que sabe a hora
    demoUnclearPattern: p.primary_danger_moment === "no_pattern",
    demoFallbackLine:
      "Stronghold helps you catch the moment earlier, even when the pattern feels unclear.",
    // "I've recently stopped": copy de proteção de recaída, não de usuário ativo
    recentlyStopped: p.frequency === "stopped",
    // Primeira tentativa: o reframe não pode dizer que ele já tentou várias vezes
    firstAttempt: p.quit_attempt_count === "first",
    firstAttemptReframe:
      "You don't need to wait for another failed attempt to build protection.",
  };
}

export default {
  derivePrimaryDangerMoment,
  ninetyDayDate,
  cleanName,
  labelFor,
  labelInline,
  vars,
  fill,
  prayerContext,
  toLegacyAnswers,
  edgeCopy,
  LABELS,
};
