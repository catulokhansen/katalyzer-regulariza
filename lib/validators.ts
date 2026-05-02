export function validateCPF(s: string): boolean {
  const c = s.replace(/\D/g, "");
  if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(c[i]) * (10 - i);
  let d1 = (sum * 10) % 11;
  if (d1 === 10) d1 = 0;
  if (d1 !== parseInt(c[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(c[i]) * (11 - i);
  let d2 = (sum * 10) % 11;
  if (d2 === 10) d2 = 0;
  return d2 === parseInt(c[10]);
}

export function validateCNPJ(s: string): boolean {
  const c = s.replace(/\D/g, "");
  if (c.length !== 14 || /^(\d)\1+$/.test(c)) return false;
  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let s1 = 0;
  for (let i = 0; i < 12; i++) s1 += parseInt(c[i]) * w1[i];
  let d1 = s1 % 11;
  d1 = d1 < 2 ? 0 : 11 - d1;
  if (d1 !== parseInt(c[12])) return false;
  let s2 = 0;
  for (let i = 0; i < 13; i++) s2 += parseInt(c[i]) * w2[i];
  let d2 = s2 % 11;
  d2 = d2 < 2 ? 0 : 11 - d2;
  return d2 === parseInt(c[13]);
}

export function validateDoc(s: string): boolean {
  const c = s.replace(/\D/g, "");
  if (c.length === 11) return validateCPF(s);
  if (c.length === 14) return validateCNPJ(s);
  return false;
}

export function docDigits(s: string): string {
  return s.replace(/\D/g, "");
}
