/* ============================================================
   metaValue.js , valor e moeda de uma compra, pro Meta App Events.

   Mora sozinho e não importa NADA (nem o SDK da Meta, nem o Superwall) por
   dois motivos:

     1. assim dá pra testar fora do app, sem módulo nativo.
     2. os modos de falha aqui são todos SILENCIOSOS. Valor errado não quebra
        tela nenhuma: vira lance errado numa campanha, semanas depois, e
        ninguém liga uma coisa à outra.

   ── O PREÇO É POR STOREFRONT, E ESSA É A ARMADILHA ────────────────────────
   A tentação é mandar o preço de tabela fixo (US$ 59.99). Estaria errado pra
   quase todo mundo: no iOS o preço da assinatura muda por loja (BRA, USA...).
   Valor fixo em dólar ensina o otimizador a tratar uma assinatura brasileira
   como se valesse o mesmo que uma americana.

   O Superwall entrega os dois campos prontos no StoreProduct do evento
   (`price` numérico e `currencyCode` ISO-4217). É deles que isto lê, e de
   mais nada. Confirmado em:
   node_modules/@superwall/react-native-superwall/src/public/StoreProduct.ts
   ============================================================ */

/**
 * Extrai valor e moeda do StoreProduct do Superwall, ou devolve null.
 *
 * ── SEM VALOR É MELHOR QUE COM VALOR ERRADO ───────────────────────────────
 * Qualquer dúvida devolve null, e quem chama manda o evento SEM valor. A Meta
 * então otimiza por quantidade: pior, e honesto. Mandar 0, ou um número numa
 * moeda que não é a da compra, envenena o aprendizado da campanha de um jeito
 * que não aparece em painel nenhum.
 *
 * Preço 0 devolve null de propósito: é o que aparece no início do teste
 * grátis, e um evento de valor zero diz ao otimizador que aquela conversão
 * não vale nada.
 *
 * @param {any} product StoreProduct do evento do Superwall
 * @returns {{ valueToSum: number, currency: string } | null}
 */
export function purchaseValue(product) {
  if (!product || typeof product !== "object") return null;

  // `price` é o campo numérico do StoreProduct. `localizedPrice` ("R$ 59,90")
  // é texto pra tela e nunca serve aqui: Number("R$ 59,90") é NaN.
  const raw = Number(product.price);
  if (!Number.isFinite(raw) || raw <= 0) return null;

  // ISO-4217 ou nada. currencyCode é opcional no SDK (`string | null`), e ""
  // como moeda faz a Meta descartar o valor sem avisar.
  const code =
    typeof product.currencyCode === "string" ? product.currencyCode.trim().toUpperCase() : "";
  if (!/^[A-Z]{3}$/.test(code)) return null;

  return { valueToSum: raw, currency: code };
}

export default { purchaseValue };
