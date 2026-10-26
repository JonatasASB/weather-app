// ÚNICO ponto de acesso à API Open-Meteo (RNF03).
// As funções exportadas nunca lançam exceção: em qualquer falha, retornam `null` (RF03).

import type {
  City,
  CurrentWeather,
  ForecastCurrentUnits,
  ForecastResponse,
  GeocodingResponse,
  Measure,
} from '../types/weather'

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

// Sem `hourly`, conforme PRD §4.2.
const CURRENT_FIELDS = [
  'precipitation_probability',
  'temperature_2m',
  'precipitation',
  'wind_speed_10m',
  'wind_direction_10m',
  'relative_humidity_2m',
  'apparent_temperature',
  'is_day',
  'weather_code',
].join(',')

// Data/hora ISO 8601 local, ex.: "2026-10-22T20:45".
const ISO_LOCAL_DATETIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== ''
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

// Faz o GET e devolve o JSON, ou `null` em erro de rede, status não 2xx ou JSON inválido.
async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url)
    if (!response.ok) return null
    return (await response.json()) as T
  } catch {
    return null
  }
}

export async function searchCity(name: string): Promise<City | null> {
  const query = name.trim()
  if (!query) return null

  const url = `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=1&language=pt&format=json`
  const data = await fetchJson<GeocodingResponse>(url)
  if (!data || typeof data !== 'object' || !Array.isArray(data.results)) return null

  const result = data.results[0]
  if (!result || typeof result !== 'object') return null

  const { name: cityName, latitude, longitude, country_code, timezone } = result
  if (
    !isNonEmptyString(cityName) ||
    !isFiniteNumber(latitude) ||
    !isFiniteNumber(longitude) ||
    !isNonEmptyString(country_code) ||
    !isNonEmptyString(timezone)
  ) {
    return null
  }

  return { name: cityName, latitude, longitude, countryCode: country_code, timezone }
}

// Unidade ausente ou inválida vira string vazia: não invalida a busca (PRD §4.4).
function toMeasure(value: number, units: ForecastCurrentUnits, field: keyof ForecastCurrentUnits): Measure {
  const unit = units[field]
  return { value, unit: typeof unit === 'string' ? unit : '' }
}

export async function getCurrentWeather(
  latitude: number,
  longitude: number,
  timezone: string,
): Promise<CurrentWeather | null> {
  if (!isFiniteNumber(latitude) || !isFiniteNumber(longitude) || !isNonEmptyString(timezone)) return null

  const url =
    `${FORECAST_URL}?latitude=${encodeURIComponent(latitude)}` +
    `&longitude=${encodeURIComponent(longitude)}` +
    `&current=${CURRENT_FIELDS}` +
    `&timezone=${encodeURIComponent(timezone)}` +
    `&forecast_days=1`
  const data = await fetchJson<ForecastResponse>(url)
  if (!data || typeof data !== 'object') return null

  const { current, current_units: units } = data
  if (!current || typeof current !== 'object' || !units || typeof units !== 'object') return null

  const {
    time,
    temperature_2m,
    relative_humidity_2m,
    apparent_temperature,
    precipitation_probability,
    precipitation,
    wind_speed_10m,
    wind_direction_10m,
    is_day,
    weather_code,
  } = current
  if (
    typeof time !== 'string' ||
    !ISO_LOCAL_DATETIME.test(time) ||
    !isFiniteNumber(temperature_2m) ||
    !isFiniteNumber(relative_humidity_2m) ||
    !isFiniteNumber(apparent_temperature) ||
    !isFiniteNumber(precipitation_probability) ||
    !isFiniteNumber(precipitation) ||
    !isFiniteNumber(wind_speed_10m) ||
    !isFiniteNumber(wind_direction_10m) ||
    (is_day !== 0 && is_day !== 1) ||
    !isFiniteNumber(weather_code)
  ) {
    return null
  }

  return {
    time,
    isDay: is_day === 1,
    weatherCode: weather_code,
    temperature: toMeasure(temperature_2m, units, 'temperature_2m'),
    apparentTemperature: toMeasure(apparent_temperature, units, 'apparent_temperature'),
    relativeHumidity: toMeasure(relative_humidity_2m, units, 'relative_humidity_2m'),
    precipitationProbability: toMeasure(precipitation_probability, units, 'precipitation_probability'),
    precipitation: toMeasure(precipitation, units, 'precipitation'),
    windSpeed: toMeasure(wind_speed_10m, units, 'wind_speed_10m'),
    windDirection: toMeasure(wind_direction_10m, units, 'wind_direction_10m'),
  }
}
