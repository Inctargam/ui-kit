// Порядок подключения такой же, как будет у потребителя кита:
// сброс → токены → собственные стили приложения.
import '../src/styles/reset.css'
import '../src/styles/tokens.css'
import './global.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { Playground } from './Playground'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Playground />
  </StrictMode>
)
