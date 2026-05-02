"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { IconCheck } from "@/components/kr/icons";
import { fmtBRL } from "@/lib/formatters";
import type { Plano } from "@/lib/parcelas";

interface TermosModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAccept: () => void;
  plano: Plano;
  totalDebito: number;
}

const SECOES = [
  {
    n: "1",
    titulo: "Do objeto",
    texto:
      "Este termo formaliza o reconhecimento e confissão, pelo CONTRIBUINTE, do débito identificado nas etapas anteriores, e estabelece as condições para sua regularização perante a Administração Tributária Municipal.",
  },
  {
    n: "2",
    titulo: "Da forma de pagamento e juros",
    bold: "Taxa Selic vigente no mês do respectivo vencimento",
    texto:
      "O valor de cada parcela é determinado pela divisão do débito total consolidado pelo número de parcelas escolhido. Sobre cada parcela vincenda incidirão juros calculados pela {bold}, acrescidos de 1% (um por cento) no mês do pagamento, conforme legislação aplicável.",
  },
  {
    n: "3",
    titulo: "Do vencimento das parcelas",
    texto:
      "As parcelas vencem mensalmente, a partir do mês subsequente à celebração deste termo, em data fixa indicada no boleto. O atraso superior a 60 (sessenta) dias em qualquer parcela implicará a rescisão automática do parcelamento.",
  },
  {
    n: "4",
    titulo: "Da confissão de dívida",
    texto:
      "O CONTRIBUINTE confessa, de forma irrevogável e irretratável, a dívida objeto deste termo, renunciando expressamente a qualquer questionamento administrativo ou judicial relativo à sua exigibilidade.",
  },
  {
    n: "5",
    titulo: "Da rescisão",
    texto:
      "A rescisão deste termo restabelece a totalidade do débito original, deduzidos os pagamentos efetuados, com inscrição em dívida ativa e imediata adoção das medidas de cobrança cabíveis.",
  },
  {
    n: "6",
    titulo: "Da vigência",
    texto:
      "Este termo vigora a partir da sua aceitação eletrônica e tem como prazo final a quitação integral da última parcela.",
  },
];

