// Stub do Superwall só pro bundle web (ver metro.config.js).
// No app de verdade (iOS/Android) o SDK nativo é usado normalmente.
const Superwall = {
  configure: async () => {},
  shared: {
    register: async () => {},
    setUserAttributes: async () => {},
    // Usado por attachMetaDelegate (ver superwall.js). No web não há compra,
    // então o delegate existe e nunca recebe evento de transação.
    setDelegate: async () => {},
  },
};

// O superwall.js lê EventType do módulo pra filtrar os eventos de receita.
// Sem isto, no web ele leria undefined.
export const EventType = {
  freeTrialStart: "freeTrialStart",
  subscriptionStart: "subscriptionStart",
  transactionComplete: "transactionComplete",
};

export default Superwall;
export { Superwall };
