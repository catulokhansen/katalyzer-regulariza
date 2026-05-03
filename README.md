# Katalyzer Regulariza · Portal do Contribuinte

Front-end de um portal que permite ao contribuinte consultar débitos de dívida ativa municipal (IPTU, ISS, ITBI, TMRSU, multas), simular parcelamentos e formalizar um acordo em até 5 minutos.

> **Status:** demonstração somente front-end. Os débitos, contribuinte e parcelamento ativo vêm de mocks em `lib/debitos.ts`. Nenhum backend está conectado — `lib/api.ts` já tem o cliente axios configurado para `NEXT_PUBLIC_KR_API_URL`, mas ainda não é consumido.

## Fluxo de 5 etapas

O app é um wizard. Cada rota corresponde a uma etapa e o índice repassado ao `<Stepper>` precisa bater com a posição:

| #  | Rota             | Etapa                |
| -- | ---------------- | -------------------- |
| 0  | `/`              | Identificação (CPF/CNPJ) |
| 1  | `/debitos`       | Seleção de débitos   |
| 2  | `/parcelamento`  | Escolha do plano     |
| 3  | `/revisao`       | Revisão e aceite     |
| 4  | `/pagamento`     | Pagamento da 1ª parcela + Conclusão |

A navegação entre etapas é gateada pelo `RouteGuard` (`components/kr/route-guard.tsx`) — se o pré-requisito (doc, débitos, parcelas, termos, protocolo) não estiver preenchido na store, o usuário é redirecionado para `/`.

## Stack

- **Next.js 16.2.4** (App Router) + **React 19.2.4** + **TypeScript** estrito
- **Tailwind CSS v4** (via `@tailwindcss/postcss`) — tokens declarados em `app/globals.css` sob `@theme inline`, sem arquivo `tailwind.config`
- **Zustand 5** com `persist` em `sessionStorage` (chave `kr-regulariza`)
- **shadcn/ui** (estilo `base-nova`) e **@base-ui/react** para primitivas (Dialog)
- **axios**, **lucide-react**, **sonner**, **next-themes**
- Fontes via `next/font`: Sora (display), Poppins (sans), Geist Mono

## Como rodar

```bash
npm install
npm run dev      # http://localhost:3000
```

Outros scripts:

```bash
npm run build    # build de produção
npm run start    # servir o build
npm run lint     # eslint (flat config)
```

Não há suíte de testes configurada.

## Estrutura

```
app/                  rotas (App Router) — uma página por etapa
  page.tsx              S1 Identificação (server component)
  debitos/page.tsx      S2
  parcelamento/page.tsx S3
  revisao/page.tsx      S4
  pagamento/page.tsx    S5 (renderiza Conclusão in-place)
  layout.tsx, globals.css

components/
  kr/                 chrome compartilhado (PageHeader, Stepper, RouteGuard, ícones, etc.)
  ui/                 primitivas shadcn (Dialog, Button, Input, …)
  s1/ … s5/           componentes específicos de cada etapa

lib/
  store.ts            Zustand (estado do wizard, persistido em sessionStorage)
  debitos.ts          tipos + mocks (Debito, Contribuinte, ParcelamentoAtivo)
  tributos.ts         TributoTipo, TRIBUTO_META, ORDEM_TRIBUTOS
  parcelas.ts         tabela de parcelas, Selic, regraRecomendado, getPlanos
  validators.ts       CPF/CNPJ com dígito verificador
  formatters.ts       fmtBRL, maskDoc, maskDocPartial, maskContato
  api.ts              cliente axios (placeholder)
  utils.ts            helper cn() (clsx + tailwind-merge)
```

## Convenções

- **Idioma:** UI, identificadores e domínio em **pt-BR** (`debitos`, `parcelas`, `tributos`, `contribuinte`).
- **Path alias:** `@/*` resolve para a raiz. Use `@/lib/...` e `@/components/...` em vez de caminhos relativos.
- **Componentes por etapa:** ao adicionar algo de uma etapa específica, coloque em `components/sN/` para manter o padrão.
- **Tokens de marca:** prefixo `kr-*` (`kr-deep`, `kr-violet`, `kr-cyan`, `kr-cream`, `kr-paper`, `kr-error`) com variações de opacidade `kr-deep-78/62/55/36/18/12/08`.
- **Utilitários customizados:** `kr-focus-ring`, `kr-link-focus`, `kr-tabular`, `kr-skip`, `kr-paper-grain` — definidos em `globals.css`.
- **Cálculo de parcelas:** sempre via `getPlanos(total)` em `lib/parcelas.ts`. Não recompute juros à mão nos componentes.
- **Moeda:** `R$ ${fmtBRL(n)}` em todo lugar (não usar `Intl.NumberFormat` com `style: "currency"`).
