"use client";

import { useState } from "react";
import { PageHeader } from "@/components/kr/page-header";
import { CropMarks } from "@/components/kr/crop-marks";
import { PaperGrain } from "@/components/kr/paper-grain";
import { SkipLink } from "@/components/kr/skip-link";
import { RouteGuard } from "@/components/kr/route-guard";
import { ContribuinteHeader } from "@/components/s2/contribuinte-header";
import { ParcelamentoAtivoBanner } from "@/components/s2/parcelamento-ativo-banner";
import { ResumoCard } from "@/components/s2/resumo-card";
import { GrupoTributo } from "@/components/s2/grupo-tributo";
import { FooterFixoS2 } from "@/components/s2/footer-fixo";
import { ORDEM_TRIBUTOS, type TributoTipo } from "@/lib/tributos";
import { DEBITOS_MOCK } from "@/lib/debitos";
import { useRegularizaStore } from "@/lib/store";

function S2Content() {
  // Acordeão exclusivo — todos os grupos fechados por padrão
  const grupos = ORDEM_TRIBUTOS.map((tipo) => ({
    tipo,
    debitos: DEBITOS_MOCK.filter((d) => d.tipo === tipo),
  })).filter((g) => g.debitos.length > 0);

  const [expandedTipo, setExpandedTipo] = useState<TributoTipo | null>(null);

  const selectAllNegociaveis = useRegularizaStore(
    (s) => s.selectAllNegociaveis,
  );
  const selectedDebitos = useRegularizaStore((s) => s.selectedDebitos);

  const negociaveis = DEBITOS_MOCK.filter((d) => d.status === "vencido");
  const allNegociaveisSelected =
    negociaveis.length > 0 &&
    negociaveis.every((d) => selectedDebitos[d.id]);

  const totalGeral = DEBITOS_MOCK.filter((d) => d.status !== "prescrito").reduce(
    (s, d) => s + d.valor,
    0,
  );
  const totalNegociavel = negociaveis.reduce((s, d) => s + d.valor, 0);
  const qtdJudicial = DEBITOS_MOCK.filter((d) => d.status === "ajuizado").length;
  const qtdEncaminhado = DEBITOS_MOCK.filter((d) => d.cobranca).length;

  return (
    <div className="relative min-h-screen flex flex-col bg-kr-cream font-sans">
      <SkipLink />
      <PaperGrain />
      <CropMarks />

      <PageHeader current={1} />

      <main
        id="kr-main"
        className="relative z-10 flex-1 px-32 pb-6"
      >
        <ContribuinteHeader />
        <ParcelamentoAtivoBanner />
        <ResumoCard
          totalGeral={totalGeral}
          totalNegociavel={totalNegociavel}
          qtdNegociavel={negociaveis.length}
          qtdJudicial={qtdJudicial}
          qtdEncaminhado={qtdEncaminhado}
        />

        <div className="mt-4 mb-2 flex items-center justify-between gap-3 flex-wrap">
          <h2 className="font-display font-bold text-base text-kr-deep tracking-[-0.2px] m-0">
            Seus tributos em aberto
          </h2>
          <button
            type="button"
            onClick={selectAllNegociaveis}
            className="kr-link-focus font-display font-semibold text-[13px] text-kr-violet underline underline-offset-[3px] bg-transparent border-0 cursor-pointer py-1.5 px-1"
          >
            {allNegociaveisSelected
              ? "Desmarcar todos"
              : "Selecionar todos negociáveis"}
          </button>
        </div>

        <div className="bg-white border border-kr-deep-12 rounded-xl overflow-hidden">
          {grupos.map((g, gi) => (
            <div
              key={g.tipo}
              className={gi > 0 ? "border-t border-kr-deep-12" : ""}
            >
              <GrupoTributo
                tipo={g.tipo}
                debitos={g.debitos}
                expanded={expandedTipo === g.tipo}
                onToggle={() =>
                  setExpandedTipo((curr) =>
                    curr === g.tipo ? null : g.tipo,
                  )
                }
              />
            </div>
          ))}
        </div>
      </main>

      <FooterFixoS2 />
    </div>
  );
}

export default function S2Debitos() {
  return (
    <RouteGuard require={["doc"]}>
      <S2Content />
    </RouteGuard>
  );
}
