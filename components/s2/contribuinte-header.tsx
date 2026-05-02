"use client";

import { useRouter } from "next/navigation";
import { useRegularizaStore } from "@/lib/store";
import { CONTRIBUINTE_MOCK } from "@/lib/debitos";

export function ContribuinteHeader() {
  const router = useRouter();
  const reset = useRegularizaStore((s) => s.reset);

  const handleNotMe = () => {
    reset();
    router.push("/");
  };

  return (
    <section
      aria-labelledby="kr-cnt-title"
      className="pt-6 pb-4 border-b border-kr-deep-12"
    >
      <div className="font-display font-semibold text-[11px] tracking-[.18em] uppercase text-kr-deep-78 mb-1.5">
        Contribuinte identificado
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <h1
          id="kr-cnt-title"
          className="font-display font-bold text-2xl md:text-[28px] lg:text-[32px] leading-[1.1] text-kr-deep tracking-[-0.8px] m-0"
        >
          {CONTRIBUINTE_MOCK.nome}
          <span className="block sm:inline-block sm:ml-4 text-base md:text-lg font-medium text-kr-deep-78 tracking-normal kr-tabular mt-1 sm:mt-0">
            {CONTRIBUINTE_MOCK.doc}
          </span>
        </h1>
        <button
          type="button"
          onClick={handleNotMe}
          className="kr-link-focus self-start sm:self-auto font-sans font-medium text-[13px] text-kr-deep underline underline-offset-[3px] py-2 px-1 flex-shrink-0 cursor-pointer bg-transparent border-0"
        >
          Não sou eu — voltar
        </button>
      </div>
    </section>
  );
}
