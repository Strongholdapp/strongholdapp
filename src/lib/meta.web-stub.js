/* ============================================================
   Stub do react-native-fbsdk-next pro bundle WEB.

   Mesmo motivo do superwall.web-stub.js: o pacote é nativo (iOS/Android) e
   não tem implementação de web, então o resolver do Metro o troca por este
   arquivo quando platform === "web" (ver metro.config.js). Assim o preview no
   navegador , usado pra gravar clipe de anúncio , continua subindo.

   Os métodos existem e não fazem nada, de propósito: meta.js chama sem saber
   que está no web, e medição nunca pode derrubar o produto.
   ============================================================ */

export const Settings = {
  async setAdvertiserTrackingEnabled() {
    return false;
  },
  setAutoLogAppEventsEnabled() {},
  setAdvertiserIDCollectionEnabled() {},
  initializeSDK() {},
};

export const AppEventsLogger = {
  logEvent() {},
  logPurchase() {},
};

export default { Settings, AppEventsLogger };
