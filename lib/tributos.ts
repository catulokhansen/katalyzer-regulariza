export type TributoTipo = "IPTU" | "ISS" | "ITBI" | "TMRSU" | "Multa";

export type IconKey =
  | "House"
  | "Storefront"
  | "Buildings"
  | "Trash"
  | "WarningCircle"
  | "Coin";

export const TRIBUTO_META: Record<
  TributoTipo,
  { nome: string; desc: string; icon: IconKey }
> = {
  IPTU: {
    nome: "IPTU",
    desc: "Imposto Predial e Territorial Urbano",
    icon: "House",
  },
  ISS: {
    nome: "ISS",
    desc: "Imposto Sobre Serviços",
    icon: "Storefront",
  },
  ITBI: {
    nome: "ITBI",
    desc: "Imposto sobre Transmissão de Bens Imóveis",
    icon: "Buildings",
  },
  TMRSU: {
    nome: "TMRSU",
    desc: "Taxa de Manejo de Resíduos Sólidos Urbanos",
    icon: "Trash",
  },
  Multa: {
    nome: "Multa",
    desc: "Multas e auto de infração",
    icon: "WarningCircle",
  },
};

export const ORDEM_TRIBUTOS: TributoTipo[] = [
  "IPTU",
  "ISS",
  "ITBI",
  "TMRSU",
  "Multa",
];
