import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import {
  applyThemePreference,
  getInitialTheme,
  saveThemePreference,
} from './lib/theme.js'
import ArticlePage from './pages/ArticlePage.jsx'
import HomePage from './pages/HomePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default function App() {
  const [theme, setTheme] = useState(() => getInitialTheme())

  useEffect(() => {
    applyThemePreference(theme)
    saveThemePreference(theme)
  }, [theme])

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout theme={theme} onThemeChange={setTheme}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/artikel/:slug" element={<ArticlePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
