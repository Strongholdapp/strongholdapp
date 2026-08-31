/* ============================================================
   planEngine.js , o "cérebro" do Stronghold em ESM (React Native).

   Porte 1:1 do plan-engine.js do PWA (return-funnel/app/plan-engine.js).
   Única mudança: window.COPY / window.PRAYERS / window.RESETS viraram imports.
   Continua uma função PURA: build(answers) -> objeto do plano, sem tocar em UI.

   Uso:
     import { build } from "../engine/planEngine";
     const plan = build(answers);
   ============================================================ */

import { COPY } from "../data/copy";
import { PRAYERS } from "../data/prayers";
import { RESETS } from "../data/resets";

function opt(copyId, value) {
  const c = COPY && COPY[copyId];
  if (!c || !c.options) return null;
  for (let i = 0; i < c.options.length; i++) {
    if (c.options[i].value === value) return c.options[i];
  }
  return null;
}

function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

// Arquétipo (mesma prioridade do funil): Lonely > Stress > Numb > Habit.
function archetypeKey(a) {
  const t = a.primaryTrigger;
  const c = a.copingMechanism;
  if (t === "loneliness" || c === "lessAlone") return "lonelySeeker";
  if (t === "stress" || t === "anxiety") return "stressEscaper";
  if (t === "boredom" || t === "scrolling") return "numbScroller";
  if (c === "habit" || t === "urges") return "habitLoop";
  return "stressEscaper";
}

const TRIGGER_BASE = {
  stress: "stress",
  loneliness: "loneliness",
  boredom: "boredom",
  anxiety: "anxiety",
  scrolling: "scrolling",
  urges: "urges",
};

function yearsFighting(a) {
  const ageOpt = opt("currentAgeRange", a.currentAgeRange);
  const startOpt = opt("firstExposureAge", a.firstExposureAge);
  if (!ageOpt || !startOpt) return null;
  return Math.max(0, ageOpt.mid - startOpt.years);
}

export function freedomDateFrom(startMs) {
  const d = new Date(startMs || Date.now());
  d.setDate(d.getDate() + 90);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function prayerObj(key, name, moment) {
  const p = (PRAYERS || {})[key];
  if (!p) return null;
  return {
    moment,
    text: String(p.text).replace(/\{name\}/g, name || "your son"),
    verse: p.verse,
  };
}

export function build(answers) {
  const a = answers || {};
  const C = COPY || {};
  const CR = C.result || {};

  let name =
    (a.name && String(a.name).trim()) ||
    (a.email ? String(a.email).split("@")[0] : "") ||
    "";
  // capitaliza um primeiro nome simples
  if (name) name = name.replace(/[^a-zA-ZÀ-ſ' -]/g, "").split(/\s+/)[0];
  const displayName = name ? cap(name) : "Brother";
  const prayerName = name ? cap(name) : "your son";

  const akey = archetypeKey(a);
  const arche =
    (CR.archetypes && CR.archetypes[akey]) || { title: "THE FIGHTER", message: "" };

  const trigOpt = opt("primaryTrigger", a.primaryTrigger);
  const timeOpt = opt("highRiskTime", a.highRiskTime);
  const copeOpt = opt("copingMechanism", a.copingMechanism);
  const freqOpt = opt("frequency", a.frequency);
  const faithOpt = opt("faithImpact", a.faithImpact);

  const trigger = trigOpt ? trigOpt.resultLabel : "stress";
  const highRisk = timeOpt ? timeOpt.resultLabel : "your weakest moment";
  const timePhrase = timeOpt ? timeOpt.timePhrase : "your weakest moment";
  const tone = (faithOpt && faithOpt.tone) || "shame";
  const base = TRIGGER_BASE[a.primaryTrigger] || "generic";

  // Ciclo (mesmo do resultado): Trigger -> passos -> More trigger.
  const cycle = [cap(trigger)]
    .concat(CR.cycleSteps || [])
    .concat([(CR.cycleMoreLabel || "More") + " " + trigger]);

  // Orações personalizadas (2 a 3, sempre distintas): os DOIS tons do gatilho
  // (conforto + redenção) + a hora difícil (madrugada).
  const prayers = [];
  const otherTone = tone === "shame" ? "resolve" : "shame";
  const has = (pr) => pr && !prayers.some((x) => x.text === pr.text);

  const pMain = prayerObj(base + "_" + tone, prayerName, "When " + trigger + " hits");
  const pAlt = prayerObj(
    base + "_" + otherTone,
    prayerName,
    otherTone === "resolve" ? "To come back after a fall" : "When shame closes the door"
  );
  if (has(pMain)) prayers.push(pMain);
  if (has(pAlt)) prayers.push(pAlt);

  if (a.highRiskTime === "lateNight") {
    const pNight = prayerObj("sleepless_" + tone, prayerName, "For the sleepless hours");
    if (has(pNight)) prayers.push(pNight);
  }
  if (prayers.length < 2) {
    const g = prayerObj("generic_" + otherTone, prayerName, "For this moment");
    if (has(g)) prayers.push(g);
  }

  // Protocolo do momento de risco, personalizado pela hora/gatilho.
  const protocol = {
    title: "Your reset, for the moment it hits",
    intro:
      "When " +
      timePhrase +
      " arrives and the pull starts, run this. Do not negotiate with it, negotiation is how you lose.",
    steps: [
      'Name it out loud: "This is the pattern. ' +
        cap(trigger) +
        ' is looking for a door." Naming it breaks the trance.',
      "Move your body: stand up, leave the room, put the phone face down somewhere else. Change the physical scene.",
      "Pray the prayer above out loud, using your name. Ten honest seconds is enough to interrupt the automatic sequence.",
      "Do one action: message a brother in the community, step outside, or open your Bible. Put a wall between you and the next click.",
    ],
  };

  // Reset prático de 2 minutos (etapa 3 da Intervenção), escolhido pelo gatilho.
  const R = RESETS || {};
  const resetKey = R[a.primaryTrigger]
    ? a.primaryTrigger
    : R[base]
    ? base
    : a.highRiskTime === "lateNight" && R.sleepless
    ? "sleepless"
    : "generic";
  const reset = R[resetKey] || null;

  // Escritura que dá nome ao produto.
  const scripture =
    CR.scripture || {
      text: "The Lord is a refuge for the oppressed, a stronghold in times of trouble.",
      ref: "Psalm 9:9",
    };

  const phases = (C.plan && C.plan.phases) || [];

  return {
    name: displayName,
    archetype: { key: akey, title: arche.title, message: arche.message },
    pattern: {
      triggerLabel: cap(trigger),
      highRiskLabel: cap(highRisk),
      copingLabel: copeOpt ? cap(copeOpt.resultLabel) : "",
      frequencyLabel: freqOpt ? freqOpt.label : "",
      yearsFighting: yearsFighting(a),
      cycle,
    },
    prayers,
    protocol,
    reset,
    scripture,
    phases,
    freedomDate: freedomDateFrom(Date.now()),
  };
}

export default { build, freedomDateFrom };
