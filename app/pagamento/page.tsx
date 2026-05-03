"use client";

import { useRef, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/kr/page-header";
import { CropMarks } from "@/components/kr/crop-marks";
import { PaperGrain } from "@/components/kr/paper-grain";
import { SkipLink } from "@/components/kr/skip-link";
import { RouteGuard } from "@/components/kr/route-guard";
import { AvisoAtivacao } from "@/components/s5/aviso-ativacao";
import { PixPanel } from "@/components/s5/pix-panel";
import { BoletoPanel } from "@/components/s5/boleto-panel";
import { DebitoPanel } from "@/components/s5/debito-panel";
import { Cronograma } from "@/components/s5/cronograma";
import {
  IconArrowLeft,
  IconCoin,
  IconHouse,
  IconLock,
  IconReceipt,
  IconStorefront,
} from "@/components/kr/icons";
import { fmtBRL } from "@/lib/formatters";
import {
  getDebitosSelecionados,
  useRegularizaStore,
  type MetodoPagamento,
} from "@/lib/store";
import { calcParcela } from "@/lib/parcelas";

const METODOS: Array<{
  id: MetodoPagamento;
  label: string;
  hint: string;
  Icon: React.FC<{ size?: number }>;
}> = [
  { id: "pix", label: "PIX", hint: "aprovação imediata", Icon: IconCoin },
  {
    id: "boleto",
    label: "Boleto bancário",
    hint: "até 3 dias úteis",
    Icon: IconReceipt,
  },
  {
    id: "debito",
    label: "Débito automático",
    hint: "todas as parcelas",
    Icon: IconStorefront,
  },
];

function S5Content() {
  const router = useRouter();
  const protocolo = useRegularizaStore((s) => s.protocolo);
  const selectedDebitos = useRegularizaStore((s) => s.selectedDebitos);
  const parcelas = useRegularizaStore((s) => s.parcelas);
  const metodo = useRegularizaStore((s) => s.metodoPagamento);
  const setMetodo = useRegularizaStore((s) => s.setMetodoPagamento);
  const reset = useRegularizaStore((s) => s.reset);

  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    const total = METODOS.length;
    let nextIdx = idx;
    if (e.key === "ArrowRight") nextIdx = (idx + 1) % total;
    else if (e.key === "ArrowLeft") nextIdx = (idx - 1 + total) % total;
    else if (e.key === "Home") nextIdx = 0;
    else if (e.key === "End") nextIdx = total - 1;
    else return;
    e.preventDefault();
    setMetodo(METODOS[nextIdx].id);
    tabRefs.current[nextIdx]?.focus();
  };

  const debitos = getDebitosSelecionados(selectedDebitos);
  const totalDebito = debitos.reduce((s, d) => s + d.valor, 0);
  const valorParcela = calcParcela(totalDebito, parcelas);

  // Próximo vencimento: hoje + 30 dias
  const proxVencDate = new Date();
  proxVencDate.setDate(proxVencDate.getDate() + 30);
  const proxVencto = proxVencDate.toLocaleDateString("pt-BR");

  const handleConcluir = () => {
    router.push("/");
  };

  const handlePagarDepois = () => {
    router.push("/");
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-kr-cream font-sans">
      <SkipLink />
      <PaperGrain />
      <CropMarks />

      <PageHeader current={4} />

      <main
        id="kr-main"
        className="relative z-10 flex-1 px-32"
      >
        {/* Section header */}
        <section className="pt-8 pb-5 border-b border-kr-deep/10">
          <div className="font-display font-semibold text-[11px] tracking-[.18em] uppercase text-kr-deep-78 mb-1.5">
            Etapa 05 · Pagamento da 1ª parcela
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
            <h1 className="font-display font-bold text-[28px] md:text-[32px] lg:text-[38px] leading-[1.1] text-kr-deep tracking-[-1.0px] m-0">
              Como você quer pagar?
            </h1>
            <div className="font-sans text-[13px] text-kr-deep-78">
              Acordo nº{" "}
              <span className="font-mono font-medium text-kr-deep">
                {protocolo ?? "—"}
              </span>{" "}
              · {parcelas}× de R$ {fmtBRL(valorParcela)}
            </div>
          </div>

          <AvisoAtivacao proxVencto={proxVencto} />
        </section>

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Método de pagamento"
          className="mt-6 flex gap-1 overflow-x-auto border-b border-kr-deep/[0.14] -mx-5 px-5 md:mx-0 md:px-0"
        >
          {METODOS.map((m, idx) => {
            const a = metodo === m.id;
            return (
              <button
                key={m.id}
                ref={(el) => {
                  tabRefs.current[idx] = el;
                }}
                type="button"
                role="tab"
                id={`kr-tab-${m.id}`}
                aria-selected={a}
                aria-controls={`kr-tabpanel-${m.id}`}
                tabIndex={a ? 0 : -1}
                onClick={() => setMetodo(m.id)}
                onKeyDown={(e) => onTabKeyDown(e, idx)}
                className={`px-5 py-3.5 -mb-px border-b-2 bg-transparent cursor-pointer font-display font-semibold text-[13px] inline-flex items-center gap-2.5 whitespace-nowrap kr-link-focus ${
                  a
                    ? "text-kr-deep border-kr-deep"
                    : "text-kr-deep-78 border-transparent hover:text-kr-deep"
                }`}
              >
                <m.Icon size={16} /> {m.label}
                <span className="font-sans font-medium text-[11px] text-kr-deep-62 ml-1 hidden sm:inline">
                  · {m.hint}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid: painel + cronograma */}
        <section className="mt-7 grid gap-6 lg:grid-cols-[1fr_380px] lg:gap-6 pb-10">
          {/* Painel central */}
          <div
            role="tabpanel"
            id={`kr-tabpanel-${metodo}`}
            aria-labelledby={`kr-tab-${metodo}`}
            tabIndex={0}
            className="bg-white border border-kr-deep/[0.14] rounded-xl p-6 md:p-8 min-h-[480px] focus-visible:outline-2 focus-visible:outline-kr-cyan"
          >
            {metodo === "pix" && (
              <PixPanel valorParcela={valorParcela} proxVencto={proxVencto} />
            )}
            {metodo === "boleto" && (
              <BoletoPanel
                valorParcela={valorParcela}
                proxVencto={proxVencto}
              />
            )}
            {metodo === "debito" && <DebitoPanel parcelas={parcelas} />}
          </div>

          {/* Cronograma */}
          <Cronograma parcelas={parcelas} valorParcela={valorParcela} />
        </section>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 z-20 left-0 right-0 h-[100px] bg-white border-t border-kr-deep/[0.14] px-32 flex items-center justify-between gap-4 sm:gap-6 shadow-[0_-8px_24px_rgba(10,42,95,0.04)]">
        <button
          type="button"
          onClick={() => router.push("/revisao")}
          className="kr-link-focus inline-flex items-center justify-center gap-2 font-display font-semibold text-[14px] text-kr-deep cursor-pointer pl-3 pr-4 py-2.5 rounded-lg border border-kr-deep/[0.20] bg-transparent"
        >
          <IconArrowLeft size={16} />
          <span className="hidden sm:inline">Voltar à revisão</span>
          <span className="sm:hidden">Voltar</span>
        </button>

        <div className="flex items-center gap-3 sm:gap-5">
          <div className="font-sans text-[12px] text-kr-deep-62 hidden md:flex items-center gap-2">
            <IconLock size={14} /> ambiente seguro · prefeitura
          </div>
          <button
            type="button"
            onClick={handlePagarDepois}
            className="kr-link-focus h-14 px-5 rounded-[10px] border border-kr-deep/[0.20] bg-transparent text-kr-deep cursor-pointer font-display font-semibold text-[14px] inline-flex items-center justify-center"
          >
            <span className="hidden sm:inline">Pagar depois</span>
            <span className="sm:hidden">Depois</span>
          </button>
          <button
            type="button"
            onClick={() => {
              reset();
              handleConcluir();
            }}
            className="kr-focus-ring h-14 px-6 rounded-[10px] border-0 bg-kr-deep text-white cursor-pointer font-display font-semibold text-[15px] inline-flex items-center gap-3 tracking-[.2px] shadow-[0_8px_24px_rgba(10,42,95,0.25)] hover:bg-kr-violet hover:-translate-y-px transition-all duration-200"
          >
            <IconHouse size={18} /> Concluir
          </button>
        </div>
      </footer>
    </div>
  );
}

export default function S5Pagamento() {
  return (
    <RouteGuard
      require={["doc", "selecionados", "parcelas", "protocolo"]}
    >
      <S5Content />
    </RouteGuard>
  );
}
