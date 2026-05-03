"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/kr/page-header";
import { CropMarks } from "@/components/kr/crop-marks";
import { PaperGrain } from "@/components/kr/paper-grain";
import { SkipLink } from "@/components/kr/skip-link";
import { RouteGuard } from "@/components/kr/route-guard";
import { OpcaoParcela } from "@/components/s3/opcao-parcela";
import { SimulacaoCard } from "@/components/s3/simulacao-card";
import { IconArrowLeft, IconArrowRight } from "@/components/kr/icons";
import { fmtBRL } from "@/lib/formatters";
import { getDebitosSelecionados, useRegularizaStore } from "@/lib/store";
import { getPlanos, type Plano } from "@/lib/parcelas";

function S3Content() {
  const router = useRouter();
  const selectedDebitos = useRegularizaStore((s) => s.selectedDebitos);
  const parcelas = useRegularizaStore((s) => s.parcelas);
  const setParcelas = useRegularizaStore((s) => s.setParcelas);

  const debitosSelecionados = getDebitosSelecionados(selectedDebitos);
  const totalDebito = debitosSelecionados.reduce((s, d) => s + d.valor, 0);
  const planos = getPlanos(totalDebito);

  const planoAtual: Plano =
    planos.find((p) => p.n === parcelas) ??
    planos.find((p) => p.recomendado) ??
    planos[0];

  return (
    <div className="relative min-h-screen flex flex-col bg-kr-cream font-sans">
      <SkipLink />
      <PaperGrain />
      <CropMarks />

      <PageHeader current={2} />

      <main
        id="kr-main"
        className="relative z-10 flex-1 px-32"
      >
        {/* Section header */}
        <section className="pt-8 pb-5 border-b border-kr-deep/10">
          <div className="font-display font-semibold text-[11px] tracking-[.18em] uppercase text-kr-deep-78 mb-1.5">
            Etapa 03 · Parcelamento
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
            <h1 className="font-display font-bold text-[28px] md:text-[32px] lg:text-[38px] leading-[1.1] text-kr-deep tracking-[-1.0px] m-0">
              Como você quer regularizar?
            </h1>
            <div className="font-sans text-[13px] text-kr-deep-78">
              {debitosSelecionados.length} débito
              {debitosSelecionados.length !== 1 ? "s" : ""} selecionado
              {debitosSelecionados.length !== 1 ? "s" : ""} ·{" "}
              <span className="font-display font-bold text-kr-deep kr-tabular">
                R$ {fmtBRL(totalDebito)}
              </span>
            </div>
          </div>
        </section>

        {/* Grid principal */}
        <section className="mt-7 grid gap-6 lg:grid-cols-[1fr_480px] lg:gap-6 lg:items-start pb-10">
          {/* Coluna 1 — escolha */}
          <div className="bg-white border border-kr-deep/[0.14] rounded-xl p-6 md:p-8">
            <div className="flex items-baseline justify-between gap-4 mb-1">
              <div className="font-display font-semibold text-[11px] tracking-[.18em] uppercase text-kr-deep-78">
                Opções de pagamento
              </div>
              <div className="font-sans text-[11px] text-kr-deep-62">
                {planos.length}{" "}
                {planos.length === 1 ? "opção" : "opções"} disponíveis
              </div>
            </div>

            <p className="mt-1.5 mb-5 font-sans text-[13px] text-kr-deep-78 leading-relaxed max-w-[520px]">
              Selecionamos a melhor opção de prazo para o seu perfil. Você pode
              escolher qualquer uma das opções abaixo.
            </p>

            {/* Lista de planos */}
            <div
              role="radiogroup"
              aria-label="Escolha o número de parcelas"
              className="flex flex-col gap-2.5"
            >
              {planos.map((p) => (
                <OpcaoParcela
                  key={p.n}
                  plano={p}
                  selected={parcelas === p.n}
                  onSelect={() => setParcelas(p.n)}
                />
              ))}
            </div>

            {/* Nota legal */}
            <p className="mt-6 mb-0 font-sans text-[11px] leading-[1.55] text-kr-deep-55">
              Os juros estimados acima são calculados pela Selic vigente. O
              valor real de cada parcela é definido na data do vencimento e
              pode variar conforme a taxa do mês.
            </p>
          </div>

          {/* Coluna 2 — simulação */}
          <SimulacaoCard plano={planoAtual} totalDebito={totalDebito} />
        </section>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 z-20 left-0 right-0 h-[100px] bg-white border-t border-kr-deep/[0.14] px-32 flex items-center justify-between gap-4 sm:gap-6 shadow-[0_-8px_24px_rgba(10,42,95,0.04)]">
        <button
          type="button"
          onClick={() => router.push("/debitos")}
          className="kr-link-focus inline-flex items-center justify-center gap-2 font-display font-semibold text-[14px] text-kr-deep cursor-pointer pl-3 pr-4 py-2.5 rounded-lg border border-kr-deep/[0.20] bg-transparent"
        >
          <IconArrowLeft size={16} />
          <span className="hidden sm:inline">Voltar para débitos</span>
          <span className="sm:hidden">Voltar</span>
        </button>

        <div className="flex items-center gap-4 sm:gap-7">
          <div className="text-right hidden sm:block">
            <div className="font-display font-semibold text-[11px] tracking-[.18em] uppercase text-kr-deep-78">
              {planoAtual.n === 1
                ? "pagamento à vista"
                : `${planoAtual.n}× de R$ ${fmtBRL(planoAtual.valorParcela)}`}
            </div>
            <div className="font-display font-bold text-[22px] md:text-[26px] text-kr-deep tracking-[-0.6px] kr-tabular mt-0.5">
              R$ {fmtBRL(planoAtual.valorTotal)}{" "}
              <span className="text-[13px] font-medium text-kr-deep-62 tracking-normal">
                {planoAtual.n === 1 ? "total" : "total estimado"}
              </span>
            </div>
          </div>
          <button
            type="button"
            disabled={!parcelas}
            onClick={() => router.push("/revisao")}
            className="kr-focus-ring h-14 px-6 rounded-[10px] border-0 text-white font-display font-semibold text-[15px] inline-flex items-center gap-3 tracking-[.2px] transition-all duration-150 bg-kr-deep shadow-[0_8px_24px_rgba(10,42,95,0.25)] hover:bg-kr-violet hover:-translate-y-px disabled:bg-kr-deep/30 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:bg-kr-deep/30 disabled:hover:translate-y-0"
          >
            <span className="hidden sm:inline">
              Continuar para pagamento
            </span>
            <span className="sm:hidden">Continuar</span>
            <IconArrowRight size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}

export default function S3Parcelamento() {
  return (
    <RouteGuard require={["doc", "selecionados"]}>
      <S3Content />
    </RouteGuard>
  );
}
