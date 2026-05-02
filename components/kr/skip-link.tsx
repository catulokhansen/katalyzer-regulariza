export function SkipLink({ targetId = "kr-main" }: { targetId?: string }) {
  return (
    <a href={`#${targetId}`} className="kr-skip">
      Pular para o conteúdo
    </a>
  );
}
