"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  DEBITOS_MOCK,
  type Debito,
} from "./debitos";

export type MetodoPagamento = "pix" | "boleto" | "debito";

interface RegularizaState {
  // S1
  doc: string | null;
  // S2 — usar Record (Set não serializa em sessionStorage)
  selectedDebitos: Record<string, true>;
  // S3
  parcelas: number;
  // S4
  termosAceitos: boolean;
  // S5
  metodoPagamento: MetodoPagamento;
  protocolo: string | null;
  protocoloEmitidoEm: string | null;

  // ações
  setDoc: (doc: string) => void;
  toggleDebito: (id: string) => void;
  setSelectedDebitos: (ids: string[]) => void;
  selectAllNegociaveis: () => void;
  clearSelection: () => void;
  setParcelas: (n: number) => void;
  setTermosAceitos: (v: boolean) => void;
  setMetodoPagamento: (m: MetodoPagamento) => void;
  confirmarAcordo: () => string;
  reset: () => void;
}

const initialState = {
  doc: null,
  selectedDebitos: {} as Record<string, true>,
  parcelas: 10,
  termosAceitos: false,
  metodoPagamento: "pix" as MetodoPagamento,
  protocolo: null,
  protocoloEmitidoEm: null,
};

function gerarProtocolo(): string {
  const ano = new Date().getFullYear();
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `KR-${ano}-${random}`;
}

export const useRegularizaStore = create<RegularizaState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setDoc: (doc) => set({ doc }),

      toggleDebito: (id) =>
        set((s) => {
          const next = { ...s.selectedDebitos };
          if (next[id]) {
            delete next[id];
          } else {
            next[id] = true;
          }
          return { selectedDebitos: next };
        }),

      setSelectedDebitos: (ids) => {
        const next: Record<string, true> = {};
        ids.forEach((id) => {
          next[id] = true;
        });
        set({ selectedDebitos: next });
      },

      selectAllNegociaveis: () => {
        const negociaveis = DEBITOS_MOCK.filter((d) => d.status === "vencido");
        const allSelected = negociaveis.every(
          (d) => get().selectedDebitos[d.id],
        );
        const next: Record<string, true> = { ...get().selectedDebitos };
        if (allSelected) {
          negociaveis.forEach((d) => delete next[d.id]);
        } else {
          negociaveis.forEach((d) => {
            next[d.id] = true;
          });
        }
        set({ selectedDebitos: next });
      },

      clearSelection: () => set({ selectedDebitos: {} }),

      setParcelas: (n) => set({ parcelas: n }),

      setTermosAceitos: (v) => set({ termosAceitos: v }),

      setMetodoPagamento: (m) => set({ metodoPagamento: m }),

      confirmarAcordo: () => {
        const protocolo = gerarProtocolo();
        set({
          protocolo,
          protocoloEmitidoEm: new Date().toISOString(),
        });
        return protocolo;
      },

      reset: () => set({ ...initialState }),
    }),
    {
      name: "kr-regulariza",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? sessionStorage : undefined!,
      ),
    },
  ),
);

export function getDebitosSelecionados(
  selected: Record<string, true>,
): Debito[] {
  return DEBITOS_MOCK.filter((d) => selected[d.id]);
}

export function getTotalSelecionado(selected: Record<string, true>): number {
  return getDebitosSelecionados(selected).reduce((acc, d) => acc + d.valor, 0);
}

export function getQtdSelecionada(selected: Record<string, true>): number {
  return Object.keys(selected).length;
}
