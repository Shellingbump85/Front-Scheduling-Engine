import { useState, useMemo } from 'react'
import { UploadZone } from './components/UploadZone'
import { ConfigPanel } from './components/ConfigPanel'
import { StatusBar } from './components/StatusBar'
import { ResultTable } from './components/ResultTable'
import { useScheduleJob } from './hooks/useScheduleJob'
import type { ScheduleInput, SolverType } from './types/schedule'

type ViewType = 'admin' | 'teacher' | 'student'

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('admin')
  const [fileData, setFileData] = useState<ScheduleInput | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [solver, setSolver] = useState<SolverType>('pulp_cbc')
  const [teacherId, setTeacherId] = useState('')
  const [groupId, setGroupId] = useState('')

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

  const teacherFilteredResult = useMemo(() => {
    if (!result || !result.assignments) return null
    if (!teacherId) return null
    return {
      ...result,
      assignments: result.assignments.filter(a => a.teacher_id.toLowerCase() === teacherId.toLowerCase())
    }
  }, [result, teacherId])

  const studentFilteredResult = useMemo(() => {
    if (!result || !result.assignments) return null
    if (!groupId) return null
    return {
      ...result,
      assignments: result.assignments.filter(a => a.group_id.toLowerCase() === groupId.toLowerCase())
    }
  }, [result, groupId])

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Sidebar Nav (Minimal Text) */}
      <nav className="w-56 border-r border-slate-100 flex flex-col flex-shrink-0">
        <div className="p-8">
          <h1 className="text-sm font-black tracking-tighter uppercase leading-tight">SCHEDULING<br/>ENGINE</h1>
          <div className="mt-2 h-0.5 w-4 bg-slate-900" />
        </div>
        
        <div className="flex-1 px-8 space-y-8 mt-4">
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">Módulos</p>
            <div className="flex flex-col items-start gap-4">
              {[
                { id: 'admin', label: 'Gestión / Motor' },
                { id: 'teacher', label: 'Agenda Docente' },
                { id: 'student', label: 'Horario Estudiante' },
              ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => setActiveView(item.id as ViewType)}
                  className={`text-xs font-bold uppercase tracking-tight transition-all text-left ${activeView === item.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8">
          <p className="text-[10px] font-mono text-slate-300 uppercase tracking-tighter">BUILD 2026.05.04</p>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header (Minimal) */}
        <header className="h-20 flex items-center justify-between px-12 z-10">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              {activeView === 'admin' ? 'Administrative Control' : activeView === 'teacher' ? 'Faculty Portal' : 'Student Access'}
            </span>
            <h2 className="text-lg font-light tracking-tight text-slate-800">
              {activeView === 'admin' ? 'Generador de Planificación Académica' : activeView === 'teacher' ? 'Consulta de Carga Horaria' : 'Visualización de Cursos'}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${phase === 'waiting' ? 'bg-amber-500 animate-pulse' : 'bg-slate-300'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {phase === 'waiting' ? 'Processing' : 'Standby'}
              </span>
            </div>
          </div>
        </header>

        {/* Viewport */}
        <main className="flex-1 overflow-y-auto px-12 py-8">
          <div className="max-w-4xl">
            
            {/* ADMIN VIEW */}
            {activeView === 'admin' && (
              <div className="space-y-12">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-light tracking-tighter text-slate-900 uppercase italic">Control de Optimización</h3>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-md">Distribuya automáticamente la carga académica basándose en el modelo Esquivel Tovar (2014). Cargue su dataset para iniciar.</p>
                  </div>
                  <button
                    className={`px-8 py-3 text-[11px] font-bold tracking-[0.2em] uppercase transition-all
                      ${canGenerate 
                        ? 'bg-slate-900 text-white hover:bg-blue-700 active:scale-95' 
                        : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                    disabled={!canGenerate}
                    onClick={handleGenerate}
                  >
                    Iniciar Proceso
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-12 pt-4">
                  <UploadZone onFileLoaded={handleFileLoaded} onFileRemoved={handleFileRemoved} fileName={fileName} disabled={isRunning} />
                  <ConfigPanel solver={solver} onSolverChange={setSolver} disabled={isRunning} />
                </div>

                <StatusBar phase={phase} errorMsg={errorMsg} />

                {phase === 'success' && result && fileData && (
                  <div className="pt-8">
                    <ResultTable result={result} input={fileData} onReset={handleReset} />
                  </div>
                )}
              </div>
            )}

            {/* TEACHER VIEW */}
            {activeView === 'teacher' && (
              <div className="space-y-12">
                <div className="space-y-2">
                  <h3 className="text-3xl font-light tracking-tighter text-slate-900 uppercase italic">Agenda del Docente</h3>
                  <p className="text-xs text-slate-500">Ingrese sus credenciales para visualizar sus clases asignadas.</p>
                </div>

                <div className="border-b border-slate-900 pb-2 max-w-sm">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Identificador de Usuario</label>
                  <input 
                    type="text" 
                    placeholder="INTRODUCIR ID (EJ: T166)" 
                    className="w-full bg-transparent text-xl font-light tracking-tight outline-none placeholder:text-slate-200 uppercase"
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                  />
                </div>

                {teacherFilteredResult && fileData ? (
                  <ResultTable result={teacherFilteredResult} input={fileData} onReset={() => {}} variant="compact" />
                ) : (
                  <div className="py-24 flex flex-col items-center justify-center border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-300 tracking-[0.3em] uppercase">Esperando entrada de datos</p>
                  </div>
                )}
              </div>
            )}

            {/* STUDENT VIEW */}
            {activeView === 'student' && (
              <div className="space-y-12">
                <div className="space-y-2">
                  <h3 className="text-3xl font-light tracking-tighter text-slate-900 uppercase italic">Portal de Estudiantes</h3>
                  <p className="text-xs text-slate-500">Consulta el horario oficial por grupo académico.</p>
                </div>

                <div className="border-b border-slate-900 pb-2 max-w-sm">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Código de Grupo</label>
                  <input 
                    type="text" 
                    placeholder="INTRODUCIR CÓDIGO (EJ: G1)" 
                    className="w-full bg-transparent text-xl font-light tracking-tight outline-none placeholder:text-slate-200 uppercase"
                    value={groupId}
                    onChange={(e) => setGroupId(e.target.value)}
                  />
                </div>

                {studentFilteredResult && fileData ? (
                  <ResultTable result={studentFilteredResult} input={fileData} onReset={() => {}} variant="compact" />
                ) : (
                  <div className="py-24 flex flex-col items-center justify-center border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-300 tracking-[0.3em] uppercase">No se ha seleccionado grupo</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  )
}
