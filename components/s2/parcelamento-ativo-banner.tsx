import { IconInfo } from "@/components/kr/icons";
import { PARCELAMENTO_ATIVO_MOCK } from "@/lib/debitos";

export function ParcelamentoAtivoBanner() {
  const parc = PARCELAMENTO_ATIVO_MOCK;
  return (
    <div
      role="region"
      aria-label="Parcelamento ativo"
      className="mt-4 px-4 md:px-[18px] py-3 bg-white border border-kr-violet/30 border-l-4 border-l-kr-violet rounded-[10px] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <span className="text-kr-violet flex-shrink-0 mt-0.5">
          <IconInfo size={18} />
        </span>
        <div>
          <div className="font-display font-bold text-[13px] text-kr-deep">
            Parcelamento ativo · {parc.numero}
          </div>
          <div className="font-sans font-normal text-[12px] text-kr-deep-78 mt-0.5">
            {parc.parcelasRestantes} de {parc.totalParcelas} parcelas restantes
            · próxima de {parc.valorMensal} em {parc.proximoVenc}
          </div>
        </div>
      </div>
      <a
        href="#acordo-ativo"
        className="kr-link-focus self-start sm:self-auto font-sans font-semibold text-[13px] text-kr-violet underline underline-offset-[3px] py-2 px-1 flex-shrink-0"
      >
        Ver acordo →
      </a>
    </div>
  );
}
