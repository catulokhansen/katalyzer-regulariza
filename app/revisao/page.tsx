"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { PageHeader } from "@/components/kr/page-header";
import { CropMarks } from "@/components/kr/crop-marks";
import { PaperGrain } from "@/components/kr/paper-grain";
import { SkipLink } from "@/components/kr/skip-link";
import { RouteGuard } from "@/components/kr/route-guard";
import { BlocoRevisao } from "@/components/s4/bloco-revisao";
import { IconArrowLeft, IconArrowRight, IconLock } from "@/components/kr/icons";
import { fmtBRL, maskDocPartial } from "@/lib/formatters";
import { CONTRIBUINTE_MOCK } from "@/lib/debitos";
import { TRIBUTO_META, ORDEM_TRIBUTOS } from "@/lib/tributos";
import { getDebitosSelecionados, useRegularizaStore } from "@/lib/store";
import {
  calcParcela,
  calcJurosEstimados,
  calcTotalEstimado,
} from "@/lib/parcelas";

const TERMOS_LISTA = [
  "Reconheço a dívida descrita acima e confesso o débito perante a Fazenda Municipal.",
  "O acordo só se torna ativo após o pagamento da 1ª parcela. Se eu não pagar até o vencimento, o acordo é cancelado e os débitos retornam ao status anterior.",
  "Atrasos superiores a 90 dias em qualquer parcela podem implicar rescisão e inscrição em dívida ativa.",
  "Autorizo o envio do termo de confissão de dívida e dos boletos para o e-mail e WhatsApp cadastrados.",
];

type CanalEnvio = "email" | "sms" | null;

function isContatoValido(canal: CanalEnvio, contato: string) {
  if (!canal) return false;
  const v = contato.trim();
  if (canal === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  let digits = v.replace(/\D/g, "");
  // Aceita prefixo do país (+55) sem alterar a regra de 10–11 dígitos
  if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) {
    digits = digits.slice(2);
  }
  return digits.length >= 10 && digits.length <= 11;
}

