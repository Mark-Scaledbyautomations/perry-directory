// The 9 categories, verified against the live klamathbusinesses.com bundle
// (index-BFqQiafp.js, fetched 2026-08-29). Exact slug + name + sortOrder.
// Do not re-derive. See docs/perry-build-workflow.md, Reference architecture.

export interface Category {
  slug: string
  name: string
  description: string
  sortOrder: number
}

export const CATEGORIES: Category[] = [
  {
    slug: 'restaurants',
    name: 'Restaurants & Food',
    description: 'Restaurants, cafes, bakeries, breweries, and food trucks in Perry.',
    sortOrder: 1,
  },
  {
    slug: 'home-services',
    name: 'Home Services',
    description: 'Plumbers, electricians, HVAC, and contractors serving Perry.',
    sortOrder: 2,
  },
  {
    slug: 'medical',
    name: 'Medical & Dental',
    description: 'Dentists, clinics, and health care providers in Perry.',
    sortOrder: 3,
  },
  {
    slug: 'legal',
    name: 'Legal',
    description: 'Attorneys and law firms practicing in Perry and Houston County.',
    sortOrder: 4,
  },
  {
    slug: 'auto',
    name: 'Automotive',
    description: 'Auto repair, maintenance, and dealerships in Perry.',
    sortOrder: 5,
  },
  {
    slug: 'retail',
    name: 'Retail & Shopping',
    description: 'Local shops, bookstores, gifts, and specialty retail in Perry.',
    sortOrder: 6,
  },
  {
    slug: 'fitness',
    name: 'Fitness & Recreation',
    description: 'Gyms, fitness centers, and recreation in Perry.',
    sortOrder: 7,
  },
  {
    slug: 'professional-services',
    name: 'Professional Services',
    description: 'Accountants, insurance agents, financial advisors, and consultants.',
    sortOrder: 8,
  },
  {
    slug: 'nonprofits',
    name: 'Nonprofits & Community',
    description: 'Nonprofits, museums, and community organizations in Perry.',
    sortOrder: 9,
  },
]

export function categoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}
