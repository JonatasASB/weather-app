// Estado de sucesso: sidebar + grid de cards (RF05, PRD §5.1).
// Todos os valores dinâmicos entram via `textContent`, nunca como HTML.

import type { City, CurrentWeather } from '../types/weather'
import { formatDate, formatMeasure, formatNumber } from '../utils/format'
import { getDayNightInfo, getWeatherInfo } from '../utils/weatherCode'
import { getArrowRotation, toCardinal } from '../utils/wind'

function createElement(tag: string, className: string, text?: string): HTMLElement {
  const element = document.createElement(tag)
  element.className = className
  if (text !== undefined) element.textContent = text
  return element
}

function createIcon(icon: string, className: string): HTMLElement {
  const element = createElement('span', className, icon)
  element.setAttribute('aria-hidden', 'true')
  return element
}

function createSidebar(city: City, weather: CurrentWeather): HTMLElement {
  const condition = getWeatherInfo(weather.weatherCode, weather.isDay)
  const dayNight = getDayNightInfo(weather.isDay)

  const dayNightLine = createElement('p', 'sidebar__daynight')
  dayNightLine.append(createIcon(dayNight.icon, 'sidebar__daynight-icon'), ` ${dayNight.label}`)

  const sidebar = createElement('div', 'sidebar')
  sidebar.append(
    createIcon(condition.icon, 'sidebar__icon'),
    createElement('p', 'sidebar__temperature', formatMeasure(weather.temperature)),
    createElement('h2', 'sidebar__city', `${city.name}, ${city.countryCode}`),
    createElement('p', 'sidebar__date', formatDate(weather.time)),
    dayNightLine,
    createElement('p', 'sidebar__condition', condition.label),
  )
  return sidebar
}

function createMetric(icon: string, label: string, value: string, extra?: HTMLElement): HTMLElement {
  const header = createElement('p', 'metric__label')
  header.append(createIcon(icon, 'metric__icon'), ` ${label}`)

  const valueLine = createElement('p', 'metric__value', value)
  if (extra) valueLine.append(extra)

  const metric = createElement('div', 'metric')
  metric.append(header, valueLine)
  return metric
}

function createWindMetric(weather: CurrentWeather): HTMLElement {
  const { windSpeed, windDirection } = weather
  const degrees = windDirection.value
  const value =
    `${formatMeasure(windSpeed)} · ${toCardinal(degrees)} ` +
    `(${formatNumber(degrees)}${windDirection.unit})`

  // A seta aponta para onde o vento vai (PRD §4.7).
  const arrow = createIcon('↑', 'metric__arrow')
  arrow.style.transform = `rotate(${getArrowRotation(degrees)}deg)`

  const metric = createMetric('💨', 'Vento', value, arrow)
  metric.classList.add('metric--wide')
  return metric
}

export function renderWeather(container: HTMLElement, city: City, weather: CurrentWeather): void {
  const metrics = createElement('div', 'metrics')
  metrics.append(
    createMetric('💧', 'Umidade', formatMeasure(weather.relativeHumidity)),
    createMetric('🌡️', 'Sensação térmica', formatMeasure(weather.apparentTemperature)),
    createMetric('☔', 'Probabilidade de precipitação', formatMeasure(weather.precipitationProbability)),
    createMetric('🌧️', 'Precipitação', formatMeasure(weather.precipitation)),
    createWindMetric(weather),
  )

  const view = createElement('div', 'weather')
  view.append(createSidebar(city, weather), metrics)
  container.replaceChildren(view)
}
