import { fmtBRL } from "@/lib/formatters";

interface CronogramaProps {
  parcelas: number;
  valorParcela: number;
  /** mês inicial absoluto (0-11). Ex: 5 = junho */
  mesInicial?: number;
  anoInicial?: number;
  diaCobranca?: number;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function Cronograma({
  parcelas,
  valorParcela,
  mesInicial,
  anoInicial,
  diaCobranca = 15,
}: CronogramaProps) {
  const today = new Date();
  const startMonth = mesInicial ?? today.getMonth();
  const startYear = anoInicial ?? today.getFullYear();

  const itens = Array.from({ length: parcelas }, (_, i) => {
    const month = startMonth + i;
    const yearOffset = Math.floor(month / 12);
    const monthInYear = ((month % 12) + 12) % 12;
    const d = new Date(startYear + yearOffset, monthInYear, diaCobranca);
    return {
      n: i + 1,
      data: `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`,
      valor: valorParcela,
    };
  });

  return (
    <aside
      aria-label="Cronograma de parcelas"
      className="bg-white border border-kr-deep/[0.14] rounded-xl py-5 max-h-[540px] flex flex-col"
    >
      <div className="px-5 pb-3.5 border-b border-kr-deep/10">
        <div className="font-display font-semibold text-[11px] tracking-[.18em] uppercase text-kr-deep-78">
          Cronograma
        </div>
        <div className="font-display font-bold text-[18px] tracking-[-0.2px] text-kr-deep mt-0.5">
          {parcelas} parcelas mensais
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        {itens.map((p, i) => (
          <div
            key={p.n}
            className={`px-5 py-3 flex items-center justify-between ${
              i === itens.length - 1 ? "" : "border-b border-kr-deep/[0.06]"
            } ${i === 0 ? "bg-kr-violet/[0.06]" : ""}`}
          >
            <div>
              <div className="font-display font-bold text-[13px] text-kr-deep flex items-center gap-2">
                {pad2(p.n)}/{pad2(parcelas)}
                {i === 0 && (
                  <span className="px-2 py-0.5 rounded bg-kr-violet text-white font-display font-semibold text-[9px] tracking-[.1em] uppercase">
                    Atual
                  </span>
                )}
              </div>
              <div className="font-sans text-[11px] text-kr-deep-62 mt-px">
                vence em {p.data}
              </div>
            </div>
            <div className="font-display font-bold text-[14px] text-kr-deep kr-tabular">
              R$ {fmtBRL(p.valor)}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
