/* ============================================================
   proof.js , os depoimentos REAIS (autorizados pelo dono, 2026-07-15).

   Regra do PRD, seção 6, inegociável: nunca inventar review, rating,
   número de usuários ou streak. Tudo aqui veio do copy.js do funil, que é
   a fonte de verdade. Se um depoimento sair do ar, tire daqui também;
   não substitua por placeholder em produção.

   Cada ponto de proof do arco (telas 01, 05, 10, 15, 20, 26 e 27) puxa
   daqui pelo id, então trocar um depoimento é trocar uma linha.
   ============================================================ */

export const REVIEW_PHOTOS = {
  ethan: require("../../assets/reviews/review-ethan.webp"),
  michael: require("../../assets/reviews/review-michael.webp"),
  aaron: require("../../assets/reviews/review-aaron.webp"),
  caleb: require("../../assets/reviews/review-caleb.webp"),
  nathan: require("../../assets/reviews/review-nathan.webp"),
  joshua: require("../../assets/reviews/review-joshua.webp"),
  daniel: require("../../assets/reviews/review-daniel.webp"),
  noah: require("../../assets/reviews/review-noah.webp"),
  matthew: require("../../assets/reviews/review-matthew.webp"),
};

export const REVIEWS = {
  // ---- identidade: "sou eu, e não sou o único" (tela 05) ----
  ethan: {
    id: "ethan",
    photo: "ethan",
    name: "Ethan, 32",
    location: "Nashville, Tennessee",
    text:
      "I'd been dealing with this since I was 14 and honestly thought something was just wrong with me. Seeing other Christian men talk about the same struggle made it easier to be honest about mine.",
  },

  // ---- contexto: o padrão dele (tela 10) ----
  noah: {
    id: "noah",
    photo: "noah",
    name: "Noah, 25",
    location: "Madison, Wisconsin",
    badge: "63 days free",
    text:
      "For me it was college stress, being alone at night, then scrolling until something triggered me. Once I saw the pattern written out, it was almost obvious. I just hadn't connected it before.",
  },

  // ---- mecanismo: a intervenção no momento (telas 15 e 26) ----
  caleb: {
    id: "caleb",
    photo: "caleb",
    name: "Caleb, 34",
    location: "Dallas, Texas",
    badge: "91 days free",
    text:
      "Late nights were always where I lost control. One night Stronghold blocked the page, used my name in the prayer, and told me exactly what to do next. I put the phone down and walked out of the room. It sounds simple, but that was the first time I felt helped during the actual moment, not afterward.",
  },

  // ---- progresso ao longo do tempo (tela 20) ----
  nathan: {
    id: "nathan",
    photo: "nathan",
    name: "Nathan, 39",
    location: "Charlotte, North Carolina",
    badge: "126 days free",
    text:
      "My wife didn't know how often I was going back to it. I kept saying I'd stop, then hiding it again. Four months in, the biggest change isn't just the streak. I'm not carrying the same secret around anymore, and she can feel that.",
  },

  // ---- fé: voltar sem vergonha (tela 26) ----
  joshua: {
    id: "joshua",
    photo: "joshua",
    name: "Joshua, 31",
    location: "Tampa, Florida",
    badge: "74 days free",
    text:
      "After a relapse I used to avoid praying because I felt fake. Stronghold didn't make me feel more condemned. It helped me come back to God in the same moment I wanted to hide.",
  },

  // ---- tentativas anteriores: o reframe anti-willpower (tela 27) ----
  daniel: {
    id: "daniel",
    photo: "daniel",
    name: "Daniel, 44",
    location: "Denver, Colorado",
    badge: "152 days free",
    text:
      "I tried filters, accountability apps, cold showers, deleting social media, pretty much everything. They all depended on me remembering to use them. Stronghold showed up when I was already heading in the wrong direction. That was the difference for me.",
  },

  matthew: {
    id: "matthew",
    photo: "matthew",
    name: "Matthew, 36",
    location: "Phoenix, Arizona",
    badge: "48 days rebuilding",
    text:
      "I had a setback around day 20 and normally I would've disappeared for weeks. This time I opened the app, prayed, reset the streak honestly and kept going. That might be the biggest change, I don't turn one bad night into a lost month anymore.",
  },

  michael: {
    id: "michael",
    photo: "michael",
    name: "Michael, 38",
    location: "Columbus, Ohio",
    text:
      "I'd quit for a few days, sometimes a few weeks, then end up right back where I started. I wasn't looking for another lecture. I needed to understand what kept pulling me back.",
  },

  aaron: {
    id: "aaron",
    photo: "aaron",
    name: "Aaron, 27",
    location: "Boise, Idaho",
    text:
      "I'm still working through it, but for the first time I don't feel like I'm fighting completely blind. I'm starting to recognize what happens before the urge gets strong.",
  },
};

/**
 * Rating na tela 01: o PRD manda usar estrelas SÓ se o número for real.
 * A App Store ainda não tem avaliações do Stronghold, então isto fica em
 * null e a tela cai na "identity line". Quando houver rating de verdade,
 * preencha { stars, count } aqui e a tela passa a mostrar as estrelas.
 */
export const APP_RATING = null;

export const IDENTITY_LINE = "Trusted by Christian men fighting in silence";

export function review(id) {
  return REVIEWS[id] || null;
}

export default { REVIEWS, REVIEW_PHOTOS, APP_RATING, IDENTITY_LINE, review };

/* ============================================================
   GRUPOS , espelham exatamente a estratégia do funil (copy.js).

   Não reagrupar por conta própria: a ordem e a regra de badge foram
   decididas no funil e são deliberadas.

   - early    : cardsSocialProof do funil. Cedo no quiz, SEM badge.
                "91 days free" antes de a pessoa entender o produto não é
                crível, e o funil evita isso de propósito.
   - compact  : cardsCompact, usado no loading do funil.
   - paywall  : cardsPaywall. Aqui SIM com badge, porque o preço apareceu e
                a duração vira prova. A ordem é a objeção: mecanismo (Caleb),
                casamento (Nathan), Deus (Joshua).
   - brotherhood : cardsPaywallSecondary, o segundo carrossel.
   ============================================================ */
export const PROOF_GROUPS = {
  early: ["ethan", "michael", "aaron"],
  compact: ["ethan", "caleb"],
  paywall: ["caleb", "nathan", "joshua"],
  brotherhood: ["daniel", "noah", "matthew"],
};

export const PROOF_TITLES = {
  paywall: "Results that make us proud",
  brotherhood: "More stories from the brotherhood",
};
