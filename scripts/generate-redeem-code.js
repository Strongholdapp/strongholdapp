#!/usr/bin/env node
/* ============================================================
   generate-redeem-code.js , gera um código de resgate pra um comprador.

   Roda no seu computador, nunca no app (a chave SECRET aqui tem que ser
   IDÊNTICA à de src/lib/redeem.js , se você trocar uma, troca as duas).

   Uso:
     node scripts/generate-redeem-code.js JOAO001
     node scripts/generate-redeem-code.js "joao@exemplo.com"

   O payload pode ser qualquer coisa que te ajude a lembrar quem é , um
   apelido, um número de pedido, um pedaço do e-mail. Ele não precisa ser
   secreto: quem vê o código não descobre o payload sem saber o SECRET, e
   mesmo descobrindo o payload não aprende nada sensível.

   Guarda o par (payload -> pessoa) em algum lugar seu (uma planilha, por
   exemplo), porque o app não confere IDENTIDADE, só confere se o código é
   válido , se dois compradores usarem o mesmo código, os dois entram.
   Por isso: um payload por comprador, nunca reaproveita.
   ============================================================ */

const SECRET = "sh_offline_9wQ2Kp-Lr7dVeg4TmZ1sXb_v1";

function keyedHash(payload) {
  let h = 0x811c9dc5;
  const input = SECRET + "|" + payload;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).toUpperCase().padStart(8, "0");
}

function cleanPayload(raw) {
  return String(raw || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function makeRedemptionCode(payload) {
  const clean = cleanPayload(payload);
  if (!clean) throw new Error("Payload vazio depois de limpar (só letras e números contam).");
  return `${clean}-${keyedHash(clean).slice(0, 6)}`;
}

const arg = process.argv[2];
if (!arg) {
  console.error("Uso: node scripts/generate-redeem-code.js <payload>");
  console.error('Exemplo: node scripts/generate-redeem-code.js JOAO001');
  process.exit(1);
}

const code = makeRedemptionCode(arg);
console.log(code);
