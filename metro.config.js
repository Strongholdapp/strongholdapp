// Config padrão do Expo, com um desvio só: no bundle WEB (preview rápido no
// navegador, útil pra gravar clipe de anúncio), o SDK do Superwall é trocado por
// um stub. O pacote dele tem um require quebrado que só o resolver do web pega,
// e Superwall é nativo de qualquer jeito. iOS e Android usam o SDK real.
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

const SUPERWALL_STUB = path.resolve(__dirname, "src/lib/superwall.web-stub.js");

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === "web" && moduleName.startsWith("@superwall/react-native-superwall")) {
    return { type: "sourceFile", filePath: SUPERWALL_STUB };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
