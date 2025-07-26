import { TextStyleKit } from "@tiptap/extension-text-style";
import type { Editor } from "@tiptap/react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { BlockquoteIcon } from "./components/tiptap-icons/blockquote-icon";
import { BoldIcon } from "./components/tiptap-icons/bold-icon";
import { CodeBlockIcon } from "./components/tiptap-icons/code-block-icon";
import { ItalicIcon } from "./components/tiptap-icons/italic-icon";
import { ListIcon } from "./components/tiptap-icons/list-icon";
import { ListOrderedIcon } from "./components/tiptap-icons/list-ordered-icon";
import { Redo2Icon } from "./components/tiptap-icons/redo2-icon";
import { StrikeIcon } from "./components/tiptap-icons/strike-icon";
import { Undo2Icon } from "./components/tiptap-icons/undo2-icon";

import TextAlign from "@tiptap/extension-text-align";
import React, { useRef, useState } from "react";
import { AlignCenterIcon } from "./components/tiptap-icons/align-center-icon";
import { AlignLeftIcon } from "./components/tiptap-icons/align-left-icon";
import { AlignRightIcon } from "./components/tiptap-icons/align-right-icon";

const extensions = [
  TextStyleKit,
  StarterKit,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
];

function MenuBar({ editor }: { editor: Editor }) {
  // Read the current editor's state, and re-render the component when it changes
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive("bold") ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive("italic") ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive("strike") ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor.isActive("code") ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: ctx.editor.isActive("paragraph") ?? false,
        isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive("heading", { level: 4 }) ?? false,
        isHeading5: ctx.editor.isActive("heading", { level: 5 }) ?? false,
        isHeading6: ctx.editor.isActive("heading", { level: 6 }) ?? false,
        isBulletList: ctx.editor.isActive("bulletList") ?? false,
        isOrderedList: ctx.editor.isActive("orderedList") ?? false,
        isCodeBlock: ctx.editor.isActive("codeBlock") ?? false,
        isBlockquote: ctx.editor.isActive("blockquote") ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,

        isAlignLeft: ctx.editor.isActive({ textAlign: "left" }) ?? false,
        isAlignCenter: ctx.editor.isActive({ textAlign: "center" }) ?? false,
        isAlignRight: ctx.editor.isActive({ textAlign: "right" }) ?? false,
      };
    },
  });

  // Dropdown state
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // Dropdown options
  const headingOptions = [
    { label: "Body", value: "paragraph", isActive: editorState.isParagraph },
    { label: "Heading 1", value: 1, isActive: editorState.isHeading1 },
    { label: "Heading 2", value: 2, isActive: editorState.isHeading2 },
    { label: "Heading 3", value: 3, isActive: editorState.isHeading3 },
    { label: "Heading 4", value: 4, isActive: editorState.isHeading4 },
    { label: "Heading 5", value: 5, isActive: editorState.isHeading5 },
    { label: "Heading 6", value: 6, isActive: editorState.isHeading6 },
  ];

  // Get current label
  const currentHeading =
    headingOptions.find((opt) => opt.isActive) || headingOptions[0];

  function handleHeadingSelect(option: (typeof headingOptions)[number]) {
    setShowDropdown(false);
    if (option.value === "paragraph") {
      editor.chain().focus().setParagraph().run();
    } else {
      // TypeScript expects level: 1|2|3|4|5|6
      editor
        .chain()
        .focus()
        .toggleHeading({ level: option.value as 1 | 2 | 3 | 4 | 5 | 6 })
        .run();
    }
  }

  return (
    <div className="control-group">
      <div className="button-group">
        {/* Heading Dropdown */}
        <div
          ref={dropdownRef}
          style={{ position: "relative", display: "inline-block" }}
        >
          <button
            type="button"
            onClick={() => setShowDropdown((v) => !v)}
            className={`dropdown ${currentHeading.isActive ? "is-active" : ""}`}
            style={{ minWidth: 80 }}
          >
            {currentHeading.label}
            <span>
              <img src="expand.png" />
            </span>
          </button>
          {showDropdown && (
            <div className="dropdown-menu">
              {headingOptions.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => handleHeadingSelect(option)}
                  className={
                    option.isActive
                      ? "is-active dropdown-button"
                      : "dropdown-button"
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          className={editorState.isBold ? "is-active" : ""}
        >
          <BoldIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          className={editorState.isItalic ? "is-active" : ""}
        >
          <ItalicIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
          className={editorState.isStrike ? "is-active" : ""}
        >
          <StrikeIcon />
        </button>
        {/* Text Alignment Buttons */}
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={editorState.isAlignLeft ? "is-active" : ""}
          title="Align Left"
        >
          <AlignLeftIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={editorState.isAlignCenter ? "is-active" : ""}
          title="Align Center"
        >
          <AlignCenterIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={editorState.isAlignRight ? "is-active" : ""}
          title="Align Right"
        >
          <AlignRightIcon />
        </button>
        {/* ...existing code... */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editorState.isBulletList ? "is-active" : ""}
        >
          <ListIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editorState.isOrderedList ? "is-active" : ""}
        >
          <ListOrderedIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editorState.isCodeBlock ? "is-active" : ""}
        >
          <CodeBlockIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editorState.isBlockquote ? "is-active" : ""}
        >
          <BlockquoteIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState.canUndo}
        >
          <Undo2Icon />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editorState.canRedo}
        >
          <Redo2Icon />
        </button>
      </div>
    </div>
  );
}

export default function TiptapEditor() {
  const editor = useEditor({
    extensions,
    content: `
<h2>
  Rich Text Editor
</h2>
<p>
  This is a rich text editor built with Tiptap. It supports various formatting options like bold, italic, strike-through, code blocks, lists, and more.
</p>
<p>
  You can start typing here and use the toolbar above to format your text. For example, you can make this text <strong>bold</strong>, <em>italic</em>, or <del>strike-through</del>.
</p>
<ul>
  <li>
    Here is a list item.
  </li>
  <li>
    Here is another list item.
  </li>
</ul>
<p>
  The app also supports many headings and code block styles, and is programmed in Typescript.
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  This app also has a lot of other functionality, such as undo and redo actions, text-editing keyboard shortcuts, and also advanced text formatting like block-quotes and paragraph alignment.
</p>
<blockquote>
  This app was developed by Anahat Mudgal.
  It was built with React, and is based on the Tiptap editor framework.
</blockquote>

  This program is open source and available on GitHub. Visit the repository to learn more about how it works. 
`,
  });
  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
