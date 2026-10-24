import type { WeatherInfo } from '../types/weather'

type WeatherCodeEntry = {
  label: string
  dayIcon: string
  nightIcon: string
}

// Tabela do PRD §4.6.
const WEATHER_CODES: Record<number, WeatherCodeEntry> = {
  0: { label: 'Céu limpo', dayIcon: '☀️', nightIcon: '🌙' },
  1: { label: 'Céu predominantemente limpo', dayIcon: '🌤️', nightIcon: '🌙' },
  2: { label: 'Parcialmente nublado', dayIcon: '⛅', nightIcon: '☁️' },
  3: { label: 'Nublado', dayIcon: '☁️', nightIcon: '☁️' },
  45: { label: 'Neblina', dayIcon: '🌫️', nightIcon: '🌫️' },
  48: { label: 'Neblina com geada', dayIcon: '🌫️', nightIcon: '🌫️' },
  51: { label: 'Garoa leve', dayIcon: '🌦️', nightIcon: '🌧️' },
  53: { label: 'Garoa moderada', dayIcon: '🌦️', nightIcon: '🌧️' },
  55: { label: 'Garoa intensa', dayIcon: '🌧️', nightIcon: '🌧️' },
  56: { label: 'Garoa congelante leve', dayIcon: '🌧️', nightIcon: '🌧️' },
  57: { label: 'Garoa congelante intensa', dayIcon: '🌧️', nightIcon: '🌧️' },
  61: { label: 'Chuva fraca', dayIcon: '🌦️', nightIcon: '🌧️' },
  63: { label: 'Chuva moderada', dayIcon: '🌧️', nightIcon: '🌧️' },
  65: { label: 'Chuva forte', dayIcon: '🌧️', nightIcon: '🌧️' },
  66: { label: 'Chuva congelante fraca', dayIcon: '🌧️', nightIcon: '🌧️' },
  67: { label: 'Chuva congelante forte', dayIcon: '🌧️', nightIcon: '🌧️' },
  71: { label: 'Neve fraca', dayIcon: '🌨️', nightIcon: '🌨️' },
  73: { label: 'Neve moderada', dayIcon: '🌨️', nightIcon: '🌨️' },
  75: { label: 'Neve forte', dayIcon: '❄️', nightIcon: '❄️' },
  77: { label: 'Grãos de neve', dayIcon: '🌨️', nightIcon: '🌨️' },
  80: { label: 'Pancadas de chuva fracas', dayIcon: '🌦️', nightIcon: '🌧️' },
  81: { label: 'Pancadas de chuva moderadas', dayIcon: '🌧️', nightIcon: '🌧️' },
  82: { label: 'Pancadas de chuva violentas', dayIcon: '⛈️', nightIcon: '⛈️' },
  85: { label: 'Pancadas de neve fracas', dayIcon: '🌨️', nightIcon: '🌨️' },
  86: { label: 'Pancadas de neve fortes', dayIcon: '❄️', nightIcon: '❄️' },
  95: { label: 'Trovoada', dayIcon: '⛈️', nightIcon: '⛈️' },
  96: { label: 'Trovoada com granizo leve', dayIcon: '⛈️', nightIcon: '⛈️' },
  97: { label: 'Trovoada forte', dayIcon: '⛈️', nightIcon: '⛈️' },
  99: { label: 'Trovoada com granizo forte', dayIcon: '⛈️', nightIcon: '⛈️' },
}

const UNKNOWN_WEATHER: WeatherInfo = { label: 'Condição desconhecida', icon: '🌡️' }

export function getWeatherInfo(code: number, isDay: boolean): WeatherInfo {
  const entry = WEATHER_CODES[code]
  if (!entry) return { ...UNKNOWN_WEATHER }
  return { label: entry.label, icon: isDay ? entry.dayIcon : entry.nightIcon }
}

export function getDayNightInfo(isDay: boolean): WeatherInfo {
  return isDay ? { label: 'Dia', icon: '☀️' } : { label: 'Noite', icon: '🌙' }
}
