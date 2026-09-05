// "How to claim your listing" help page. A plain guide for business owners.
// The wording mirrors the actual claim flow in Claim.tsx and the consent
// options in src/data/consent.ts, so the steps match what the owner sees.

import { Link, useSearchParams } from 'react-router-dom'

export function ClaimHelp() {
  const [searchParams] = useSearchParams()
  const from = searchParams.get('from')
  // If the user opened this page from a listing detail page, send them back
  // there. Otherwise (or if the value is missing or invalid), go to the
  // directory root.
  const backTo = from && from.startsWith('/listing/') ? from : '/'
  const backLabel = backTo === '/' ? 'Back to the directory' : 'Back to the listing'

  return (
    <div className="page">
      <h1 className="page-title">How to claim your listing</h1>
      <p className="page-sub">
        A short guide for business owners. Claiming is free and takes about two
        minutes.
      </p>
      <p className="page-sub">
        Draft notice. This guide describes how claiming will work once the
        directory is fully built. It is not live yet.
      </p>

      <section className="legal-section">
        <h2 className="legal-heading">What is claiming?</h2>
        <p>
          Claiming your listing means you take control of your business page on
          this directory. Once you claim it, you can fix your information and
          add details. You also make sure no one else can change it.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-heading">Why claim your listing?</h2>
        <ul className="claim-steps">
          <li>Fix your information if anything is wrong.</li>
          <li>Add your hours, photos, and a description.</li>
          <li>Keep your listing accurate so customers find the right details.</li>
          <li>Stop anyone else from changing your page.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2 className="legal-heading">How to claim, step by step</h2>
        <ol className="claim-steps">
          <li>Find your business on the directory.</li>
          <li>Click the "Claim this listing" button.</li>
          <li>Enter your first name and last name.</li>
          <li>
            Tell us your relationship to the business. Pick one: owner,
            co-owner, general manager, or authorized employee.
          </li>
          <li>
            Choose how you want to prove you own the business. Pick one: a phone
            call, an email, or a manual review.
          </li>
          <li>
            Choose whether you want to hear from us. You can say yes to email,
            to text messages, or to phone calls. These are all optional. You can
            skip them.
          </li>
          <li>Check the box to agree to the terms and privacy notice.</li>
          <li>Click "Submit claim."</li>
        </ol>
      </section>

      <section className="legal-section">
        <h2 className="legal-heading">What happens next</h2>
        <p>
          After you submit, we will check that you own the business. Once we
          confirm it, the listing will be yours to manage. You will be able to
          come back any time to update your information.
        </p>
      </section>

      <p className="back-link">
        <Link to={backTo}>{backLabel}</Link>
      </p>
    </div>
  )
}
