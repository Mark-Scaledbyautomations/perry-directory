import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation, useSearchParams } from 'react-router-dom'
import { BRAND_NAME } from './data/brand'
import { CATEGORIES } from './data/categories'
import { isAdminMode } from './components/ListingCard'
import { Landing } from './pages/Landing'
import { Home } from './pages/Home'
import { Category } from './pages/Category'
import { ListingDetail } from './pages/ListingDetail'
import { Claim } from './pages/Claim'
import { Pricing } from './pages/Pricing'
import { AddBusiness } from './pages/AddBusiness'
import { Terms } from './pages/Terms'
import { Privacy } from './pages/Privacy'
import { ClaimHelp } from './pages/ClaimHelp'
import { Admin } from './pages/Admin'
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

// The "Admin Dashboard" nav pill (moved here from the directory banner,
// Arbo 2026-09-19). Renders in the site header only while the sticky
// ?admin=1 flag is on, so visitors never see the dashboard entrance.
function AdminNavCta() {
  const [searchParams] = useSearchParams()
  if (!isAdminMode(searchParams)) return null
  return (
    <Link className="nav-cta nav-cta-admin" to="/admin">
      Admin Dashboard
    </Link>
  )
}

// Header nav with a "you are here" marker: whichever entry owns the current
// route turns its FONT gold #f59f00, nothing else added (Arbo's correction;
// the pill keeps a white label + 1px gold edge instead, gold-on-azure text
// would fail contrast). Route map: Directory owns /directory + listing
// pages; Categories owns the category pages only (Arbo: landing must NOT
// light it, 2026-09-24); For Business Owners owns the claim guide +
// pricing; the pill owns /add.
const NAV_ROUTES: Record<string, string[]> = {
  '/directory': ['/directory', '/listing'],
  '/#categories': ['/category'],
  '/claim-help': ['/claim-help', '/pricing'],
  '/add': ['/add'],
}
function navIsHere(to: string, pathname: string) {
  return (NAV_ROUTES[to] ?? [to]).some(
    (r) => pathname === r || (r !== '/' && pathname.startsWith(r + '/')),
  )
}
function SiteNav() {
  const { pathname } = useLocation()
  // "You are here": the route-owning entry's FONT turns gold, nothing else
  // changes (Arbo's correction, 2026-09-24). The pill keeps its pale chip
  // exactly as the offer-colors pass built it.
  const cls = (to: string, base?: string) => {
    const here = navIsHere(to, pathname)
    return base ? (here ? `${base} nav-here` : base) : here ? 'nav-here' : undefined
  }
  const text = (to: string, label: string) => (
    <Link className={cls(to)} to={to}>
      {label}
    </Link>
  )
  return (
    <>
      {text('/directory', 'Directory')}
      {text('/#categories', 'Categories')}
      {text('/claim-help', 'For Business Owners')}
      <Link className={cls('/add', 'nav-cta')} to="/add">
        Add Your Business
      </Link>
    </>
  )
}

// Tab title per route. App used to set BRAND_NAME once on mount, which ran
// after child page effects and overwrote them (React runs child effects
// first). This syncs on every navigation instead: pages that manage their
// own title (Category, 2026-09-16 piece b) are skipped, everything else
// shows the brand name, matching the previous behavior.
function RouteTitleSync() {
  const location = useLocation()
  useEffect(() => {
    // Category (2026-09-16), ListingDetail (2026-09-18, piece c),
    // ClaimHelp (2026-09-18), and Admin (2026-09-19, piece d) own their
    // titles; everything else shows the brand name.
    if (
      location.pathname.startsWith('/category/') ||
      location.pathname.startsWith('/listing/') ||
      location.pathname.startsWith('/claim-help') ||
      location.pathname.startsWith('/admin')
    )
      return
    document.title = BRAND_NAME
  }, [location.pathname])
  return null
}

// Scrolls to #anchor targets after navigation (react-router does not do
// this across routes). Powers the header "Categories" link -> landing grid.
function HashScroll() {
  const { hash } = useLocation()
  useEffect(() => {
    if (!hash) return
    const el = document.getElementById(hash.slice(1))
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [hash])
  return null
}

function SiteFooter() {
  // Keep the claim-help back-link behavior: arriving from a listing page
  // sends you back there (ClaimHelp reads ?from=).
  const location = useLocation()
  const from = encodeURIComponent(location.pathname)
  // 4-column site-wide footer (Arbo, 2026-09-18), modeled on the reference
  // build's footer. Gated reference items deliberately left out: "About &
  // who we are", "Where our data comes from", "No-spam pledge" (brand/legal
  // decisions still pending) and the copyright entity line (Tina's pending
  // sender-entity decision). Category columns are computed from
  // categories.ts so they cannot drift from the real routes.
  const cats = CATEGORIES.map((c) => ({ slug: c.slug, name: c.name }))
  return (
    <footer className="site-footer">
      <div className="site-footer-grid">
        <div className="site-footer-col">
          <p className="site-footer-brand">{BRAND_NAME}</p>
          <p className="site-footer-tag">
            Your local guide to Perry, Georgia businesses.
          </p>
        </div>
        <div className="site-footer-col">
          <h2 className="site-footer-heading">Categories</h2>
          <ul className="site-footer-list">
            {cats.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link to={`/category/${c.slug}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="site-footer-col">
          <h2 className="site-footer-heading">More</h2>
          <ul className="site-footer-list">
            {cats.slice(5).map((c) => (
              <li key={c.slug}>
                <Link to={`/category/${c.slug}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="site-footer-col">
          <h2 className="site-footer-heading">Business owners</h2>
          <ul className="site-footer-list">
            <li>
              <Link to={`/claim-help?from=${from}`}>How to claim your listing</Link>
            </li>
            <li>
              <Link to="/add">Add your business</Link>
            </li>
            <li>
              <Link to="/pricing">Featured listings &amp; packages</Link>
            </li>
            <li>
              <Link to="/privacy">Privacy notice</Link>
            </li>
            <li>
              <Link to="/terms">Terms of use</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="site-footer-bar">
        <p>
          Every listing has a real street address and phone number, compiled
          from public sources.
        </p>
        <p className="site-footer-credits">
          Town photos: Michael Rivera, via Wikimedia Commons (CC BY-SA).
        </p>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.VITE_BASE || '/'}>
      <AdminFlagSync />
      <RouteTitleSync />
      <HashScroll />
      <div className="app">
        <header className="site-header">
          <Link className="site-brand" to="/">
            {BRAND_NAME}
          </Link>
          <nav className="site-nav">
            <AdminNavCta />
            <SiteNav />
          </nav>
        </header>

        <main className="site-main">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/directory" element={<Home />} />
            <Route path="/category/:slug" element={<Category />} />
            <Route path="/listing/:slug" element={<ListingDetail />} />
            <Route path="/claim/:slug" element={<Claim />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/add" element={<AddBusiness />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/claim-help" element={<ClaimHelp />} />
            {/* Piece (d), 2026-09-19: read-only review dashboard, gated on
                the sticky ?admin=1 flag inside the page itself. */}
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        <ChatBot />
      </div>
      {/* Footer sits OUTSIDE the .app width cap: full-bleed navy bar with
          its own centered column, no 100vw scrollbar hack needed. */}
      <SiteFooter />
    </BrowserRouter>
  )
}
