"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconArrowRight,
  IconShieldCheck,
  IconSpinner,
  IconWarningCircle,
} from "@/components/kr/icons";
import { maskDoc } from "@/lib/formatters";
import { docDigits, validateDoc } from "@/lib/validators";
import { useRegularizaStore } from "@/lib/store";

export function ConsultaForm() {
  const router = useRouter();
  const setDoc = useRegularizaStore((s) => s.setDoc);
  const reset = useRegularizaStore((s) => s.reset);

  const [val, setVal] = useState("");
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  const digits = docDigits(val);
  const has = digits.length > 0;
  const complete = digits.length === 11 || digits.length === 14;
  const isValid = complete && validateDoc(val);
  const showError = touched && has && (!complete || !isValid);

  const errorMsg = !complete
    ? "Documento incompleto. Use 11 dígitos para CPF ou 14 para CNPJ."
    : "Documento inválido. Verifique os números digitados.";

  const borderClass = showError
    ? "border-kr-error"
    : focused || has
      ? "border-kr-deep"
      : "border-kr-deep-55";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) {
      inputRef.current?.focus();
      return;
    }
    setLoading(true);
    // mock: em produção dispara consulta de débitos
    timeoutRef.current = setTimeout(() => {
      reset();
      setDoc(val);
      router.push("/debitos");
    }, 1200);
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      aria-label="Consultar situação fiscal"
      className="flex flex-col"
    >
      <label
        htmlFor="kr-doc"
        className="font-display font-semibold text-[13px] text-kr-deep mb-2.5 tracking-[-0.1px]"
      >
        CPF ou CNPJ do contribuinte
      </label>

      <input
        ref={inputRef}
        id="kr-doc"
        name="documento"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        required
        aria-required="true"
        aria-invalid={showError ? "true" : "false"}
        aria-describedby="kr-doc-hint kr-doc-error"
        value={val}
        onChange={(e) => setVal(maskDoc(e.target.value))}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          setTouched(true);
        }}
        placeholder="000.000.000-00 ou 00.000.000/0001-00"
        className={`w-full h-[54px] px-4 box-border rounded-[10px] bg-kr-paper border-[1.5px] ${borderClass} text-kr-deep outline-none font-sans font-medium text-[15px] tracking-[.3px] transition-[border-color,background,box-shadow] duration-150 focus-visible:shadow-[0_0_0_4px_rgba(0,224,255,0.30)]`}
      />

      {showError ? (
        <div
          id="kr-doc-error"
          role="alert"
          aria-live="assertive"
          className="mt-2.5 flex gap-2 items-start text-kr-error"
        >
          <span className="mt-0.5 flex-shrink-0">
            <IconWarningCircle size={14} />
          </span>
          <span className="font-sans font-medium text-[12.5px] leading-relaxed">
            {errorMsg}
          </span>
        </div>
      ) : (
        <div
          id="kr-doc-hint"
          className="mt-2.5 font-sans font-normal text-[12px] text-kr-deep-78 leading-normal"
        >
          Aceita CPF (11 dígitos) ou CNPJ (14 dígitos).
        </div>
      )}

      <div className="h-[18px]" />

      <button
        type="submit"
        disabled={loading}
        aria-busy={loading ? "true" : "false"}
        className="kr-focus-ring h-14 rounded-[10px] border-none bg-kr-deep text-white font-display font-semibold text-[15px] flex items-center justify-center gap-3 shadow-[0_8px_24px_rgba(10,42,95,0.25)] tracking-[.2px] transition-all duration-150 hover:bg-kr-violet hover:-translate-y-px disabled:cursor-wait disabled:opacity-95 disabled:hover:bg-kr-deep disabled:hover:translate-y-0"
      >
        {loading ? (
          <>
            <IconSpinner size={18} />
            <span>Consultando…</span>
          </>
        ) : (
          <>
            <span>Consultar minha situação</span>
            <IconArrowRight size={18} />
          </>
        )}
      </button>

      <div className="mt-3.5 text-center">
        <a
          href="#contador"
          className="kr-link-focus font-sans font-medium text-[12.5px] text-kr-deep underline underline-offset-[3px] py-1.5 px-2 inline-block hover:text-kr-violet"
        >
          Sou contador — buscar por cliente
        </a>
      </div>

      <div className="mt-4 pt-4 border-t border-kr-deep-08 flex gap-3 items-start">
        <span
          className="text-kr-violet mt-0.5 flex-shrink-0"
          aria-hidden="true"
        >
          <IconShieldCheck size={15} />
        </span>
        <span className="font-sans font-normal text-[12px] text-kr-deep-62 leading-relaxed">
          Consulta gratuita. Seus dados são protegidos e não são compartilhados
          com terceiros.{" "}
          <a
            href="#privacidade"
            className="kr-link-focus text-kr-deep font-semibold text-[12.5px] underline underline-offset-[2px] py-1 px-0.5 inline-block leading-tight"
          >
            Política de privacidade
          </a>
          .
        </span>
      </div>
    </form>
  );
}
