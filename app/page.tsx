import Link from "next/link";
import { ConsultaForm } from "@/components/s1/consulta-form";
import {
  IconFileText,
  IconLightning,
  IconLock,
  IconQuestion,
} from "@/components/kr/icons";
import { CropMarks } from "@/components/kr/crop-marks";
import { PaperGrain } from "@/components/kr/paper-grain";
import { PageHeader } from "@/components/kr/page-header";
import { SkipLink } from "@/components/kr/skip-link";

const TRUST_ITEMS = [
  {
    icon: IconLock,
    title: "100% seguro",
    desc: "Dados criptografados",
  },
  {
    icon: IconLightning,
    title: "Aprovação imediata",
    desc: "Acordo online, sem fila",
  },
  {
    icon: IconFileText,
    title: "Contrato digital",
    desc: "Receba por e-mail",
  },
] as const;

export default function S1Identificacao() {
  return (
    <div className="relative min-h-screen flex flex-col bg-kr-cream font-sans">
      <SkipLink />
      <PaperGrain />
      <CropMarks />

      <PageHeader current={0} />

      <main
        id="kr-main"
        className="relative z-10 flex-1 flex flex-col px-5 py-10 md:px-12 md:py-16 lg:px-20 lg:py-20"
      >
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-50 lg:items-center lg:justify-center flex-1">
          {/* HERO */}
          <section
            aria-labelledby="kr-hero-title"
            className="flex flex-col lg:max-w-[720px]"
          >
            <h1
              id="kr-hero-title"
              className="font-display font-bold leading-none text-kr-deep m-0 text-[44px] tracking-[-1.2px] sm:text-[56px] sm:tracking-[-1.6px] md:text-[64px] md:tracking-[-1.8px] lg:text-[76px] lg:tracking-[-2.2px]"
            >
              <span className="block">Quite ou parcele</span>
              <span className="block">sua dívida ativa </span>
              <span className="inline-block italic font-semibold text-kr-violet border-b-4 border-kr-cyan pb-1 mt-0.5">
                sem burocracia.
              </span>
            </h1>

            <p className="font-sans font-normal text-[15px] md:text-[17px] text-kr-deep-78 leading-[1.7] mt-7 md:mt-9 max-w-[520px]">
              Consulte sua situação fiscal, simule parcelamentos e feche o
              acordo em menos de{" "}
              <span className="text-kr-deep font-semibold">5 minutos</span> —
              tudo sem sair do lugar.
            </p>
          </section>

          {/* FORM CARD */}
          <section
            aria-labelledby="kr-form-title"
            className="flex items-center lg:w-[460px] lg:flex-shrink-0"
          >
            <div className="w-full rounded-[14px] bg-white border border-kr-deep-12 shadow-[0_24px_48px_rgba(10,42,95,0.08),0_2px_6px_rgba(10,42,95,0.04)] overflow-hidden">
              <div className="px-6 md:px-7 py-5 md:py-6 border-b border-kr-deep-08 bg-kr-paper">
                <h2
                  id="kr-form-title"
                  className="font-display font-bold text-xl text-kr-deep tracking-[-0.3px] mb-1"
                >
                  Consultar minha situação
                </h2>
                <p className="font-sans font-normal text-[12.5px] text-kr-deep-62 leading-normal">
                  Informe seu CPF ou CNPJ para ver seus débitos e opções de
                  negociação.
                </p>
              </div>
              <div className="px-6 md:px-7 py-6 md:py-7 bg-white">
                <ConsultaForm />
              </div>
            </div>
          </section>
        </div>

        {/* TRUST + SUPPORT ROW */}
        <footer className="mt-10 md:mt-14 flex flex-col gap-6 lg:flex-row lg:gap-12 lg:items-start lg:justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 border-y border-kr-deep-18 lg:w-[720px] lg:flex-shrink-0">
            {TRUST_ITEMS.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className={`px-5 py-4 flex gap-3 items-start ${
                  i < 2 ? "md:border-r border-kr-deep-08" : ""
                } ${i > 0 ? "md:border-t-0 border-t border-kr-deep-08" : ""}`}
              >
                <span
                  className="text-kr-violet mt-0.5 flex-shrink-0"
                  aria-hidden="true"
                >
                  <Icon size={17} />
                </span>
                <div>
                  <div className="font-sans font-semibold text-[13px] text-kr-deep">
                    {title}
                  </div>
                  <div className="font-sans font-normal text-[12px] text-kr-deep-62 mt-0.5">
                    {desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2.5 pt-4 lg:w-[460px] lg:flex-shrink-0">
            <span className="text-kr-deep">
              <IconQuestion size={16} />
            </span>
            <Link
              href="#suporte"
              className="kr-link-focus font-sans font-medium text-[12.5px] text-kr-deep underline underline-offset-[3px] py-1"
            >
              Precisa de ajuda? Fale com o atendimento
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
