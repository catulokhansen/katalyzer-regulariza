"use client";

import Link from "next/link";
import { KatalyzerLogo } from "./logo";
import { Stepper } from "./stepper";

interface PageHeaderProps {
  current: number;
}

export function PageHeader({ current }: PageHeaderProps) {
  return (
    <header className="relative z-10 h-20 md:h-24 px-5 md:px-12 lg:px-20 flex items-center justify-between border-b border-kr-deep-12 bg-kr-cream">
      <Link
        href="/"
        aria-label="Katalyzer Regulariza — página inicial"
        className="kr-link-focus flex items-center gap-3 md:gap-3.5 -ml-1 px-1.5 py-1 rounded-md no-underline"
      >
        <KatalyzerLogo size={36} decorative className="md:w-11 md:h-[39px]" />
        <div className="flex flex-col leading-[1.05]">
          <span className="font-display font-bold text-[15px] md:text-base tracking-[-0.2px] text-kr-deep">
            Katalyzer{" "}
            <span className="font-normal text-kr-violet">Regulariza</span>
          </span>
          <span className="font-sans font-normal text-[11px] md:text-[11.5px] tracking-[.05em] text-kr-deep-62 mt-0.5 hidden sm:block">
            Portal do Contribuinte
          </span>
        </div>
      </Link>

      <Stepper current={current} />
    </header>
  );
}