export function TermosModal({
  open,
  onOpenChange,
  onAccept,
  plano,
  totalDebito,
}: TermosModalProps) {
  const handleAccept = () => {
    onAccept();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        aria-labelledby="kr-termo-title"
        className="max-w-[680px] sm:max-w-[680px] w-full p-0 gap-0 bg-white border-0 ring-0 rounded-[14px] shadow-[0_24px_64px_rgba(10,42,95,0.32)] flex flex-col max-h-[80vh] overflow-hidden"
      >
        {/* Crop marks */}
        <ModalCropMarks />

        {/* Header */}
        <div className="px-6 sm:px-9 pt-7 pb-5 border-b border-kr-deep/10 relative">
          <div className="font-display font-semibold text-[11px] tracking-[.18em] uppercase text-kr-deep-78">
            Documento Oficial · Etapa 03
          </div>
          <DialogPrimitive.Title
            id="kr-termo-title"
            className="mt-1.5 font-display font-bold text-[22px] sm:text-[24px] leading-tight tracking-[-0.4px] text-kr-deep"
          >
            Termo de parcelamento e confissão de dívida
          </DialogPrimitive.Title>
          <DialogPrimitive.Close
            aria-label="Fechar"
            className="absolute top-5 right-5 w-8 h-8 rounded-lg border border-kr-deep/[0.16] bg-white text-kr-deep flex items-center justify-center cursor-pointer hover:bg-kr-paper kr-link-focus"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <line
                x1="2"
                y1="2"
                x2="12"
                y2="12"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <line
                x1="12"
                y1="2"
                x2="2"
                y2="12"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </DialogPrimitive.Close>
        </div>

        {/* Body */}
        <div className="px-6 sm:px-9 py-5 overflow-y-auto flex-1 font-sans text-[13.5px] leading-[1.7] text-kr-deep/[0.85]">
          <div className="px-4 py-4 bg-kr-paper border border-kr-deep/10 rounded-[10px] mb-5 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <TermoStat label="Débito original" value={`R$ ${fmtBRL(totalDebito)}`} />
            <TermoStat
              label="Forma de pagamento"
              value={
                plano.n === 1
                  ? "À vista"
                  : `${plano.n}× de R$ ${fmtBRL(plano.valorParcela)}`
              }
            />
            <TermoStat
              label="Total estimado"
              value={`R$ ${fmtBRL(plano.valorTotal)}`}
            />
          </div>

          {SECOES.map((s) => (
            <TermoSec key={s.n} n={s.n} titulo={s.titulo}>
              {s.bold && s.texto.includes("{bold}") ? (
                <>
                  {s.texto.split("{bold}")[0]}
                  <strong>{s.bold}</strong>
                  {s.texto.split("{bold}")[1]}
                </>
              ) : (
                s.texto
              )}
            </TermoSec>
          ))}

          <p className="mt-5 mb-0 text-[11.5px] text-kr-deep-55 leading-[1.6]">
            A aceitação eletrônica deste termo, registrada com IP, data e hora,
            tem força de assinatura para todos os fins legais, nos termos da
            legislação vigente sobre documentos eletrônicos.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-9 py-4 border-t border-kr-deep/10 flex items-center justify-between gap-3.5 flex-wrap">
          <button
            type="button"
            className="kr-link-focus bg-transparent border-0 p-0 cursor-pointer font-sans text-[12.5px] text-kr-deep-78 underline underline-offset-[3px] inline-flex items-center gap-1.5"
          >
            Baixar versão completa em PDF
          </button>

          <div className="flex gap-2.5 ml-auto">
            <DialogPrimitive.Close className="kr-link-focus h-11 px-4 rounded-lg border border-kr-deep/[0.20] bg-transparent text-kr-deep cursor-pointer font-display font-semibold text-[13px]">
              Fechar
            </DialogPrimitive.Close>
            <button
              type="button"
              onClick={handleAccept}
              className="kr-focus-ring h-11 px-5 rounded-lg border-0 bg-kr-deep text-white cursor-pointer font-display font-bold text-[13px] inline-flex items-center gap-2 transition-colors hover:bg-kr-violet"
            >
              <IconCheck size={14} /> Li e aceito o termo
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ModalCropMarks() {
  return (
    <>
      <svg
        width="14"
        height="14"
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{ left: 10, top: 10 }}
      >
        <line x1="7" y1="7" x2="14" y2="7" stroke="rgba(10,42,95,0.30)" strokeWidth="1" />
        <line x1="7" y1="7" x2="7" y2="14" stroke="rgba(10,42,95,0.30)" strokeWidth="1" />
      </svg>
      <svg
        width="14"
        height="14"
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{ right: 10, top: 10 }}
      >
        <line x1="7" y1="7" x2="0" y2="7" stroke="rgba(10,42,95,0.30)" strokeWidth="1" />
        <line x1="7" y1="7" x2="7" y2="14" stroke="rgba(10,42,95,0.30)" strokeWidth="1" />
      </svg>
      <svg
        width="14"
        height="14"
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{ left: 10, bottom: 10 }}
      >
        <line x1="7" y1="7" x2="14" y2="7" stroke="rgba(10,42,95,0.30)" strokeWidth="1" />
        <line x1="7" y1="7" x2="7" y2="0" stroke="rgba(10,42,95,0.30)" strokeWidth="1" />
      </svg>
      <svg
        width="14"
        height="14"
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{ right: 10, bottom: 10 }}
      >
        <line x1="7" y1="7" x2="0" y2="7" stroke="rgba(10,42,95,0.30)" strokeWidth="1" />
        <line x1="7" y1="7" x2="7" y2="0" stroke="rgba(10,42,95,0.30)" strokeWidth="1" />
      </svg>
    </>
  );
}

function TermoSec({
  n,
  titulo,
  children,
}: {
  n: string;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-4">
      <h3 className="m-0 font-display font-bold text-[13.5px] text-kr-deep flex items-baseline gap-2">
        <span className="kr-tabular text-kr-deep/50 font-medium text-[12px] tracking-[.05em]">
          0{n}
        </span>
        {titulo}
      </h3>
      <p className="mt-1.5 mb-0">{children}</p>
    </section>
  );
}

function TermoStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display font-semibold text-[10px] tracking-[.14em] uppercase text-kr-deep-62">
        {label}
      </div>
      <div className="font-display font-bold text-[14px] tracking-[-0.2px] text-kr-deep mt-1 kr-tabular">
        {value}
      </div>
    </div>
  );
}
