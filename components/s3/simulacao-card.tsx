import { IconInfo } from "@/components/kr/icons";
import { fmtBRL, fmtPercent } from "@/lib/formatters";
import { SELIC_MENSAL, type Plano } from "@/lib/parcelas";

interface SimulacaoCardProps {
  plano: Plano;
  totalDebito: number;
}

/**
 * Sidebar de simulação — protótipo S3.
 * - bg #0A2A5F, color white, padding 28 32, rounded 12
 * - Halo decorativo violeta blur top-right
 * - "Simulação" eyebrow
 * - "Você paga" + R$ 56px Sora 700 ls -1.6px
 * - Breakdown: Total débitos / Juros (accent violet) / Total estimado bold 22px
 * - Aviso "Cada parcela..." card
 * - position: sticky top: 32 (lg+)
 */
export function SimulacaoCard({ plano, totalDebito }: SimulacaoCardProps) {
  const jurosEstimados = plano.jurosTotal;

  return (
    <aside
      aria-label="Simulação de pagamento"
      className="relative bg-kr-deep text-white rounded-xl px-7 py-7 md:px-8 md:py-7 overflow-hidden self-start lg:sticky lg:top-8"
    >
      {/* Halo decorativo violeta */}
      <div
        aria-hidden="true"
        className="absolute -top-10 -right-10 w-[200px] h-[200px] rounded-full bg-kr-violet/30 blur-[40px]"
      />

      <div className="relative">
        <div className="font-display font-semibold text-[11px] tracking-[.18em] uppercase text-white/70">
          Simulação
        </div>

        <div className="mt-5 relative">
          <div className="font-display font-semibold text-[12px] text-white/70">
            Você paga
          </div>
          <div className="font-display font-bold text-[44px] sm:text-[56px] leading-none tracking-[-1.6px] mt-1.5 kr-tabular">
            R$ {fmtBRL(plano.valorParcela)}
          </div>
          <div className="font-sans text-[13px] text-white/[0.78] mt-1.5">
            {plano.n === 1
              ? "em uma única parcela"
              : `por mês, durante ${plano.n} meses`}
          </div>
        </div>

        <div className="mt-7 pt-5 border-t border-white/[0.18] flex flex-col gap-3.5 relative">
          <Row
            label="Total dos débitos"
            value={`R$ ${fmtBRL(totalDebito)}`}
          />
          {plano.n > 1 && (
            <Row
              label={`Juros estimados (Selic ${fmtPercent(SELIC_MENSAL)} a.m.)`}
              value={`+ R$ ${fmtBRL(jurosEstimados)}`}
              accent
            />
          )}
          <div className="h-px bg-white/[0.18] my-1" />
          <Row
            label={plano.n === 1 ? "Total a pagar" : "Total estimado"}
            value={`R$ ${fmtBRL(plano.valorTotal)}`}
            bold
          />

          {plano.n > 1 && (
            <div className="mt-1.5 px-3.5 py-2.5 rounded-lg bg-white/[0.08] flex gap-2.5 items-start">
              <span className="flex-shrink-0 mt-px text-white">
                <IconInfo size={14} />
              </span>
              <span className="font-sans text-[12px] leading-snug text-white/[0.85]">
                Cada parcela é gerada na data do vencimento e os juros são
                calculados pela{" "}
                <strong className="text-white">Selic vigente no mês</strong>. O
                total real pode variar.
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

function Row({
  label,
  value,
  accent,
  bold,
}: {
  label: string;
  value: string;
  accent?: boolean;
  bold?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="font-sans font-normal text-[13px] text-white/[0.78]">
        {label}
      </span>
      <span
        className={`font-display kr-tabular ${
          bold
            ? "font-bold text-[22px] tracking-[-0.4px] text-white"
            : "font-semibold text-[14px] tracking-normal"
        } ${accent ? "text-kr-violet" : !bold ? "text-white" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
