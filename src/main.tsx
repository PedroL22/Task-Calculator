import { Analytics } from '@vercel/analytics/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'

import { Toaster } from '~/components/ui/sonner'

import { App } from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Analytics />

    <Toaster richColors />

    <App />
  </StrictMode>
)
