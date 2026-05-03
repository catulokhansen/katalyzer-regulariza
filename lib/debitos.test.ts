import { DEBITOS_MOCK, getDebitoById, type DebitoStatus } from "./debitos";
import { ORDEM_TRIBUTOS } from "./tributos";

const STATUSES_VALIDOS: DebitoStatus[] = ["vencido", "ajuizado", "prescrito"];
const COBRANCAS_VALIDAS = new Set(["encaminhado", "protestado"]);

describe("getDebitoById", () => {
  it("encontra débito existente e devolve shape completo", () => {
    const d = getDebitoById("d1");
    expect(d).toBeDefined();
    expect(d?.tipo).toBe("IPTU");
    expect(d?.valor).toBe(1842.5);
  });

  it("retorna undefined para id inexistente", () => {
    expect(getDebitoById("d999")).toBeUndefined();
  });

  it("retorna undefined para string vazia", () => {
    expect(getDebitoById("")).toBeUndefined();
  });

  it("é case-sensitive (D1 não bate com d1)", () => {
    expect(getDebitoById("D1")).toBeUndefined();
  });
});

describe("DEBITOS_MOCK invariants", () => {
  it("contém 12 débitos", () => {
    expect(DEBITOS_MOCK).toHaveLength(12);
  });

  it("tem ids únicos", () => {
    const ids = DEBITOS_MOCK.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("todo tipo está na ORDEM_TRIBUTOS", () => {
    for (const d of DEBITOS_MOCK) {
      expect(ORDEM_TRIBUTOS).toContain(d.tipo);
    }
  });

  it("todo status é um DebitoStatus válido", () => {
    for (const d of DEBITOS_MOCK) {
      expect(STATUSES_VALIDOS).toContain(d.status);
    }
  });

  it("toda cobrança definida usa um valor válido", () => {
    for (const d of DEBITOS_MOCK) {
      if (d.cobranca !== undefined) {
        expect(COBRANCAS_VALIDAS.has(d.cobranca)).toBe(true);
      }
    }
  });

  it("todo valor é positivo", () => {
    for (const d of DEBITOS_MOCK) {
      expect(d.valor).toBeGreaterThan(0);
    }
  });

  // Regra implícita do mock: processo existe se e somente se status === "ajuizado".
  it("processo está definido se e somente se status === 'ajuizado'", () => {
    for (const d of DEBITOS_MOCK) {
      const isAjuizado = d.status === "ajuizado";
      const temProcesso = d.processo !== undefined;
      expect(temProcesso).toBe(isAjuizado);
    }
  });

  it("cobre os 3 status (vencido, ajuizado, prescrito) — garante render visual da S2", () => {
    for (const status of STATUSES_VALIDOS) {
      expect(DEBITOS_MOCK.some((d) => d.status === status)).toBe(true);
    }
  });
});
