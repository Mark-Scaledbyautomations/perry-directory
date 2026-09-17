// Consent checkbox wording. PLACEHOLDER legal text, built to accept Tina's
// final wording in one pass. The strings below are the exact wording from the
// Klamath Falls build (verified 2026-08-29), kept here as the placeholder
// until Tina signs off. Do not deploy as final legal language.

export const CONSENT_VERSION = 'v0.9-draft-pending-legal-review'

export interface ConsentOption {
  id: 'email' | 'sms' | 'voice'
  label: string
  body: string
}

// Three separate OPTIONAL marketing checkboxes. Claiming never requires these.
export const CONSENT_OPTIONS: ConsentOption[] = [
  {
    id: 'email',
    label: 'Email updates (optional)',
    body: 'You may email me about my listing, directory features, and services for local businesses. I can unsubscribe with one click at any time.',
  },
  {
    id: 'sms',
    label: 'Text messages (SMS) (optional)',
    body: 'You may text me about my listing and related offers. Message and data rates may apply. I can reply STOP at any time to end texts.',
  },
  {
    id: 'voice',
    label: 'Phone calls, including automated or AI-assisted calls (optional)',
    body: "You may call me at the number I provided, including with automated or AI-assisted calling technology, about my listing and related services. I can say 'do not call' on any call and it will be honored immediately.",
  },
]

// The REQUIRED terms checkbox. This is the authorization-to-manage consent,
// separate from the optional marketing checkboxes above. It links to the
// terms and privacy pages.
export const TERMS_LABEL = 'Terms & privacy (required)'
export const TERMS_BODY_PREFIX = 'I confirm I am authorized to manage this listing, and I accept the'

// Relationship to the business (fixed options, feeds relationship_to_business).
export const RELATIONSHIP_OPTIONS = [
  'Owner',
  'Co-owner',
  'General manager',
  'Authorized employee',
] as const

// Verification method (fixed options, feeds verification_method).
export const VERIFICATION_METHOD_OPTIONS = [
  { value: 'phone', label: 'Phone call' },
  { value: 'email', label: 'Email' },
  { value: 'manual', label: 'Manual review' },
] as const

// Listing photo + rights grant (PREP ONLY, 2026-09-17). The claim-time photo
// field is dormant: there is no backend yet, so an uploaded file is not stored
// anywhere. These strings are placeholders and wait on Tina's legal sign-off
// like the consent strings above. The license wording is the important part:
// it records WHO holds the rights and grants the directory a license to show
// the photo, which the photo-sourcing research found is the strongest legal
// posture (see research/listing-photo-sourcing-2026-09-17.md section 5).
export const PHOTO_UPLOAD_LABEL = 'Listing photo (optional)'
export const PHOTO_UPLOAD_HINT =
  'Add a photo of your business. We only use a photo you provide or approve, never one copied from another site.'
export const PHOTO_LICENSE_LABEL = 'Photo rights (required if you add a photo)'
export const PHOTO_LICENSE_BODY =
  'I confirm I own this photo or have the owner\'s permission to share it, and I grant this directory a license to show it on my listing.'
