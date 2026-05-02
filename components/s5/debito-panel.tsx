"use client";

const FIELD_CLASS =
  "w-full h-11 px-3.5 rounded-lg bg-white border border-kr-deep/[0.20] text-kr-deep font-sans text-[14px] outline-none focus-visible:outline-2 focus-visible:outline-kr-cyan";

export function DebitoPanel({ parcelas }: { parcelas: number }) {
  return (
    <div className="max-w-[540px]">
      <div className="font-display font-semibold text-[11px] tracking-[.18em] uppercase text-kr-deep-78">
        Débito automático
      </div>
      <div className="font-display font-bold text-[22px] md:text-[24px] tracking-[-0.4px] text-kr-deep mt-1.5">
        Cobrança automática em todas as {parcelas} parcelas
      </div>
      <p className="font-sans text-[13px] leading-relaxed text-kr-deep-78 mt-2">
        Autorize o débito direto na sua conta bancária. Você pode cancelar a
        qualquer momento; parcelas em atraso retornam para a modalidade de
        boleto.
      </p>

      <form className="mt-5 grid gap-3.5" onSubmit={(e) => e.preventDefault()}>
        <Field label="Banco">
          <select className={FIELD_CLASS}>
            <option>001 — Banco do Brasil</option>
            <option>237 — Bradesco</option>
            <option>104 — Caixa Econômica Federal</option>
            <option>341 — Itaú</option>
            <option>033 — Santander</option>
          </select>
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-3">
          <Field label="Agência">
            <input className={FIELD_CLASS} placeholder="0000" inputMode="numeric" />
          </Field>
          <Field label="Conta com dígito">
            <input className={FIELD_CLASS} placeholder="00000-0" inputMode="numeric" />
          </Field>
        </div>

        <Field label="Dia preferencial de cobrança">
          <select className={FIELD_CLASS} defaultValue="15">
            <option value="5">Dia 5</option>
            <option value="10">Dia 10</option>
            <option value="15">Dia 15</option>
            <option value="20">Dia 20</option>
            <option value="25">Dia 25</option>
          </select>
        </Field>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block font-display font-semibold text-[11px] tracking-[.18em] uppercase text-kr-deep-78 mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
