import { useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useListings } from '../data/useListings'
import type { Listing } from '../data/listings'
import { CATEGORIES } from '../data/categories'
import { isAdminMode, SCOPE_LABEL, WEBSITE_STATUS_LABEL } from '../components/ListingCard'
import { isAeoDescription } from '../components/DescriptionBlock'
import { BRAND_NAME } from '../data/brand'

// UI buildout piece (d), 2026-09-19: the admin review dashboard at /admin.
// Ported from the OpenDesign artifact admin-dashboard-template.html (run
// bc4fe817, project perry-landing-ui-758e, archived under
// research/ui-buildout-od-2026-09-19-admin/). Read-only by design: the app
// has no backend, so nothing on this page edits or exports data. Every
// number is computed from LISTINGS at render; none are hardcoded from the
// artifact (standing port rule). Class names carry the adm- prefix. As of
// 2026-09-19 this strip's UI is shared: the directory page's admin banner
// reuses adm-strip/adm-tag/adm-note/adm-exit (Arbo's merge), replacing the
// old amber .admin-banner style, which was retired.
//
// The gate: same sticky ?admin=1 flag as everywhere else (AdminFlagSync
// pins it, isAdminMode reads it). Without it, the page says admin mode is
// off and offers the switch. This is a review aid, not authentication.

// Manual snapshot date of the dataset audit this screen reports. Bump it
// together with a full data pass (scripts/audit_full.py), never claim
// automatic freshness.
const SNAPSHOT_DATE = '2026-09-19'

function pct(n: number, total: number): string {
  return `${Math.round((n / total) * 100)}%`
}

