import {
  Type,
  Image as ImageIcon,
  Trash2,
  Plus
} from 'lucide-react'

import Button from '../common/Button'
import { clsx } from 'clsx'

import {
  DndContext,
  closestCenter
} from '@dnd-kit/core'

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable'

import { CSS } from '@dnd-kit/utilities'

/* =========================
   Sortable Block
========================= */
function SortableBlock({ id, children, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition
      }}
      className="p-3 border rounded-xl bg-secondary/50"
    >
      {/* drag */}
      <div
        {...attributes}
        {...listeners}
        className="text-xs text-gray-400 cursor-grab mb-2"
      >
        ⋮⋮ drag
      </div>

      {children}

      <button
        type="button"
        onClick={onDelete}
        className="mt-2 text-sm text-red-500"
      >
        <Trash2 className="w-4 h-4 inline mr-1" />
        삭제
      </button>
    </div>
  )
}

/* =========================
   MAIN
========================= */
export default function BlockEditor({ blocks = [], onChange }) {

  /* =========================
     블록 추가
  ========================= */
  const addBlock = (type, file = null) => {

    if (type === 'TEXT') {
      onChange([
        ...blocks,
        {
          id: crypto.randomUUID(),
          type: 'TEXT',
          content: ''
        }
      ])
      return
    }

    if (type === 'IMAGE' && file) {
      onChange([
        ...blocks,
        {
          id: crypto.randomUUID(),
          type: 'IMAGE',
          file,
          content: URL.createObjectURL(file)
        }
      ])
    }
  }

  /* =========================
     수정
  ========================= */
  const updateBlock = (id, value) => {
    onChange(
      blocks.map((b) =>
        b.id === id ? { ...b, content: value } : b
      )
    )
  }

  /* =========================
     이미지 교체
  ========================= */
  const replaceImage = (id, file) => {
    onChange(
      blocks.map((b) =>
        b.id === id
          ? {
              ...b,
              file,
              content: URL.createObjectURL(file)
            }
          : b
      )
    )
  }

  /* =========================
     삭제
  ========================= */
  const deleteBlock = (id) => {
    onChange(blocks.filter((b) => b.id !== id))
  }

  /* =========================
     드래그
  ========================= */
  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = blocks.findIndex(b => b.id === active.id)
    const newIndex = blocks.findIndex(b => b.id === over.id)

    const newBlocks = arrayMove(blocks, oldIndex, newIndex)

    onChange(newBlocks)
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="space-y-4">

      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">조리 순서</label>

        <div className="flex gap-2">
          {/* 텍스트 */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addBlock('TEXT')}
          >
            <Type className="w-4 h-4 mr-1" />
            텍스트
          </Button>

          {/* 이미지 */}
          <label className="inline-flex items-center gap-1 border px-3 py-1 rounded cursor-pointer text-sm">
            <ImageIcon className="w-4 h-4" />
            이미지
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0]
                if (file) addBlock('IMAGE', file)
              }}
            />
          </label>
        </div>
      </div>

      {/* 드래그 */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={blocks.map(b => b.id)}
          strategy={verticalListSortingStrategy}
        >

          {/* 빈 상태 */}
          {blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-lg text-gray-400">
              <Plus className="w-8 h-8 mb-2" />
              <p className="text-sm">
                블록을 추가하여 조리 순서를 작성하세요
              </p>
            </div>
          ) : (

            <div className="space-y-3">
              {blocks.map((block, index) => (
                <SortableBlock
                  key={block.id}
                  id={block.id}
                  onDelete={() => deleteBlock(block.id)}
                >

                  {/* 타입 + 순서 */}
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={clsx(
                        "px-2 py-0.5 text-xs rounded",
                        block.type === 'TEXT'
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      )}
                    >
                      {block.type === 'TEXT' ? '텍스트' : '이미지'}
                    </span>

                    <span className="text-xs text-gray-400">
                      Step {index + 1}
                    </span>
                  </div>

                  {/* TEXT */}
                  {block.type === 'TEXT' ? (
                    <textarea
                      value={block.content}
                      onChange={(e) =>
                        updateBlock(block.id, e.target.value)
                      }
                      placeholder="조리 과정을 입력하세요..."
                      className="w-full min-h-[80px] p-3 rounded-lg border text-sm resize-none"
                    />
                  ) : (

                    /* IMAGE */
                    <div className="space-y-2">

                      {/* 🔥 이미지 표시 (수정 시 바로 보임) */}
                      {block.content && (
                        <img
                          src={
                            block.content.startsWith("http")
                              ? block.content
                              : `${process.env.REACT_APP_API_BASE_URL}${block.content}`
                          }
                          alt="preview"
                          className="w-full max-w-xs h-32 object-cover rounded-lg"
                        />
                      )}

                      {/* 🔥 아무것도 없을 때만 input */}
                      {!block.file && !block.content && (
                        <input
                          type="text"
                          value={block.content || ''}
                          onChange={(e) =>
                            updateBlock(block.id, e.target.value)
                          }
                          placeholder="이미지 URL 입력"
                          className="w-full h-10 px-3 rounded-lg border text-sm"
                        />
                      )}

                      {/* 🔥 이미지 교체 */}
                      <label className="text-xs text-blue-500 cursor-pointer">
                        이미지 변경
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0]
                            if (file) replaceImage(block.id, file)
                          }}
                        />
                      </label>

                    </div>
                  )}

                </SortableBlock>
              ))}
            </div>
          )}
        </SortableContext>
      </DndContext>
    </div>
  )
}