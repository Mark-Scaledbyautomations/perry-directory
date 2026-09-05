// Placeholder legal content. Final wording is gated on Tina's sign-off.
// This file holds the Terms of Use and Privacy Notice structure so the final
// wording replaces it in one pass. Nothing here is final legal language and
// nothing here is deployed as such. The facts stated below match the current
// build (free listings, the claim process, and the three optional marketing
// consent choices). Specific values that need a decision, like the operator
// name, a postal address, and a contact email, are marked as pending.

export interface LegalSection {
  heading: string
  paragraphs: string[]
}

export const LEGAL_DRAFT_NOTICE =
  'Draft notice. This page is placeholder content. Final wording is pending legal review.'

export const TERMS_SECTIONS: LegalSection[] = [
  {
    heading: 'Acceptance of these terms',
    paragraphs: [
      'By using this directory, you agree to these terms of use. If you do not agree, do not use this directory.',
    ],
  },
  {
    heading: 'What this directory is',
    paragraphs: [
      'This website is a directory of local businesses in Perry, Georgia. It helps residents and visitors find local businesses. The businesses listed here are separate from the directory. The directory does not own or operate them.',
    ],
  },
  {
    heading: 'Listings and accuracy',
    paragraphs: [
      'We build listings from public sources and from information the businesses provide. We do not promise that every listing is complete or current. A business can claim its listing to correct its information. If you see an error, you can report it.',
    ],
  },
  {
    heading: 'Claiming a listing',
    paragraphs: [
      'A business owner or an authorized person can claim a listing. To claim, you confirm your relationship to the business and choose a way to verify it. You confirm that you are authorized to manage the listing. Claiming a listing does not require you to accept marketing messages.',
    ],
  },
  {
    heading: 'Your responsibilities',
    paragraphs: [
      'You agree to provide accurate information. You agree not to misuse the directory. You agree not to submit information for a business you are not authorized to represent.',
    ],
  },
  {
    heading: 'Intellectual property',
    paragraphs: [
      'The directory design and its original content belong to the directory operator. Business names, logos, and descriptions belong to their owners. We list them to help people find the businesses.',
    ],
  },
  {
    heading: 'No warranty',
    paragraphs: [
      'The directory is provided as is. We do not promise that it is free of errors or always available.',
    ],
  },
  {
    heading: 'Limitation of liability',
    paragraphs: [
      'To the extent the law allows, the directory operator is not liable for losses that come from using the directory or relying on a listing.',
    ],
  },
  {
    heading: 'Changes to these terms',
    paragraphs: [
      'We may update these terms. We will post the updated terms on this page.',
    ],
  },
  {
    heading: 'Contact',
    paragraphs: [
      'Questions about these terms can be sent to [contact email pending]. The directory is operated by [operator name pending]. You can write to us at [postal address pending].',
    ],
  },
]

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    heading: 'What this notice covers',
    paragraphs: [
      'This notice explains what information the directory collects and how it is used.',
    ],
  },
  {
    heading: 'Information we collect',
    paragraphs: [
      'We collect business information for listings: name, address, phone, email, website, and description. When someone claims a listing, we collect their name and their relationship to the business. We also record their chosen verification method. We record marketing consent choices when they are given.',
    ],
  },
  {
    heading: 'How we use information',
    paragraphs: [
      'We use business information to build and maintain listings. We use claim information to verify who manages a listing. We use marketing consent to decide whether we may contact someone about their listing and related services.',
    ],
  },
  {
    heading: 'Marketing consent',
    paragraphs: [
      'Marketing contact is optional and separate from claiming a listing. A person can agree to email, to text messages, or to phone calls. Phone calls may include automated or AI-assisted calls. Each choice is recorded with a date and a version. A person can withdraw any choice at any time.',
    ],
  },
  {
    heading: 'How we share information',
    paragraphs: [
      'We do not sell personal information. We share information only as needed to run the directory, or when the law requires it.',
    ],
  },
  {
    heading: 'How long we keep information',
    paragraphs: [
      'We keep listing information while the listing is active. We keep consent records so we can honor a person\u2019s choices. The exact retention period is pending legal review.',
    ],
  },
  {
    heading: 'Your choices',
    paragraphs: [
      'You can ask us to correct or remove your information. You can withdraw marketing consent at any time. The exact way to make these requests is pending.',
    ],
  },
  {
    heading: 'Contact',
    paragraphs: [
      'Questions about this notice can be sent to [contact email pending]. The directory is operated by [operator name pending]. You can write to us at [postal address pending].',
    ],
  },
]
