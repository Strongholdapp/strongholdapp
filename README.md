# Stronghold , app iOS (React Native / Expo)

App cristão anti-pornografia. No momento exato em que o cara vai cair, o app entra na
frente: bloqueia, mostra uma **oração escrita pro momento dele, com o nome dele**, e guia um
**reset de 2 minutos**.

O "cérebro" (orações, arquétipos, plano de 90 dias, lógica de personalização) veio pronto do
funil web e está aqui em `src/data` + `src/engine`, sem reescrita. O que foi feito neste repo
é a UI nativa em cima dele.

---

## Rodar na sua máquina

```bash
npm install
cp .env.example .env      # e preencha as chaves (ver abaixo)
npx expo start
```

Abra no **Expo Go** (iPhone) pra ver as telas. Para testar o Superwall de verdade, é preciso um
build nativo (`npx expo prebuild` + Xcode, ou direto pelo Codemagic).

---

## As chaves (o que o Lucas entrega)

| Chave | Onde vai | Status |
|---|---|---|
| Supabase URL + anon key | `.env` → `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` | ✅ entregue (está no `tracker.js` do funil) |
| Superwall public key | `.env` → `EXPO_PUBLIC_SUPERWALL_API_KEY` | ⏳ pedir ao Lucas |
| App Store Connect API Key | Painel do Codemagic (não vai pro repo) | ⏳ pedir ao Lucas |

Todas as chaves do `.env` são **client-side por natureza** (anon key e public key). A
`service_role` do Supabase **nunca** entra aqui.

Sem a chave do Superwall o app roda inteiro: a tela de assinatura avisa e deixa passar. Isso é
de propósito, pra dar pra testar tudo e gravar clipe de anúncio antes dos produtos serem
aprovados.

---

## Estrutura

```
App.js                     roteador: onboarding primeiro, app depois
src/
  onboarding/  screens.js       ← as 27 telas do PRD, como CONFIGURAÇÃO
               QuizEngine.js    ← o renderer que monta cada tela
               derive.js        ← derivações, placeholders, ponte pro motor
               proof.js         ← os depoimentos reais
               components/      ← um componente por TIPO de tela
  data/        copy.js · prayers.js · resets.js   ← do funil, só viraram ESM
  engine/      planEngine.js                      ← o motor: build(answers) → plano
  state/       AppContext.js                      ← estado + persistência local
  lib/         env · storage · supabase · superwall · notifications · analytics
  theme/       theme.js                           ← tokens do design system
  components/  ui.js · Icons.js
  screens/     as telas do app pós-onboarding
```

**Regra de ouro herdada do handoff:** dado e lógica se copiam, render se reescreve. Se precisar
mudar um texto de tela, mexa em `src/data/copy.js`, não no componente.

---

## O onboarding (PRD V3, 27 telas)

Implementado como Quiz Engine, exatamente como a seção 3 do PRD pede: não existem 27 páginas
hardcoded. `src/onboarding/screens.js` descreve cada tela (tipo, copy, opções, auto-advance,
mínimo de seleções, próxima tela, evento) e o `QuizEngine` renderiza.

**Mudar copy, ordem, opção ou ponto de proof = editar `screens.js`.** Você só escreve componente
quando aparece um TIPO de tela novo.

Tipos implementados: `WELCOME · TEXT_INPUT · SINGLE_SELECT · MULTI_SELECT · COMMITMENT ·
PERSONALIZED_INTERSTITIAL · PATTERN_REVEAL · REFRAME · MECHANISM · PRODUCT_DEMO · PRIVACY ·
RESULT_BRIDGE · RECOVERY_PROFILE · PLAN_90 · CELEBRATION · PERMISSION_PREPROMPT ·
NATIVE_PERMISSION · PROOF_BRIDGE · PAYWALL`.

O que o PRD exige e está funcionando:

- **Personalização real:** as respostas voltam no bridge, no pattern reveal, no demo, no perfil e
  no paywall. O motor de placeholders nunca deixa `{chave}` crua na tela; sem valor, cai num
  fallback neutro.
