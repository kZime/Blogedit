// src/pages/Editor.tsx
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

// Tailwind styles
import '@mdxeditor/editor/style.css'

// MDXEditor
import {
  MDXEditor,
  type MDXEditorMethods,
  toolbarPlugin,
  headingsPlugin,
  listsPlugin,
  linkPlugin,
  quotePlugin,
  codeBlockPlugin,
  markdownShortcutPlugin,
  // toolbar items
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  ListsToggle,
  CreateLink,
  CodeToggle,
  UndoRedo,
  Separator
} from '@mdxeditor/editor'

// Orval generated hooks
import { useListNotes } from '../api/gen/client'
import type { Note } from '../api/gen/models/note'

export default function Editor() {
  const { logout } = useAuth()
  const editorRef = useRef<MDXEditorMethods>(null)

  // Sidebar toggle state
  const [open, setOpen] = useState(true)
  // Current markdown content being edited
  const [md, setMd] = useState('# Headline here \n \n This is a paragraph \n \n This is a list \n - Item 1 \n - Item 2 \n - Item 3')
  
  // Edit page details modal state
  const [showEditModal, setShowEditModal] = useState(false)
  const [pageDetails, setPageDetails] = useState({
    title: 'Untitled Page',
    description: '',
    tags: '',
    visibility: 'private' as 'private' | 'public'
  })

  // Load notes list
  const { data, isLoading, isError } = useListNotes({ limit: 50, offset: 0 })

  // ESC key closes sidebar (mobile friendly)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ==== Placeholder actions ====
  const handleNew = () => {
    console.log('[Notes] new note… (todo)')
  }
  const handleDelete = (id: number) => {
    console.log('[Notes] delete note id=', id, ' (todo)')
  }
  const handleSave = () => {
    console.log('[Notes] save note… (todo)')
  }
  




  // ==== edit page details ====
  const handleEditPage = () => {
    setShowEditModal(true)
  }
  
  const handleCloseModal = () => {
    setShowEditModal(false)
  }
  
  const handleSavePageDetails = () => {
    console.log('[Notes] saving page details:', pageDetails)
    // TODO: Implement actual save logic
    setShowEditModal(false)
  }
  
  const handlePageDetailsChange = (field: string, value: string) => {
    setPageDetails(prev => ({
      ...prev,
      [field]: value
    }))
  }










  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="h-12 border-b bg-white flex items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen(v => !v)}
            aria-expanded={open}
            aria-controls="sidebar"
            className="px-2 py-1 rounded hover:bg-gray-100"
            title="Toggle sidebar"
          >
            ☰
          </button>
          <span className="font-medium">Editor</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={logout} className="text-red-500 hover:underline">
            Logout
          </button>
        </div>
      </header>

      {/* Main area: sidebar + editor */}
      <div className="flex-1 flex overflow-hidden bg-gray-50">
        {/* Sidebar (fixed width on desktop, drawer on mobile) */}
        {/* Overlay (mobile only) */}
        {open && (
          <div
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}
        {/* sidebar */}
        <aside
          id="sidebar"
          className={[
            'z-40 bg-white border-r overflow-y-auto',
            // Mobile: fixed position, Desktop: static position
            'fixed h-full md:static',
            // Control width and visibility based on open state
            open 
              ? 'w-72 translate-x-0 md:translate-x-0 md:w-72' 
              : 'w-72 -translate-x-full md:translate-x-0 md:w-0',
          ].join(' ')}
          style={{ transition: 'transform .2s ease, width .2s ease' }}
        >
          <div className="p-3 border-b flex items-center justify-between">
            <h2 className="font-semibold">Notes</h2>
            <button
              onClick={handleNew}
              className="px-2 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              New
            </button>
          </div>

          <div className="p-2">
            {isLoading && <div className="text-sm text-gray-500 p-2">Loading…</div>}
            {isError && <div className="text-sm text-red-600 p-2">Failed to load notes</div>}
            <ul className="space-y-1">
              {(data?.data?.items ?? []).map((n: Note) => (
                <li key={n.id}>
                  <div className="group flex items-center justify-between gap-2 px-2 py-1 rounded hover:bg-gray-100">
                    <button
                      className="text-left flex-1 truncate"
                      onClick={() => {
                        // Load specific note content and setMd
                        console.log('[Notes] open note id=', n.id)
                      }}
                      title={n.title}
                    >
                      {n.title || '(Untitled)'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(n.id)
                      }}
                      className="text-xs text-gray-500 px-1 py-0.5 rounded hover:bg-gray-200"
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
              {(!isLoading && (data?.data?.items?.length ?? 0) === 0) && (
                <li className="text-sm text-gray-500 p-2">No notes</li>
              )}
            </ul>
          </div>
        </aside>

        {/* editor area */}
        <main className="flex-1 overflow-auto p-4">

          
          {/* Page Title */}
          <div className="mb-4">
            <input
              type="text"
              value={pageDetails.title}
              onChange={(e) => handlePageDetailsChange('title', e.target.value)}
              className="w-full text-2xl font-bold bg-transparent border-none outline-none focus:bg-white focus:border focus:border-gray-300 focus:rounded-md focus:px-3 focus:py-2 transition-all duration-200"
              placeholder="Enter page title..."
            />
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <MDXEditor
              ref={editorRef}
              className="min-h-[70vh]"
              contentEditableClassName="prose"
              markdown={md}
              onChange={setMd}
              plugins={[
                toolbarPlugin({
                  toolbarContents: () => (
                    <>
                      <UndoRedo /><Separator />
                      <BlockTypeSelect /><Separator />
                      <BoldItalicUnderlineToggles /><Separator />
                      <ListsToggle /><Separator />
                      <CreateLink /><Separator />
                      <CodeToggle />
                    </>
                  ),
                }),
                headingsPlugin(),
                listsPlugin(),
                linkPlugin(),
                quotePlugin(),
                codeBlockPlugin(),
                markdownShortcutPlugin(), // Place last
              ]}
            />
          </div>

          {/* Button container - aligned to the right with proper spacing */}
          <div className="mt-4 flex justify-end gap-5">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleEditPage}>Edit</button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleSave}>Save</button>
          </div>
        </main>
      </div>
      






      {/* Edit Page Details Modal */}
      {showEditModal && (
        <div 
          className="fixed inset-0 bg-gray-900/20 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Edit Page Details</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={pageDetails.title}
                  onChange={(e) => handlePageDetailsChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter page title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={pageDetails.description}
                  onChange={(e) => handlePageDetailsChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter page description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  value={pageDetails.tags}
                  onChange={(e) => handlePageDetailsChange('tags', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter tags (comma separated)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Visibility
                </label>
                <select
                  value={pageDetails.visibility}
                  onChange={(e) => handlePageDetailsChange('visibility', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePageDetails}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
