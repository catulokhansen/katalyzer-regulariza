import type { TributoTipo } from "./tributos";

export type DebitoStatus = "vencido" | "ajuizado" | "prescrito";

export interface Debito {
  id: string;
  tipo: TributoTipo;
  exercicio: number;
  status: DebitoStatus;
  cda: string;
  subtitulo: string;
  referenciaCurta: string;
  valor: number;
  processo?: string;
}

export interface Contribuinte {
  nome: string;
  doc: string;
}

export interface ParcelamentoAtivo {
  numero: string;
  parcelasRestantes: number;
  totalParcelas: number;
  valorMensal: string;
  proximoVenc: string;
}

export const CONTRIBUINTE_MOCK: Contribuinte = {
  nome: "Maria Aparecida da Silva",
  doc: "CPF 123.***.***-45",
};

export const PARCELAMENTO_ATIVO_MOCK: ParcelamentoAtivo = {
  numero: "PARC-2024-0817",
  parcelasRestantes: 8,
  totalParcelas: 24,
  valorMensal: "R$ 312,40",
  proximoVenc: "15/12/2025",
};

export const DEBITOS_MOCK: Debito[] = [
  // IPTU — 2 imóveis, 5 débitos
  {
    id: "d1",
    tipo: "IPTU",
    exercicio: 2024,
    status: "vencido",
    cda: "2024.001.0001234",
    subtitulo: "Apto 301 — Rua das Acácias, 142",
    referenciaCurta: "Apto 301",
    valor: 1842.5,
  },
  {
    id: "d2",
    tipo: "IPTU",
    exercicio: 2023,
    status: "vencido",
    cda: "2023.001.0008762",
    subtitulo: "Apto 301 — Rua das Acácias, 142",
    referenciaCurta: "Apto 301",
    valor: 2104.8,
  },
  {
    id: "d3",
    tipo: "IPTU",
    exercicio: 2022,
    status: "ajuizado",
    cda: "2022.001.0019504",
    subtitulo: "Apto 301 — Rua das Acácias, 142",
    referenciaCurta: "Apto 301",
    valor: 1986.3,
    processo: "0012345-67.2023.8.26.0100",
  },
  {
    id: "d4",
    tipo: "IPTU",
    exercicio: 2024,
    status: "vencido",
    cda: "2024.001.0024891",
    subtitulo: "Loja 02 — Av. Paulista, 1.020",
    referenciaCurta: "Loja 02",
    valor: 4218.7,
  },
  {
    id: "d5",
    tipo: "IPTU",
    exercicio: 2019,
    status: "prescrito",
    cda: "2019.001.0031745",
    subtitulo: "Apto 301 — Rua das Acácias, 142",
    referenciaCurta: "Apto 301",
    valor: 1620.4,
  },

  // ISS — 3 débitos
  {
    id: "d6",
    tipo: "ISS",
    exercicio: 2024,
    status: "vencido",
    cda: "2024.002.0004128",
    subtitulo: "Prestação de serviços autônomos",
    referenciaCurta: "Autônoma",
    valor: 524.3,
  },
  {
    id: "d7",
    tipo: "ISS",
    exercicio: 2023,
    status: "vencido",
    cda: "2023.002.0007891",
    subtitulo: "Prestação de serviços autônomos",
    referenciaCurta: "Autônoma",
    valor: 612.8,
  },
  {
    id: "d8",
    tipo: "ISS",
    exercicio: 2022,
    status: "ajuizado",
    cda: "2022.002.0014562",
    subtitulo: "Prestação de serviços autônomos",
    referenciaCurta: "Autônoma",
    valor: 580.2,
    processo: "0098765-43.2023.8.26.0100",
  },

  // TMRSU — 2 débitos
  {
    id: "d9",
    tipo: "TMRSU",
    exercicio: 2024,
    status: "vencido",
    cda: "2024.003.0001102",
    subtitulo: "Apto 301 — Rua das Acácias, 142",
    referenciaCurta: "Apto 301",
    valor: 348.9,
  },
  {
    id: "d10",
    tipo: "TMRSU",
    exercicio: 2023,
    status: "vencido",
    cda: "2023.003.0002847",
    subtitulo: "Apto 301 — Rua das Acácias, 142",
    referenciaCurta: "Apto 301",
    valor: 322.5,
  },

  // ITBI — 1 débito
  {
    id: "d11",
    tipo: "ITBI",
    exercicio: 2023,
    status: "vencido",
    cda: "2023.005.0000812",
    subtitulo: "Loja 02 — Av. Paulista, 1.020",
    referenciaCurta: "Loja 02",
    valor: 8740.0,
  },

  // Multa de postura — 1
  {
    id: "d12",
    tipo: "Multa",
    exercicio: 2024,
    status: "vencido",
    cda: "2024.004.0000412",
    subtitulo: "Notificação de Postura nº 84.621",
    referenciaCurta: "Notif. 84.621",
    valor: 412.7,
  },
];

export function getDebitoById(id: string): Debito | undefined {
  return DEBITOS_MOCK.find((d) => d.id === id);
}
