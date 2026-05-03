import {
  getDebitosSelecionados,
  getTotalSelecionado,
  getQtdSelecionada,
} from "./store";
import { DEBITOS_MOCK } from "./debitos";

describe("getDebitosSelecionados", () => {
  it("retorna lista vazia quando selection é vazia", () => {
    expect(getDebitosSelecionados({})).toEqual([]);
  });

  it("retorna os débitos cujos ids estão marcados", () => {
    const selecionados = getDebitosSelecionados({ d1: true, d3: true });
    expect(selecionados).toHaveLength(2);
    expect(selecionados.map((d) => d.id).sort()).toEqual(["d1", "d3"]);
  });

  it("filtra ids inexistentes silenciosamente", () => {
    expect(getDebitosSelecionados({ d999: true })).toEqual([]);
  });

  it("preserva a ordem de DEBITOS_MOCK, não a ordem das chaves do Record", () => {
    // d3 vem depois de d1 em DEBITOS_MOCK; mesmo passando d3 antes, o resultado segue a ordem do mock.
    const selecionados = getDebitosSelecionados({ d3: true, d1: true });
    expect(selecionados.map((d) => d.id)).toEqual(["d1", "d3"]);
  });
});

describe("getTotalSelecionado", () => {
  it("retorna zero para selection vazia", () => {
    expect(getTotalSelecionado({})).toBe(0);
  });

  it("retorna o valor único quando há 1 selecionado", () => {
    expect(getTotalSelecionado({ d1: true })).toBe(1842.5);
  });

  it("soma os valores de múltiplos selecionados", () => {
    const total = getTotalSelecionado({ d1: true, d2: true });
    expect(total).toBeCloseTo(1842.5 + 2104.8, 2);
  });

  it("ignora ids inexistentes (soma efetiva = 0)", () => {
    expect(getTotalSelecionado({ d999: true })).toBe(0);
  });

  it("equivale à soma direta sobre DEBITOS_MOCK quando tudo é selecionado", () => {
    const todos = Object.fromEntries(
      DEBITOS_MOCK.map((d) => [d.id, true as const]),
    );
    const totalEsperado = DEBITOS_MOCK.reduce((acc, d) => acc + d.valor, 0);
    expect(getTotalSelecionado(todos)).toBeCloseTo(totalEsperado, 2);
  });
});

describe("getQtdSelecionada", () => {
  it("retorna zero para selection vazia", () => {
    expect(getQtdSelecionada({})).toBe(0);
  });

  it("conta o número de chaves marcadas", () => {
    expect(getQtdSelecionada({ d1: true, d2: true, d3: true })).toBe(3);
  });

  // Quirk: o helper não valida existência em DEBITOS_MOCK,
  // é literalmente Object.keys(selected).length.
  it("[quirk] não filtra ids inexistentes — conta todas as chaves", () => {
    expect(getQtdSelecionada({ inexistente: true })).toBe(1);
  });
});
