import { defineConfig } from 'vite'

// O GitHub Pages serve o projeto em https://jonatasasb.github.io/weather-app/,
// então os assets do build precisam desse prefixo. Em `npm run dev` continua em "/".
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/weather-app/' : '/',
}))
