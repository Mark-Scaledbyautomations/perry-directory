import { useState } from 'react'

// A phone number with a small copy button. Uses the Clipboard API when
// available, with a textarea fallback for older browsers. The button shows
// "Copied" for a moment after a successful copy.
export function CopyPhone({ phone }: { phone: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    const text = phone
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Copy failed; leave the button as-is so the user can copy manually.
    }
  }

  return (
    <span className="copy-phone">
      <span className="copy-phone-number">{phone}</span>
      <button
        className="copy-phone-btn"
        type="button"
        onClick={copy}
        aria-label={`Copy phone number ${phone}`}
        title="Copy phone number"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </span>
  )
}
