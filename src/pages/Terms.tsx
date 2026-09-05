// Terms of use page. Renders placeholder structure from src/data/legal.ts.
// Final legal wording is gated on Tina's sign-off and replaces legal.ts in
// one pass. Nothing here is final legal language.

import { LEGAL_DRAFT_NOTICE, TERMS_SECTIONS } from '../data/legal'

export function Terms() {
  return (
    <div className="page">
      <h1 className="page-title">Terms of use</h1>
      <p className="page-sub">{LEGAL_DRAFT_NOTICE}</p>
      {TERMS_SECTIONS.map((section) => (
        <section key={section.heading} className="legal-section">
          <h2 className="legal-heading">{section.heading}</h2>
          {section.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </section>
      ))}
    </div>
  )
}
