"use client";

import { useRouter } from "next/navigation";

const STEPS = [
  { label: "Identificação", path: "/" },
  { label: "Débitos", path: "/debitos" },
  { label: "Parcelamento", path: "/parcelamento" },
  { label: "Revisão e aceite", path: "/revisao" },
  { label: "Pagamento", path: "/pagamento" },
] as const;

const SR_ONLY =
  "absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0 [clip:rect(0_0_0_0)]";

interface StepperProps {
  current: number;
  /** Quando true, etapas anteriores ficam clicáveis. Default: true. */
  navigable?: boolean;
}

export function Stepper({ current, navigable = true }: StepperProps) {
  const router = useRouter();

  return (
    <nav
      aria-label="Progresso da negociação"
      className="flex items-center gap-3.5"
    >
      <span className="font-display font-semibold text-[11px] tracking-[.18em] uppercase text-kr-deep-78 hidden sm:inline">
        Etapa {current + 1} de {STEPS.length}
      </span>
      <span className="font-display font-semibold text-[11px] tracking-[.18em] uppercase text-kr-deep-78 sm:hidden">
        {current + 1}/{STEPS.length}
      </span>
      <ol className="list-none m-0 p-0 flex items-center gap-2">
        {STEPS.map((step, i) => {
          const isCurrent = i === current;
          const isPast = i < current;
          const dashWidth = isCurrent ? 22 : 8;
          const dashClass = `block h-1 rounded transition-all duration-200 ${
            i <= current ? "bg-kr-deep" : "bg-kr-deep-18"
          }`;
          const dash = (
            <span
              aria-hidden="true"
              className={dashClass}
              style={{ width: dashWidth }}
            />
          );
          const label = isCurrent ? (
            <span className="font-sans font-medium text-xs text-kr-deep hidden md:inline">
              {step.label}
            </span>
          ) : (
            <span className={SR_ONLY}>{step.label}</span>
          );

          if (isPast && navigable) {
            return (
              <li
                key={step.label}
                className="flex items-center gap-2"
              >
                <a
                  href={step.path}
                  className="kr-link-focus flex items-center gap-2 px-1 py-1 rounded-[4px] no-underline cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(step.path);
                  }}
                  aria-label={`Voltar para etapa ${i + 1}: ${step.label}`}
                >
                  {dash}
                  <span className={SR_ONLY}>{step.label}</span>
                </a>
              </li>
            );
          }

          return (
            <li
              key={step.label}
              aria-current={isCurrent ? "step" : undefined}
              className="flex items-center gap-2"
            >
              {dash}
              {label}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
