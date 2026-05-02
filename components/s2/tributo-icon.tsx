import { TributoIconMap } from "@/components/kr/icons";
import { TRIBUTO_META, type TributoTipo } from "@/lib/tributos";

interface TributoIconProps {
  tipo: TributoTipo;
  size?: number;
}

export function TributoIcon({ tipo, size = 44 }: TributoIconProps) {
  const meta = TRIBUTO_META[tipo];
  const Comp = TributoIconMap[meta.icon];
  return (
    <div
      aria-hidden="true"
      className="bg-kr-deep-08 border border-kr-deep-12 rounded-[10px] flex items-center justify-center text-kr-deep flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <Comp size={Math.round(size * 0.5)} />
    </div>
  );
}
