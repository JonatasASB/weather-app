// Estados vazio, carregando e não encontrado (RF06, PRD §5.4).
// Cada render substitui todo o conteúdo do container.

function renderMessage(container: HTMLElement, icon: string, title: string, text: string): void {
  container.innerHTML = `
    <div class="state">
      <span class="state__icon" aria-hidden="true">${icon}</span>
      <h2 class="state__title">${title}</h2>
      <p class="state__text">${text}</p>
    </div>
  `
}

export function renderEmpty(container: HTMLElement): void {
  renderMessage(container, '🔍', 'Pesquise uma cidade', 'Digite o nome de uma cidade para ver o clima agora.')
}

export function renderLoading(container: HTMLElement): void {
  container.innerHTML = `
    <div class="state">
      <span class="spinner" aria-hidden="true"></span>
      <p class="state__title">Buscando clima…</p>
    </div>
  `
}

export function renderNotFound(container: HTMLElement): void {
  renderMessage(container, '🏙️', 'Nenhum resultado encontrado', 'Verifique o nome da cidade e tente novamente.')
}
