"use client";

import { useState } from "react";
import { IconCheck, IconReceipt } from "@/components/kr/icons";
import { fmtBRL } from "@/lib/formatters";

interface BoletoPanelProps {
  valorParcela: number;
  proxVencto: string;
}

const LINHA_DIGITAVEL =
  "03399.62540 31250.000123 60003.456789 1 9999000000820542";

export function BoletoPanel({ valorParcela, proxVencto }: BoletoPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(LINHA_DIGITAVEL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <div>
      <div className="font-display font-semibold text-[11px] tracking-[.18em] uppercase text-kr-deep-78">
        Boleto da 1ª parcela
      </div>
      <div className="mt-4">
        <div className="font-display font-bold text-[24px] md:text-[28px] tracking-[-0.6px] text-kr-deep">
          R$ {fmtBRL(valorParcela)}
        </div>
        <div className="font-sans text-[13px] text-kr-deep-78 mt-1">
          Vencimento {proxVencto} · após o vencimento incidem juros
        </div>

        {/* Linha digitável */}
        <div className="mt-5">
          <label
            htmlFor="kr-boleto-linha"
            className="block font-display font-semibold text-[11px] tracking-[.18em] uppercase text-kr-deep-78 mb-2"
          >
            Linha digitável
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="kr-boleto-linha"
              type="text"
              readOnly
              value={LINHA_DIGITAVEL}
              className="flex-1 min-w-0 h-11 px-3.5 rounded-lg bg-kr-paper border border-kr-deep/[0.20] text-kr-deep font-mono text-[12px] tracking-[0.5px] kr-tabular truncate focus-visible:outline-2 focus-visible:outline-kr-cyan"
            />
            <button
              type="button"
              onClick={handleCopy}
              className={`kr-focus-ring h-11 px-4 rounded-lg border-0 text-white font-display font-semibold text-[13px] cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap ${
                copied ? "bg-kr-violet" : "bg-kr-deep hover:bg-kr-violet"
              }`}
            >
              {copied ? (
                <>
                  <IconCheck size={14} /> Copiado
                </>
              ) : (
                "Copiar"
              )}
            </button>
          </div>
        </div>

        {/* Código de barras visual */}
        <div className="mt-5 p-4 bg-white border border-kr-deep/[0.14] rounded-[10px]">
          <BarcodeVisual />
        </div>

        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            className="kr-focus-ring h-12 px-5 rounded-[10px] border-0 bg-kr-deep text-white cursor-pointer font-display font-semibold text-[14px] inline-flex items-center justify-center gap-2.5 shadow-[0_4px_12px_rgba(10,42,95,0.15)] hover:bg-kr-violet transition-colors"
          >
            <IconReceipt size={16} /> Baixar boleto em PDF
          </button>
          <button
            type="button"
            className="kr-link-focus h-12 px-5 rounded-[10px] border border-kr-deep/[0.20] bg-transparent text-kr-deep cursor-pointer font-display font-semibold text-[14px] inline-flex items-center justify-center"
          >
            Receber por e-mail
          </button>
        </div>
      </div>
    </div>
  );
}

function BarcodeVisual() {
  // Padrão fixo do protótipo (whitespace-s4.jsx)
  const seq =
    "1213132131211223132213122113112213121131221331213122113213121221331132121";
  const bars: React.ReactElement[] = [];
  let x = 0;
  for (const c of seq) {
    const w = parseInt(c, 10);
    bars.push(
      <rect key={x} x={x} y={0} width={w} height={60} fill="#0A2A5F" />,
    );
    x += w + 2;
  }
  return (
    <svg
      width="100%"
      height="60"
      viewBox={`0 0 ${x} 60`}
      preserveAspectRatio="none"
      aria-label="Código de barras"
    >
      {bars}
    </svg>
  );
}
