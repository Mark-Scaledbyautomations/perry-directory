import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { LISTINGS } from '../data/listings'
import { ConsentCheckbox, type ConsentState } from '../components/ConsentCheckbox'
import {
  RELATIONSHIP_OPTIONS,
  VERIFICATION_METHOD_OPTIONS,
} from '../data/consent'

// Claim/verify flow. Local-only for now: no backend, no persistence beyond
// this demo. Consent checkboxes attach here (Track 2). Claiming never
// requires marketing consent, but the terms checkbox is required.

export function Claim() {
  const { slug } = useParams<{ slug: string }>()
  const listing = LISTINGS.find((l) => l.slug === slug)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [relationship, setRelationship] = useState('')
  const [verificationMethod, setVerificationMethod] = useState('')
  const [consent, setConsent] = useState<ConsentState>({
    email: false,
    sms: false,
    voice: false,
  })
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!listing) {
    return (
      <div className="page">
        <h1 className="page-title">Listing not found</h1>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="page">
        <h1 className="page-title">Claim submitted</h1>
        <p>
          Thank you. Your claim for {listing.business_name} was recorded in this
          browser only. No data was sent anywhere.
        </p>
      </div>
    )
  }

  return (
    <div className="page">
      <p className="back-link">
        <Link to={`/listing/${listing.slug}`}>Back to listing</Link>
      </p>
      <h1 className="page-title">Claim {listing.business_name}</h1>
      <p className="page-sub">
        Verify ownership and fix your listing. Marketing consent is optional and
        separate.
      </p>

      <div className="claim-explainer">
        <p>
          Claiming your listing means you take control of your business page. It
          is free and takes about two minutes. Once you claim it, you can fix
          your information and stop anyone else from changing it.
        </p>
      </div>

      <form
        className="claim-form"
        onSubmit={(e) => {
          e.preventDefault()
          setSubmitted(true)
        }}
      >
        <label className="field">
          <span>First name</span>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        <label className="field">
          <span>Last name</span>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>

        <fieldset className="field">
          <legend>Your relationship to this business</legend>
          {RELATIONSHIP_OPTIONS.map((opt) => (
            <label key={opt} className="radio-option">
              <input
                type="radio"
                name="relationship"
                value={opt}
                checked={relationship === opt}
                onChange={() => setRelationship(opt)}
                required
              />
              <span>{opt}</span>
            </label>
          ))}
        </fieldset>

        <fieldset className="field">
          <legend>How would you like to verify this listing?</legend>
          {VERIFICATION_METHOD_OPTIONS.map((opt) => (
            <label key={opt.value} className="radio-option">
              <input
                type="radio"
                name="verification"
                value={opt.value}
                checked={verificationMethod === opt.value}
                onChange={() => setVerificationMethod(opt.value)}
                required
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </fieldset>

        <ConsentCheckbox
          value={consent}
          onChange={setConsent}
          termsAccepted={termsAccepted}
          onTermsChange={setTermsAccepted}
        />

        <button
          className="btn btn-primary"
          type="submit"
          disabled={!termsAccepted}
        >
          Submit claim
        </button>
      </form>

      {listing.website_status && (
        <div className="website-status-note" role="note">
          {listing.website_status === 'broken' ? (
            <span>
              We noticed that the website we have on file for your business may
              not be working. Once done claiming this listing, we can help you
              get it fixed.
            </span>
          ) : (
            <span>
              We noticed that the website we have on file for your business may
              not be showing your business. Once done claiming this listing, we
              can help you correct it.
            </span>
          )}
        </div>
      )}
    </div>
  )
}
