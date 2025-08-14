import { useListNotes, useUpdateNote } from '../api/gen/client'

export default function DebugNotes() {
  const { data, isLoading } = useListNotes({ params: { limit: 10, offset: 0 } })
  const update = useUpdateNote()

  if (isLoading) return <div>Loading…</div>
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button
        onClick={() =>
          update.mutate({
            id: 1,
            data: { content_md: '# hi', updated_at: new Date().toISOString() },
          })
        }
      >
        Patch one note
      </button>
    </div>
  )
}
