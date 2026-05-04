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
        setParseError('Solo se aceptan archivos .json')
        return
      }
      setParseError(null)
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string) as ScheduleInput
          onFileLoaded(data, file.name)
        } catch {
          setParseError('El archivo no es un JSON válido')
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

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setParseError(null)
    onFileRemoved()
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <p className="section-label">Archivo de entrada</p>

      <div
        className={`upload-zone ${dragging ? 'drag-over' : ''} ${fileName ? 'has-file' : ''}`}
        onClick={() => !disabled && !fileName && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        aria-label="Zona de carga de archivo JSON"
      >
        <div className="upload-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
        </div>

        {fileName ? (
          <>
            <p className="upload-title" style={{ color: 'var(--color-accent)' }}>
              Archivo listo para procesar
            </p>
            <div className="file-chip">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 0h5.5L14 4.5V15a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1z" opacity="0.3"/>
                <path d="M9.5 0v4.5H14"/>
                <rect x="3.5" y="7" width="9" height="1" rx="0.5" fill="white"/>
                <rect x="3.5" y="9.5" width="9" height="1" rx="0.5" fill="white"/>
                <rect x="3.5" y="12" width="6" height="1" rx="0.5" fill="white"/>
              </svg>
              {fileName}
              {!disabled && (
                <button className="file-chip-remove" onClick={handleRemove} title="Quitar archivo">
                  ✕
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <p className="upload-title">Arrastra tu archivo JSON aquí</p>
            <p className="upload-sub">
              o{' '}
              <button onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}>
                selecciona un archivo
              </button>
            </p>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".json,application/json"
          style={{ display: 'none' }}
          onChange={handleChange}
        />
      </div>

      {parseError && (
        <p style={{ fontSize: 12, color: 'var(--color-danger)', marginTop: 8, fontFamily: 'var(--font-mono)' }}>
          ⚠ {parseError}
        </p>
      )}
    </div>
  )
}
