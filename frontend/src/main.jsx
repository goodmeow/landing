import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HeroUIProvider } from '@heroui/react'
import './styles.css'
import App from './App.jsx'

const browserLocale = (() => {
  if (typeof navigator === 'undefined') return 'en-US'
  const [primary] = navigator.languages ?? []
  return primary || navigator.language || 'en-US'
})()

if (typeof document !== 'undefined') {
  document.documentElement.lang = browserLocale
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HeroUIProvider locale={browserLocale} disableRipple>
      <App />
    </HeroUIProvider>
  </StrictMode>,
)
