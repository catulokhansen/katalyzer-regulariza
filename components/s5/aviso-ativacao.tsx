import { IconInfo } from "@/components/kr/icons";

interface AvisoAtivacaoProps {
  proxVencto: string;
}

/**
 * Aviso institucional do protótipo S4 (whitespace-s4.jsx).
 * - bg violet/06, border violet/22, border-l 3px violet, rounded 8
 * - Round icon 24×24 violet com Info dentro
 * - Título Sora 700 13px
 * - Texto 12.5px com strong em data e ações
 */
export function AvisoAtivacao({ proxVencto }: AvisoAtivacaoProps) {
  return (
    <div
      role="note"
      className="mt-5 px-4 py-3.5 bg-kr-violet/[0.06] border border-kr-violet/[0.22] border-l-[3px] border-l-kr-violet rounded-lg flex items-start gap-3"
    >
      <span
        aria-hidden="true"
        className="flex-shrink-0 w-6 h-6 rounded-full bg-kr-violet text-white flex items-center justify-center mt-0.5"
      >
        <IconInfo size={14} />
      </span>
      <div className="flex-1">
        <div className="font-display font-bold text-[13px] text-kr-deep mb-0.5">
          O acordo só será ativado após o pagamento da 1ª parcela
        </div>
        <div className="font-sans text-[12.5px] leading-snug text-kr-deep/[0.85]">
          Você tem até <strong>{proxVencto}</strong> para realizar o pagamento.
          Se não pagar até essa data, o acordo é cancelado automaticamente e os
          débitos retornam ao status anterior. Você pode{" "}
          <strong>pagar agora</strong> ou{" "}
          <strong>guardar o boleto/PIX</strong> para pagar depois — o link e o
          termo também são enviados para o seu e-mail e WhatsApp.
        </div>
      </div>
    </div>
  );
}
