import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LISTINGS, type Listing } from '../data/listings'
import { CATEGORIES, categoryBySlug } from '../data/categories'

// The category slugs are the 9 verified values in src/data/categories.ts. The
// subcategory keywords are loose fragments matched against the subcategory
// label (for example "plumb" matches "Plumbing").
interface Synonym {
  category: string
  keywords: string[]
}

const SYNONYMS: Synonym[] = [
  { category: 'restaurants', keywords: ['restaurant', 'food', 'eat', 'dinner', 'lunch', 'breakfast', 'brunch', 'cafe', 'coffee', 'bakery', 'pizza', 'bar', 'brewery', 'diner', 'sushi', 'steak', 'mexican', 'bbq', 'barbecue', 'wine'] },
  { category: 'home-services', keywords: ['plumber', 'plumbing', 'electrician', 'electrical', 'hvac', 'heating', 'air conditioning', 'contractor', 'construction', 'roof', 'landscaping', 'lawn', 'cleaning', 'restoration', 'handyman', 'repair'] },
  { category: 'medical', keywords: ['doctor', 'medical', 'dentist', 'dentistry', 'dental', 'clinic', 'health', 'care', 'chiropractor', 'eye', 'pharmacy', 'therapy', 'hospital', 'urgent', 'senior', 'nursing'] },
  { category: 'legal', keywords: ['lawyer', 'attorney', 'legal', 'law firm', 'law'] },
  { category: 'auto', keywords: ['auto', 'car', 'vehicle', 'repair', 'mechanic', 'dealership', 'car wash', 'detailing', 'tire', 'oil change'] },
  { category: 'retail', keywords: ['shop', 'store', 'retail', 'boutique', 'clothing', 'furniture', 'gift', 'grocery', 'market', 'salon', 'spa', 'beauty', 'pawn', 'laundry', 'convenience', 'hardware'] },
  { category: 'fitness', keywords: ['gym', 'fitness', 'workout', 'yoga', 'pilates', 'golf', 'country club', 'recreation', 'outdoor'] },
  { category: 'professional-services', keywords: ['bank', 'banking', 'financial', 'insurance', 'real estate', 'realtor', 'accountant', 'accounting', 'cpa', 'marketing', 'media', 'technology', 'it', 'manufacturing', 'agriculture', 'forestry', 'utilities', 'energy', 'storage', 'moving', 'funeral', 'security', 'vending', 'transportation'] },
  { category: 'nonprofits', keywords: ['church', 'religious', 'nonprofit', 'community', 'arts', 'culture', 'education', 'school', 'museum', 'historical', 'charity', 'foundation'] },
]

// A visitor word maps to a category slug if it matches a synonym keyword.
function categoryForWord(word: string): string | null {
  const w = word.toLowerCase()
  for (const s of SYNONYMS) {
    if (s.keywords.some((k) => k === w || w.includes(k) || k.includes(w))) {
      return s.category
    }
  }
  return null
}

// A "Chat with us" widget modeled on the reference build (klamathbusinesses.com).
// It is a rule-based keyword matcher, NOT an AI chatbot: no model, no API, no
// network call. A visitor types a few words (for example "plumber" or "brunch")
// and the widget returns the top matching listings. This honors the
// no-OpenAI/Anthropic rule by using no model at all.

// Synonym map: common visitor words -> category slugs + subcategory keywords.
// The category slugs are the 9 verified values in src/data/categories.ts. The
// subcategory keywords are loose fragments matched against the subcategory
// label (for example "plumb" matches "Plumbing").

// Score a listing against the visitor's raw query. Higher is better. We match
// against business_name (highest weight), subcategory, category_slug, and
// description (lowest weight). The `tags` field is empty for all records, so it
// is not scored. Matching is substring-based, which is what lets "dentist"
// match a listing whose name says "Dentistry" and "plumber" match a listing
// whose subcategory is "Plumbing".
function scoreListing(listing: Listing, query: string): number {
  const q = query.toLowerCase()
  const words = q.split(/[^a-z0-9]+/).filter((w) => w.length > 1)
  let score = 0

  const name = listing.business_name.toLowerCase()
  const sub = listing.subcategory.toLowerCase()
  const cat = listing.category_slug.toLowerCase()
  const desc = listing.description.toLowerCase()

  for (const word of words) {
    if (name.includes(word)) score += 4
    if (sub.includes(word)) score += 3
    if (cat.includes(word)) score += 2
    if (desc.includes(word)) score += 1
  }

  // Bonus when a synonym maps the query to this listing's category.
  for (const word of words) {
    const mapped = categoryForWord(word)
    if (mapped && mapped === listing.category_slug) score += 3
  }

  return score
}

