import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ReactQueryProvider from './components/ReactQueryProvider'
import { BANNER, BG_DESKTOP, BG_MOBILE } from './utils/constants'
import './reset.css'
import './index.css'

document.documentElement.style.setProperty('--bg-mobile', `url(${BG_MOBILE})`)
document.documentElement.style.setProperty('--bg-desktop', `url(${BG_DESKTOP})`)
document.documentElement.style.setProperty('--banner', `url(${BANNER})`)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReactQueryProvider>
      <App />
    </ReactQueryProvider>
  </React.StrictMode>
)
