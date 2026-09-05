import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { BRAND_NAME } from './data/brand'
import { Home } from './pages/Home'
import { ListingDetail } from './pages/ListingDetail'
import { Claim } from './pages/Claim'
import { Pricing } from './pages/Pricing'
import { AddBusiness } from './pages/AddBusiness'
import { Terms } from './pages/Terms'
import { Privacy } from './pages/Privacy'
import { ClaimHelp } from './pages/ClaimHelp'

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
    <BrowserRouter basename="/perry-directory">
      <div className="app">
        <header className="site-header">
          <Link className="site-brand" to="/">
            {BRAND_NAME}
          </Link>
          <nav className="site-nav">
            <Link to="/">Directory</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/add">Add a business</Link>
          </nav>
        </header>

        <main className="site-main">
          <Routes>
            <Route path="/" element={<Home />} />
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
      </div>
    </BrowserRouter>
  )
}
