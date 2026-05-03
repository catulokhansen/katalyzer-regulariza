# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Heads-up: Next.js version

This project uses **Next.js 16.2.4** with **React 19.2.4** and **Tailwind v4** — APIs and conventions differ from older training data. Before writing non-trivial Next/React code, consult the bundled docs at `node_modules/next/dist/docs/` (entry: `index.md`, with `01-app/`, `02-pages/`, `03-architecture/`). Heed deprecation notices.

The user writes in **Brazilian Portuguese**; respond in Portuguese when the conversation is in Portuguese. Code identifiers and domain terms are also in Portuguese (`debitos`, `parcelas`, `tributos`, `contribuinte`).

## Commands

```bash
npm run dev            # next dev — http://localhost:3000
npm run build          # next build
npm run start          # next start (production)
npm run lint           # eslint (flat config, eslint-config-next core-web-vitals + typescript)
npm test               # vitest run (unit tests in lib/**/*.test.ts, env: node)
npm run test:watch     # vitest (interactive)
npm run test:coverage  # vitest run --coverage (v8 provider; report in coverage/)
```

Tests cover only pure domain code in `lib/` (validators, formatters, parcelas, tributos, debitos, store helpers, utils). Components and store actions are not tested yet.

## Architecture

### What this is

`Katalyzer Regulariza` is a 5-step front-end-only flow ("Portal do Contribuinte") that lets a citizen consult tax debts (IPTU/ISS/ITBI/TMRSU/Multa), select which to negotiate, choose an installment plan, accept terms, and pay the first installment. All data is currently **mocked in `lib/debitos.ts`** — there is no backend wired up. `lib/api.ts` configures an axios client against `NEXT_PUBLIC_KR_API_URL` (fallback `/api`) but is not used yet.

### The 5-step flow

The whole app is a wizard. Routes map 1:1 to steps; the `current` index passed to `<PageHeader>` and `<Stepper>` must match the step number:

| Step | Route          | Page component  | Component dir    |
| ---- | -------------- | --------------- | ---------------- |
| 0    | `/`            | S1 Identificação | `components/s1/` |
| 1    | `/debitos`     | S2 Débitos      | `components/s2/` |
| 2    | `/parcelamento` | S3 Parcelamento | `components/s3/` |
| 3    | `/revisao`     | S4 Revisão      | `components/s4/` |
| 4    | `/pagamento`   | S5 Pagamento    | `components/s5/` |

When adding a step-specific component, place it under `components/sN/` to match this convention.

### State + step gating

Wizard state lives in a single Zustand store (`lib/store.ts`) persisted to `sessionStorage` under the key `kr-regulariza`. Selection state uses `Record<string, true>` (not `Set`) because Sets don't serialize.

`components/kr/route-guard.tsx` enforces ordering: each step page wraps its content in `<RouteGuard require={[...]}>` listing the prerequisites (`doc`, `selecionados`, `parcelas`, `termos`, `protocolo`). On store hydration, missing prerequisites redirect to `/`. The guard uses `useSyncExternalStore` against `useRegularizaStore.persist.onFinishHydration` to avoid hydration race conditions — keep this pattern when touching the guard.

The pagamento page (S5) is special: it renders the `Conclusao` view in-place (toggled by local `concluido` state) rather than navigating to a separate `/conclusao` route.

### Domain logic

- `lib/debitos.ts` — `Debito` shape, `DEBITOS_MOCK` (the demo dataset), `CONTRIBUINTE_MOCK`, `PARCELAMENTO_ATIVO_MOCK`. Statuses: `vencido` (negotiable), `ajuizado`, `prescrito`. `cobranca`: `encaminhado` | `protestado`.
- `lib/tributos.ts` — `TributoTipo` union, `TRIBUTO_META` (display labels), `ORDEM_TRIBUTOS` (canonical render order — preserve it across S2/S4 grouping).
- `lib/parcelas.ts` — installment table `[1,2,3,6,10,12,18,24,30,36,42,48,54,60]`, Selic rate, and the `regraRecomendado` heuristic (>10 opts → 10×, 4–10 → 3×, ≤3 → 1×). `getPlanos(total)` is the single source of truth for installment options; never recompute interest by hand in components.
- `lib/validators.ts` — full CPF/CNPJ check-digit validation. `validateDoc` dispatches by digit count (11 → CPF, 14 → CNPJ).
- `lib/formatters.ts` — `fmtBRL`, `maskDoc` (live input mask), `maskDocPartial` (display, e.g. `CPF 123.***.***-45`), `maskContato`.

### Design system

- Tailwind v4 via `@tailwindcss/postcss`; tokens are declared in `app/globals.css` under `@theme inline` — **don't add a `tailwind.config.*`**. Brand tokens use the `kr-*` prefix (`kr-deep`, `kr-violet`, `kr-cyan`, `kr-cream`, `kr-paper`, `kr-error`, plus opacity variants `kr-deep-78/62/55/36/18/12/08`).
- Fonts (Next/font): Sora (`--font-display`, headings), Poppins (`--font-sans`, body), Geist Mono (`--font-mono`).
- Custom utilities defined in `globals.css`: `kr-skip`, `kr-focus-ring`, `kr-link-focus`, `kr-paper-grain`, `kr-spin`, `kr-tabular`. Use these for accessibility/focus styling instead of redefining.
- shadcn/ui is configured (`components.json`, style `base-nova`, alias `@/components/ui`, util `@/lib/utils#cn`). `@base-ui/react` provides Dialog primitives wrapped by `components/ui/dialog.tsx`.
- Common chrome lives in `components/kr/`: `PageHeader` (logo + Stepper), `Stepper`, `SkipLink`, `PaperGrain`, `CropMarks`, `RouteGuard`, `icons.tsx` (custom icons named `IconX`, e.g. `IconLock`, `IconArrowRight`).

### Path alias

`@/*` resolves to the project root (see `tsconfig.json` + `components.json` aliases). Use `@/lib/...`, `@/components/...` — never relative `../../`.

### Conventions worth keeping

- All step pages are `"use client"` (Zustand + interactivity); only `app/page.tsx` and `app/layout.tsx` are server components.
- Steps after S1 always wrap content in `<RouteGuard>` — when adding a new step, declare the full prerequisite chain.
- Keep currency rendering as `R$ ` prefix + `fmtBRL(n)` (no `style: "currency"`); the codebase is consistent on this.
- Texts and labels in pt-BR.
