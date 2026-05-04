import { useRef, useState, useCallback } from 'react'
import type { ScheduleInput } from '../types/schedule'

interface Props {
  onFileLoaded: (data: ScheduleInput, fileName: string) => void
  onFileRemoved: () => void
  fileName: string | null
  disabled: boolean
}

export function UploadZone({ onFileLoaded, onFileRemoved, fileName, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [parseError, setParseError] = useState<string | null>(null)

  const parseFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith('.json')) {
        setParseError('SOLO FORMATO .JSON')
        return
      }
      setParseError(null)
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string) as ScheduleInput
          onFileLoaded(data, file.name)
        } catch {
          setParseError('ERROR DE SINTAXIS JSON')
        }
      }
      reader.readAsText(file)
    },
    [onFileLoaded]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      if (disabled) return
      const file = e.dataTransfer.files[0]
      if (file) parseFile(file)
    },
    [disabled, parseFile]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) parseFile(file)
    e.target.value = ''
  }

  return (
    <div className="space-y-4">

      <div
        className={`relative border-b-2 border-slate-900 py-10 transition-all cursor-pointer
          ${dragging ? 'bg-slate-50' : 'bg-transparent'}
          ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
        onClick={() => !disabled && !fileName && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        {fileName ? (
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xl font-light tracking-tight text-slate-900 uppercase">{fileName}</p>
              <p className="text-[10px] font-bold text-blue-600 mt-1 tracking-widest">ARCHIVO CARGADO</p>
            </div>
            {!disabled && (
              <button 
                className="text-[10px] font-bold text-red-600 hover:opacity-70 tracking-widest uppercase"
                onClick={(e) => { e.stopPropagation(); onFileRemoved() }}
              >
                Remover
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col">
            <p className="text-2xl font-light text-slate-300 tracking-tighter uppercase italic">Arrastrar archivo aquí</p>
            <button 
              className="text-left text-[10px] font-bold text-slate-900 mt-2 tracking-widest uppercase hover:underline"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
            >
              o seleccionar manualmente
            </button>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {parseError && (
        <p className="text-[10px] font-bold text-red-600 tracking-widest uppercase flex items-center gap-2">
          <span>Error // {parseError}</span>
        </p>
      )}
    </div>
  )
}
