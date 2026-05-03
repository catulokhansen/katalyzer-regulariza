"use client";

import {
  IconCheckCircle,
  IconEnvelope,
  IconFileText,
  IconHouse,
  IconWhatsapp,
} from "@/components/kr/icons";
import { fmtBRL, maskContato } from "@/lib/formatters";
import type { MetodoPagamento } from "@/lib/store";

interface ConclusaoProps {
  protocolo: string;
  protocoloEmitidoEm: string;
  canalEnvio: "email" | "sms" | null;
  contatoEnvio: string;
  parcelas: number;
  valorParcela: number;
  totalDebito: number;
  metodoPagamento: MetodoPagamento;
  proxVencto: string;
  onNovaConsulta: () => void;
}

const METODO_LABEL: Record<MetodoPagamento, string> = {
  pix: "PIX",
  boleto: "Boleto bancário",
  debito: "Débito automático",
};

function fmtEmissao(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const data = d.toLocaleDateString("pt-BR");
  const hora = d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${data} às ${hora}`;
}

export function Conclusao({
  protocolo,
  protocoloEmitidoEm,
  canalEnvio,
  contatoEnvio,
  parcelas,
  valorParcela,
  totalDebito,
  metodoPagamento,
  proxVencto,
  onNovaConsulta,
}: ConclusaoProps) {
  const contatoMascarado = maskContato(canalEnvio, contatoEnvio);
  const CanalIcon = canalEnvio === "sms" ? IconWhatsapp : IconEnvelope;

  const handleBaixarTermo = () => {
    window.alert("Em breve: download do termo do acordo (PDF).");
  };

  return (
    <section
      aria-labelledby="kr-conclusao-title"
      className="mt-7 grid gap-6 pb-10"
    >
      {/* Hero card */}
      <div className="bg-white border border-kr-deep/[0.14] border-l-4 border-l-kr-violet rounded-xl px-6 py-7 md:px-8 md:py-8 flex flex-col sm:flex-row gap-5 sm:items-start">
        <span
          aria-hidden="true"
          className="flex-shrink-0 w-14 h-14 rounded-full bg-kr-violet/[0.10] text-kr-violet flex items-center justify-center"
        >
          <IconCheckCircle size={36} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-display font-semibold text-[11px] tracking-[.18em] uppercase text-kr-violet">
            Acordo registrado
          </div>
          <h2
            id="kr-conclusao-title"
            className="font-display font-bold text-[22px] md:text-[26px] tracking-[-0.4px] text-kr-deep mt-1"
          >
            Tudo pronto, {protocolo}.
          </h2>
          <p className="font-sans text-[13.5px] text-kr-deep-78 mt-1.5 leading-relaxed">
            O termo de confissão foi gerado e o acordo está formalizado.
            Lembrete: ele{" "}
            <strong className="text-kr-deep">
              só passa a ter efeito após o pagamento da 1ª parcela
            </strong>{" "}
            até {proxVencto}.
          </p>
          <div className="mt-3 font-sans text-[12.5px] text-kr-deep-62">
            Emitido em {fmtEmissao(protocoloEmitidoEm)}
          </div>
        </div>
      </div>

      {/* Recap + envio */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="bg-white border border-kr-deep/[0.14] rounded-xl px-6 py-6 md:px-7 md:py-6">
          <div className="font-display font-semibold text-[11px] tracking-[.18em] uppercase text-kr-deep-78">
            Resumo do acordo
          </div>
          <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <RecapRow
              label="Total negociado"
              value={`R$ ${fmtBRL(totalDebito)}`}
              strong
            />
            <RecapRow
              label="Parcelamento"
              value={`${parcelas}× de R$ ${fmtBRL(valorParcela)}`}
              strong
            />
            <RecapRow
              label="Método de pagamento"
              value={METODO_LABEL[metodoPagamento]}
            />
            <RecapRow label="1ª parcela vence" value={proxVencto} />
          </dl>
        </div>

        <aside
          aria-label="Envio do termo"
          className="bg-white border border-kr-deep/[0.14] rounded-xl px-6 py-6 md:px-7 md:py-6 self-start"
        >
          <div className="font-display font-semibold text-[11px] tracking-[.18em] uppercase text-kr-deep-78">
            Termo enviado para
          </div>
          <div className="mt-3 flex items-start gap-3">
            <span
              aria-hidden="true"
              className="flex-shrink-0 w-9 h-9 rounded-full bg-kr-deep/[0.06] text-kr-deep flex items-center justify-center"
            >
              <CanalIcon size={18} />
            </span>
            <div className="min-w-0">
              <div className="font-display font-bold text-[14px] text-kr-deep">
                {canalEnvio === "sms" ? "SMS / WhatsApp" : "E-mail"}
              </div>
              <div className="font-mono text-[13px] text-kr-deep-78 mt-0.5 truncate">
                {contatoMascarado || "—"}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleBaixarTermo}
            className="kr-link-focus mt-5 w-full h-11 px-4 rounded-lg border border-kr-deep/[0.20] bg-transparent text-kr-deep cursor-pointer font-display font-semibold text-[13px] inline-flex items-center justify-center gap-2"
          >
            <IconFileText size={16} /> Baixar termo (PDF)
          </button>
        </aside>
      </div>

      {/* Próximos passos */}
      <div className="bg-white border border-kr-deep/[0.14] rounded-xl px-6 py-6 md:px-7 md:py-6">
        <div className="font-display font-semibold text-[11px] tracking-[.18em] uppercase text-kr-deep-78">
          Próximos passos
        </div>
        <ol className="mt-3 pl-5 list-decimal font-sans text-[13.5px] leading-relaxed text-kr-deep/[0.85] space-y-1.5">
          <li>
            Pague a 1ª parcela até <strong>{proxVencto}</strong> usando o método
            escolhido ({METODO_LABEL[metodoPagamento]}).
          </li>
          <li>
            Após a confirmação do pagamento, o acordo é ativado e os boletos
            das parcelas seguintes são enviados pelo mesmo canal.
          </li>
          <li>
            Acompanhe o status do acordo a qualquer momento pelo número{" "}
            <span className="font-mono font-semibold text-kr-deep">
              {protocolo}
            </span>
            .
          </li>
        </ol>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
        <button
          type="button"
          onClick={onNovaConsulta}
          className="kr-focus-ring h-12 px-6 rounded-[10px] border-0 bg-kr-deep text-white cursor-pointer font-display font-semibold text-[14px] inline-flex items-center justify-center gap-2.5 shadow-[0_4px_12px_rgba(10,42,95,0.15)] hover:bg-kr-violet transition-colors"
        >
          <IconHouse size={16} /> Nova consulta
        </button>
      </div>
    </section>
  );
}

function RecapRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div>
      <dt className="font-display font-semibold text-[10.5px] tracking-[.18em] uppercase text-kr-deep-78">
        {label}
      </dt>
      <dd
        className={`mt-1 kr-tabular ${
          strong
            ? "font-display font-bold text-[18px] tracking-[-0.2px] text-kr-deep"
            : "font-sans text-[14px] text-kr-deep"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
