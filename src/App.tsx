import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation, useSearchParams } from 'react-router-dom'
import { BRAND_NAME } from './data/brand'
import { isAdminMode } from './components/ListingCard'
import { Landing } from './pages/Landing'
import { Home } from './pages/Home'
import { ListingDetail } from './pages/ListingDetail'
import { Claim } from './pages/Claim'
import { Pricing } from './pages/Pricing'
import { AddBusiness } from './pages/AddBusiness'
import { Terms } from './pages/Terms'
import { Privacy } from './pages/Privacy'
import { ClaimHelp } from './pages/ClaimHelp'
import { ChatBot } from './components/ChatBot'

// Pins the hidden ?admin=1 review flag to sessionStorage on ANY entry page.
// Admin mode used to be detected only on the directory grid (Home), so it
// worked while / was the grid. Now / is the Landing page, which never read
// the flag, so landing on /?admin=1 and then clicking "Directory" dropped it
// and showed the visitor view. Reading it here, inside the router, keeps the
// flag sticky for the whole tab no matter which page you enter on.
function AdminFlagSync() {
  const [searchParams] = useSearchParams()
  isAdminMode(searchParams)
  return null
}

function SiteFooter() {
  const location = useLocation()
  const from = encodeURIComponent(location.pathname)
  return (
    <footer className="site-footer">
      <p>{BRAND_NAME}</p>
      <nav className="site-footer-links">
        <Link to={`/claim-help?from=${from}`}>How to claim your listing</Link>
        <Link to="/terms">Terms of use</Link>
        <Link to="/privacy">Privacy notice</Link>
      </nav>
    </footer>
  )
}

export default function App() {
  useEffect(() => {
    document.title = BRAND_NAME
  }, [])

  return (
    <BrowserRouter basename={import.meta.env.VITE_BASE || '/'}>
      <AdminFlagSync />
      <div className="app">
        <header className="site-header">
          <Link className="site-brand" to="/">
            {BRAND_NAME}
          </Link>
          <nav className="site-nav">
            <Link to="/directory">Directory</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/add">Add a business</Link>
          </nav>
        </header>

        <main className="site-main">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/directory" element={<Home />} />
            <Route path="/listing/:slug" element={<ListingDetail />} />
            <Route path="/claim/:slug" element={<Claim />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/add" element={<AddBusiness />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/claim-help" element={<ClaimHelp />} />
          </Routes>
        </main>

        <SiteFooter />
        <ChatBot />
      </div>
    </BrowserRouter>
  )
}
