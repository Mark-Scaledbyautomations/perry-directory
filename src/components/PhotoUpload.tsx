import { PHOTO_UPLOAD_LABEL, PHOTO_UPLOAD_HINT, PHOTO_LICENSE_LABEL, PHOTO_LICENSE_BODY } from '../data/consent'

// Listing photo upload + rights grant. PREP ONLY (2026-09-17): the field is
// dormant. The app has no backend, so an uploaded file is not stored anywhere;
// the file input and the license checkbox are built now so the claim-time
// collector is ready the moment a destination exists. The license wording is
// the point: it records WHO holds the rights and grants the directory a
// license to show the photo (the strongest legal posture per the photo-sourcing
// research). Nothing here is wired to send data.

export interface PhotoUploadState {
  fileName: string | null
  licenseAccepted: boolean
}

interface PhotoUploadProps {
  value: PhotoUploadState
  onChange: (next: PhotoUploadState) => void
}

export function PhotoUpload({ value, onChange }: PhotoUploadProps) {
  const hasFile = value.fileName !== null

  return (
    <div className="photo-upload-block">
      <label className="field">
        <span>{PHOTO_UPLOAD_LABEL}</span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null
            onChange({ ...value, fileName: file ? file.name : null })
          }}
        />
      </label>
      {hasFile && (
        <p className="photo-file-name" role="note">
          Selected: {value.fileName}
        </p>
      )}
      <p className="photo-hint">{PHOTO_UPLOAD_HINT}</p>

      {hasFile && (
        <label className="consent-option">
          <input
            type="checkbox"
            checked={value.licenseAccepted}
            onChange={(e) => onChange({ ...value, licenseAccepted: e.target.checked })}
          />
          <span className="consent-text">
            <strong>{PHOTO_LICENSE_LABEL}</strong>
            <span className="consent-body">{PHOTO_LICENSE_BODY}</span>
          </span>
        </label>
      )}
    </div>
  )
}