- **Derivação determinística:** `derivePrimaryDangerMoment` usa a lista de prioridade da seção 8,
  sem IA. Mudar uma resposta recalcula tudo que vem depois.
- **Persistência por tela:** o profile e o `screen_id` são gravados a cada submit. Fechar e
  reabrir volta exatamente no mesmo ponto, com as respostas.
- **Proof só real:** os 7 pontos de proof puxam de `proof.js`, que só tem depoimentos autorizados.
  A tela 01 mostra estrelas apenas se `APP_RATING` tiver número de verdade; enquanto for `null`,
  usa a identity line.
- **Edge cases da seção 11:** primeira tentativa muda o reframe, "sem padrão claro" muda o demo,
  nome sujo é sanitizado, permissão negada não interrompe o funil.
- **Analytics da seção 5:** os 13 eventos, com `screen_id` e `screen_index` em todo view e
  `time_on_screen_ms` em todo submit, pra dar completion rate por tela.

### As telas do app depois do onboarding

| Tela | Arquivo | O que é |
|---|---|---|
| Welcome | `WelcomeScreen` | abertura |
| Quiz (8 passos) | `QuizScreen` | alimenta TODA a personalização |
| Loading | `LoadingScreen` | roda o motor de verdade enquanto os passos acendem |
| Pattern Report | `ProfileScreen` | arquétipo + o mapa do padrão dele |
| Plano de 90 dias | `PlanScreen` | 4 fases + freedom date |
| Paywall | `PaywallScreen` | dispara o Superwall |
| Home | `HomeScreen` | streak, botão de pânico, pledge, filtro, SOS |
| **A Intervenção** | `InterventionScreen` | bloqueio → oração (palavra a palavra) → reset 2 min → retorno |
| SOS | `SOSScreen` | o app fala com ele pelo nome, digitando ao vivo |
| Content filter | `BrowserScreen` | navegador seguro + paródia 🌽 que dispara o bloqueio |
| Return sem vergonha | `ReturnScreen` | pós-queda, sem punição |
| Brotherhood | `BrotherhoodScreen` | comunidade (vitrine na v1) |
| Profile | `YouScreen` | perfil, modo demo pra gravação, recomeço |

---

## Publicar (Codemagic → App Store Connect do Lucas)

1. Suba este projeto num repo no seu GitHub.
2. Codemagic → **Add application** → conecte o repo → ele acha o `codemagic.yaml` sozinho.
3. Codemagic → **Teams > Integrations > App Store Connect** → cole a API Key do Lucas com o nome
   exato **`Stronghold ASC`**.
4. Codemagic → **Environment variables** → grupo **`stronghold`** com:
   `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`,
   `EXPO_PUBLIC_SUPERWALL_API_KEY`, `APP_STORE_APPLE_ID`.
5. Rode o workflow **`ios-testflight`**. Depois que passar, o **`ios-appstore`**.

**Bundle ID:** `app.livestronghold.stronghold` , é o mesmo do registro que já existe. Não crie app
novo na App Store Connect, reusa esse.

**Product IDs da assinatura:** `stronghold_monthly` e `stronghold_annual`.

---

## Regras de copy e compliance (inegociáveis)

- **Sem travessão (—).** Vírgula, ponto ou dois-pontos.
- **Sem promessa médica** e sem prometer cura. Linguagem espiritual, não clínica.
- **Deus é aliado, nunca juiz.** O vício é o inimigo, nunca a pessoa.
- **Privacidade é o argumento nº 1.** Tudo fica no aparelho; o nome nunca sai dele.
- No texto **público** da App Store, **não** usar a palavra "porn" (a Apple já rejeitou por
  isso). O propósito anti-pornografia se explica só nas **notas de revisão**, que são privadas.
- Compra só por **StoreKit** (via Superwall). Nada de link de pagamento externo dentro do app.

---

## O que ficou pra fase 2

O **bloqueio real** de sites (hoje o filtro é a paródia 🌽 que dispara a Intervenção). Em iOS isso
pede Screen Time API / Family Controls, com entitlement da Apple, que o Lucas já solicitou. A v1
entrega a Intervenção pelo botão de pânico e pelo SOS, que é o que vende no anúncio.
