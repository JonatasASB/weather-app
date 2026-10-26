import './style.css'
import { getCurrentWeather, searchCity } from './services/openMeteo'
import { renderEmpty, renderLoading, renderNotFound } from './ui/states'
import { renderWeather } from './ui/weatherView'

const app = document.querySelector<HTMLDivElement>('#app')!

// Estrutura estática da página (PRD §5.1). Nenhum dado dinâmico entra aqui.
app.innerHTML = `
  <main class="page">
    <form class="search" role="search">
      <label class="visually-hidden" for="city-input">Nome da cidade</label>
      <input
        class="search__input"
        id="city-input"
        name="city"
        type="text"
        placeholder="Digite o nome da cidade…"
        autocomplete="off"
      />
      <button class="search__button" type="submit">Buscar</button>
    </form>
    <section class="card" aria-live="polite"></section>
  </main>
`

const form = app.querySelector<HTMLFormElement>('.search')!
const input = app.querySelector<HTMLInputElement>('.search__input')!
const button = app.querySelector<HTMLButtonElement>('.search__button')!
const content = app.querySelector<HTMLElement>('.card')!

// Identifica a busca atual; respostas de buscas antigas são descartadas (RF04).
let currentSearchId = 0

function setSearching(searching: boolean): void {
  input.disabled = searching
  button.disabled = searching
}

async function handleSearch(query: string): Promise<void> {
  const id = ++currentSearchId
  renderLoading(content)

  const city = await searchCity(query)
  if (id !== currentSearchId) return
  if (!city) return renderNotFound(content)

  const weather = await getCurrentWeather(city.latitude, city.longitude, city.timezone)
  if (id !== currentSearchId) return
  if (!weather) return renderNotFound(content)

  renderWeather(content, city, weather)
}

form.addEventListener('submit', async (event) => {
  event.preventDefault()

  const query = input.value.trim()
  if (!query) return

  setSearching(true)
  try {
    await handleSearch(query)
  } finally {
    setSearching(false)
    input.focus()
  }
})

renderEmpty(content)
