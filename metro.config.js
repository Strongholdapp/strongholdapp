// Config padrão do Expo, com um desvio só: no bundle WEB (preview rápido no
// navegador, útil pra gravar clipe de anúncio), os SDKs nativos são trocados por
// stubs. O do Superwall tem um require quebrado que só o resolver do web pega, e
// o do Meta não tem implementação de web nenhuma. Os dois são nativos de
// qualquer jeito. iOS e Android usam os SDKs reais.
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

const SUPERWALL_STUB = path.resolve(__dirname, "src/lib/superwall.web-stub.js");
const META_STUB = path.resolve(__dirname, "src/lib/meta.web-stub.js");

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === "web" && moduleName.startsWith("@superwall/react-native-superwall")) {
    return { type: "sourceFile", filePath: SUPERWALL_STUB };
  }
  if (platform === "web" && moduleName === "react-native-fbsdk-next") {
    return { type: "sourceFile", filePath: META_STUB };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
