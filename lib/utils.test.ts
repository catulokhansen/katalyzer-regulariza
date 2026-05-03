import { cn } from "./utils";

describe("cn", () => {
  it("retorna a string única", () => {
    expect(cn("foo")).toBe("foo");
  });

  it("faz join de duas strings com espaço", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("inclui apenas chaves truthy de objeto condicional", () => {
    expect(cn({ active: true, hidden: false, focused: true })).toBe("active focused");
  });

  it("achata array aninhado", () => {
    expect(cn(["a", ["b", { c: true }]])).toBe("a b c");
  });

  it("resolve conflito Tailwind via twMerge", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("retorna string vazia para inputs vazios/falsy", () => {
    expect(cn()).toBe("");
    expect(cn("")).toBe("");
    expect(cn(undefined, null, false)).toBe("");
  });
});
