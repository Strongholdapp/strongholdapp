// Stub do Superwall só pro bundle web (ver metro.config.js).
// No app de verdade (iOS/Android) o SDK nativo é usado normalmente.
const Superwall = {
  configure: async () => {},
  shared: {
    register: async () => {},
    setUserAttributes: async () => {},
  },
};

export default Superwall;
export { Superwall };
