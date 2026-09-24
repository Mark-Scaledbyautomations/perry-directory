import { useEffect, useState } from 'react'
import type { Listing } from './listings'

// Lazily-loaded directory data. The 278 listings (with their descriptions)
// used to be inlined into the JS bundle as a 278-item array (~335 kB of
// source, ~115 kB after minification), which is what pushed the bundle over
// Vite's 500 kB warning. They now live in a separate listings.json served
// from public/ and fetched once at runtime. The fetch is cached at module
// scope, so every component that calls useListings() shares a single request
// instead of firing one per component.
//
// Returns [listings, loaded]: `listings` is [] until the fetch resolves, and
// `loaded` flips true once the data is in. Pages that render an error state
// on an empty array (ListingDetail "not found", Claim "not found") gate on
// `loaded` so they do not flash the wrong message during the sub-second fetch.

let cache: Listing[] | null = null
let pending: Promise<Listing[]> | null = null

function loadListings(): Promise<Listing[]> {
  if (cache) return Promise.resolve(cache)
  if (pending) return pending
  pending = fetch(`${import.meta.env.BASE_URL}listings.json`)
    .then((res) => {
      if (!res.ok) throw new Error(`listings.json failed: ${res.status}`)
      return res.json() as Promise<Listing[]>
    })
    .then((data) => {
      cache = data
      return cache
    })
    .catch((err) => {
      pending = null // allow a retry on the next call instead of caching a failure
      throw err
    })
  return pending
}

export function useListings(): [Listing[], boolean] {
  const [listings, setListings] = useState<Listing[]>(cache ?? [])
  const [loaded, setLoaded] = useState<boolean>(cache !== null)

  useEffect(() => {
    if (cache) return
    let active = true
    loadListings().then((data) => {
      if (active) {
        setListings(data)
        setLoaded(true)
      }
    })
    return () => {
      active = false
    }
  }, [])

  return [listings, loaded]
}
