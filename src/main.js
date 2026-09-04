import { categories, tools } from './data.js'

const state = { query: '', category: 'All' }
const grid = document.querySelector('#tool-grid')
const filters = document.querySelector('#filters')
const search = document.querySelector('#tool-search')
const emptyState = document.querySelector('#empty-state')
const nav = document.querySelector('#primary-nav')
const menuToggle = document.querySelector('.menu-toggle')
const themeToggle = document.querySelector('.theme-toggle')
const themeIcon = document.querySelector('.theme-icon')
const themeLabel = document.querySelector('.theme-label')

function priceClass(pricing) {
  return `price--${pricing.toLowerCase()}`
}

function toolCard(tool) {
  return `
    <article class="tool-card">
      <div class="tool-card__icon" aria-hidden="true">✦</div>
      <div class="tool-card__content">
        <div class="tool-card__header">
          <h3>${tool.name}</h3>
          <span class="price ${priceClass(tool.pricing)}">${tool.pricing}</span>
        </div>
        <p>${tool.description}</p>
      </div>
      <div class="tool-card__footer">
        <span>${tool.category}</span>
        <a href="${tool.url}" target="_blank" rel="noreferrer" aria-label="Visit ${tool.name}">Visit Tool ↗</a>
      </div>
    </article>`
}

function renderFilters() {
  filters.innerHTML = categories.map((category) => `<button class="${state.category === category ? 'active' : ''}" type="button" data-category="${category}">${category}</button>`).join('')
}

function getFilteredTools() {
  const normalizedQuery = state.query.trim().toLowerCase()
  return tools.filter((tool) => {
    const matchesCategory = state.category === 'All' || tool.category === state.category
    const matchesQuery = [tool.name, tool.description, tool.category, tool.pricing].join(' ').toLowerCase().includes(normalizedQuery)
    return matchesCategory && matchesQuery
  })
}

function renderTools() {
  const filteredTools = getFilteredTools()
  grid.innerHTML = filteredTools.map(toolCard).join('')
  emptyState.hidden = filteredTools.length > 0
}

function renderFeatured() {
  const featured = tools.slice(0, 6)
  document.querySelector('#hero-featured').innerHTML = featured.slice(0, 4).map((tool) => `<div class="mini-tool"><span>${tool.name.charAt(0)}</span><div><strong>${tool.name}</strong><small>${tool.category} · ${tool.pricing}</small></div></div>`).join('')
  document.querySelector('#featured-list').innerHTML = featured.map((tool) => `<a href="${tool.url}" target="_blank" rel="noreferrer">✓ ${tool.name}<span>${tool.category}</span></a>`).join('')
}

function render() {
  renderFilters()
  renderTools()
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme
  localStorage.setItem('theme', theme)
  themeIcon.textContent = theme === 'light' ? '☾' : '☀'
  themeLabel.textContent = theme === 'light' ? 'Dark' : 'Light'
}

filters.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-category]')
  if (!button) return
  state.category = button.dataset.category
  render()
})

search.addEventListener('input', (event) => {
  state.query = event.target.value
  renderTools()
})

document.querySelector('.search-panel').addEventListener('submit', (event) => event.preventDefault())

menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('nav-links--open')
  menuToggle.setAttribute('aria-expanded', String(isOpen))
  menuToggle.textContent = isOpen ? '×' : '☰'
})

nav.addEventListener('click', () => {
  nav.classList.remove('nav-links--open')
  menuToggle.setAttribute('aria-expanded', 'false')
  menuToggle.textContent = '☰'
})

themeToggle.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'
  applyTheme(nextTheme)
})

document.querySelector('#year').textContent = new Date().getFullYear()
document.querySelector('#tool-count').textContent = `${tools.length}+`
applyTheme(localStorage.getItem('theme') || 'light')
renderFeatured()
render()
