// Tabela mestre de opções de parcelamento
// Não há descontos: o valor da parcela é (débito ÷ N).
// A cada mês, no boleto, incidem juros pela Selic vigente.
export const TABELA_PARCELAS = [
  1, 2, 3, 6, 10, 12, 18, 24, 30, 36, 42, 48, 54, 60,
] as const;

// Limite de parcelas que o contribuinte pode acessar.
// Em produção: definido por regra de negócio (perfil + montante).
export const MAX_PARCELAS = 60;

// Selic mensal vigente (~0,89% a.m. ≈ 11,25% a.a.)
export const SELIC_MENSAL = 0.0089;

export interface Plano {
  n: number;
  valorParcela: number;
  jurosTotal: number;
  valorTotal: number;
  recomendado: boolean;
}

/**
 * Regra de "Mais recomendado":
 * - > 10 opções disponíveis → 10x
 * - 4 a 10 opções → 3x
 * - ≤ 3 opções → 1x (à vista)
 */
export function regraRecomendado(qtdPlanos: number): number {
  if (qtdPlanos > 10) return 10;
  if (qtdPlanos >= 4) return 3;
  return 1;
}

export function calcParcela(totalDebito: number, n: number): number {
  return totalDebito / n;
}

/**
 * Estimativa de juros (somatório aproximado da Selic mensal sobre saldo decrescente).
 * Soma de saldos = total * (n-1)/2 / n × n = total * (n-1)/2 → juros ≈ total × Selic × (n-1)/2.
 */
export function calcJurosEstimados(totalDebito: number, n: number): number {
  return (totalDebito * SELIC_MENSAL * (n - 1)) / 2;
}

export function calcTotalEstimado(totalDebito: number, n: number): number {
  return totalDebito + calcJurosEstimados(totalDebito, n);
}

export function getPlanos(totalDebito: number, max: number = MAX_PARCELAS): Plano[] {
  const opcoes = TABELA_PARCELAS.filter((n) => n <= max);
  const recomendadoN = regraRecomendado(opcoes.length);

  return opcoes.map((n) => {
    const valorParcela = calcParcela(totalDebito, n);
    const jurosTotal = calcJurosEstimados(totalDebito, n);
    return {
      n,
      valorParcela,
      jurosTotal,
      valorTotal: totalDebito + jurosTotal,
      recomendado: n === recomendadoN,
    };
  });
}
