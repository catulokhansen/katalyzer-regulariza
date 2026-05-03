import {
  TABELA_PARCELAS,
  SELIC_MENSAL,
  regraRecomendado,
  calcParcela,
  calcJurosEstimados,
  calcTotalEstimado,
  getPlanos,
} from "./parcelas";

describe("regraRecomendado", () => {
  it.each([
    [0, 1],
    [1, 1],
    [3, 1],
    [4, 3],
    [10, 3],
    [11, 10],
    [14, 10],
  ])("para %i opções recomenda %i parcelas", (qtd, esperado) => {
    expect(regraRecomendado(qtd)).toBe(esperado);
  });
});

describe("calcParcela", () => {
  it("retorna o próprio total quando n=1", () => {
    expect(calcParcela(1000, 1)).toBe(1000);
  });

  it("divide proporcionalmente para n>1", () => {
    expect(calcParcela(1000, 10)).toBe(100);
  });

  it("retorna zero quando débito é zero", () => {
    expect(calcParcela(0, 5)).toBe(0);
  });

  it("preserva precisão de divisão fracionária", () => {
    expect(calcParcela(1000, 3)).toBeCloseTo(333.33, 2);
  });
});

describe("calcJurosEstimados", () => {
  it("não cobra juros à vista (n=1)", () => {
    expect(calcJurosEstimados(1000, 1)).toBe(0);
  });

  it("calcula juros para n=2 (Selic × 0.5)", () => {
    expect(calcJurosEstimados(1000, 2)).toBeCloseTo(4.45, 2);
  });

  it("calcula juros para n=12 (Selic × 5.5)", () => {
    expect(calcJurosEstimados(1000, 12)).toBeCloseTo(48.95, 2);
  });

  it("retorna zero quando débito é zero", () => {
    expect(calcJurosEstimados(0, 60)).toBe(0);
  });

  it("é linear em relação ao débito", () => {
    expect(calcJurosEstimados(2000, 12)).toBeCloseTo(
      2 * calcJurosEstimados(1000, 12),
      6,
    );
  });

  it("respeita a constante SELIC_MENSAL exposta", () => {
    expect(SELIC_MENSAL).toBe(0.0089);
  });
});

describe("calcTotalEstimado", () => {
  it("retorna o próprio débito quando n=1 (sem juros)", () => {
    expect(calcTotalEstimado(1000, 1)).toBe(1000);
  });

  it("é a soma do débito com os juros estimados", () => {
    const total = calcTotalEstimado(1000, 12);
    expect(total).toBeCloseTo(1000 + calcJurosEstimados(1000, 12), 6);
  });

  it("idem para outro par (500, 36)", () => {
    const total = calcTotalEstimado(500, 36);
    expect(total).toBeCloseTo(500 + calcJurosEstimados(500, 36), 6);
  });
});

describe("getPlanos", () => {
  it("retorna 14 planos para o limite máximo padrão", () => {
    expect(getPlanos(1000)).toHaveLength(14);
  });

  it("preserva exatamente a sequência de TABELA_PARCELAS", () => {
    const ns = getPlanos(1000).map((p) => p.n);
    expect(ns).toEqual([...TABELA_PARCELAS]);
  });

  it("calcula valorParcela e valorTotal coerentes em cada plano", () => {
    const planos = getPlanos(1000);
    for (const p of planos) {
      expect(p.valorParcela).toBeCloseTo(1000 / p.n, 6);
      expect(p.valorTotal).toBeCloseTo(1000 + p.jurosTotal, 6);
    }
  });

  it("marca exatamente 1 plano como recomendado para 14 opções (n=10)", () => {
    const planos = getPlanos(1000);
    const recomendados = planos.filter((p) => p.recomendado);
    expect(recomendados).toHaveLength(1);
    expect(recomendados[0].n).toBe(10);
  });

  it("filtra por max e ajusta o recomendado conforme regra", () => {
    const planos = getPlanos(1000, 5);
    expect(planos.map((p) => p.n)).toEqual([1, 2, 3]);
    const recomendados = planos.filter((p) => p.recomendado);
    expect(recomendados).toHaveLength(1);
    expect(recomendados[0].n).toBe(1);
  });

  it("retorna lista vazia quando max=0", () => {
    expect(getPlanos(1000, 0)).toEqual([]);
  });
});
