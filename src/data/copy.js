// ============================================================
// COPY.JS — all visible text for the STRONGHOLD quiz funnel (SPEC-V3 + dono's addendum).
// Nothing is hardcoded in quiz.js: edit text here only.
// Rule: NO em dash (—) and NO en dash (–) anywhere. Use period, comma, colon or "to".
// Brand: STRONGHOLD (rebrand from Return). Storage/analytics keys keep the "return_" prefix
// on purpose (internal only, never shown to the user).
// ============================================================

export const COPY = {

  // ---------- T0 landing ----------
  landing: {
    wordmark: "Stronghold",
    cta: "Take the free test",
    // Microcopy de privacidade (teardown Gracen: a peça de copy mais importante do nicho, resolve
    // a objeção nº1 = ser visto). Fica perto do CTA/seleção de idade.
    privacyLine: "100% private. No judgment. Just the truth about your pattern.",
    footerTerms: "Terms",
    footerPrivacy: "Privacy",
    // Credibility strip (compartilhada pelas 3 variantes, abaixo do sub).
    creds: [
      "Personalized Christian protection plan",
      "Built around your triggers",
      "Takes less than 60 seconds"
    ],
    agePrompt: "Start by selecting your age:",
    // 3 variantes de hero (A/B/C). Default em CONFIG.heroVariant; override por URL ?v=a|b|c.
    variants: {
      a: {
        h1Line1: "God is watching you every time you go to porn.",
        h1Line2: "And He's just wondering when you'll finally go towards Him.",
        sub: "Your struggle follows a pattern. Answer a few questions so we can identify your pattern and build a personalized Christian intervention for the exact moments you're most likely to fall."
      },
      b: {
        h1: "You keep falling at the same moments for a reason.",
        subLines: ["The late nights.", "The stress.", "The loneliness.", "The scrolling."],
        subClose: "This 60-second quiz maps your pattern so the app knows when and how to step between you and your next relapse."
      },
      c: {
        h1: "Easily quit porn in under 90 days",
        kicker: "3-MINUTE QUIZ"
      },
      // Variantes casadas com os ângulos VENCEDORES do teardown Gracen (message match com o ad).
      // d = family stake (o maior winner: "would you do it for her?").
      d: {
        h1Line1: "You'd die for your wife.",
        h1Line2: "Would you quit porn for her?",
        sub: "You'd give your life for her without thinking twice. But the screen still wins at night. Answer a few questions and get the personalized plan that finally puts her first."
      },
      // e = paz das 2am (vende o SENTIMENTO do depois).
      e: {
        h1: "One night soon, it's 2am and you just go to sleep.",
        sub: "No scrolling. No shame spiral. No hiding it in the morning. Discover the pattern keeping you up, and get the plan that finally lets you rest."
      },
      // f = isolamento na igreja (a dor mais específica do ICP).
      f: {
        h1: "You sit with them every Sunday. None of them know.",
        sub: "You worship next to men who would never guess. Carrying it alone is the heaviest part. Answer a few questions and get a private plan, and a brotherhood that already understands."
      }
    }
  },

  // ---------- header (a partir da T1) ----------
  header: {
    wordmark: "Stronghold",
    startOver: "Start over"
  },

  // ---------- T1 currentAgeRange ----------
  currentAgeRange: {
    title: "What is your age?",
    options: [
      { value: "18to24", label: "18-24", mid: 21 },
      { value: "25to34", label: "25-34", mid: 30 },
      { value: "35to44", label: "35-44", mid: 40 },
      { value: "45plus", label: "45+", mid: 52 }
    ]
  },

  // ---------- T2 frequency ----------
  frequency: {
    title: "How often do you currently watch pornography?",
    options: [
      { value: "multipleDaily", label: "Multiple times a day" },
      { value: "daily", label: "Daily" },
      { value: "severalWeekly", label: "Several times a week" },
      { value: "weekly", label: "Weekly" },
      { value: "rarely", label: "Rarely" }
    ]
  },

  // ---------- T3 firstExposureAge ----------
  firstExposureAge: {
    title: "How old were you when you first encountered pornography?",
    options: [
      { value: "under10", label: "Under 10", years: 9 },
      { value: "10to12", label: "10-12", years: 11 },
      { value: "13to15", label: "13-15", years: 14 },
      { value: "16to18", label: "16-18", years: 17 },
      { value: "18plus", label: "18+", years: 19 }
    ]
  },

  // ---------- T4 socialProof ----------
  socialProof: {
    title: "You're not the only one fighting this.",
    sub: "Many Christian men first encountered pornography young, and spent years trying to break the pattern alone.",
    verseText: "No temptation has overtaken you except what is common to mankind. And God is faithful; he will not let you be tempted beyond what you can bear.",
    verseRef: "(1 Corinthians 10:13, NIV)",
    cta: "Continue"
  },

  // ---------- T5 highRiskTime ----------
  // timePhrase: usada na frase do Personal Summary do paywall ("{Trigger} {timePhrase}.").
  highRiskTime: {
    title: "When are you most vulnerable?",
    options: [
      { value: "lateNight", emoji: "🌙", label: "Late at night", resultLabel: "late night", protectLabel: "late nights", timePhrase: "late at night" },
      { value: "earlyMorning", emoji: "🌅", label: "Early morning", resultLabel: "early morning", protectLabel: "early mornings", timePhrase: "in the early morning" },
      { value: "afterWork", emoji: "💼", label: "After work", resultLabel: "after work", protectLabel: "after-work hours", timePhrase: "in the hours after work" },
      { value: "alone", emoji: "🏠", label: "When I'm alone", resultLabel: "being alone", protectLabel: "hours alone", timePhrase: "when you're alone" },
      { value: "varies", emoji: "🎲", label: "It varies", resultLabel: "unpredictable moments", protectLabel: "unguarded moments", timePhrase: "at unpredictable moments" }
    ]
  },

  // ---------- T6 interstitialHighRisk ----------
  // Mockup reframado (leva do dono): sem linguagem de vigilância/alarme ("detected", "risk
  // level"). O card mostra cuidado, não monitoramento. Headline/texto da TELA (title/text/cta)
  // ficam como estavam.
  interstitialHighRisk: {
    title: "Stronghold identifies your high-risk moments.",
    text: "Most relapses don't start with pornography. They start long before it.",
    // Carrossel: MESMA história do T5 (detecção de padrão) fatiada em telas, porque o mockup
    // é grande demais. Slide 1 = lock screen, slide 2 = app aberto. Fotos entram nos slots.
    slides: [
      { imageKey: "highRiskLock", step: "It notices", title: "A quiet nudge at the right time", desc: "A gentle reminder arrives at your most vulnerable hour, before the urge takes over." },
      { imageKey: "highRiskReport", step: "It shows your pattern", title: "It shows you what it learned", desc: "Your highest-risk window and your triggers, mapped from your own answers." }
    ],
    cta: "Continue"
  },

  // ---------- T7 primaryTrigger ----------
  primaryTrigger: {
    title: "What usually happens right before a relapse?",
    options: [
      { value: "stress", label: "Stress", resultLabel: "stress" },
      { value: "loneliness", label: "Loneliness", resultLabel: "loneliness" },
      { value: "boredom", label: "Boredom", resultLabel: "boredom" },
      { value: "anxiety", label: "Anxiety", resultLabel: "anxiety" },
      { value: "scrolling", label: "Social media scrolling", resultLabel: "scrolling" },
      { value: "urges", label: "Sexual urges", resultLabel: "sexual urges" }
    ]
  },

  // ---------- T8 copingMechanism ----------
  copingMechanism: {
    title: "Which statement feels most true?",
    options: [
      { value: "escape", label: "Porn helps me escape difficult emotions", resultLabel: "escaping difficult emotions" },
      { value: "relax", label: "Porn helps me relax", resultLabel: "needing to relax" },
      { value: "habit", label: "Porn has become a habit", resultLabel: "an automatic habit" },
      { value: "lessAlone", label: "Porn makes me feel less alone", resultLabel: "seeking connection" },
      { value: "unsure", label: "I'm not sure anymore", resultLabel: "an unclear pattern" }
    ]
  },

  // ---------- T9 interstitialIntervention ----------
  interstitialIntervention: {
    title: "Before temptation becomes a relapse, Stronghold steps in.",
    text: "It blocks the page, prays with you, and gives you one clear next step.",
    // Carrossel: a sequência da intervenção fatiada em 3 telas do app.
    slides: [
      { imageKey: "intervention1", step: "Pattern interrupted", title: "It blocks the website/app", desc: "The moment explicit content loads, Stronghold steps in and closes the door." },
      { imageKey: "intervention2", step: "Prayer for the moment", title: "A prayer for this exact moment", desc: "Not a generic quote. A prayer written from your own pattern, using your name." },
      { imageKey: "intervention3", step: "Practical reset", title: "One practical reset", desc: "A simple two-minute action to break the pull and get you back on your feet." }
    ],
    cta: "Continue"
  },

  // ---------- T10 previousAttempts ----------
  previousAttempts: {
    title: "Have you tried to quit before?",
    options: [
      { value: "many", label: "Many times" },
      { value: "few", label: "A few times" },
      { value: "once", label: "Once" },
      { value: "never", label: "Never" }
    ]
  },

  // ---------- T11 longestStreak ----------
  longestStreak: {
    title: "What's your longest streak?",
    options: [
      { value: "lt7", label: "Less than 7 days" },
      { value: "7to30", label: "7-30 days" },
      { value: "1to3m", label: "1-3 months" },
      { value: "3to6m", label: "3-6 months" },
      { value: "gt6m", label: "More than 6 months" }
    ]
  },

  // ---------- T12 biggestCost ----------
  biggestCost: {
    title: "What is porn costing you today?",
    options: [
      { value: "god", label: "My relationship with God" },
      { value: "confidence", label: "My confidence" },
      { value: "marriage", label: "My marriage / relationship" },
      { value: "focus", label: "My focus" },
      { value: "mentalHealth", label: "My mental health" }
    ]
  },

  // ---------- T13 faithImpact ----------
  // tone: usado para escolher a chave da oração (avoidPrayer|ashamed|numb = shame; disconnected|notMuch = resolve).
  // resultLabel: frase curta usada no comparativo "Today vs Freedom Date" do paywall.
  faithImpact: {
    title: "When you relapse, how does it affect your relationship with God?",
    options: [
      { value: "avoidPrayer", label: "I avoid prayer afterward", tone: "shame", resultLabel: "avoiding prayer" },
      { value: "ashamed", label: "I feel ashamed to come back", tone: "shame", resultLabel: "shame" },
      { value: "numb", label: "I feel spiritually numb", tone: "shame", resultLabel: "spiritual numbness" },
      { value: "disconnected", label: "I feel disconnected", tone: "resolve", resultLabel: "disconnection" },
      { value: "notMuch", label: "It doesn't affect my faith much", tone: "resolve", resultLabel: "distance" }
    ]
  },

  // ---------- T14 interstitialCommunity ----------
  interstitialCommunity: {
    title: "You don't have to fight this in silence.",
    sub: "A private community of 22,000+ Christian men, sharing progress and returning without judgment.",
    posts: [
      { name: "Marcus", status: "14 days returning", quote: "Last night was difficult, but I used the reset instead of giving in.", encouragements: "12 encouragements" },
      { name: "Daniel", status: "Starting again today", quote: "No hiding. No pretending. I'm coming back.", encouragements: "18 encouragements" }
    ],
    cta: "Continue"
  },

  // ---------- T15 motivation ----------
  motivation: {
    title: "What are you fighting for?",
    options: [
      { value: "god", label: "A stronger relationship with God" },
      { value: "selfControl", label: "Self-control" },
      { value: "marriage", label: "Future marriage" },
      { value: "clarity", label: "Mental clarity" },
      { value: "freedom", label: "Freedom" }
    ]
  },

  // ---------- T16 futureProjection ----------
  futureProjection: {
    titleLine1: "If nothing changes...",
    titleLine2: "Where do you think you'll be in 12 months?",
    options: [
      { value: "same", label: "Exactly where I am now" },
      { value: "worse", label: "Worse than today" },
      { value: "dontKnow", label: "I don't know" },
      { value: "ratherNot", label: "I'd rather not think about it" }
    ]
  },

  // ---------- T17 desiredSupport ----------
  desiredSupport: {
    title: "Which kind of support would help you most?",
    options: [
      { value: "intervention", label: "Real-time intervention" },
      { value: "accountability", label: "Accountability" },
      { value: "spiritual", label: "Spiritual guidance" },
      { value: "habits", label: "Habit building" },
      { value: "understanding", label: "Understanding my triggers" }
    ]
  },

  // ---------- T18 loading ----------
  loading: {
    title: "Identifying your relapse pattern...",
    steps: [
      { delay: 600, text: "Analyzing your highest-risk moments" },
      { delay: 1500, text: "Connecting triggers and coping patterns" },
      { delay: 2500, text: "Evaluating spiritual impact" },
      { delay: 3600, text: "Building your personalized Stronghold Plan" }
    ],
    advanceDelay: 4400
  },

  // ---------- T19 result ----------
  result: {
    badgeLabel: "YOUR RECOVERY PROFILE",
    // Versículo que dá nome ao produto (Salmo 9:9): identidade cristã logo no topo do resultado.
    scripture: {
      text: "The Lord is a refuge for the oppressed, a stronghold in times of trouble.",
      ref: "Psalm 9:9"
    },
    archetypes: {
      stressEscaper: { title: "THE STRESS ESCAPER", message: "Pornography has become a shortcut for relief when pressure builds." },
      lonelySeeker: { title: "THE LONELY SEEKER", message: "The pattern is often triggered by isolation and the desire to feel connected." },
      numbScroller: { title: "THE NUMB SCROLLER", message: "Your relapses are often part of an automatic scrolling and stimulation loop." },
      habitLoop: { title: "THE HABIT LOOP", message: "Your pattern appears less tied to one emotion and more to an established automatic routine." }
    },
    diagnosisTemplate: "Your answers suggest that pornography has become a shortcut for emotional relief, especially during {trigger} and {highRiskTime}.",
    durationOverTemplate: "You've likely been fighting this battle for over {years} years.",
    durationAboutTemplate: "You've likely been fighting this battle for about {years} years.",
    drivenByTitle: "Based on your answers, your relapses are most likely driven by:",
    vulnerabilitySuffix: "vulnerability",
    cycleTitle: "The Cycle We Identified",
    cycleSteps: ["Seeking relief", "Pornography", "Temporary relief", "Shame"],
    cycleMoreLabel: "More",
    whyTitle: "Why this matters",
    whyParagraphs: [
      "The problem isn't a lack of willpower.",
      "The problem is that this pattern has become automatic.",
      "The good news is that automatic patterns can be interrupted."
    ],
    futureTitle: "90 Days From Now",
    futureImagineLabel: "Imagine:",
    futureChecks: ["Going to sleep without hiding", "Praying without shame", "Feeling in control again", "Building trust with yourself"],
    todayVsTitle: "Today vs 90 Days",
    todayLabel: "Today",
    futureLabel: "90 Days",
    todayPills: ["Reactive", "Ashamed", "Isolated", "Stuck"],
    futurePills: ["Intentional", "Connected to God", "Confident", "Free"],
    cta: "Get My 90-Day Plan",

    // Bloco "How Stronghold interrupts the cycle" (mecanismo, antes de 90 Days From Now).
    interruptCycle: {
      title: "How Stronghold interrupts the cycle",
      intro: "When your usual pattern begins, Stronghold does not wait until after the fall.",
      steps: [
        "Detects your danger moment",
        "Steps in before temptation grows",
        "Delivers a prayer written for that exact moment",
        "Gives you one practical action",
        "Helps you return without shame"
      ],
      flow: ["Pattern begins", "Stronghold steps in", "You choose what happens next"]
    },

    // Gráfico de trajetória (antes vs depois), antes de "90 Days From Now".
    trajectory: {
      title: "Two paths from today",
      sub: "The pattern never stays still. It either deepens on its own, or it breaks with the right system.",
      withLabel: "With Stronghold",
      withoutLabel: "On your own",
      startLabel: "Today",
      endLabel: "Day 90"
    },

    // Prova social compacta do Caleb (após o mecanismo, antes do carrossel de demo).
    calebProof: {
      name: "Caleb, 34",
      location: "Dallas, Texas",
      quote: "Stronghold helped me during the actual moment, not afterward.",
      photo: "img/review-caleb.webp"
    },

    // Demonstração real do produto (carrossel de 3 mockups, sem auto-advance). Complementa o
    // bloco textual "How Stronghold interrupts the cycle": o texto explica, o carrossel mostra.
    demo: {
      title: "See how Stronghold steps in",
      sub: "Your answers prepare a personalized intervention for the moments when you are most vulnerable.",
      slides: [
        { imageKey: "intervention1", eyebrow: "STEP 1 · INTERRUPT", title: "The path is blocked", desc: "When protected content loads, Stronghold closes the door before the automatic pattern goes further." },
        { imageKey: "intervention2", eyebrow: "STEP 2 · RETURN", title: "A prayer for your exact moment", desc: "Written from your pattern, your circumstances and your name, not pulled from a generic library." },
        { imageKey: "intervention3", eyebrow: "STEP 3 · RESET", title: "One practical action", desc: "A short guided reset helps you leave the environment and interrupt the automatic response." }
      ],
      footerLine: "Stronghold supports you during the moment, not only after it."
    }
  },

  // ---------- T20 emailCapture ----------
  emailCapture: {
    title: "Your personalized Stronghold Plan is ready.",
    placeholder: "Your email",
    privacy: "We respect your privacy. No spam, ever.",
    inboxLine: "We will also send your plan to your inbox.",
    cta: "Get My 90-Day Plan"
  },

  emailModal: {
    title: "May we send encouragement to your email?",
    body: "Occasional prayer prompts and encouragement, nothing more. You can stop anytime.",
    yesCta: "Yes, send it",
    noCta: "No, my plan only"
  },

  // ---------- T21 paywall: Personal Summary (frases humanizadas) ----------
  summary: {
    title: "Personal summary based on your answers",
    riskLabel: "Your highest-risk pattern:",
    afterFallLabel: "After a fall:",
    interventionLabel: "Your intervention:",
    interventionValue: "Immediate pause + personalized prayer + practical reset",
    fightingLabel: "Fighting alone for:",
    attemptsLabel: "Previous attempts:",
    streakLabel: "Longest streak:",
    // Mapas usados para montar a frase "{TriggerCap} {timePhrase}."
    triggerCap: {
      stress: "Stress", loneliness: "Loneliness", boredom: "Boredom",
      anxiety: "Anxiety", scrolling: "Scrolling", urges: "Sexual urges"
    },
    // Frases de "After a fall:" por faithImpact.
    afterFallByFaithImpact: {
      avoidPrayer: "You avoid prayer and keep your distance from God.",
      ashamed: "You feel too ashamed to come back.",
      numb: "You feel spiritually numb.",
      disconnected: "You feel disconnected from God.",
      notMuch: "You try to move on without addressing what happened."
    }
  },

  // ---------- Paywall: Today vs Freedom Date (mockup 2 phones) ----------
  // Reframe (leva do dono): sem "detected"/"risk %", tom de cuidado em vez de vigilância.
  todayVsMockup: {
    left: {
      tag: "TONIGHT REQUIRES EXTRA ATTENTION",
      lines: ["Stress is high", "You are alone", "It is late"]
    },
    right: {
      tag: "YOUR FUTURE SELF IS PROTECTED",
      checks: ["Prayer prepared for this exact moment", "Reset ready", "Temptation passed"]
    }
  },

  // ---------- Paywall: How Stronghold Works (5 passos curtos) ----------
  mechanism: {
    title: "How Stronghold Works",
    pills: [
      { label: "Temptation", tone: "gray" },
      { label: "STRONGHOLD steps in", tone: "dark" },
      { label: "You choose God", tone: "soft" }
    ],
    steps: [
      "Detects your danger moments",
      "Interrupts temptation before the fall",
      "Delivers a prayer written for that exact moment",
      "Gives you one practical action",
      "Gets you back on track"
    ]
  },

  // ---------- Paywall: benefícios (6 checks ICP, substitui "best version") ----------
  benefits: {
    title: "What Stronghold gives you back",
    checks: [
      "Pray without shame",
      "Look your wife in the eyes",
      "Stop hiding",
      "Break the cycle",
      "Walk with God again",
      "Become a man of integrity"
    ]
  },

  // ---------- Paywall: plano em 4 fases (substitui Week 1-4 + Weeks 5-12) ----------
  plan: {
    planTitleShort: "Your 90-day Stronghold Plan",
    todayLabel: "Today",
    phases: [
      { title: "Phase 1: Break the automatic pattern", days: "Days 1 to 7" },
      { title: "Phase 2: Protect your danger moments", days: "Days 8 to 28" },
      { title: "Phase 3: Build a new response", days: "Days 29 to 60" },
      { title: "Phase 4: Make freedom automatic", days: "Days 61 to 90" }
    ],
    // Dimensões dinâmicas do "Today vs 90 Days" (o valor de hoje espelha a resposta real).
    dims: [
      { label: "Falls", from: "frequency", fallbackToday: "Daily war", future: "Pattern broken" },
      { label: "The door", from: "primaryTrigger", fallbackToday: "Open", future: "Guarded" },
      { label: "Hardest hours", from: "highRiskTime", fallbackToday: "Nights lost", future: "Protected" },
      { label: "After a fall", from: "faithImpact", fallbackToday: "Shame", future: "Grace, and a way back" },
      { label: "Faith", fallbackToday: "Distant", future: "Restored" }
    ],
    milestones: ["Day 7", "Day 28", "Day 60", "Day 90"],
    milestoneCaption: "Day 28: the pattern is broken. Day 90: the new response is your normal."
  },

  // ---------- included (tabela WITHOUT | STRONGHOLD) ----------
  included: {
    title: "What's included in your plan",
    colWithout: "WITHOUT",
    colReturn: "STRONGHOLD",
    rows: [
      { label: "Personalized intervention at the moment of temptation", without: false, crossOut: true },
      { label: "Desire to change", without: true },
      { label: "A prayer that steps in at your exact moment", without: false },
      { label: "No accountability partner required. Nobody else has to know.", without: false },
      { label: "Protection built around your triggers", without: false },
      { label: "Daily scripture + prayers", without: false },
      { label: "Restoration after a fall, without shame", without: false },
      { label: "Your highest-risk hours guarded", without: false }
    ]
  },

  // ---------- reviews ----------
  // TROCAR por depoimentos REAIS antes de qualquer trafego. NUNCA publicar placeholders.
  reviews: {
    paywallSectionTitle: "Results that make us proud",
    // T4 socialProof: 3 depoimentos REAIS e autorizados (dono, 2026-07-15). Sem badge de dias
    // (venda cedo demais); photo = slot da foto real de cada um.
    cardsSocialProof: [
      { text: "I'd been dealing with this since I was 14 and honestly thought something was just wrong with me. Seeing other Christian men talk about the same struggle made it easier to be honest about mine.", name: "Ethan, 32", location: "Nashville, Tennessee", photo: "img/review-ethan.webp" },
      { text: "I'd quit for a few days, sometimes a few weeks, then end up right back where I started. I wasn't looking for another lecture. I needed to understand what kept pulling me back.", name: "Michael, 38", location: "Columbus, Ohio", photo: "img/review-michael.webp" },
      { text: "I'm still working through it, but for the first time I don't feel like I'm fighting completely blind. I'm starting to recognize what happens before the urge gets strong.", name: "Aaron, 27", location: "Boise, Idaho", photo: "img/review-aaron.webp" }
    ],
    // T18 loading: reusa os depoimentos reais do paywall (carrossel compacto).
    // Paywall carrossel 1 (topo, antes do preço): mecanismo → casamento → Deus (dono, 2026-07-15, REAIS).
    cardsPaywall: [
      { text: "Late nights were always where I lost control. One night Stronghold blocked the page, used my name in the prayer, and told me exactly what to do next. I put the phone down and walked out of the room. It sounds simple, but that was the first time I felt helped during the actual moment, not afterward.", name: "Caleb, 34", location: "Dallas, Texas", badge: "91 days free", photo: "img/review-caleb.webp" },
      { text: "My wife didn't know how often I was going back to it. I kept saying I'd stop, then hiding it again. Four months in, the biggest change isn't just the streak. I'm not carrying the same secret around anymore, and she can feel that.", name: "Nathan, 39", location: "Charlotte, North Carolina", badge: "126 days free", photo: "img/review-nathan.webp" },
      { text: "After a relapse I used to avoid praying because I felt fake. Stronghold didn't make me feel more condemned. It helped me come back to God in the same moment I wanted to hide.", name: "Joshua, 31", location: "Tampa, Florida", badge: "74 days free", photo: "img/review-joshua.webp?v=3" }
    ],
    // Paywall carrossel 2 (após a garantia): tentativas anteriores → padrão → retorno após queda.
    cardsPaywallSecondary: [
      { text: "I tried filters, accountability apps, cold showers, deleting social media, pretty much everything. They all depended on me remembering to use them. Stronghold showed up when I was already heading in the wrong direction. That was the difference for me.", name: "Daniel, 44", location: "Denver, Colorado", badge: "152 days free", photo: "img/review-daniel.webp" },
      { text: "For me it was college stress, being alone at night, then scrolling until something triggered me. Once I saw the pattern written out, it was almost obvious. I just hadn't connected it before.", name: "Noah, 25", location: "Madison, Wisconsin", badge: "63 days free", photo: "img/review-noah.webp" },
      { text: "I had a setback around day 20 and normally I would've disappeared for weeks. This time I opened the app, prayed, reset the streak honestly and kept going. That might be the biggest change, I don't turn one bad night into a lost month anymore.", name: "Matthew, 36", location: "Phoenix, Arizona", badge: "48 days rebuilding", photo: "img/review-matthew.webp?v=2" }
    ],
    secondarySectionTitle: "More stories from the brotherhood",
    // Loading (T18): 2 frases curtas, uma de identificação (T3) + uma de mecanismo (paywall).
    // Ponte "esse app entende gente como eu" + "esse mecanismo ajudou alguém". SEM badge de dias.
    cardsCompact: [
      { text: "For the first time, I understood what kept pulling me back.", name: "Ethan, 32", location: "Nashville, TN", photo: "img/review-ethan.webp" },
      { text: "Stronghold helped me during the actual moment, not afterward.", name: "Caleb, 34", location: "Dallas, TX", photo: "img/review-caleb.webp" }
    ]
  },

  // ---------- paywall (secoes gerais) ----------
  paywall: {
    headerTitle: "Your 90-day Stronghold plan is ready.",
    freedomLabel: "Your freedom date:",
    pricingTitle: "Choose the best plan for you",
    pricingCta: "Get My 90-Day Plan",
    perDaySuffix: "/day",
    // Bloco de valor acima dos planos.
    systemTitle: "Your 90-Day Stronghold System",
    systemChecks: [
      "Personalized interventions during your danger moments",
      "Protection built around your triggers",
      "Personalized prayers and scripture",
      "Practical 2-minute resets",
      "Support after a fall, without shame",
      "Progress and pattern tracking"
    ],
    // Rótulos do expandir/recolher da oração.
    prayerReadFull: "Read full prayer",
    prayerShowLess: "Show less",
    guaranteeBadge: "Money-Back Guarantee",
    guaranteeSub: "Not satisfied? Get a full refund within 30 days.",
    discretion: "Purchase appears discretely · Cancel Anytime",
    // Card grande de garantia (com selo 30 dias), modelo Gracen.
    guaranteeCardTitle: "Money-Back Guarantee",
    guaranteeCardBody: "We are so confident in Stronghold that we are ready to offer a full refund within 30 days of your initial purchase if you don't see progress. Additional terms and conditions apply.",
    guaranteeCardLinkText: "For full details, please review our complete refund policy here.",
    // FAQ (perguntas reais do ICP: homem cristão querendo largar a pornografia; foco em
    // privacidade, medo de falhar de novo, vergonha, sem partner, discrição na fatura).
    faqTitle: "Questions men ask before starting",
    faq: [
      {
        q: "Is this really private? Will anyone find out?",
        a: "**Yes. Stronghold is built for privacy first.** It works on your device, the charge appears discreetly on your statement, and nothing requires you to expose your struggle to anyone."
      },
      {
        q: "Do I need an accountability partner?",
        a: "**No.** Stronghold was made for men who don't want to confess this to a friend, a pastor, or their wife before they are ready. *The system is your accountability, nobody else has to know.*"
      },
      {
        q: "I've tried to quit before and failed. Why would this work?",
        a: "Because **it doesn't rely on willpower.** Stronghold learns the exact moments and triggers where you usually fall and steps in right there, **before the fall**, instead of leaving you to white-knuckle it alone."
      },
      {
        q: "What happens if I relapse?",
        a: "You are not kicked out and you are not shamed. Stronghold:\n\n- Helps you come back **the same day**\n- Counts your returns as progress\n- Adjusts to protect that moment next time\n\n*Coming back is part of the process.*"
      },
      {
        q: "Is this tied to a specific church or denomination?",
        a: "No. Stronghold is **Christ-centered** and works whether you are Catholic, Protestant, Orthodox, or just trying to walk back toward God. The prayers and Scripture meet you where you are."
      },
      {
        q: "How much time does it take each day?",
        a: "**Almost none.** Stronghold runs in the background and only speaks up at your high-risk moments. You set it up once and it does the watching for you."
      },
      {
        q: "Can I cancel anytime?",
        a: "**Yes, in a few seconds** from your app settings, and you are covered by the **30-day money-back guarantee.** If it doesn't help, you get your money back."
      }
    ],
    stickyCta: "Get My 90-Day Plan",
    arcLine: "Day 28 breaks the pattern. Days 29 to 90 make the new response automatic. The 12-week plan covers the whole arc.",
    pricingHeadline: "Break the pattern in 28 days. Make it permanent in 90.",
    recommendedBadge: "RECOMMENDED · COVERS THE FULL 90 DAYS",
    // Hora personalizada (T5 highRiskTime) na linha "Prayer is free".
    prayerFreeLine: "Prayer is free. It always was. What you are paying for is the system that puts a prayer between you and the fall at {momentPhrase}, when nobody is watching and willpower is gone.",
    momentPhrases: {
      lateNight: "11:47pm",
      earlyMorning: "6:15am",
      afterWork: "the hour after work",
      alone: "the minute the house goes quiet",
      varies: "the exact moment it hits"
    },
    momentPhraseFallback: "your weakest moment",
    footerLinks: ["Terms", "Privacy", "Refund Policy"],
    takeaway: "Or close this page and try willpower one more time.",
    objections: [
      { icon: "🔒", text: "Appears discretely on your statement" },
      { icon: "⏱", text: "Cancel anytime in 10 seconds" },
      { icon: "🛡", text: "30-day money-back guarantee" }
    ],
    wheelBannerTitle: "🎉 CONGRATULATIONS!",
    wheelBannerSub: "You won the biggest discount!",
    discountExpiresLabel: "Discount expires in",
    offerExpiredLabel: "This offer has expired."
  },

  // ---------- wheel ("Before revealing your plan..." recompensa, nao desconto na copy) ----------
  wheel: {
    title: "Before revealing your plan...",
    sub: "You've completed the assessment. Claim your reward.",
    segments: ["-5%", "-10%", "-15%", "-20%", "-25%", "-30%", "-35%", "-40%", "-50%", "-75%"],
    stopCta: "Stop",
    closeLabel: "Close"
  }
};
