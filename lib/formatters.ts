const brl = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const percent = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

export function fmtBRL(n: number): string {
  return brl.format(n);
}

export function fmtPercent(n: number): string {
  return percent.format(n * 100) + "%";
}

export function maskDoc(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 14);
  if (d.length <= 11) {
    return d
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return d
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{4})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

export function maskDocPartial(doc: string): string {
  const d = doc.replace(/\D/g, "");
  if (d.length === 11) {
    return `CPF ${d.slice(0, 3)}.***.***-${d.slice(9)}`;
  }
  if (d.length === 14) {
    return `CNPJ ${d.slice(0, 2)}.${d.slice(2, 5)}.***/****-${d.slice(12)}`;
  }
  return doc;
}

export function maskContato(canal: "email" | "sms" | null, contato: string): string {
  if (!canal) return "";
  const v = contato.trim();
  if (!v) return "";

  if (canal === "email") {
    const at = v.indexOf("@");
    if (at < 1) return v;
    const local = v.slice(0, at);
    const domain = v.slice(at);
    const head = local.slice(0, Math.min(2, local.length));
    return `${head}***${domain}`;
  }

  let digits = v.replace(/\D/g, "");
  if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) {
    digits = digits.slice(2);
  }
  if (digits.length < 10) return v;
  const ddd = digits.slice(0, 2);
  const last2 = digits.slice(-2);
  if (digits.length === 11) {
    return `(${ddd}) 9****-**${last2}`;
  }
  return `(${ddd}) ****-**${last2}`;
}
