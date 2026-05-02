"use client";

import { useRouter } from "next/navigation";

interface BlocoRevisaoProps {
  eyebrow: string;
  editPath?: string;
  children: React.ReactNode;
}

/**
 * Card padrão dos blocos de revisão na S4 (protótipo whitespace-s5.jsx).
 * - bg white, border 1px deep/14, rounded 12, padding 24 28
 * - Header: eyebrow Sora 600 11px tracking .18em uppercase + "Editar" link
 */
export function BlocoRevisao({
  eyebrow,
  editPath,
  children,
}: BlocoRevisaoProps) {
  const router = useRouter();
  return (
    <section className="bg-white border border-kr-deep/[0.14] rounded-xl px-6 py-6 md:px-7 md:py-6">
      <div className="flex items-center justify-between gap-4">
        <div className="font-display font-semibold text-[11px] tracking-[.18em] uppercase text-kr-deep-78">
          {eyebrow}
        </div>
        {editPath && (
          <button
            type="button"
            onClick={() => router.push(editPath)}
            className="kr-link-focus font-sans font-semibold text-[12px] text-kr-deep underline underline-offset-[3px] bg-transparent border-0 cursor-pointer"
          >
            Editar
          </button>
        )}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}
