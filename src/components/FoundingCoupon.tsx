import { useState } from 'react'
import { FOUNDING_COUPON_CODE } from '../data/pricing'

// Founding-member coupon: logic hook + shared row UI, used by the pricing
// page and the business-owners guide so the two cannot drift (extracted
// from Pricing.tsx, 2026-09-19). Display reveal only: applying the code
// shows the founding price on the Premium card; the real price is enforced
// at the payment link (Phase 3).

export function useFoundingCoupon() {
  const [coupon, setCoupon] = useState('')
  const [applied, setApplied] = useState(false)
  const [error, setError] = useState('')

  const apply = () => {
    if (coupon.trim().toUpperCase() === FOUNDING_COUPON_CODE) {
      setApplied(true)
      setError('')
    } else {
      setApplied(false)
      setError('That code is not recognized')
    }
  }

  return { coupon, setCoupon, applied, error, apply }
}

export function CouponRow({
  coupon,
  setCoupon,
  apply,
  error,
  applied,
  successText,
}: {
  coupon: string
  setCoupon: (v: string) => void
  apply: () => void
  error: string
  applied: boolean
  successText: string
}) {
  return (
    <>
      <div className="coupon-row">
        <input
          className="coupon-input"
          type="text"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          placeholder="Founding member code"
          aria-label="Founding member code"
        />
        <button className="coupon-apply" onClick={apply}>
          Apply
        </button>
      </div>
      {error && <p className="coupon-error">{error}</p>}
      {applied && <p className="coupon-success">{successText}</p>}
    </>
  )
}
