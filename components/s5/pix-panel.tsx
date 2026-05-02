"use client";

import { useState } from "react";
import { QRPlaceholder } from "./qr-placeholder";
import { IconCheck } from "@/components/kr/icons";
import { fmtBRL } from "@/lib/formatters";

interface PixPanelProps {
  valorParcela: number;
  proxVencto: string;
}

const PIX_CODE =
  "00020126770014BR.GOV.BCB.PIX0114+5511999999999...5204000053039865802BR5925KATALYZER REGULARIZA LTDA6009SAO PAULO62070503***6304A1B2";

export function PixPanel({ valorParcela, proxVencto }: PixPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PIX_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard pode falhar em ambientes sem permissão */
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8 items-start">
      <div className="flex-shrink-0 self-center lg:self-auto p-4 bg-white border border-kr-deep/[0.14] rounded-xl">
        <QRPlaceholder size={220} />
      </div>

      <div className="flex-1 pt-1 min-w-0 w-full">
        <div className="font-display font-semibold text-[11px] tracking-[.18em] uppercase text-kr-deep-78">
          Pagar com PIX
        </div>
        <div className="font-display font-bold text-[24px] md:text-[28px] tracking-[-0.6px] text-kr-deep mt-1.5 kr-tabular">
          R$ {fmtBRL(valorParcela)}
        </div>
        <div className="font-sans text-[13px] text-kr-deep-78 mt-1">
          1ª parcela · vencimento {proxVencto}
        </div>

        <ol className="mt-5 pl-5 list-decimal font-sans text-[13px] leading-relaxed text-kr-deep/[0.85] space-y-1">
          <li>Abra o app do seu banco</li>
          <li>Escolha pagar via PIX QR Code</li>
          <li>Aponte a câmera ou use o copia-e-cola abaixo</li>
        </ol>

        <div className="mt-5">
          <label
            htmlFor="kr-pix-code"
            className="block font-display font-semibold text-[11px] tracking-[.18em] uppercase text-kr-deep-78 mb-2"
          >
            PIX copia e cola
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="kr-pix-code"
              type="text"
              readOnly
              value={PIX_CODE}
              className="flex-1 min-w-0 h-11 px-3.5 rounded-lg bg-kr-paper border border-kr-deep/[0.20] text-kr-deep font-mono text-[12px] truncate focus-visible:outline-2 focus-visible:outline-kr-cyan"
            />
            <button
              type="button"
              onClick={handleCopy}
              className={`kr-focus-ring h-11 px-4 rounded-lg border-0 text-white font-display font-semibold text-[13px] cursor-pointer inline-flex items-center justify-center gap-2 transition-colors duration-200 whitespace-nowrap ${
                copied ? "bg-kr-violet" : "bg-kr-deep hover:bg-kr-violet"
              }`}
            >
              {copied ? (
                <>
                  <IconCheck size={14} /> Copiado
                </>
              ) : (
                "Copiar código"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
