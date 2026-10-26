import './style.css'
import { renderEmpty } from './ui/states'

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

const content = app.querySelector<HTMLElement>('.card')!

renderEmpty(content)
