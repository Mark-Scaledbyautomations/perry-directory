import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CONSENT_OPTIONS,
  CONSENT_VERSION,
  TERMS_LABEL,
  TERMS_BODY_PREFIX,
  type ConsentOption,
} from '../data/consent'

// Three separate optional consent checkboxes (email, SMS, voice) plus a
// required terms checkbox. Each optional consent is timestamped and versioned.
// PLACEHOLDER legal text; final wording swaps in one pass via
// src/data/consent.ts. Built and tested internally only, never deployed as
// final legal language.

export interface ConsentState {
  email: boolean
  sms: boolean
  voice: boolean
}

interface ConsentCheckboxProps {
  value: ConsentState
  onChange: (next: ConsentState) => void
  termsAccepted: boolean
  onTermsChange: (next: boolean) => void
}

export function ConsentCheckbox({
  value,
  onChange,
  termsAccepted,
  onTermsChange,
}: ConsentCheckboxProps) {
  const [timestamp] = useState<string>(() => new Date().toISOString())

  const toggle = (id: ConsentOption['id']) => {
    onChange({ ...value, [id]: !value[id] })
  }

  return (
    <div className="consent-block">
      <p className="consent-note">
        Marketing consent is optional and separate. Claiming never requires it.
      </p>
      {CONSENT_OPTIONS.map((opt) => (
        <label key={opt.id} className="consent-option">
          <input
            type="checkbox"
            checked={value[opt.id]}
            onChange={() => toggle(opt.id)}
          />
          <span className="consent-text">
            <strong>{opt.label}</strong>
            <span className="consent-body">{opt.body}</span>
          </span>
        </label>
      ))}

      <label className="consent-option consent-required">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => onTermsChange(e.target.checked)}
        />
        <span className="consent-text">
          <strong>{TERMS_LABEL}</strong>
          <span className="consent-body">
            {TERMS_BODY_PREFIX}{' '}
            <Link
              to="/terms"
              onClick={(e) => e.stopPropagation()}
            >
              terms
            </Link>{' '}
            and{' '}
            <Link
              to="/privacy"
              onClick={(e) => e.stopPropagation()}
            >
              privacy notice
            </Link>
            .
          </span>
        </span>
      </label>

      <p className="consent-meta">
        Recorded {new Date(timestamp).toLocaleString()} · consent version {CONSENT_VERSION}
      </p>
    </div>
  )
}
