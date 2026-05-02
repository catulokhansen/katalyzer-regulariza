"use client";

import { TributoIcon } from "./tributo-icon";
import { IconCaretDown, IconClock, IconGavel } from "@/components/kr/icons";
import { TRIBUTO_META, type TributoTipo } from "@/lib/tributos";
import type { Debito } from "@/lib/debitos";
import { fmtBRL } from "@/lib/formatters";
import { useRegularizaStore } from "@/lib/store";

interface GrupoTributoProps {
  tipo: TributoTipo;
  debitos: Debito[];
  expanded: boolean;
  onToggle: () => void;
}

export function GrupoTributo({
  tipo,
  debitos,
  expanded,
  onToggle,
}: GrupoTributoProps) {
  const meta = TRIBUTO_META[tipo];
  const negociaveis = debitos.filter((d) => d.status === "vencido");
  const judiciais = debitos.filter((d) => d.status === "ajuizado");
  const prescritos = debitos.filter((d) => d.status === "prescrito");
  const valorGrupo = debitos
    .filter((d) => d.status !== "prescrito")
    .reduce((s, d) => s + d.valor, 0);

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        aria-label={`${meta.nome} — ${debitos.length} débitos, total R$ ${fmtBRL(valorGrupo)}. ${expanded ? "Recolher" : "Expandir"}`}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        className={`px-4 md:px-5 py-3.5 grid grid-cols-[44px_1fr_auto] md:grid-cols-[44px_1fr_auto_auto_32px] items-center gap-3 md:gap-4 cursor-pointer transition-colors hover:bg-kr-paper kr-focus-ring ${
          expanded ? "bg-kr-paper border-b border-kr-deep-08" : "bg-white"
        }`}
      >
        <TributoIcon tipo={tipo} size={44} />

        <div className="min-w-0">
          <div className="font-display font-bold text-base md:text-lg text-kr-deep tracking-[-0.3px]">
            {meta.nome}
          </div>
          <div className="font-sans font-normal text-[12px] md:text-[12.5px] text-kr-deep-78 mt-0.5">
            {meta.desc}
          </div>
          <div className="md:hidden font-display font-bold text-lg text-kr-deep tracking-[-0.3px] mt-2 kr-tabular">
            R$ {fmtBRL(valorGrupo)}
          </div>
          <div className="md:hidden flex flex-wrap gap-3 mt-1 font-sans text-[12px] text-kr-deep-78">
            {negociaveis.length > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-kr-deep" />
                {negociaveis.length} pode negociar
              </span>
            )}
            {judiciais.length > 0 && (
              <span className="inline-flex items-center gap-1.5 text-kr-error">
                <span className="w-1.5 h-1.5 rounded-full bg-kr-error" />
                {judiciais.length} judicial
              </span>
            )}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2.5 font-sans text-[12.5px] text-kr-deep-78">
          {negociaveis.length > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-kr-deep" />
              {negociaveis.length} pode negociar
            </span>
          )}
          {judiciais.length > 0 && (
            <span className="inline-flex items-center gap-1.5 text-kr-error">
              <span className="w-1.5 h-1.5 rounded-full bg-kr-error" />
              {judiciais.length} judicial
            </span>
          )}
        </div>

        <div className="hidden md:block font-display font-bold text-[20px] md:text-[22px] text-kr-deep tracking-[-0.4px] text-right kr-tabular min-w-[180px]">
          R$ {fmtBRL(valorGrupo)}
        </div>

        <div
          className={`w-8 h-8 flex items-center justify-center text-kr-deep-78 transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        >
          <IconCaretDown size={16} />
        </div>
      </div>

      {expanded && (
        <GrupoExpandido
          negociaveis={negociaveis}
          judiciais={judiciais}
          prescritos={prescritos}
        />
      )}
    </div>
  );
}

function GrupoExpandido({
  negociaveis,
  judiciais,
  prescritos,
}: {
  negociaveis: Debito[];
  judiciais: Debito[];
  prescritos: Debito[];
}) {
  return (
    <div>
      {negociaveis.length > 0 && (
        <>
          <SubSecao bg="bg-kr-cream" textColor="text-kr-deep">
            Disponíveis para negociar diretamente · {negociaveis.length} débito
            {negociaveis.length > 1 ? "s" : ""}
          </SubSecao>
          {negociaveis.map((d) => (
            <DebitoLinha key={d.id} debito={d} />
          ))}
        </>
      )}

      {judiciais.length > 0 && (
        <>
          <SubSecao bg="bg-kr-error/5" textColor="text-kr-error">
            <span className="inline-flex items-center gap-1.5">
              <IconGavel size={12} /> Em processo judicial — atenção especial
            </span>
          </SubSecao>
          {judiciais.map((d) => (
            <DebitoLinhaJudicial key={d.id} debito={d} />
          ))}
        </>
      )}

      {prescritos.length > 0 && (
        <>
          <SubSecao bg="bg-kr-deep-08/40" textColor="text-kr-deep-62">
            <span className="inline-flex items-center gap-1.5">
              <IconClock size={12} /> Possivelmente prescritos · análise antes
              de pagar
            </span>
          </SubSecao>
          {prescritos.map((d) => (
            <DebitoLinhaPrescrito key={d.id} debito={d} />
          ))}
        </>
      )}
    </div>
  );
}

function SubSecao({
  bg,
  textColor,
  children,
}: {
  bg: string;
  textColor: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`px-4 md:px-5 py-2 ${bg} border-t border-kr-deep-08 font-display font-bold text-[11px] tracking-[.14em] uppercase ${textColor}`}
    >
      {children}
    </div>
  );
}

function DebitoLinha({ debito }: { debito: Debito }) {
  const selected = useRegularizaStore(
    (s) => !!s.selectedDebitos[debito.id],
  );
  const toggle = useRegularizaStore((s) => s.toggleDebito);

  return (
    <label
      htmlFor={`chk-${debito.id}`}
      className={`grid grid-cols-[24px_1fr_auto] md:grid-cols-[32px_1fr_auto] items-center gap-3 md:gap-4 px-4 md:px-5 md:pl-[78px] py-2.5 border-t border-kr-deep-08 cursor-pointer transition-colors ${
        selected ? "bg-kr-cyan/[0.06]" : "hover:bg-kr-paper"
      }`}
    >
      <input
        id={`chk-${debito.id}`}
        type="checkbox"
        checked={selected}
        onChange={() => toggle(debito.id)}
        className="w-[18px] h-[18px] cursor-pointer accent-kr-deep"
      />
      <div className="min-w-0">
        <div className="font-display font-semibold text-[14px] text-kr-deep">
          {debito.referenciaCurta} · Exercício {debito.exercicio}
        </div>
        <div className="font-sans font-normal text-[12px] text-kr-deep-78 mt-0.5 kr-tabular">
          CDA {debito.cda}
          {debito.subtitulo && debito.subtitulo !== debito.referenciaCurta
            ? ` · ${debito.subtitulo}`
            : ""}
        </div>
      </div>
      <div className="font-display font-bold text-[15px] md:text-base text-kr-deep text-right kr-tabular">
        R$ {fmtBRL(debito.valor)}
      </div>
    </label>
  );
}

function DebitoLinhaJudicial({ debito }: { debito: Debito }) {
  const selected = useRegularizaStore(
    (s) => !!s.selectedDebitos[debito.id],
  );
  const toggle = useRegularizaStore((s) => s.toggleDebito);

  return (
    <div className="grid grid-cols-[24px_1fr_auto] md:grid-cols-[32px_1fr_auto] items-center gap-3 md:gap-4 px-4 md:px-5 md:pl-[78px] py-2.5 border-t border-kr-deep-08 bg-kr-error/[0.03]">
      <input
        type="checkbox"
        checked={selected}
        onChange={() => toggle(debito.id)}
        aria-label={`Selecionar débito judicial ${debito.cda}`}
        className="w-[18px] h-[18px] cursor-pointer accent-kr-error"
      />
      <div className="min-w-0">
        <div className="font-display font-semibold text-[14px] text-kr-deep">
          {debito.referenciaCurta} · Exercício {debito.exercicio}
        </div>
        <div className="font-sans font-normal text-[12px] text-kr-error mt-1 kr-tabular">
          Processo {debito.processo} · custas e honorários podem ser acrescidos
        </div>
      </div>
      <div className="font-display font-bold text-[15px] md:text-base text-kr-deep text-right kr-tabular">
        R$ {fmtBRL(debito.valor)}
      </div>
    </div>
  );
}

function DebitoLinhaPrescrito({ debito }: { debito: Debito }) {
  return (
    <div className="grid grid-cols-[24px_1fr_auto] md:grid-cols-[32px_1fr_auto] items-center gap-3 md:gap-4 px-4 md:px-5 md:pl-[78px] py-2.5 border-t border-kr-deep-08 opacity-70">
      <div className="w-[18px] h-[18px]" />
      <div className="min-w-0">
        <div className="font-display font-semibold text-[14px] text-kr-deep-78">
          {debito.referenciaCurta} · Exercício {debito.exercicio}
        </div>
        <div className="font-sans font-normal text-[12px] text-kr-deep-62 mt-0.5">
          Mais de 5 anos · solicite análise de prescrição
        </div>
      </div>
      <div className="font-display font-semibold text-[14px] text-kr-deep-62 text-right kr-tabular">
        R$ {fmtBRL(debito.valor)}
      </div>
    </div>
  );
}
