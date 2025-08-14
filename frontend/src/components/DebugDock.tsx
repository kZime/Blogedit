import React, { useState } from 'react'
import { useListNotes, useUpdateNote } from '../api/gen/client'

export default function DebugDock() {
  // only show in development
  if (!import.meta.env.DEV) return null

  const [open, setOpen] = useState(false)

  // fetch when open, avoid fetching every render
  const { data, isLoading } = useListNotes(
    { params: { limit: 5, offset: 0 } },
    { enabled: open }
  )

  const update = useUpdateNote()

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed',
          right: 16,
          bottom: 16,
          zIndex: 9999,
          padding: '8px 12px',
          borderRadius: 8,
          border: '1px solid #ccc',
          background: '#fff',
          cursor: 'pointer'
        }}
      >
        {open ? 'Close Debug' : 'Debug'}
      </button>

      {open && (
        <div
          style={{
            position: 'fixed',
            right: 16,
            bottom: 64,
            zIndex: 9999,
            width: 360,
            maxHeight: 420,
            overflow: 'auto',
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: 12,
            padding: 12,
            boxShadow: '0 8px 24px rgba(0,0,0,.12)',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: 12
          }}
        >
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <button
              onClick={() => {
                update.mutate({
                  id: 1, // TODO: use current selected noteId
                  data: { content_md: '# hi', updated_at: new Date().toISOString() }
                })
              }}
            >
              PATCH /notes/1
            </button>

            <button onClick={() => window.location.reload()}>Reload</button>
          </div>

          <div style={{ color: '#666', marginBottom: 6 }}>
            {isLoading ? 'Loading notes…' : 'Notes response:'}
          </div>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {data ? JSON.stringify(data, null, 2) : '—'}
          </pre>
        </div>
      )}
    </>
  )
}
