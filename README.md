# scheduling-front

Frontend para el [Class Scheduling Engine](https://github.com/nikotpab/class-scheduling-engine).

## Stack

- **Vite** + **React 18** + **TypeScript**
- CSS vanilla con variables custom (sin librerías de UI)
- WebSocket nativo + polling de fallback

## Estructura

```
src/
├── api/
│   └── scheduleApi.ts       # POST /generate, GET /{job_id}
├── components/
│   ├── UploadZone.tsx        # Drag & drop del JSON
│   ├── ConfigPanel.tsx       # Solver, penalizaciones, tiempo límite
│   ├── StatusBar.tsx         # Estado del job en tiempo real
│   └── ResultTable.tsx       # Tabla de asignaciones + stats + export
├── hooks/
│   ├── useScheduleJob.ts     # Orquesta POST → WebSocket → polling
│   └── useExportCSV.ts       # Serializa a CSV con BOM UTF-8
├── types/
│   └── schedule.ts           # Tipos TypeScript del backend (Pydantic → TS)
└── styles/
    └── global.css
```

## Instalación

```bash
npm install
```

## Desarrollo

El backend debe estar corriendo en `http://localhost:8000`. El proxy de Vite
redirige `/api` y `/ws` automáticamente.

```bash
# Arrancar backend (en el repo del engine)
docker compose --profile dev up --build

# Arrancar frontend
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173).

## Build para producción

```bash
npm run build
```

## Flujo de datos

1. Usuario arrastra un `.json` con el payload de entrada
2. Los campos de configuración (solver, penalizaciones) se pueden ajustar antes de generar
3. Al hacer clic en **Generar horario**:
   - `POST /api/v1/schedules/generate` → devuelve `job_id` + `ws_url`
   - Se abre un WebSocket en `ws_url` para recibir el resultado en tiempo real
   - Si el WebSocket falla, el hook hace polling cada 3s al `GET /api/v1/schedules/{job_id}`
4. Al completar, aparece la tabla con las asignaciones y los botones de **Exportar CSV** y **Reiniciar**

## Formato del JSON de entrada

Ver el README del backend para el schema completo. Ejemplo mínimo:

```json
{
  "teachers": [...],
  "subjects": [...],
  "rooms": [...],
  "timeslots": [...],
  "penalty_weights": { "penalizacion1": 2.0, "penalizacion2": 1.0 },
  "solver": "pulp_cbc",
  "time_limit_seconds": 300
}
```
