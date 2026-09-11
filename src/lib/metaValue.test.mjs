/* ============================================================
   Testes do metaValue.js.  Rodar:
     node --test --disable-warning=MODULE_TYPELESS_PACKAGE_JSON src/lib/metaValue.test.mjs

   (apontando pro arquivo, não pra pasta: `node --test src/lib/` tentaria
   carregar os outros módulos do lib/, que importam React Native e não rodam
   fora do app.)

   Estes testes existem porque errar aqui não quebra nada visível: vira lance
   errado numa campanha, semanas depois, sem nada no painel apontando pra cá.

   O arquivo é .mjs (e não .js) só pra o Node carregar como ES module sem
   precisar mexer no "type" do package.json, que quebraria o Metro. Metro não
   bundla isto: nada no app importa este arquivo.
   ============================================================ */

import test from "node:test";
import assert from "node:assert/strict";
import { purchaseValue } from "./metaValue.js";

/**
 * Recorte de um StoreProduct real do Superwall RN (só os campos que importam).
 * Shape confirmado em:
 * node_modules/@superwall/react-native-superwall/src/public/StoreProduct.ts
 */
const PRODUTO_BRL = {
  productIdentifier: "stronghold_monthly",
  localizedPrice: "R$ 59,90",
  price: 59.9,
  currencyCode: "BRL",
  currencySymbol: "R$",
  hasFreeTrial: true,
  trialPeriodPrice: 0,
};

test("assinatura brasileira sai como 59.9 BRL, não como o preço de tabela em dólar", () => {
  assert.deepEqual(purchaseValue(PRODUTO_BRL), { valueToSum: 59.9, currency: "BRL" });
});

test("o valor é o da ASSINATURA, não o do teste grátis", () => {
  // O mesmo produto traz trialPeriodPrice: 0. Se alguém trocar o campo lido,
  // este teste cai.
  assert.notEqual(purchaseValue(PRODUTO_BRL).valueToSum, 0);
  assert.equal(purchaseValue(PRODUTO_BRL).valueToSum, 59.9);
});

test("storefront americano sai em USD, com o preço de lá", () => {
  assert.deepEqual(purchaseValue({ price: 9.99, currencyCode: "USD" }), {
    valueToSum: 9.99,
    currency: "USD",
  });
});

test("moeda inválida devolve null, e não um valor sem moeda", () => {
  for (const moeda of ["", "  ", "R$", "BRLL", "12", null, undefined, 5]) {
    assert.equal(
      purchaseValue({ price: 59.9, currencyCode: moeda }),
      null,
      `moeda ${JSON.stringify(moeda)} deveria ser recusada`,
    );
  }
});

test("preço ausente, zero ou não numérico devolve null", () => {
  for (const p of [undefined, null, "", 0, "grátis", NaN, -5, Infinity]) {
    assert.equal(
      purchaseValue({ price: p, currencyCode: "BRL" }),
      null,
      `preço ${JSON.stringify(p)} deveria ser recusado`,
    );
  }
});

test("localizedPrice nunca é usado como valor", () => {
  // Sem `price`, o texto da tela não pode virar número por acidente.
  assert.equal(purchaseValue({ localizedPrice: "R$ 59,90", currencyCode: "BRL" }), null);
});

test("moeda em minúscula é aceita e normalizada", () => {
  assert.deepEqual(purchaseValue({ price: 9.99, currencyCode: "usd" }), {
    valueToSum: 9.99,
    currency: "USD",
  });
});

test("payload que não é objeto não derruba nada", () => {
  for (const raw of [null, undefined, "", 0, "texto", true]) {
    assert.equal(purchaseValue(raw), null);
  }
});