function topMatches(query: string, limit = 3): Listing[] {
  const q = query.trim()
  if (!q) return []
  return LISTINGS.map((l) => ({ l, s: scoreListing(l, q) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.l)
}

interface Message {
  from: 'user' | 'bot'
  text: string
  listings?: Listing[]
  categories?: boolean
}

const QUICK_REPLIES = ['Find a business', 'Browse categories', 'Contact us', 'I own a business']

export function ChatBot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      from: 'bot',
      text: 'Hi, I can help you find a local business in Perry. Try typing something like "plumber" or "brunch".',
    },
  ])

  const send = (raw: string) => {
    const text = raw.trim()
    if (!text) return
    const next: Message[] = [...messages, { from: 'user', text }]

    if (text.toLowerCase() === 'browse categories') {
      next.push({ from: 'bot', text: 'Every category in the directory:', categories: true })
    } else if (text.toLowerCase() === 'i own a business') {
      next.push({
        from: 'bot',
        text: 'If you own a business in Perry, you can claim your free listing. Head to the "Add a business" page or find your listing and click "Claim this listing".',
      })
    } else if (text.toLowerCase() === 'contact us') {
      next.push({
        from: 'bot',
        text: 'You can reach us through the "How to claim your listing" page in the footer, or by claiming a listing. There is no phone or email on file yet.',
      })
    } else {
      const matches = topMatches(text)
      if (matches.length === 0) {
        next.push({
          from: 'bot',
          text: 'I could not find a match for that. Try a different word, like "plumber", "dentist", or "coffee".',
        })
      } else {
        next.push({
          from: 'bot',
          text: `Here are the top ${matches.length} match${matches.length === 1 ? '' : 'es'}:`,
          listings: matches,
        })
      }
    }

    setMessages(next)
    setInput('')
  }

  return (
    <div className="chatbot">
      {open && (
        <div className="chatbot-panel" role="dialog" aria-label="Chat with us">
          <div className="chatbot-head">
            <div>
              <div className="chatbot-title">Perry Directory Assistant</div>
              <div className="chatbot-subtitle">Real local businesses, real answers.</div>
            </div>
            <button className="chatbot-close" type="button" onClick={() => setOpen(false)} aria-label="Close chat">
              ×
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chatbot-msg chatbot-msg-${m.from}`}>
                <div className="chatbot-bubble">{m.text}</div>
                {m.categories && (
                  <div className="chatbot-categories">
                    {CATEGORIES.map((c) => (
                      <button key={c.slug} className="chatbot-cat-btn" type="button" onClick={() => send(c.name)}>
                        {c.name}
                      </button>
                    ))}
                  </div>
                )}
                {m.listings && (
                  <div className="chatbot-results">
                    {m.listings.map((l) => {
                      const cat = categoryBySlug(l.category_slug)
                      return (
                        <Link key={l.listing_id} className="chatbot-result" to={`/listing/${l.slug}`} onClick={() => setOpen(false)}>
                          <span className="chatbot-result-name">{l.business_name}</span>
                          <span className="chatbot-result-cat">
                            {cat ? cat.name : l.category_slug}
                            {l.subcategory ? ` · ${l.subcategory}` : ''}
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="chatbot-quick">
            {QUICK_REPLIES.map((q) => (
              <button key={q} className="chatbot-quick-btn" type="button" onClick={() => send(q)}>
                {q}
              </button>
            ))}
          </div>
          <form
            className="chatbot-input-row"
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
          >
            <input
              className="chatbot-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a business or service..."
              aria-label="Type a business or service"
            />
            <button className="chatbot-send" type="submit">
              Send
            </button>
          </form>
          <p className="chatbot-privacy">Your words stay in this browser. Nothing is stored or sent without your choice.</p>
        </div>
      )}
      <button className="chatbot-fab" type="button" onClick={() => setOpen((v) => !v)}>
        {open ? 'Close' : 'Chat with us'}
      </button>
    </div>
  )
}
