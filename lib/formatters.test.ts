import {
  fmtBRL,
  fmtPercent,
  maskDoc,
  maskDocPartial,
  maskContato,
} from "./formatters";

// Smoke test: confirma que Node tem full-ICU (locale pt-BR funcional).
// Se este falhar, todos os testes de fmtBRL/fmtPercent caem por culpa do ambiente, não do código.
describe("ambiente Intl pt-BR", () => {
  it("formata números no locale pt-BR (full-ICU presente)", () => {
    expect(new Intl.NumberFormat("pt-BR").format(1234.5)).toBe("1.234,5");
  });
});

describe("fmtBRL", () => {
  it("formata zero com 2 casas", () => {
    expect(fmtBRL(0)).toBe("0,00");
  });

  it("formata inteiro positivo", () => {
    expect(fmtBRL(1)).toBe("1,00");
  });

  it("formata milhar com decimal", () => {
    expect(fmtBRL(1234.5)).toBe("1.234,50");
  });

  it("formata milhão com decimais", () => {
    expect(fmtBRL(1234567.89)).toBe("1.234.567,89");
  });

  it("formata negativo", () => {
    expect(fmtBRL(-50)).toBe("-50,00");
  });
});

describe("fmtPercent", () => {
  it("formata zero", () => {
    expect(fmtPercent(0)).toBe("0,0%");
  });

  it("formata Selic mensal (0.0089)", () => {
    expect(fmtPercent(0.0089)).toBe("0,89%");
  });

  it("formata 10% (uma casa)", () => {
    expect(fmtPercent(0.1)).toBe("10,0%");
  });

  it("formata fração com 2 casas", () => {
    expect(fmtPercent(0.1234)).toBe("12,34%");
  });

  it("formata 100%", () => {
    expect(fmtPercent(1)).toBe("100,0%");
  });
});

describe("maskDoc", () => {
  it("retorna vazio para entrada vazia", () => {
    expect(maskDoc("")).toBe("");
  });

  it("não acrescenta separador com 3 dígitos", () => {
    expect(maskDoc("123")).toBe("123");
  });

  it("aplica primeiro ponto com 6 dígitos", () => {
    expect(maskDoc("123456")).toBe("123.456");
  });

  it("aplica dois pontos com 9 dígitos", () => {
    expect(maskDoc("123456789")).toBe("123.456.789");
  });

  it("aplica máscara CPF completa com 11 dígitos", () => {
    expect(maskDoc("11144477735")).toBe("111.444.777-35");
  });

  // BUG documentado: maskDoc gera dot extra antes do "/" para CNPJ
  // (output observado "11.222.333.0001/81" em vez do padrão "11.222.333/0001-81").
  // Causa: a regex (\d{3})(\d) do passo 3 dispara mesmo quando o resultado deveria
  // virar grupo de 4 dígitos pré-slash. Travado aqui como characterization test.
  it("[bug latente] aplica dot extra antes do / em CNPJ de 12 dígitos", () => {
    expect(maskDoc("112223330001")).toBe("11.222.333.0001");
  });

  it("[bug latente] aplica máscara CNPJ parcial com 13 dígitos (dot extra)", () => {
    expect(maskDoc("1122233300018")).toBe("11.222.333.0001/8");
  });

  it("[bug latente] aplica máscara CNPJ completa com 14 dígitos (dot extra, sem dash)", () => {
    expect(maskDoc("11222333000181")).toBe("11.222.333.0001/81");
  });

  it("trunca em 14 dígitos quando recebe mais", () => {
    expect(maskDoc("112223330001819999")).toBe("11.222.333.0001/81");
  });

  it("filtra lixo não-numérico antes de mascarar", () => {
    expect(maskDoc("abc111.444.777-35xyz")).toBe("111.444.777-35");
  });
});

describe("maskDocPartial", () => {
  it("ofusca CPF preservando 3 primeiros e 2 últimos dígitos", () => {
    expect(maskDocPartial("11144477735")).toBe("CPF 111.***.***-35");
  });

  it("ofusca CNPJ preservando bloco inicial e DV", () => {
    expect(maskDocPartial("11222333000181")).toBe("CNPJ 11.222.***/****-81");
  });

  it("retorna o input cru quando comprimento é inválido", () => {
    expect(maskDocPartial("12345")).toBe("12345");
  });

  it("aceita CPF já com máscara aplicada (extrai dígitos)", () => {
    expect(maskDocPartial("111.444.777-35")).toBe("CPF 111.***.***-35");
  });
});

describe("maskContato", () => {
  it("retorna vazio quando canal é null", () => {
    expect(maskContato(null, "qualquer")).toBe("");
  });

  it("retorna vazio quando contato é vazio", () => {
    expect(maskContato("email", "")).toBe("");
  });

  it("ofusca email com local de 5+ chars", () => {
    expect(maskContato("email", "maria@email.com")).toBe("ma***@email.com");
  });

  it("ofusca email com local de 1 char (head usa min(2,1))", () => {
    expect(maskContato("email", "a@b.com")).toBe("a***@b.com");
  });

  it("retorna o input cru quando email não tem @", () => {
    expect(maskContato("email", "semarroba")).toBe("semarroba");
  });

  it("ofusca SMS celular de 11 dígitos", () => {
    expect(maskContato("sms", "11987654321")).toBe("(11) 9****-**21");
  });

  it("strip de DDI 55 quando SMS tem 13 dígitos", () => {
    expect(maskContato("sms", "5511987654321")).toBe("(11) 9****-**21");
  });

  it("ofusca SMS fixo de 10 dígitos (sem o 9)", () => {
    expect(maskContato("sms", "1133334444")).toBe("(11) ****-**44");
  });

  it("retorna o input cru quando SMS é curto demais", () => {
    expect(maskContato("sms", "123")).toBe("123");
  });
});
