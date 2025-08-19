// src/pages/Editor.tsx
import React, { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '@mdxeditor/editor/style.css';
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
} from '@mdxeditor/editor';

export default function Editor() {
  const { logout } = useAuth();
  const editorRef = useRef<MDXEditorMethods>(null);
  const [md, setMd] = useState('# Hello MDXEditor'); // 仅用于保存/调试


  return (
    <div className="h-screen flex flex-col">
      <div className="p-3 border-b flex items-center gap-2">
        <button onClick={logout} className="text-red-500">退出</button>
      </div>

      <div className="flex-1 overflow-auto p-4 bg-gray-50">
        <MDXEditor
          contentEditableClassName="prose"

          ref={editorRef}
          markdown={md}                 // 初始值：只用来“开机一次”
          onChange={setMd}              // 实时拿到用户输入（保存用）
          className="bg-white rounded-xl p-4 min-h-[70vh]"
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
              )
            }),
            headingsPlugin(),
            listsPlugin(),
            linkPlugin(),
            quotePlugin(),
            codeBlockPlugin(),
            markdownShortcutPlugin(),   // must be the last plugin
          ]}
        />
      </div>
    </div>
  );
}
