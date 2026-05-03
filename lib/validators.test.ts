import { validateCPF, validateCNPJ, validateDoc, docDigits } from "./validators";

describe("validateCPF", () => {
  it("aceita CPF válido sem máscara", () => {
    expect(validateCPF("11144477735")).toBe(true);
  });

  it("aceita CPF válido com máscara", () => {
    expect(validateCPF("111.444.777-35")).toBe(true);
  });

  it.each([
    "00000000000",
    "11111111111",
    "22222222222",
    "33333333333",
    "44444444444",
    "55555555555",
    "66666666666",
    "77777777777",
    "88888888888",
    "99999999999",
  ])("rejeita CPF com todos os dígitos iguais (%s)", (cpf) => {
    expect(validateCPF(cpf)).toBe(false);
  });

  it("rejeita CPF com DV1 errado", () => {
    expect(validateCPF("11144477745")).toBe(false);
  });

  it("rejeita CPF com DV2 errado", () => {
    expect(validateCPF("11144477736")).toBe(false);
  });

  it("rejeita CPF com comprimento curto", () => {
    expect(validateCPF("123")).toBe(false);
  });

  it("rejeita CPF com comprimento longo", () => {
    expect(validateCPF("123456789012")).toBe(false);
  });

  it("rejeita string vazia", () => {
    expect(validateCPF("")).toBe(false);
  });

  it("rejeita string só com não-dígitos", () => {
    expect(validateCPF("abc.def.ghi-jk")).toBe(false);
  });

  // Cobre branch `if (d1 === 10) d1 = 0`:
  // sum=210 → d1=(210*10)%11=10 → 0; c[9]='0' bate.
  it("aceita CPF onde DV1 calcula 10 e vira 0", () => {
    expect(validateCPF("12345678909")).toBe(true);
  });
});

describe("validateCNPJ", () => {
  it("aceita CNPJ válido sem máscara", () => {
    expect(validateCNPJ("11222333000181")).toBe(true);
  });

  it("aceita CNPJ válido com máscara", () => {
    expect(validateCNPJ("11.222.333/0001-81")).toBe(true);
  });

  it("rejeita CNPJ com todos os dígitos iguais", () => {
    expect(validateCNPJ("11111111111111")).toBe(false);
  });

  it("rejeita CNPJ com DV1 errado", () => {
    expect(validateCNPJ("11222333000191")).toBe(false);
  });

  it("rejeita CNPJ com DV2 errado", () => {
    expect(validateCNPJ("11222333000182")).toBe(false);
  });

  it("rejeita CNPJ com 13 dígitos", () => {
    expect(validateCNPJ("1122233300018")).toBe(false);
  });

  it("rejeita CNPJ com 15 dígitos", () => {
    expect(validateCNPJ("112223330001811")).toBe(false);
  });

  it("rejeita string só com não-dígitos", () => {
    expect(validateCNPJ("abc.def.ghi/jklm-no")).toBe(false);
  });

  // Cobre branch `d1 = d1 < 2 ? 0 : 11 - d1`:
  // s1=11 → d1=0 → DV1 vira 0; c[12]='0' bate.
  it("aceita CNPJ onde DV1 calcula <2 e vira 0", () => {
    expect(validateCNPJ("11000000000108")).toBe(true);
  });

  // Cobre branch `d2 = d2 < 2 ? 0 : 11 - d2`:
  // s2=33 → d2=0 → DV2 vira 0; c[13]='0' bate.
  it("aceita CNPJ onde DV2 calcula <2 e vira 0", () => {
    expect(validateCNPJ("11000000002070")).toBe(true);
  });
});

describe("validateDoc", () => {
  it("delega para validateCPF quando 11 dígitos", () => {
    expect(validateDoc("111.444.777-35")).toBe(true);
  });

  it("delega para validateCNPJ quando 14 dígitos", () => {
    expect(validateDoc("11.222.333/0001-81")).toBe(true);
  });

  it.each(["1234567890", "123456789012", "1234567890123", "123456789012345"])(
    "rejeita comprimentos diferentes de 11 e 14 (%s dígitos)",
    (doc) => {
      expect(validateDoc(doc)).toBe(false);
    },
  );

  it("não passa CPF inválido por engano (DV errado)", () => {
    expect(validateDoc("11144477745")).toBe(false);
  });
});

describe("docDigits", () => {
  it("remove letras e símbolos", () => {
    expect(docDigits("abc123def")).toBe("123");
  });

  it("strip de máscara CPF", () => {
    expect(docDigits("111.444.777-35")).toBe("11144477735");
  });

  it("retorna string vazia para input vazio", () => {
    expect(docDigits("")).toBe("");
  });
});
