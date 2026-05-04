import { useState } from 'react'
import { UploadZone } from './components/UploadZone'
import { ConfigPanel } from './components/ConfigPanel'
import { StatusBar } from './components/StatusBar'
import { ResultTable } from './components/ResultTable'
import { useScheduleJob } from './hooks/useScheduleJob'
import type { ScheduleInput, SolverType } from './types/schedule'

export default function App() {
  const [fileData, setFileData] = useState<ScheduleInput | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [solver, setSolver] = useState<SolverType>('pulp_cbc')

  const { phase, result, errorMsg, run, reset } = useScheduleJob()

  const isRunning = phase === 'submitting' || phase === 'waiting'
  const canGenerate = !!fileData && !isRunning && phase !== 'success'

  const handleFileLoaded = (data: ScheduleInput, name: string) => {
    setFileData(data)
    setFileName(name)
    if (data.solver) setSolver(data.solver)
  }

  const handleFileRemoved = () => {
    setFileData(null)
    setFileName(null)
  }

  const handleGenerate = async () => {
    if (!fileData) return
    await run({ ...fileData, solver })
  }

  const handleReset = () => {
    reset()
    setFileData(null)
    setFileName(null)
    setSolver('pulp_cbc')
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-logo">
          <span /><span /><span /><span />
        </div>
        <h1>Class Scheduling Engine</h1>
        <span className="separator">/</span>
        <span className="subtitle">generador de horarios</span>
      </header>

      <main className="app-main">
        <div className="card">
          <UploadZone
            onFileLoaded={handleFileLoaded}
            onFileRemoved={handleFileRemoved}
            fileName={fileName}
            disabled={isRunning}
          />

          <ConfigPanel
            solver={solver}
            onSolverChange={setSolver}
            disabled={isRunning}
          />

          <div className="action-bar">
            <button
              className="btn btn-primary"
              disabled={!canGenerate}
              onClick={handleGenerate}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Generar horario
            </button>

            {phase !== 'idle' && (
              <button className="btn btn-ghost" onClick={handleReset}>
                Reiniciar
              </button>
            )}
          </div>
        </div>

        <StatusBar phase={phase} errorMsg={errorMsg} />

        {phase === 'success' && result && (
          <ResultTable result={result} onReset={handleReset} />
        )}
      </main>
    </div>
  )
}