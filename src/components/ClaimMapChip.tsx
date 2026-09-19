// Mini map card for the claim band badge (Arbo 2026-09-19, reference
// match): beige map tile with faint street lines, a blue location pin
// over a storefront mark, and a "Perry" label. Pure inline SVG, no
// image file, aria-hidden (decorative; the headline carries the meaning).

export function ClaimMapChip({ size = 56 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <rect width="56" height="56" fill="#efe9dc" />
      {/* street lines */}
      <g stroke="#dcd4c2" strokeWidth="3">
        <path d="M0 18h56M0 40h56M16 0v56M40 0v56" />
      </g>
      <g stroke="#e6dfcf" strokeWidth="1.5">
        <path d="M0 28h56M28 0v56" />
      </g>
      {/* pin */}
      <path
        d="M28 12c-5.5 0-10 4.4-10 9.9 0 7.2 10 17.1 10 17.1s10-9.9 10-17.1C38 16.4 33.5 12 28 12Z"
        fill="#1a7fd6"
      />
      {/* tiny storefront inside the pin */}
      <g fill="#fff">
        <rect x="24" y="19.5" width="8" height="6" rx="0.8" />
        <path d="M23 18.5h10l-1.2-2.6a1.2 1.2 0 0 0-1.1-.7h-5.4c-.5 0-.9.3-1.1.7L23 18.5Z" />
      </g>
      {/* label */}
      <text
        x="28"
        y="50.5"
        textAnchor="middle"
        fontFamily="inherit"
        fontSize="9"
        fontWeight="700"
        fill="#3b4557"
      >
        Perry
      </text>
    </svg>
  )
}
