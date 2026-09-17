/* ============================================================
   redeem.js , código de resgate offline pra quem já comprou pelo funil web.

   Sem servidor: o app confere o código sozinho, com uma chave embutida no
   binário. O código sai como "PAYLOAD-XXXXXX", onde XXXXXX é um hash de 6
   caracteres do PAYLOAD com a chave (SECRET). Pra gerar um código válido é
   preciso saber o SECRET, que só existe aqui e no script de geração
   (scripts/generate-redeem-code.js , roda no computador, nunca no app).

   Risco aceito de propósito (ver decisão): o SECRET viaja dentro do bundle
   JS, então alguém que descompilar o app consegue extraí-lo e forjar
   códigos. Pra um produto de US$19 com poucos compradores, esse risco é
   aceitável agora. Quando o volume crescer, trocar pela verificação por
   e-mail contra a tabela purchases (Parte 2 do SQL) é o caminho certo.

   Se o SECRET vazar, trocar o valor abaixo invalida todos os códigos já
   emitidos , teria que reemitir pros compradores antigos.
   ============================================================ */

const SECRET = "sh_offline_9wQ2Kp-Lr7dVeg4TmZ1sXb_v1";

/** Hash simples (FNV-1a de 32 bits) do SECRET + payload, em hex maiúsculo. */
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

/** 6 caracteres de assinatura pra um payload já limpo. */
export function signature(payload) {
  return keyedHash(payload).slice(0, 6);
}

/** Gera "PAYLOAD-XXXXXX". Usado pelo script de geração, não pelo app. */
export function makeRedemptionCode(payload) {
  const clean = cleanPayload(payload);
  return `${clean}-${signature(clean)}`;
}

/**
 * Confere um código digitado pela pessoa. Aceita espaços, minúsculas e
 * hífens extras , qualquer coisa que ela tenha copiado e colado do e-mail.
 */
export function verifyRedemptionCode(rawCode) {
  const clean = String(rawCode || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
  const parts = clean.split("-").filter(Boolean);
  if (parts.length < 2) return false;

  const sig = parts[parts.length - 1];
  /* Mesma limpeza do gerador. Sem isto, um payload com pontuação (JOAO.001)
     vira JOAO001 na hora de gerar mas continua JOAO.001 na hora de conferir,
     e o código legítimo é recusado. */
  const payload = cleanPayload(parts.slice(0, -1).join(""));
  if (!payload || sig.length !== 6) return false;

  return signature(payload) === sig;
}

export default { makeRedemptionCode, verifyRedemptionCode, signature };
