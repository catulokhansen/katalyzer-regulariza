"use client";

import { useRouter } from "next/navigation";
import { IconArrowLeft, IconArrowRight } from "@/components/kr/icons";
import { fmtBRL } from "@/lib/formatters";
import {
  getQtdSelecionada,
  getTotalSelecionado,
  useRegularizaStore,
} from "@/lib/store";

export function FooterFixoS2() {
  const router = useRouter();
  const selectedDebitos = useRegularizaStore((s) => s.selectedDebitos);
  const total = getTotalSelecionado(selectedDebitos);
  const qtd = getQtdSelecionada(selectedDebitos);

  return (
    <footer className="sticky bottom-0 z-20 left-0 right-0 min-h-[88px] md:h-[100px] py-4 md:py-0 bg-white border-t border-kr-deep-12 px-5 md:px-12 lg:px-20 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shadow-[0_-8px_24px_rgba(10,42,95,0.04)]">
      <button
        type="button"
        onClick={() => router.push("/")}
        className="kr-link-focus inline-flex items-center justify-center gap-2 font-display font-semibold text-[14px] text-kr-deep no-underline cursor-pointer px-4 py-2.5 rounded-lg border border-kr-deep-18 bg-transparent self-start sm:self-auto"
      >
        <IconArrowLeft size={16} /> Voltar
      </button>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-7">
        <div className="text-right sm:text-right">
          <div
            className="font-display font-semibold text-[11px] tracking-[.18em] uppercase text-kr-deep-78"
            aria-live="polite"
            aria-atomic="true"
          >
            {qtd === 0
              ? "Selecione os débitos a regularizar"
              : `${qtd} débito${qtd !== 1 ? "s" : ""} selecionado${qtd !== 1 ? "s" : ""}`}
          </div>
          <div className="font-display font-bold text-[22px] md:text-[26px] text-kr-deep tracking-[-0.6px] kr-tabular mt-0.5">
            R$ {fmtBRL(total)}
          </div>
        </div>
        <button
          type="button"
          disabled={qtd === 0}
          onClick={() => router.push("/parcelamento")}
          className="kr-focus-ring h-14 px-6 rounded-[10px] border-none text-white font-display font-semibold text-[15px] inline-flex items-center justify-center gap-3 tracking-[.2px] transition-all duration-150 bg-kr-deep shadow-[0_8px_24px_rgba(10,42,95,0.25)] hover:bg-kr-violet hover:-translate-y-px disabled:bg-kr-deep-36 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:bg-kr-deep-36 disabled:hover:translate-y-0"
        >
          <span className="hidden sm:inline">Continuar para parcelamento</span>
          <span className="sm:hidden">Continuar</span>
          <IconArrowRight size={18} />
        </button>
      </div>
    </footer>
  );
}
