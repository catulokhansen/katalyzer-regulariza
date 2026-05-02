/**
 * QR code visual placeholder — protótipo S4 (whitespace-s4.jsx).
 * Não é um QR válido — apenas decorativo. Padrão fixo de 25×25 cells.
 * Em produção, gere um real via lib (qrcode, qr-svg).
 */
const SEED = [
  "1111111010110001111111",
  "1000001011000001000001",
  "1011101001110101011101",
  "1011101010001001011101",
  "1011101000111001011101",
  "1000001011010101000001",
  "1111111010101011111111",
  "0000000011010100000000",
  "1101011110011010110010",
  "0010010011110001000111",
  "1110111100010100110100",
  "0101100011001011011010",
  "1010111110100110001101",
  "1100100001011000110110",
  "0111110100110011010001",
  "0010010111000110101011",
  "1110010110101010001100",
  "0000000011010110100010",
  "1111111010001101011010",
  "1000001011001000110001",
  "1011101000110100110111",
  "1011101011010011001000",
  "1011101010011110011001",
  "1000001010110101110010",
  "1111111011001001100010",
];

interface QRPlaceholderProps {
  size?: number;
}

export function QRPlaceholder({ size = 220 }: QRPlaceholderProps) {
  const cells = SEED.length;
  const cell = size / cells;

  const rects: React.ReactElement[] = [];
  for (let r = 0; r < SEED.length; r++) {
    for (let c = 0; c < SEED[r].length; c++) {
      if (SEED[r][c] === "1") {
        rects.push(
          <rect
            key={`${r}-${c}`}
            x={c * cell}
            y={r * cell}
            width={cell + 0.4}
            height={cell + 0.4}
            fill="#0A2A5F"
          />,
        );
      }
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${cells * cell} ${cells * cell}`}
      role="img"
      aria-label="QR code para pagamento PIX"
    >
      <rect width="100%" height="100%" fill="#FFFFFF" />
      {rects}
    </svg>
  );
}
