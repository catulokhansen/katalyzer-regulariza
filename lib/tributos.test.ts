import { TRIBUTO_META, ORDEM_TRIBUTOS, type TributoTipo } from "./tributos";

const TIPOS_ESPERADOS: TributoTipo[] = ["IPTU", "ISS", "ITBI", "TMRSU", "Multa"];
const ICONS_VALIDOS = new Set([
  "House",
  "Storefront",
  "Buildings",
  "Trash",
  "WarningCircle",
  "Coin",
]);

describe("TRIBUTO_META", () => {
  it("expõe metadados para os 5 tipos de tributo", () => {
    expect(Object.keys(TRIBUTO_META)).toHaveLength(5);
  });

  it.each(TIPOS_ESPERADOS)("tem entrada não-vazia para %s", (tipo) => {
    const meta = TRIBUTO_META[tipo];
    expect(meta).toBeDefined();
    expect(meta.nome.length).toBeGreaterThan(0);
    expect(meta.desc.length).toBeGreaterThan(0);
    expect(meta.icon.length).toBeGreaterThan(0);
  });

  it.each(TIPOS_ESPERADOS)("usa o próprio tipo como label canônica (%s)", (tipo) => {
    expect(TRIBUTO_META[tipo].nome).toBe(tipo);
  });

  it.each(TIPOS_ESPERADOS)("usa um IconKey válido em %s", (tipo) => {
    expect(ICONS_VALIDOS.has(TRIBUTO_META[tipo].icon)).toBe(true);
  });
});

describe("ORDEM_TRIBUTOS", () => {
  it("contém exatamente 5 entradas", () => {
    expect(ORDEM_TRIBUTOS).toHaveLength(5);
  });

  it("não tem duplicatas", () => {
    expect(new Set(ORDEM_TRIBUTOS).size).toBe(5);
  });

  // CLAUDE.md: "preserve it across S2/S4 grouping"
  it("respeita a ordem canônica", () => {
    expect(ORDEM_TRIBUTOS).toEqual(TIPOS_ESPERADOS);
  });
});
