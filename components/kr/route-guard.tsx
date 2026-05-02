"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useRegularizaStore } from "@/lib/store";

type GuardKind = "doc" | "selecionados" | "parcelas" | "termos" | "protocolo";

interface RouteGuardProps {
  require: GuardKind[];
  redirectTo?: string;
  children: React.ReactNode;
}

const subscribeHydration = (callback: () => void) =>
  useRegularizaStore.persist.onFinishHydration(callback);
const getHydratedSnapshot = () => useRegularizaStore.persist.hasHydrated();
const getServerSnapshot = () => false;

/**
 * Pattern oficial React para stores externas. Inscreve no callback de
 * onFinishHydration e lê hasHydrated() a cada render — sem race conditions.
 */
function useHasHydrated(): boolean {
  return useSyncExternalStore(
    subscribeHydration,
    getHydratedSnapshot,
    getServerSnapshot,
  );
}

export function RouteGuard({
  require,
  redirectTo = "/",
  children,
}: RouteGuardProps) {
  const router = useRouter();
  const hydrated = useHasHydrated();

  // Selectors discretos — re-render apenas quando o slice usado muda
  const doc = useRegularizaStore((s) => s.doc);
  const selecionadosCount = useRegularizaStore(
    (s) => Object.keys(s.selectedDebitos).length,
  );
  const parcelas = useRegularizaStore((s) => s.parcelas);
  const termosAceitos = useRegularizaStore((s) => s.termosAceitos);
  const protocolo = useRegularizaStore((s) => s.protocolo);

  const checks: Record<GuardKind, boolean> = {
    doc: !!doc,
    selecionados: selecionadosCount > 0,
    parcelas: parcelas > 0,
    termos: termosAceitos,
    protocolo: !!protocolo,
  };
  const allowed = require.every((k) => checks[k]);

  useEffect(() => {
    if (hydrated && !allowed) {
      router.replace(redirectTo);
    }
  }, [hydrated, allowed, router, redirectTo]);

  if (!hydrated || !allowed) {
    return (
      <div
        aria-live="polite"
        className="min-h-screen flex items-center justify-center text-kr-deep-62 text-sm font-sans"
      >
        Carregando…
      </div>
    );
  }

  return <>{children}</>;
}