export function Admin() {
  const [searchParams] = useSearchParams()
  const isAdmin = isAdminMode(searchParams)
  const [listings] = useListings()

  // This page owns its title (paired with the RouteTitleSync skip in App.tsx)
  useEffect(() => {
    document.title = `Review dashboard | ${BRAND_NAME}`
  }, [])

  const stats = useMemo(() => {
    const total = listings.length
    const count = (pred: (l: Listing) => boolean) =>
      listings.filter(pred).length
    const has = (v: string | null) => Boolean(v && v.trim())

    // KPI coverage (field non-empty across all listings).
    const kpis = [
      { label: 'Listings', value: total },
      { label: 'Phone', value: count((l) => has(l.phone)) },
      { label: 'Email', value: count((l) => has(l.email)) },
      { label: 'Website', value: count((l) => has(l.website)) },
      { label: 'Street address', value: count((l) => has(l.street_address)) },
      { label: 'Logo', value: count((l) => has(l.image)) },
    ]

    // Category distribution in CATEGORIES order (sortOrder), names verbatim.
    const byCategory = CATEGORIES.map((c) => ({
      name: c.name,
      value: count((l) => l.category_slug === c.slug),
    }))

    // Website status: the same buckets the grid filters use. "Site OK"
    // means a website with no status flag; no-website is its own line so
    // the panel sums to the total (the 2026-09-12 admin-filter design).
    const byWebsite = [
      { name: 'Site OK', value: count((l) => has(l.website) && !l.website_status) },
      ...(['broken', 'domain-lost', 'rebranded', 'platform-link'] as const).map((s) => ({
        name: WEBSITE_STATUS_LABEL[s],
        value: count((l) => l.website_status === s),
      })),
      { name: 'No website', value: count((l) => !has(l.website)) },
    ]

    const byScope = (['local-independent', 'local-franchisee', 'corporate-location'] as const).map(
      (s) => ({ name: SCOPE_LABEL[s], value: count((l) => l.listing_scope === s) }),
    )

    const aeo = count((l) => Boolean(l.description) && isAeoDescription(l.description))
    const byDescription = [
      { name: 'AEO-structured', value: aeo },
      { name: 'Plain', value: total - aeo },
    ]

    const premium = count((l) => l.listing_tier === 'premium')
    const claimed = count((l) => l.claim_status === 'claimed')
    const freeTier = count((l) => l.listing_tier === 'free')
    const unclaimed = count((l) => l.claim_status === 'unclaimed')

    // Review lists, derived from the data (the artifact's names were
    // correct at run time; the source of truth is this computation).
    const noPhone = listings.filter((l) => !has(l.phone))
    const noStreet = listings.filter((l) => !has(l.street_address))
    const emailGroups = computeEmailGroups(listings)

    return {
      total,
      kpis,
      byCategory,
      byWebsite,
      byScope,
      byDescription,
      premium,
      freeTier,
      claimed,
      unclaimed,
      noPhone,
      noStreet,
      emailGroups,
    }
  }, [listings])

  if (!isAdmin) {
    return (
      <div className="page">
        <h1 className="page-title">Review dashboard</h1>
        <p className="page-sub">
          Admin mode is off, so this screen shows nothing but this notice. It
          is a review aid for the directory operator, not a public page.
        </p>
        <p>
          <Link className="btn-primary-inline" to="/admin?admin=1">
            Turn on admin mode
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="page adm-page">
      <div className="adm-strip" role="status">
        <span className="adm-tag">Admin mode</span>
        <p className="adm-note">This screen reads the directory dataset. It does not change anything.</p>
        <Link className="adm-exit" to="/directory?admin=0">
          Exit admin mode
        </Link>
      </div>

      <div className="adm-head">
        <h1 className="adm-title">Review dashboard</h1>
        <p className="adm-sub">
          The full picture of the directory dataset: field coverage, how
          listings are distributed, and the small review lists kept for the
          record.
        </p>
        <p className="adm-snapshot">Updated {SNAPSHOT_DATE} data snapshot.</p>
      </div>

      <section aria-label="Field coverage summary">
        <div className="adm-kpi-grid">
          {stats.kpis.map((k) => (
            <div className="adm-kpi-card" key={k.label}>
              <p className="adm-kpi-label">{k.label}</p>
              <p className="adm-kpi-row">
                <span className="adm-kpi-value">
                  {k.value}
                  {k.label !== 'Listings' && (
                    <span className="adm-kpi-of"> of {stats.total}</span>
                  )}
                </span>
                {k.label !== 'Listings' && (
                  <span className="adm-kpi-pct">{pct(k.value, stats.total)}</span>
                )}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section aria-label="Dataset distributions">
        <div className="adm-dist-grid">
          <div className="adm-panel">
            <h2 className="adm-panel-title">Category distribution</h2>
            <ul className="adm-stat-list">
              {stats.byCategory.map((r) => (
                <li className="adm-stat-row" key={r.name}>
                  <span className="adm-stat-name">{r.name}</span>
                  <span className="adm-stat-num">{r.value}</span>
                </li>
              ))}
            </ul>
            <p className="adm-panel-note">
              Nine categories cover the whole dataset. The counts are listings
              per category.
            </p>
          </div>

          <div className="adm-stack">
            <StatPanel title="Website status" rows={stats.byWebsite} />
            <StatPanel title="Scope distribution" rows={stats.byScope} />
            <StatPanel title="Description type" rows={stats.byDescription} />
          </div>
        </div>
      </section>

      <section aria-label="Plans and claims">
        <div className="adm-tier-grid">
          <div className="adm-panel">
            <h2 className="adm-panel-title">Plan distribution</h2>
            <div className="adm-mix-bar" aria-hidden="true">
              {stats.premium > 0 && (
                <div
                  className="adm-mix-seg adm-mix-seg-paid"
                  style={{ width: `${(stats.premium / stats.total) * 100}%` }}
                />
              )}
              <div
                className="adm-mix-seg adm-mix-seg-free"
                style={{ width: `${(stats.freeTier / stats.total) * 100}%` }}
              />
            </div>
            <ul className="adm-stat-list">
              <li className="adm-stat-row">
                <span className="adm-stat-name adm-legend">
                  <span className="adm-swatch adm-swatch-paid" aria-hidden="true" />
                  Premium
                </span>
                <span className="adm-stat-num">{stats.premium}</span>
              </li>
              <li className="adm-stat-row">
                <span className="adm-stat-name adm-legend">
                  <span className="adm-swatch adm-swatch-free" aria-hidden="true" />
                  Free
                </span>
                <span className="adm-stat-num">{stats.freeTier}</span>
              </li>
            </ul>
            <p className="adm-zero-note">
              {stats.premium === 0
                ? 'No listing is on a premium package yet. The bar fills as owners buy packages.'
                : 'Share of listings on each plan, from the directory data.'}
            </p>
          </div>
          <div className="adm-panel">
            <h2 className="adm-panel-title">Claim status</h2>
            <div className="adm-mix-bar" aria-hidden="true">
              {stats.claimed > 0 && (
                <div
                  className="adm-mix-seg adm-mix-seg-paid"
                  style={{ width: `${(stats.claimed / stats.total) * 100}%` }}
                />
              )}
              <div
                className="adm-mix-seg adm-mix-seg-free"
                style={{ width: `${(stats.unclaimed / stats.total) * 100}%` }}
              />
            </div>
            <ul className="adm-stat-list">
              <li className="adm-stat-row">
                <span className="adm-stat-name adm-legend">
                  <span className="adm-swatch adm-swatch-paid" aria-hidden="true" />
                  Claimed
                </span>
                <span className="adm-stat-num">{stats.claimed}</span>
              </li>
              <li className="adm-stat-row">
                <span className="adm-stat-name adm-legend">
                  <span className="adm-swatch adm-swatch-free" aria-hidden="true" />
                  Unclaimed
                </span>
                <span className="adm-stat-num">{stats.unclaimed}</span>
              </li>
            </ul>
            <p className="adm-zero-note">
              {stats.claimed === 0
                ? 'No owner has claimed a listing yet. The bar fills as claims come in.'
                : 'Share of listings an owner has claimed, from the directory data.'}
            </p>
          </div>
        </div>
      </section>

      <section className="adm-review-section" aria-labelledby="adm-review-heading">
        <h2 className="adm-review-heading" id="adm-review-heading">Review lists</h2>
        <p className="adm-review-intro">
          The data quality cases worth knowing about. Each name opens that
          listing page.
        </p>
        <div className="adm-review-grid">
          <NameList title={`No phone number (${stats.noPhone.length})`} listings={stats.noPhone} />
          <div className="adm-stack">
            <NameList
              title={`No street address (${stats.noStreet.length})`}
              listings={stats.noStreet}
            />
            <div className="adm-panel">
              <h3 className="adm-review-title">
                Shared email addresses ({stats.emailGroups.length}{' '}
                {stats.emailGroups.length === 1 ? 'group' : 'groups'})
              </h3>
              <ul className="adm-stat-list">
                {stats.emailGroups.map((g) => (
                  <li className="adm-shared-group" key={g.email}>
                    <span className="adm-shared-email">{g.email}</span>
                    <span className="adm-shared-names">
                      Shared by{' '}
                      {g.listings.map((l, i) => (
                        <span key={l.slug}>
                          {i > 0 && (i === g.listings.length - 1 ? ' and ' : ', ')}
                          <Link to={`/listing/${l.slug}`}>{l.business_name}</Link>
                        </span>
                      ))}
                      .
                    </span>
                  </li>
                ))}
              </ul>
              <p className="adm-review-note">
                The {stats.emailGroups.length}{' '}
                {stats.emailGroups.length === 1 ? 'group was' : 'groups were'}{' '}
                checked by hand during the {SNAPSHOT_DATE} data pass. Each one
                is a legitimate multi-unit or branch case, so they stay on
                this page for the record.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="adm-panel adm-field-panel" aria-labelledby="adm-field-heading">
        <h2 className="adm-panel-title" id="adm-field-heading">Field availability</h2>
        <p className="adm-field-copy">
          This dataset does not collect opening hours, map coordinates, or
          tags. That is why this screen has no columns for them. They appear
          when the data exists.
        </p>
      </section>
    </div>
  )
}

// One "name + count" distribution panel (website status, scope, description).
function StatPanel(props: { title: string; rows: { name: string; value: number }[] }) {
  return (
    <div className="adm-panel">
      <h2 className="adm-panel-title">{props.title}</h2>
      <ul className="adm-stat-list">
        {props.rows.map((r) => (
          <li className="adm-stat-row" key={r.name}>
            <span className="adm-stat-name">{r.name}</span>
            <span className="adm-stat-num">{r.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// A review list of business names, each linking to its listing page.
function NameList(props: { title: string; listings: Listing[] }) {
  return (
    <div className="adm-panel">
      <h3 className="adm-review-title">{props.title}</h3>
      <ul className="adm-stat-list">
        {props.listings.map((l) => (
          <li key={l.slug}>
            <Link className="adm-review-link" to={`/listing/${l.slug}`}>
              {l.business_name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Emails carried by more than one listing, in the passed list's order.
// Derived, not hardcoded: if the CSV changes, this list changes with it.
// (Currently 3 groups, all reviewed as legitimate multi-unit or branch
// cases.) Plain function, not a hook: it is called inside the page's stats
// useMemo.
function computeEmailGroups(listings: Listing[]) {
  const byEmail = new Map<string, Listing[]>()
  for (const l of listings) {
    const e = (l.email || '').trim().toLowerCase()
    if (!e) continue
    const arr = byEmail.get(e) || []
    arr.push(l)
    byEmail.set(e, arr)
  }
  const groups: { email: string; listings: Listing[] }[] = []
  for (const [email, listings] of byEmail) {
    if (listings.length > 1) groups.push({ email, listings })
  }
  return groups
}
