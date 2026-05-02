"use client";

import { IconCheck } from "@/components/kr/icons";
import { fmtBRL } from "@/lib/formatters";
import type { Plano } from "@/lib/parcelas";

interface OpcaoParcelaProps {
  plano: Plano;
  selected: boolean;
  onSelect: () => void;
}

/**
 * Linha de plano de parcelamento — botão radio do protótipo.
 * - Active: bg #0A2A5F, texto branco, border 2px deep
 * - Recomendado (não-active): border 1.5px violet/55, com faixa lateral violeta 3px
 * - Idle: border 1px deep/16
 * Grid: 120px 1fr auto
 */
export function OpcaoParcela({ plano, selected, onSelect }: OpcaoParcelaProps) {
  const isAVista = plano.n === 1;
  const isRec = plano.recomendado;

  const baseBorder = selected
    ? "border-2 border-kr-deep"
    : isRec
      ? "border-[1.5px] border-kr-violet/55"
      : "border border-kr-deep/[0.16]";

  const baseBg = selected ? "bg-kr-deep text-white" : "bg-white text-kr-deep";
  const recShadow =
    isRec && !selected ? "shadow-[0_1px_0_rgba(123,44,191,0.10)]" : "";

  const eyebrowColor = selected
    ? "text-white/[0.78]"
    : "text-kr-deep-62";

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`relative grid grid-cols-1 sm:grid-cols-[120px_1fr_auto] items-center gap-3 sm:gap-5 px-5 py-4 rounded-[10px] cursor-pointer text-left transition-all duration-150 kr-focus-ring ${baseBorder} ${baseBg} ${recShadow}`}
    >
      {/* Faixa lateral violeta para recomendado não-ativo */}
      {isRec && !selected && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-2.5 bottom-2.5 w-[3px] bg-kr-violet rounded-sm"
        />
      )}

      {/* Coluna 1 — prazo */}
      <div className="flex flex-col gap-0.5">
        <span className="font-display font-bold text-[22px] leading-none tracking-[-0.5px] kr-tabular">
          {isAVista ? "À vista" : `${plano.n}×`}
        </span>
        <span className={`font-sans text-[11px] ${eyebrowColor}`}>
          {isAVista ? "pagamento único" : "parcelas mensais"}
        </span>
      </div>

      {/* Coluna 2 — info / badge */}
      <div className="flex flex-col gap-1.5 min-w-0">
        {isRec && (
          <span
            className={`self-start inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-display font-bold text-[10.5px] tracking-[.12em] uppercase whitespace-nowrap ${
              selected
                ? "bg-white/[0.18] text-white"
                : "bg-kr-violet text-white"
            }`}
          >
            <IconCheck size={11} /> Mais recomendado
          </span>
        )}
        <div className="flex items-center gap-2.5 flex-wrap">
          {isAVista ? (
            <span
              className={`font-display font-semibold text-[12px] tracking-[.04em] whitespace-nowrap ${
                selected ? "text-white" : "text-kr-violet"
              }`}
            >
              sem juros
            </span>
          ) : (
            <span
              className={`font-sans text-[11.5px] whitespace-nowrap ${
                selected ? "text-white/[0.78]" : "text-kr-deep-62"
              }`}
            >
              <span className="font-display font-semibold">
                + R$ {fmtBRL(plano.jurosTotal)}
              </span>{" "}
              em juros estimados
            </span>
          )}
        </div>
      </div>

      {/* Coluna 3 — valor */}
      <div className="text-left sm:text-right">
        <div className="font-display font-bold text-[18px] tracking-[-0.3px] kr-tabular">
          R$ {fmtBRL(plano.valorParcela)}
          {!isAVista && (
            <span
              className={`font-sans font-medium text-[12px] ml-1 ${
                selected ? "text-white/[0.78]" : "text-kr-deep-62"
              }`}
            >
              /mês
            </span>
          )}
        </div>
        <div
          className={`font-sans text-[11px] mt-0.5 kr-tabular ${
            selected ? "text-white/[0.70]" : "text-kr-deep-55"
          }`}
        >
          total R$ {fmtBRL(plano.valorTotal)}
        </div>
      </div>
    </button>
  );
}
