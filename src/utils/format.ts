import type { Measure } from '../types/weather'

const numberFormatter = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 })

// `timeZone: 'UTC'` porque a data é montada com `Date.UTC` (PRD §4.8).
const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
})

export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}

export function formatMeasure(measure: Measure): string {
  const value = formatNumber(measure.value)
  return measure.unit ? `${value} ${measure.unit}` : value
}

// `isoLocal` já vem no fuso da cidade (ex.: "2026-10-22T20:45"), então ano, mês
// e dia são lidos direto da string, sem passar pelo fuso do navegador.
export function formatDate(isoLocal: string): string {
  const [year, month, day] = isoLocal.slice(0, 10).split('-').map(Number)
  const formatted = dateFormatter.format(new Date(Date.UTC(year, month - 1, day)))
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}
