// 8 direções em PT-BR, em setores de 45° centrados em cada uma (PRD §4.7).
const DIRS = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO']

export function toCardinal(degrees: number): string {
  const normalized = ((degrees % 360) + 360) % 360
  return DIRS[Math.round(normalized / 45) % 8]
}

// `wind_direction_10m` indica de onde o vento vem; a seta aponta para onde ele vai.
export function getArrowRotation(degrees: number): number {
  return degrees + 180
}
