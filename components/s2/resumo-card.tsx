import { fmtBRL } from "@/lib/formatters";

interface ResumoCardProps {
  totalGeral: number;
  totalNegociavel: number;
  qtdNegociavel: number;
  qtdJudicial: number;
}

export function ResumoCard({
  totalGeral,
  totalNegociavel,
  qtdNegociavel,
  qtdJudicial,
}: ResumoCardProps) {
  return (
    <section
      aria-label="Resumo da situação"
      className="mt-3.5 p-5 md:py-4 md:px-6 bg-white border border-kr-deep-12 rounded-xl grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-4 md:gap-0"
    >
      <div className="md:pr-6 md:border-r border-kr-deep-08">
        <div className="font-display font-semibold text-[11px] tracking-[.18em] uppercase text-kr-deep-78">
          Total em divida ativa
        </div>
        <div className="font-display font-bold text-[26px] md:text-[30px] text-kr-deep tracking-[-0.6px] mt-1.5 kr-tabular">
          R$ {fmtBRL(totalGeral)}
        </div>
      </div>
      <div className="md:px-6 md:border-r border-kr-deep-08">
        <div className="font-display font-semibold text-[11px] tracking-[.18em] uppercase text-kr-deep-78">
          Pode negociar agora
        </div>
        <div className="font-display font-bold text-[20px] md:text-[22px] text-kr-deep tracking-[-0.4px] mt-1.5 kr-tabular">
          R$ {fmtBRL(totalNegociavel)}
        </div>
        <div className="font-sans font-medium text-[12px] text-kr-deep-78 mt-0.5">
          {qtdNegociavel} débito{qtdNegociavel !== 1 ? "s" : ""}
        </div>
      </div>
      <div className="md:pl-6">
        <div className="font-display font-semibold text-[11px] tracking-[.18em] uppercase text-kr-deep-78">
          Em processo judicial
        </div>
        <div className="font-display font-bold text-[20px] md:text-[22px] text-kr-error tracking-[-0.4px] mt-1.5 kr-tabular">
          {qtdJudicial} débito{qtdJudicial !== 1 ? "s" : ""}
        </div>
        <div className="font-sans font-medium text-[12px] text-kr-deep-78 mt-0.5">
          atenção especial
        </div>
      </div>
    </section>
  );
}
