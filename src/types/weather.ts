// Respostas cruas da API Open-Meteo.
// Os campos são opcionais e `unknown` porque a API pode omiti-los ou mandá-los
// com outro tipo; a validação é feita em `services/openMeteo.ts`.

export type GeocodingResult = {
  name?: unknown
  latitude?: unknown
  longitude?: unknown
  country_code?: unknown
  timezone?: unknown
}

export type GeocodingResponse = {
  results?: GeocodingResult[]
}

export type ForecastCurrent = {
  time?: unknown
  temperature_2m?: unknown
  relative_humidity_2m?: unknown
  apparent_temperature?: unknown
  precipitation_probability?: unknown
  precipitation?: unknown
  wind_speed_10m?: unknown
  wind_direction_10m?: unknown
  is_day?: unknown
  weather_code?: unknown
}

export type ForecastCurrentUnits = {
  [K in keyof ForecastCurrent]?: unknown
}

export type ForecastResponse = {
  current?: ForecastCurrent
  current_units?: ForecastCurrentUnits
}

// Modelos internos (PRD §4.3, §4.4 e §4.6).

export type City = {
  name: string
  latitude: number
  longitude: number
  countryCode: string
  timezone: string
}

export type Measure = {
  value: number
  unit: string
}

export type CurrentWeather = {
  time: string // ISO local da cidade, ex.: "2026-10-22T20:45"
  isDay: boolean
  weatherCode: number
  temperature: Measure
  apparentTemperature: Measure
  relativeHumidity: Measure
  precipitationProbability: Measure
  precipitation: Measure
  windSpeed: Measure
  windDirection: Measure // graus
}

export type WeatherInfo = {
  label: string
  icon: string
}
