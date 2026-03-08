export const partsConfig = [
  {
    id: 'overview',
    label: 'Vista General',
    color: '#1a1a2e',
    pct: 100,
    dias: null,
    activeBlocks: ['EXTRAER','CARGAR','TRANSFORMAR','SEMÁNTICA','APROVECHAR','ALMACENAR','GOBERNAR','OBSERVABILIDAD','ORQUESTADOR'],
    desc: 'Stack completo con todas las capas activas. Vista de referencia final de la arquitectura DaaP sobre Azure.',
  },
  {
    id: 'part1',
    label: 'Parte 1 · Fundación',
    color: '#1d4ed8',
    pct: 20,
    dias: '30–45',
    activeBlocks: ['EXTRAER','CARGAR','ALMACENAR','GOBERNAR'],
    desc: 'Base del stack: ingesta, carga, almacenamiento y gobernanza. Sin esta fundación ninguna capa superior es sostenible.',
  },
  {
    id: 'part2',
    label: 'Parte 2 · Transformar',
    color: '#0f3460',
    pct: 40,
    dias: '45–60',
    activeBlocks: ['EXTRAER','CARGAR','TRANSFORMAR','ALMACENAR','GOBERNAR','OBSERVABILIDAD'],
    desc: 'Activación del patrón ELT con dbt. El dato pasa de crudo a limpio y enriquecido. Se añade observabilidad proactiva.',
  },
  {
    id: 'part3',
    label: 'Parte 3 · Semántica',
    color: '#533483',
    pct: 60,
    dias: '30–45',
    activeBlocks: ['EXTRAER','CARGAR','TRANSFORMAR','SEMÁNTICA','ALMACENAR','GOBERNAR','OBSERVABILIDAD'],
    desc: 'Capa semántica centralizada. Una sola definición de métricas y KPIs para toda la organización.',
  },
  {
    id: 'part4',
    label: 'Parte 4 · Aprovechar',
    color: '#2d6a4f',
    pct: 80,
    dias: '30–45',
    activeBlocks: ['EXTRAER','CARGAR','TRANSFORMAR','SEMÁNTICA','APROVECHAR','ALMACENAR','GOBERNAR','OBSERVABILIDAD'],
    desc: 'El dato genera valor de negocio real: BI, ML, IA Generativa y Feature Engineering.',
  },
  {
    id: 'part5',
    label: 'Parte 5 · Orquestador',
    color: '#1b4332',
    pct: 100,
    dias: '20–30',
    activeBlocks: ['EXTRAER','CARGAR','TRANSFORMAR','SEMÁNTICA','APROVECHAR','ALMACENAR','GOBERNAR','OBSERVABILIDAD','ORQUESTADOR'],
    desc: 'El orquestador conecta todo. Automatización E2E, gestión de dependencias y monitoreo de SLAs.',
  },
]

export const TOTAL_DIAS = '155–225'

export const ROADMAP = [
  { fecha: '9 Mar 2026',  hito: 'Presentación & Kick-off',                pct: 0,   color: '#64748b' },
  { fecha: '24 Mar 2026', hito: 'Levantamiento de dominios y fuentes',    pct: 5,   color: '#64748b' },
  { fecha: '7 May 2026',  hito: 'Parte 1 completa — Fundación (20%)',     pct: 20,  color: '#1d4ed8' },
  { fecha: '7 Jul 2026',  hito: 'Parte 2 completa — Transformar (40%)',   pct: 40,  color: '#0f3460' },
  { fecha: '21 Ago 2026', hito: 'Parte 3 completa — Semántica (60%)',     pct: 60,  color: '#533483' },
  { fecha: '5 Oct 2026',  hito: 'Parte 4 completa — Aprovechar (80%)',    pct: 80,  color: '#2d6a4f' },
  { fecha: '4 Nov 2026',  hito: '🏁 Stack completo en producción (100%)', pct: 100, color: '#1b4332' },
]