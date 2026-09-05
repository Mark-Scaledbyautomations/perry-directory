import { useState } from 'react'
import { CATEGORIES } from '../data/categories'

// Add-business flow. Local-only for now: no backend, no persistence beyond
// this demo. Submitting records nothing anywhere.

export function AddBusiness() {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="page">
        <h1 className="page-title">Submission received</h1>
        <p>
          Thank you. Your submission was recorded in this browser only. No data
          was sent anywhere.
        </p>
      </div>
    )
  }

  return (
    <div className="page">
      <h1 className="page-title">Add your business</h1>
      <p className="page-sub">
        List your business in the Perry directory. Free listings are always
        available.
      </p>

      <form
        className="claim-form"
        onSubmit={(e) => {
          e.preventDefault()
          setSubmitted(true)
        }}
      >
        <label className="field">
          <span>Business name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label className="field">
          <span>Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
    </div>
  )
}