function S4Content() {
  const router = useRouter();
  const doc = useRegularizaStore((s) => s.doc);
  const selectedDebitos = useRegularizaStore((s) => s.selectedDebitos);
  const parcelas = useRegularizaStore((s) => s.parcelas);
  const confirmarAcordo = useRegularizaStore((s) => s.confirmarAcordo);

  const [aceitou, setAceitou] = useState(false);
  const [showTermos, setShowTermos] = useState(false);
  const [canal, setCanal] = useState<CanalEnvio>(null);
  const [contato, setContato] = useState("");

  const podeConfirmar = aceitou && isContatoValido(canal, contato);

  const debitos = getDebitosSelecionados(selectedDebitos);
  const subTotal = debitos.reduce((s, d) => s + d.valor, 0);
  const valorParcela = calcParcela(subTotal, parcelas);
  const jurosTotal = calcJurosEstimados(subTotal, parcelas);
  const valorTotal = calcTotalEstimado(subTotal, parcelas);

  // Próximo vencimento: hoje + 30 dias
  const proxVencDate = new Date();
  proxVencDate.setDate(proxVencDate.getDate() + 30);
  const proxVencto = proxVencDate.toLocaleDateString("pt-BR");

  // Lista compacta de débitos agrupados por tributo
  const grupos = ORDEM_TRIBUTOS.map((tipo) => ({
    tipo,
    items: debitos.filter((d) => d.tipo === tipo),
  })).filter((g) => g.items.length > 0);

  const handleConfirmar = () => {
    if (!podeConfirmar) return;
    confirmarAcordo();
    router.push("/pagamento");
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-kr-cream font-sans">
      <SkipLink />
      <PaperGrain />
      <CropMarks />

      <PageHeader current={3} />

      <main
        id="kr-main"
        className="relative z-10 flex-1 px-32"
      >
        {/* Section header */}
        <section className="pt-8 pb-5 border-b border-kr-deep/10">
          <div className="font-display font-semibold text-[11px] tracking-[.18em] uppercase text-kr-deep-78 mb-1.5">
            Etapa 04 · Revisão e aceite
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
            <h1 className="font-display font-bold text-[28px] md:text-[32px] lg:text-[38px] leading-[1.1] text-kr-deep tracking-[-1.0px] m-0">
              Confira e formalize seu acordo
            </h1>
            <div className="font-sans text-[13px] text-kr-deep-78">
              {parcelas}× de{" "}
              <span className="font-display font-bold text-kr-deep">
                R$ {fmtBRL(valorParcela)}
              </span>{" "}
              · Total R$ {fmtBRL(valorTotal)}
            </div>
          </div>
        </section>

        {/* Grid: revisão + sidebar */}
        <section className="mt-7 grid gap-6 lg:grid-cols-[1fr_380px] lg:gap-6 pb-10">
          <div className="flex flex-col gap-5">
            <BlocoRevisao eyebrow="Contribuinte" editPath="/">
              <div className="font-display font-bold text-[18px] tracking-[-0.2px] text-kr-deep">
                {CONTRIBUINTE_MOCK.nome}
              </div>
              <div className="mt-1 flex flex-wrap gap-3 sm:gap-4 font-sans text-[12.5px] text-kr-deep-78 kr-tabular">
                <span>{doc ? maskDocPartial(doc) : CONTRIBUINTE_MOCK.doc}</span>
                <span className="text-kr-deep/30">·</span>
                <span>CCM 1.234.567-8</span>
              </div>
            </BlocoRevisao>

            <BlocoRevisao
              eyebrow="Débitos incluídos no acordo"
              editPath="/debitos"
            >
              <ul className="list-none p-0 m-0">
                {grupos.map((g, i) => {
                  const subtotalG = g.items.reduce((s, d) => s + d.valor, 0);
                  const labelExercicio =
                    g.items.length === 1
                      ? `Exercício ${g.items[0].exercicio}`
                      : `${g.items.length} débito${g.items.length !== 1 ? "s" : ""}`;
                  return (
                    <li
                      key={g.tipo}
                      className={`grid grid-cols-[1fr_auto] gap-3 py-3 ${
                        i === grupos.length - 1
                          ? ""
                          : "border-b border-kr-deep/[0.08]"
                      }`}
                    >
                      <div>
                        <div className="font-display font-bold text-[14px] text-kr-deep">
                          {TRIBUTO_META[g.tipo].nome}
                        </div>
                        <div className="font-sans text-[12px] text-kr-deep-62 mt-0.5">
                          {labelExercicio}
                        </div>
                      </div>
                      <div className="font-display font-bold text-[14px] text-kr-deep kr-tabular self-center">
                        R$ {fmtBRL(subtotalG)}
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-3 pt-3 border-t border-dashed border-kr-deep/[0.18] flex items-center justify-between">
                <span className="font-sans text-[12.5px] text-kr-deep-78">
                  Subtotal dos débitos consolidados
                </span>
                <span className="font-display font-bold text-[16px] text-kr-deep kr-tabular">
                  R$ {fmtBRL(subTotal)}
                </span>
              </div>
            </BlocoRevisao>

            <BlocoRevisao eyebrow="Parcelamento" editPath="/parcelamento">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Stat label="Parcelas" value={`${parcelas}×`} />
                <Stat
                  label="Valor por parcela"
                  value={`R$ ${fmtBRL(valorParcela)}`}
                />
                <Stat label="1º vencimento" value={proxVencto} />
              </div>
            </BlocoRevisao>

            {/* Cláusulas + aceite */}
            <section className="bg-white border border-kr-deep/[0.14] rounded-xl px-6 py-6 md:px-7 md:py-6">
              <div className="font-display font-semibold text-[11px] tracking-[.18em] uppercase text-kr-deep-78">
                Termos do acordo
              </div>

              <ul className="mt-3.5 p-0 list-none flex flex-col gap-2.5">
                {TERMOS_LISTA.map((t, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-[20px_1fr] gap-2.5 font-sans text-[13px] leading-snug text-kr-deep/[0.85]"
                  >
                    <span
                      aria-hidden="true"
                      className="w-4 h-4 rounded-full bg-kr-deep/[0.08] text-kr-deep flex items-center justify-center font-display font-bold text-[10px] mt-[3px]"
                    >
                      {i + 1}
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => setShowTermos(true)}
                className="kr-link-focus mt-3.5 font-sans font-semibold text-[12.5px] text-kr-deep underline underline-offset-[3px] bg-transparent border-0 cursor-pointer p-0"
              >
                Ler termo completo de confissão de dívida →
              </button>

              {/* Checkbox de aceite */}
              <label
                className={`mt-5 grid grid-cols-[24px_1fr] gap-3 p-4 rounded-lg cursor-pointer transition-all duration-200 border ${
                  aceitou
                    ? "bg-kr-violet/[0.06] border-kr-violet/30"
                    : "bg-kr-deep/[0.04] border-kr-deep/[0.14]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={aceitou}
                  onChange={(e) => setAceitou(e.target.checked)}
                  className="w-5 h-5 mt-0.5 cursor-pointer accent-kr-violet"
                />
                <span className="font-sans text-[13.5px] leading-snug text-kr-deep">
                  <strong className="font-display font-bold">
                    Li e concordo
                  </strong>{" "}
                  com os termos acima e com o termo completo de confissão de
                  dívida. Estou ciente de que o acordo será formalizado nesta
                  etapa, mas{" "}
                  <strong>só passa a ter efeito após o pagamento da 1ª parcela</strong>.
                </span>
              </label>

              {/* Canal de envio do termo */}
              <div className="mt-5">
                <div className="font-display font-semibold text-[11px] tracking-[.18em] uppercase text-kr-deep-78 mb-2.5">
                  Como você quer receber o termo?
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (canal === "email") return;
                      setCanal("email");
                      setContato("");
                    }}
                    aria-pressed={canal === "email"}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 text-left ${
                      canal === "email"
                        ? "bg-kr-violet/[0.06] border-kr-violet/30"
                        : "bg-kr-deep/[0.04] border-kr-deep/[0.14]"
                    }`}
                  >
                    <div className="font-display font-semibold text-[14px] text-kr-deep">
                      E-mail
                    </div>
                    <div className="font-sans text-[12px] text-kr-deep-62 mt-0.5">
                      Receber por e-mail
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (canal === "sms") return;
                      setCanal("sms");
                      setContato("");
                    }}
                    aria-pressed={canal === "sms"}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 text-left ${
                      canal === "sms"
                        ? "bg-kr-violet/[0.06] border-kr-violet/30"
                        : "bg-kr-deep/[0.04] border-kr-deep/[0.14]"
                    }`}
                  >
                    <div className="font-display font-semibold text-[14px] text-kr-deep">
                      SMS
                    </div>
                    <div className="font-sans text-[12px] text-kr-deep-62 mt-0.5">
                      Receber por mensagem de texto
                    </div>
                  </button>
                </div>

                {canal !== null && (() => {
                  const mostrarErro =
                    contato.trim().length > 0 &&
                    !isContatoValido(canal, contato);
                  return (
                    <div className="mt-3">
                      <input
                        className="w-full h-11 px-3.5 rounded-lg bg-white border border-kr-deep/[0.20] text-kr-deep font-sans text-[14px] outline-none focus-visible:outline-2 focus-visible:outline-kr-cyan"
                        type={canal === "email" ? "email" : "tel"}
                        inputMode={canal === "email" ? "email" : "numeric"}
                        placeholder={
                          canal === "email"
                            ? "voce@exemplo.com"
                            : "(11) 91234-5678"
                        }
                        value={contato}
                        onChange={(e) => setContato(e.target.value)}
                        aria-invalid={mostrarErro}
                        aria-describedby={mostrarErro ? "kr-contato-hint" : undefined}
                      />
                      {mostrarErro && (
                        <p
                          id="kr-contato-hint"
                          className="mt-1.5 font-sans text-[12px] text-kr-error"
                        >
                          {canal === "email"
                            ? "Informe um e-mail válido."
                            : "Informe um telefone com DDD (10 ou 11 dígitos)."}
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>
            </section>
          </div>

          {/* Sidebar de totais */}
          <aside
            aria-label="Totais do acordo"
            className="bg-white border border-kr-deep/[0.14] border-l-4 border-l-kr-violet rounded-xl px-6 py-6 md:px-7 md:py-6 self-start lg:sticky lg:top-8"
          >
            <div className="font-display font-semibold text-[11px] tracking-[.18em] uppercase text-kr-deep-78">
              Total a pagar
            </div>
            <div className="font-display font-bold text-[32px] md:text-[36px] tracking-[-1px] text-kr-deep mt-1 kr-tabular">
              R$ {fmtBRL(valorTotal)}
            </div>
            <div className="font-sans text-[12.5px] text-kr-deep-78 mt-1">
              em {parcelas}× de R$ {fmtBRL(valorParcela)}
            </div>

            <div className="mt-5 pt-5 border-t border-kr-deep/10 flex flex-col gap-3">
              <Row label="Subtotal débitos" value={`R$ ${fmtBRL(subTotal)}`} />
              {jurosTotal > 0 && (
                <Row
                  label="Acréscimo do parcelamento"
                  value={`R$ ${fmtBRL(jurosTotal)}`}
                  muted
                />
              )}
              <Row label="1ª parcela vence" value={proxVencto} muted />
            </div>

            <div className="mt-5 p-3.5 rounded-lg bg-kr-deep/[0.04] flex gap-2.5 items-start">
              <span aria-hidden="true" className="text-kr-deep mt-px">
                <IconLock size={14} />
              </span>
              <span className="font-sans text-[11.5px] leading-snug text-kr-deep/[0.85]">
                Ao confirmar, você gera o termo de confissão e segue para o
                pagamento da 1ª parcela.
              </span>
            </div>
          </aside>
        </section>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 z-20 left-0 right-0 h-[100px] bg-white border-t border-kr-deep/[0.14] px-32 flex items-center justify-between gap-4 sm:gap-6 shadow-[0_-8px_24px_rgba(10,42,95,0.04)]">
        <button
          type="button"
          onClick={() => router.push("/parcelamento")}
          className="kr-link-focus inline-flex items-center justify-center gap-2 font-display font-semibold text-[14px] text-kr-deep cursor-pointer pl-3 pr-4 py-2.5 rounded-lg border border-kr-deep/[0.20] bg-transparent"
        >
          <IconArrowLeft size={16} />
          <span className="hidden sm:inline">Voltar ao parcelamento</span>
          <span className="sm:hidden">Voltar</span>
        </button>

        <div className="flex items-center gap-4 sm:gap-5">
          {!podeConfirmar && (
            <div
              role="status"
              className="font-sans text-[12px] text-kr-deep-62 hidden sm:block"
            >
              Marque o aceite e informe o canal de envio
            </div>
          )}
          <button
            type="button"
            onClick={handleConfirmar}
            disabled={!podeConfirmar}
            aria-disabled={!podeConfirmar}
            className="kr-focus-ring h-14 px-6 rounded-[10px] border-0 text-white font-display font-semibold text-[15px] inline-flex items-center gap-3 tracking-[.2px] transition-all duration-200 bg-kr-deep shadow-[0_8px_24px_rgba(10,42,95,0.25)] hover:bg-kr-violet hover:-translate-y-px disabled:bg-kr-deep/20 disabled:cursor-not-allowed disabled:shadow-none disabled:text-white/[0.85] disabled:hover:bg-kr-deep/20 disabled:hover:translate-y-0"
          >
            Confirmar acordo
            <IconArrowRight size={18} />
          </button>
        </div>
      </footer>

      {/* Modal: termo completo */}
      <TermoCompletoModal open={showTermos} onOpenChange={setShowTermos} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display font-semibold text-[10.5px] tracking-[.18em] uppercase text-kr-deep-78">
        {label}
      </div>
      <div className="font-display font-bold text-[18px] tracking-[-0.2px] text-kr-deep mt-1 kr-tabular">
        {value}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span
        className={`font-sans text-[12.5px] ${
          muted ? "text-kr-deep-62" : "text-kr-deep/[0.85]"
        }`}
      >
        {label}
      </span>
      <span
        className={`font-display kr-tabular text-[13px] ${
          muted
            ? "font-medium text-kr-deep-78"
            : "font-bold text-kr-deep"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function TermoCompletoModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        aria-labelledby="kr-termo-completo-title"
        className="max-w-[760px] sm:max-w-[760px] w-full p-0 gap-0 bg-white border-0 ring-0 rounded-[14px] shadow-[0_24px_60px_rgba(10,42,95,0.30)] flex flex-col max-h-[80vh] overflow-hidden"
      >
        <div className="px-7 py-5 border-b border-kr-deep/10 flex items-center justify-between">
          <DialogPrimitive.Title
            id="kr-termo-completo-title"
            className="m-0 font-display font-bold text-[18px] text-kr-deep"
          >
            Termo de confissão de dívida
          </DialogPrimitive.Title>
          <DialogPrimitive.Close
            aria-label="Fechar"
            className="kr-link-focus w-9 h-9 rounded-lg border-0 bg-transparent text-kr-deep cursor-pointer flex items-center justify-center"
          >
            <span className="font-display font-bold text-[18px] leading-none">
              ×
            </span>
          </DialogPrimitive.Close>
        </div>
        <div className="px-7 py-5 overflow-y-auto flex-1 font-sans text-[13px] leading-relaxed text-kr-deep/[0.85]">
          <p>
            <strong>1. Das partes.</strong> O presente termo é firmado entre o(a)
            contribuinte e a Fazenda Pública Municipal.
          </p>
          <p>
            <strong>2. Da confissão.</strong> O(a) contribuinte reconhece e
            confessa, de forma irretratável e irrevogável, a totalidade dos
            débitos consolidados acima, bem como dos respectivos juros, multas
            e demais encargos legais.
          </p>
          <p>
            <strong>3. Da ativação do acordo.</strong> Este acordo de parcelamento{" "}
            <strong>somente passa a produzir efeitos após o pagamento da 1ª parcela</strong>.
            O não pagamento até a data de vencimento implica cancelamento
            automático e o retorno dos débitos ao status anterior.
          </p>
          <p>
            <strong>4. Da rescisão.</strong> Constitui causa de rescisão o atraso
            superior a 90 (noventa) dias em qualquer das parcelas, com inscrição
            em dívida ativa e cobrança dos valores remanescentes acrescidos dos
            encargos cabíveis.
          </p>
          <p>
            <strong>5. Da renúncia.</strong> O(a) contribuinte renuncia ao
            direito de discutir administrativa ou judicialmente os débitos ora
            confessados, ressalvada a hipótese de erro material comprovado.
          </p>
          <p>
            <strong>6. Do envio.</strong> Autoriza-se o envio deste termo, dos
            boletos e comprovantes para o e-mail e o número de WhatsApp
            cadastrados pelo(a) contribuinte.
          </p>
          <p className="mt-4 text-[11px] text-kr-deep-62">
            Este é um modelo de demonstração. O termo definitivo é gerado após
            a confirmação.
          </p>
        </div>
        <div className="px-7 py-4 border-t border-kr-deep/10 flex justify-end gap-2.5">
          <DialogPrimitive.Close className="kr-focus-ring h-11 px-5 rounded-lg border-0 bg-kr-deep text-white cursor-pointer font-display font-semibold text-[13px]">
            Fechar
          </DialogPrimitive.Close>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function S4Revisao() {
  return (
    <RouteGuard require={["doc", "selecionados", "parcelas"]}>
      <S4Content />
    </RouteGuard>
  );
}
