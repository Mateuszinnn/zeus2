import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// Lato, auto-hospedada nos três pesos do sistema. Sem CDN: numa apresentação,
// a fonte não pode depender da rede.
import '@fontsource/lato/400.css'
import '@fontsource/lato/700.css'

import './styles/globals.css'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
