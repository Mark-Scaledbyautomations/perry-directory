// Renders a listing description. If the description is AEO-structured (it has
// "Services", "FAQ", and "Summary" headings), it is parsed into styled blocks:
// an opening paragraph, a bulleted services list, question-and-answer lines,
// and a summary. A plain (non-AEO) description renders as a single paragraph,
// preserving newlines. This keeps the card and the detail page consistent.
//
// The `expanded` prop drives the "See more" clamp. Plain descriptions use the
// existing -webkit-line-clamp; AEO descriptions use a max-height clamp, because
// line-clamp does not work on structured (multi-block) content.

const HEADINGS = ['Services', 'FAQ', 'Summary']

function isAeo(text: string): boolean {
  return HEADINGS.every((h) => text.split('\n').some((l) => l.trim() === h))
}

export function DescriptionBlock({ text, expanded }: { text: string; expanded: boolean }) {
  if (!text) return null

  const clampClass = expanded ? ' is-expanded' : ''

  if (!isAeo(text)) {
    return <p className={`listing-desc${clampClass}`}>{text}</p>
  }

  const lines = text.split('\n')
  let current: 'opening' | 'services' | 'faq' | 'summary' = 'opening'
  let services: string[] = []
  let faq: string[] = []
  let summary: string[] = []
  let opening: string[] = []

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue
    if (line === 'Services') {
      current = 'services'
      continue
    }
    if (line === 'FAQ') {
      current = 'faq'
      continue
    }
    if (line === 'Summary') {
      current = 'summary'
      continue
    }
    if (current === 'opening') opening.push(line)
    else if (current === 'services') services.push(line)
    else if (current === 'faq') faq.push(line)
    else summary.push(line)
  }

  return (
    <div className={`listing-desc listing-desc-aeo${clampClass}`}>
      {opening.length > 0 && <p className="aeo-opening">{opening.join(' ')}</p>}
      {services.length > 0 && (
        <>
          <h4 className="aeo-heading">Services</h4>
          <ul className="aeo-list">
            {services.map((s, i) => (
              <li key={i}>{s.replace(/^- /, '')}</li>
            ))}
          </ul>
        </>
      )}
      {faq.length > 0 && (
        <>
          <h4 className="aeo-heading">FAQ</h4>
          <dl className="aeo-faq">
            {faq.map((q, i) => {
              const m = q.match(/^Q:\s*(.+?)\s+A:\s*(.+)$/)
              if (!m) return null
              return (
                <div key={i} className="aeo-qa">
                  <dt>{m[1]}</dt>
                  <dd>{m[2]}</dd>
                </div>
              )
            })}
          </dl>
        </>
      )}
      {summary.length > 0 && (
        <>
          <h4 className="aeo-heading">Summary</h4>
          <p className="aeo-summary">{summary.join(' ')}</p>
        </>
      )}
    </div>
  )
}
