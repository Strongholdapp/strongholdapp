/* ============================================================
   resets.js — "The practical 2-minute reset" (etapa 3 da Intervencao).
   Um reset por gatilho (+ sleepless para lateNight, + generic de fallback).
   Cada reset e um circuit-breaker fisico/espiritual de ~2 min.
   Voz: direta, honesta, sem sermao. Regra: sem travessao (—).
   Consumido por plan-engine (build().reset) e pela tela da Intervencao.
   ============================================================ */
export const RESETS = {
  stress: {
    title: "The Unclench",
    tag: "Two minutes to break the grip",
    steps: [
      "Stand up and physically unclench. Drop your shoulders, unclench your jaw, open your hands. Stress lives in the body first. Take it out of the body.",
      "Breathe in for 4, hold for 4, out for 6. Four times. You are telling your nervous system the threat is not real.",
      "Say it out loud: \"The pressure is real, but this is not where I put it down.\" Name the lie that porn is rest.",
      "Do one small ordering thing: clear the desk, wash your face, fill a glass of water. Give the stress a real exit."
    ]
  },
  loneliness: {
    title: "The Reach",
    tag: "Two minutes to break the isolation",
    steps: [
      "Text one person. Not about this. Just \"thinking of you\" or \"rough night, glad you exist.\" Break the silence in any direction.",
      "Say out loud: \"I am alone in this room. I am not alone.\" The room lies. Contradict it with your voice.",
      "Put your hand over your chest and breathe slow for 30 seconds. Loneliness makes you feel unseen. You are seen right now.",
      "Leave the room you are in. Isolation and the fall share the same four walls. Change the walls."
    ]
  },
  boredom: {
    title: "The Redirect",
    tag: "Two minutes to fill the void",
    steps: [
      "Move hard for 60 seconds: 20 pushups, run the stairs, step outside. Boredom is low energy and the fall feeds on it. Spike the energy.",
      "Put the phone in another room, screen down. The scroll is the on-ramp. Remove the on-ramp.",
      "Name one thing you actually want to build or do, and take the first small step now. The void wants filling. Fill it with something true."
    ]
  },
  anxiety: {
    title: "The Grounding",
    tag: "Two minutes to come back to now",
    steps: [
      "Name 5 things you can see, 4 you can hear, 3 you can touch. Anxiety lives in the future. This drags you back to now.",
      "Breathe out longer than you breathe in. In for 4, out for 8. Twice. The long exhale switches off the alarm.",
      "Say it out loud: \"I am giving this to God, not to the screen.\" Cast it somewhere real.",
      "Do the next small necessary thing. Anxiety shrinks the moment you act, even tiny."
    ]
  },
  scrolling: {
    title: "The Blackout",
    tag: "Two minutes to kill the feed",
    steps: [
      "Phone face down in another room. Right now, before the next thought. Distance beats willpower.",
      "Ten slow breaths with your hands empty. The habit is in your thumbs. Give them nothing to do.",
      "Say out loud: \"The feed never fills me. I have proven this a hundred times.\" Tell yourself the truth the scroll hides.",
      "Open one real thing instead: your Bible, a window, a walk. Replace the input, do not just remove it."
    ]
  },
  urges: {
    title: "The Wave",
    tag: "Two minutes to let it pass",
    steps: [
      "Cold water on your face and wrists. Ten seconds. It resets your body faster than your mind can argue.",
      "Name it out loud: \"This is a wave. It rises, it peaks, it passes. It always passes.\" You have never once had an urge that lasted forever.",
      "Move your body out of the position and the room. Stand, walk, change the scene. Urges are anchored to a place.",
      "Breathe slow and let the clock run. Two minutes. Do not fight it, do not feed it. Just outlast it. It is already fading."
    ]
  },
  sleepless: {
    title: "The Shutdown",
    tag: "Two minutes to release the night",
    steps: [
      "Phone out of arm's reach, or out of the room. At 2am you cannot be trusted with it, and that is okay.",
      "Lie back and breathe: in for 4, out for 8. Let your body be heavy. You are not solving anything tonight.",
      "Pray one line and repeat it as you drift: \"I give this night to you.\" Let the same words carry you down."
    ]
  },
  generic: {
    title: "The Reset",
    tag: "Two minutes to break the pattern",
    steps: [
      "Change your physical scene. Stand up, leave the room, put the phone down somewhere else. The pattern is anchored to right here.",
      "Breathe slow: in for 4, out for 6, four times. Interrupt the automatic sequence with something manual.",
      "Say it out loud: \"This is the pattern. I am not going to negotiate with it.\" Naming it breaks the trance.",
      "Do one action toward a person or toward God: text a brother, step outside, open your Bible. Put a wall between you and the next click."
    ]
  }
};
