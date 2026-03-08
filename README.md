# 🏗️ Modern Data Stack · Azure DaaP

> Arquitectura **Data as a Product** sobre Azure — implementación progresiva en 5 partes.  
> Los protagonistas: **dbt** y **Microsoft Fabric**.

🔗 **Demo:** [lizandro-mc.github.io/modern-data-stack](https://lizandro-mc.github.io/modern-data-stack)  
📁 **Repo:** [github.com/lizandro-mc/modern-data-stack](https://github.com/lizandro-mc/modern-data-stack)

---

## Índice

- [Principios DaaP](#-principios-daap)
- [Vista General del Stack](#-vista-general-del-stack)
- [🟡 dbt — El Protagonista de la Transformación](#-dbt--el-protagonista-de-la-transformación)
- [🟣 Microsoft Fabric — La Plataforma Unificada](#-microsoft-fabric--la-plataforma-unificada)
- [Roadmap de Implementación](#-roadmap-de-implementación)
- [Parte 1 · Fundación](#-parte-1--fundación--20)
- [Parte 2 · Transformar](#-parte-2--transformar--40)
- [Parte 3 · Semántica](#-parte-3--semántica--60)
- [Parte 4 · Aprovechar](#-parte-4--aprovechar--80)
- [Parte 5 · Orquestador](#-parte-5--orquestador--100)
- [Detalle por Capa](#-detalle-por-capa)
- [Instalación](#-instalación)

---

## 🎯 Principios DaaP

| | Principio | Descripción |
|--|-----------|-------------|
| ⚡ | ELT sobre ETL | Transformar dentro del almacén, no antes de cargar |
| ☁️ | Cloud primero | Stack completo sobre Azure |
| 🔀 | Separación cómputo/almacenamiento | Fabric Lakehouse + Synapse |
| 🧠 | Dato como Feature | Ingeniería de características + Azure ML |
| 💻 | Dato como Software | dbt + Git + CI/CD |
| 🔭 | Confiabilidad Proactiva | Observabilidad, Linaje y Contratos de Datos |
| 🛡️ | Gobernanza Centralizada | Microsoft Purview + Fabric One Governance |
| 💡 | Única Fuente de Verdad | dbt Metrics Layer + Fabric Semantic Model |
| 🤖 | Automatización E2E | ADF + Airflow + dbt Jobs |
| 🧩 | Arquitectura Modular | Best-of-Breed, sin vendor lock-in |

---

## 🗺️ Vista General del Stack

**Eje horizontal — Pipeline ELT:**
```
📥 EXTRAER → 📤 CARGAR → ⚙️ TRANSFORMAR → 💡 SEMÁNTICA → 🚀 APROVECHAR
```

**Eje vertical — Fundaciones transversales:**
```
🗄️  ALMACENAR      → OneLake / Fabric Lakehouse / Delta Lake
🛡️  GOBERNAR       → Purview · Fabric One Governance · dbt Contracts
🔭  OBSERVABILIDAD → Elementary · Fabric Monitoring Hub · Azure Monitor
🤖  ORQUESTADOR    → ADF · dbt Jobs · Apache Airflow
```

---

## 🟡 dbt — El Protagonista de la Transformación

> dbt trata el **SQL como código**: versionado, testeado, documentado y desplegado con los mismos estándares que el software de producción. Es la columna vertebral de la transformación y el gobierno del dato en este stack.

### SQL como Código

dbt convierte cada modelo SQL en una unidad de software:

- **Control de versiones completo** en Git: cada cambio tiene autor, fecha y mensaje
- **Code Review obligatorio** con Pull Request antes de llegar a producción
- **CI/CD nativo**: `dbt test` se ejecuta en cada PR automáticamente
- **Historial de auditoría** completo: quién cambió qué, cuándo y por qué
- **Portabilidad total**: cambiar de Fabric a Snowflake = cambiar solo el adaptador en `profiles.yml`

### Tipos de Tests

| Tipo | Descripción | Dónde se define |
|------|-------------|-----------------|
| **Generic tests** | `unique` · `not_null` · `relationships` · `accepted_values` | `schema.yml` |
| **Singular tests** | SQL custom para reglas de negocio complejas | `tests/` |
| **dbt-expectations** | +50 tests de distribución, rangos y patrones | paquete externo |
| **Data health checks** | Freshness, coverage y anomaly detection | Elementary OSS |

```yaml
# Ejemplo schema.yml — tests + documentación + ownership
models:
  - name: fct_ventas
    description: "Tabla de hechos de ventas. Propietario: equipo_comercial"
    meta:
      owner: equipo_comercial
    columns:
      - name: venta_id
        description: "ID único de la venta"
        tests:
          - unique
          - not_null
      - name: cliente_id
        tests:
          - not_null
          - relationships:
              to: ref('dim_cliente')
              field: cliente_id
```

### Linaje de Datos

- Generado automáticamente desde `ref()` y `source()` en cada modelo
- DAG visual completo en dbt Docs
- Integración con **Microsoft Purview** para linaje end-to-end
- **Impact analysis**: saber qué se rompe antes de hacer un cambio

```
source(crm) → brz_crm__clientes → slv_clientes → dim_cliente → fct_ventas → RPT_Ventas
```

### Gobierno y Contratos

```yaml
# Data Contract declarado en schema.yml
models:
  - name: dim_cliente
    config:
      contract:
        enforced: true       # falla el build si el schema no coincide
    columns:
      - name: cliente_id
        data_type: varchar
        constraints:
          - type: not_null
          - type: unique
```

- **Modelos públicos**: expuestos a otros proyectos/dominios con SLA garantizado
- **Modelos privados**: internos al dominio, sin contrato externo
- **dbt Mesh**: arquitectura multi-proyecto para gobernanza federada por dominio
- **Ownership**: `meta.owner` declarado en cada modelo
- **Diccionario de datos**: `description:` en schema.yml = documentación ejecutable

### Portabilidad — Sin Vendor Lock-in

```yaml
# profiles.yml — solo cambiar el adaptador para cambiar de plataforma
my_project:
  target: prod
  outputs:
    prod:
      type: fabric          # ← cambiar por: snowflake | bigquery | databricks
      server: ...
```

El mismo código SQL funciona sobre Fabric, Snowflake, BigQuery o Databricks.

### Recursos de Aprendizaje

| Recurso | Descripción |
|---------|-------------|
| [dbt Core](https://docs.getdbt.com/docs/core/installation-overview) | Motor OSS, gratis e instalable en cualquier entorno |
| [dbt Cloud](https://docs.getdbt.com/docs/cloud/about-cloud/dbt-cloud-features) | SaaS con IDE, scheduler, CI/CD y alertas |
| [dbt Mesh](https://docs.getdbt.com/docs/collaborate/govern/about-dbt-mesh) | Gobernanza federada multi-proyecto |
| [dbt Semantic Layer](https://docs.getdbt.com/docs/use-dbt-semantic-layer/dbt-sl) | Métricas centralizadas consumibles desde cualquier BI |
| [dbt-fabric adapter](https://docs.getdbt.com/docs/core/connect-data-platform/fabric-setup) | Adaptador oficial para Microsoft Fabric |
| [dbt Data Contracts](https://docs.getdbt.com/docs/collaborate/govern/model-contracts) | Contratos de schema versionados y validados |
| [dbt Docs](https://docs.getdbt.com/docs/collaborate/documentation) | Portal de documentación auto-generado |
| [Elementary OSS](https://docs.elementary-data.com) | Observabilidad nativa de dbt |
| [dbt-expectations](https://github.com/calogica/dbt-expectations) | +50 tests avanzados para dbt |

---

## 🟣 Microsoft Fabric — La Plataforma Unificada

> Microsoft Fabric es la plataforma analítica SaaS unificada de Microsoft: **OneLake, One Security, One Governance, One Monitoring**. Elimina silos de datos con un modelo de pago por uso (F-SKUs) y es el hogar natural de dbt en Azure.

### OneLake — Single Data Lake

```
┌─────────────────────────────────────────────────────┐
│                    OneLake                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Lakehouse│  │Warehouse │  │  Semantic Model  │  │
│  │ (Bronze/ │  │  (Gold)  │  │   (Power BI)     │  │
│  │  Silver) │  │          │  │                  │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
│         Todos sobre Delta/Parquet abierto            │
└─────────────────────────────────────────────────────┘
```

- **Un solo lago lógico** para toda la organización, múltiples workspaces
- **Zero-copy shortcuts**: acceder a datos externos sin moverlos ni duplicarlos
- **Formato Delta/Parquet abierto**: portable a cualquier plataforma, sin lock-in
- Compatible con ADLS Gen2, S3 y GCS vía shortcuts externos

### One Security & One Governance

- **One Access Control Experience**: permisos unificados para todos los items desde un único panel
- Integración nativa con **Microsoft Purview**: catálogo, linaje y clasificación automática
- Row-level security y column-level security en Warehouse
- Sensitivity labels automáticos desde Purview a todos los datasets
- Audit logs centralizados para cumplimiento normativo (GDPR, SOC2, etc.)

### F-SKUs — Escalabilidad por Dominio

| SKU | CUs | Caso de uso |
|-----|-----|-------------|
| F2  | 2   | Desarrollo y pruebas |
| F4  | 4   | Dominio pequeño en producción |
| F8  | 8   | Dominio mediano, cargas regulares |
| F16+| 16+ | Dominios críticos, alta concurrencia |
| F64+| 64+ | Plataforma enterprise completa |

- **Pagar por uso real**, no por almacenamiento fijo
- **Burst automático** para picos de carga sin aprovisionamiento manual
- Separar capacidades F-SKU por dominio: ventas ≠ finanzas ≠ datos crudos
- **Escalar almacenamiento y cómputo de forma independiente**

### Integración con dbt ← Clave

```
dbt Core/Cloud
      │
      │ dbt-fabric adapter
      ▼
Fabric Warehouse ──── OneLake ──── Fabric Lakehouse
      │                                    │
   Gold / Semántica               Bronze / Silver
```

- **dbt-fabric adapter** oficial: conecta dbt directamente con Fabric Warehouse
- **dbt Jobs** ejecutan sobre Fabric Lakehouse y Warehouse sin infraestructura adicional
- **Linaje dbt visible en Purview**: trazabilidad end-to-end automática
- CI/CD: dbt test en PR → dbt job en stage → dbt job en prod
- OneLake como destino de todos los modelos dbt: Bronze, Silver, Gold

### Herramientas de Fabric para el Stack

| Herramienta | Rol en el stack | Docs |
|-------------|-----------------|------|
| **Lakehouse** | Bronze y Silver sobre Delta Lake | [→](https://learn.microsoft.com/es-es/fabric/data-engineering/lakehouse-overview) |
| **Warehouse** | Gold y capa Semántica con SQL serverless | [→](https://learn.microsoft.com/es-es/fabric/data-warehouse/data-warehousing) |
| **Data Factory** | Ingesta nativa con +150 conectores | [→](https://learn.microsoft.com/es-es/fabric/data-factory/data-factory-overview) |
| **DirectLake** | Power BI lee OneLake sin copiar datos | [→](https://learn.microsoft.com/es-es/fabric/fundamentals/direct-lake-overview) |
| **Notebooks** | PySpark para ML y Feature Engineering | [→](https://learn.microsoft.com/es-es/fabric/data-engineering/how-to-use-notebook) |
| **Monitoring Hub** | Visibilidad unificada de jobs y consumos | [→](https://learn.microsoft.com/es-es/fabric/admin/monitoring-hub) |
| **Real-Time Intelligence** | Streaming y análisis en tiempo real | [→](https://learn.microsoft.com/es-es/fabric/real-time-intelligence/overview) |
| **Semantic Model** | DirectLake desde OneLake a Power BI | [→](https://learn.microsoft.com/es-es/fabric/get-started/microsoft-fabric-overview) |
| **Purview + Fabric** | One Governance para todos los items | [→](https://learn.microsoft.com/es-es/fabric/governance/microsoft-purview-fabric) |
| **F-SKUs / Pricing** | Capacidad flexible por dominio | [→](https://learn.microsoft.com/es-es/fabric/enterprise/licenses) |

### Ambientes en Fabric — Dev / Stage / Prod

```
fabric-dev              fabric-stage            fabric-prod
├── lh_raw_crm          ├── lh_raw_crm          ├── lh_raw_crm
├── lh_bronze_crm       ├── lh_bronze_crm       ├── lh_bronze_crm
├── lh_silver           ├── lh_silver           ├── lh_silver
├── wh_gold             ├── wh_gold             ├── wh_gold
└── sm_ventas           └── sm_ventas           └── sm_ventas
```

- Un **workspace de Fabric por ambiente**: misma estructura, datos separados
- **Zero-copy cloning** para crear entornos de dev sin duplicar datos de prod
- Variables de entorno en dbt (`profiles.yml`) apuntan al workspace correcto
- CI/CD: PR → deploy automático en stage → aprobación manual → prod

### Sin Vendor Lock-in

- Datos en **Delta/Parquet abierto**: legible desde Databricks, Synapse, Spark, etc.
- ADLS Gen2 compatible: accesible desde cualquier herramienta del ecosistema
- Shortcuts: conectar datos externos sin moverlos a OneLake
- dbt como capa portable: cambiar Fabric = cambiar solo el adaptador

---

## 📅 Roadmap de Implementación

> Inicio: **9 de marzo de 2026** · Equipo de 5 personas · Estimado optimista  
> ⚠️ El tiempo real depende del levantamiento de dominios y fuentes de datos.

```mermaid
gantt
    dateFormat YYYY-MM-DD
    axisFormat %b %Y
    section Inicio
    Presentación & kick-off         :milestone, 2026-03-09, 0d
    Levantamiento de dominios       :2026-03-09, 15d
    section Implementación
    Parte 1 · Fundación    20%      :2026-03-24, 45d
    Parte 2 · Transformar  40%      :2026-05-08, 60d
    Parte 3 · Semántica    60%      :2026-07-07, 45d
    Parte 4 · Aprovechar   80%      :2026-08-21, 45d
    Parte 5 · Orquestador  100%     :2026-10-05, 30d
    section Entrega
    Stack completo en producción    :milestone, 2026-11-04, 0d
```

**Total estimado: 155–225 días hábiles** (marzo → noviembre 2026)

### Hitos y Entregables

| Fecha | Hito | Entregables clave |
|-------|------|-------------------|
| **9 Mar 2026** | Kick-off | Presentación aprobada, equipo formado |
| **24 Mar 2026** | Levantamiento | Dominios mapeados, fuentes identificadas, contratos iniciales |
| **7 May 2026** | Fundación 20% | Workspaces Fabric dev/stage/prod · Lakehouse RAW · Pipelines ADF · Purview inicial · RBAC |
| **7 Jul 2026** | Transformar 40% | dbt Bronze/Silver/Gold · CI/CD · dbt Docs · Elementary · Alertas SLA |
| **21 Ago 2026** | Semántica 60% | dbt Semantic Layer · Fabric Semantic Model · DirectLake · API métricas |
| **5 Oct 2026** | Aprovechar 80% | Power BI dashboards · Azure ML · Feature Store · RAG OpenAI |
| **4 Nov 2026** | 🏁 Producción 100% | DAGs E2E · Monitoring Hub · Runbooks · Stack completo |

---

## 🟦 Parte 1 · Fundación — 20%

**⏱ 30–45 días** · Capas: `EXTRAER` `CARGAR` `ALMACENAR` `GOBERNAR`

> Base mínima viable. Sin esta fundación ninguna capa superior es sostenible.

```
Fuentes (CRM · ERP · APIs)
        ↓
   [ADF · Airbyte]          ← EXTRAER: identificar por sistema, no por dominio
        ↓
  [lh_raw_{sistema}]        ← CARGAR: aterrizaje en Fabric Lakehouse RAW
        ↓
     [OneLake]              ← ALMACENAR: Delta Lake sobre OneLake
        ↕
   [Purview · RBAC]         ← GOBERNAR: catálogo y contratos desde el día 1
```

| Capa | Herramientas |
|------|-------------|
| 📥 EXTRAER | Azure Data Factory · Event Hubs · Airbyte |
| 📤 CARGAR | ADF Copy Activity · Fabric Data Factory · COPY INTO |
| 🗄️ ALMACENAR | Fabric Lakehouse · OneLake · Delta Lake |
| 🛡️ GOBERNAR | Microsoft Purview · Azure Policy · dbt Tests |

---

## 🟠 Parte 2 · Transformar — 40%

**⏱ 45–60 días** · Añade: `TRANSFORMAR` `OBSERVABILIDAD`

> ELT con dbt sobre Fabric. El dato como Software: versionado, testeado y documentado.

```
lh_raw_{sistema}  →  [dbt Bronze]  →  [dbt Silver]  →  [dbt Gold]
                          ↕                 ↕                ↕
                     [Elementary · Azure Monitor · dbt Artifacts]
```

**Arquitectura Medallion con dbt + Fabric:**

| Capa | Lakehouse Item | Modelos dbt | Descripción |
|------|---------------|-------------|-------------|
| Bronze | `lh_bronze_{sistema}` | `brz_{sistema}__{entidad}.sql` | JSON descompuesto, sin transformar |
| Silver | `lh_silver` | `slv_{entidad}.sql` | Limpio, deduplicado, tipado |
| Gold | `wh_gold` | `fct_{hecho}.sql` / `dim_{dim}.sql` | Agregado, listo para consumo |

---

## 🟣 Parte 3 · Semántica — 60%

**⏱ 30–45 días** · Añade: `SEMÁNTICA`

> Una sola definición de métricas para todos los consumidores. dbt + Fabric garantizan consistencia total.

```
Gold (wh_gold)
      ↓
[dbt Semantic Layer]  ←→  [Fabric Semantic Model]
      ↓                           ↓
  REST API                   DirectLake
      ↓                           ↓
  Azure ML                    Power BI
```

**Mejores prácticas dbt + Fabric en la capa semántica:**
- Definir métricas en dbt Semantic Layer como fuente de verdad
- Fabric Semantic Model consume las Gold tables vía DirectLake (cero copia)
- Un Semantic Model por dominio de negocio
- Versionar todas las definiciones en Git junto con los modelos dbt

| Herramienta | Rol |
|-------------|-----|
| dbt Metrics Layer | Define las métricas en YAML versionado |
| Fabric Semantic Model | Expone métricas a Power BI vía DirectLake |
| Power BI Dataset | Compartido entre múltiples reportes |
| Analysis Services | OLAP tabular para modelos complejos |

---

## 🟢 Parte 4 · Aprovechar — 80%

**⏱ 30–45 días** · Añade: `APROVECHAR`

> El dato genera valor: dashboards, modelos ML e IA sobre datos propios. Dato como Feature (DaaF).

```
[Fabric Semantic Model / OneLake]
        ↓              ↓              ↓
   Power BI        Azure ML      Azure OpenAI
 (DirectLake)   (Feature Store)    (RAG)
```

**dbt y Fabric en esta capa:**
- Power BI conecta a **Fabric Semantic Model via DirectLake** — cero latencia, cero copia
- Las Gold tables de dbt alimentan directamente el **Feature Store de Azure ML**
- **Fabric Notebooks** (PySpark) para Feature Engineering sobre OneLake
- RAG con Azure OpenAI + Azure AI Search indexando datos del Lakehouse

**Mejores prácticas:**
- Power BI conecta SIEMPRE al Semantic Model, nunca a tablas crudas
- Feature Store centralizado para consistencia entrenamiento/inferencia
- Versionar modelos ML con MLflow en Azure ML Workspace
- Monitorear drift de datos y modelos como parte de Observabilidad

---

## 🟡 Parte 5 · Orquestador — 100%

**⏱ 20–30 días** · Añade: `ORQUESTADOR`

> El orquestador conecta todo el stack de extremo a extremo.

```
[ADF]  →  EXTRAER → CARGAR
[dbt Jobs on Fabric]  →  TRANSFORMAR → SEMÁNTICA
[Airflow DAGs]  →  coordina dependencias entre etapas
[Fabric Monitoring Hub]  →  visibilidad unificada
```

| Herramienta | Responsabilidad |
|-------------|-----------------|
| Azure Data Factory | Orquesta ingesta y pipelines de carga |
| dbt Jobs (Fabric) | Ejecuta transformaciones Bronze→Silver→Gold |
| Apache Airflow | DAGs complejos con dependencias entre dominios |
| Fabric Monitoring Hub | Visibilidad unificada de todos los jobs |

---

## 📚 Detalle por Capa

---

### 📥 EXTRAER

> Ingesta desde fuentes heterogéneas. Identificar por sistema origen, no por dominio de negocio.

**Mejores prácticas**
- Identificar fuentes por **sistema origen** (CRM, ERP, API) — no por dominio de negocio
- Nunca transformar en extracción — Schema-on-Read estricto
- Registrar metadatos por cada ingesta (timestamp, volumen, estado)
- CDC para capturar solo cambios incrementales
- Reintentos automáticos ante fallos de conexión

**Nomenclatura**
```
Carpetas:    raw/{sistema_origen}/{entidad}/año=YYYY/mes=MM/día=DD/
Archivos:    {sistema}_{entidad}_{timestamp}.parquet
Pipelines:   pl_{sistema}_{entidad}_{tipo}
             ej. pl_crm_clientes_full · pl_erp_pedidos_cdc
```

**Herramientas**

| Herramienta | Descripción | Docs |
|-------------|-------------|------|
| Azure Data Factory | +90 conectores nativos gestionados | [→](https://learn.microsoft.com/es-es/azure/data-factory/introduction) |
| Fabric Data Factory | Pipelines nativos de Fabric con +150 conectores | [→](https://learn.microsoft.com/es-es/fabric/data-factory/data-factory-overview) |
| Azure Event Hubs | Streaming Kafka-compatible | [→](https://learn.microsoft.com/es-es/azure/event-hubs/event-hubs-about) |
| Airbyte OSS | +300 conectores open-source sin vendor lock-in | [→](https://docs.airbyte.com) |

---

### 📤 CARGAR

> Aterrizaje de datos crudos al Lakehouse de Fabric. JSON llegan intactos — dbt los descompone en Bronze.

**Patrón ELT — JSON intactos**

```
API externa → JSON raw → lh_raw_{sistema} → (dbt Bronze descompone)
                ↑
         NO tocar aquí
         Llega intacto
```

**Metadata obligatoria — Nunca cargar sin marcar**

```sql
-- Columnas obligatorias en TODA tabla raw
_ingested_at      TIMESTAMP  -- momento exacto de carga UTC
_source_system    STRING     -- sistema origen: crm | erp | api_pagos
_source_entity    STRING     -- entidad/tabla/endpoint origen
_source_file      STRING     -- ruta o nombre del archivo fuente
_batch_id         STRING     -- ID único de la ejecución del pipeline
_raw_hash         STRING     -- hash MD5/SHA del registro para deduplicación
_pipeline_name    STRING     -- nombre del pipeline ADF
_is_deleted       BOOLEAN    -- flag CDC para eliminaciones lógicas
```

**Nomenclatura de Lakehouse Items en Fabric**
```
Lakehouse RAW:   lh_raw_{sistema}      ej. lh_raw_crm · lh_raw_erp
Tablas raw:      raw__{sistema}__{entidad}
                 ej. raw__crm__clientes · raw__erp__pedidos
Workspaces:      {org}-fabric-dev · {org}-fabric-stage · {org}-fabric-prod
Pipelines ADF:   pl_load_{sistema}_{entidad}_{frecuencia}
```

**Ambientes Dev / Stage / Prod en Fabric**
```
fabric-dev    → lh_raw_crm (datos sintéticos / muestra)
fabric-stage  → lh_raw_crm (copia reciente de prod, anonimizada)
fabric-prod   → lh_raw_crm (datos reales, RBAC restrictivo)
```

**Mejores prácticas con Azure Data Factory**
- Usar **Copy Activity** con mapeo explícito de columnas de auditoría
- Activar **logging detallado** en cada Copy Activity
- Parametrizar pipelines: mismo pipeline, distintos sistemas con variables
- **Checkpoint y reinicio** desde el último punto exitoso en cargas largas
- Separar pipelines de ingesta full vs incremental vs CDC

**Herramientas**

| Herramienta | Descripción | Docs |
|-------------|-------------|------|
| ADF Copy Activity | Carga masiva con metadata de auditoría automática | [→](https://learn.microsoft.com/es-es/azure/data-factory/copy-activity-overview) |
| Fabric Lakehouse (RAW) | Item Fabric para aterrizaje sobre OneLake | [→](https://learn.microsoft.com/es-es/fabric/data-engineering/lakehouse-overview) |
| COPY INTO | Carga masiva SQL nativa desde OneLake | [→](https://learn.microsoft.com/es-es/sql/t-sql/statements/copy-into-transact-sql) |
| dbt Seeds | Catálogos y datos de referencia en Git | [→](https://docs.getdbt.com/docs/build/seeds) |

---

### ⚙️ TRANSFORMAR

> ELT con dbt sobre Fabric. SQL como código: versionado, testeado, documentado, desplegado.

**Mejores prácticas**
- dbt descompone JSON raw en Bronze — nunca en la carga
- Medallion: Bronze (raw descompuesto) → Silver (limpio) → Gold (negocio)
- Tests en cada modelo: `unique`, `not_null`, `relationships`, `accepted_values`
- Documentar en `schema.yml` — la documentación es código ejecutable
- CI/CD: `dbt test` en cada PR, `dbt run` solo tras tests verdes
- dbt Mesh para separar proyectos por dominio con contratos de interfaz

**Nomenclatura dbt + Fabric**
```
Bronze: brz_{sistema}__{entidad}.sql     ej. brz_crm__clientes.sql
Silver: slv_{entidad}.sql                ej. slv_clientes.sql
Gold:   fct_{hecho}.sql                  ej. fct_ventas.sql
        dim_{dimension}.sql              ej. dim_cliente.sql
Schemas Fabric: bronze · silver · gold
Tags dbt:       daily · weekly · critical · pii
```

**Herramientas**

| Herramienta | Descripción | Docs |
|-------------|-------------|------|
| dbt Core / Cloud | Transformación SQL con tests, docs y CI/CD | [→](https://docs.getdbt.com) |
| dbt-fabric adapter | Conecta dbt con Fabric Warehouse y Lakehouse | [→](https://docs.getdbt.com/docs/core/connect-data-platform/fabric-setup) |
| Azure Databricks | Spark para transformaciones complejas sobre OneLake | [→](https://learn.microsoft.com/es-es/azure/databricks/introduction/) |
| dbt-expectations | +50 tests de calidad avanzados | [→](https://github.com/calogica/dbt-expectations) |

---

### 💡 SEMÁNTICA

> Una definición de negocio, múltiples consumidores. dbt + Fabric = Única Fuente de Verdad.

**Mejores prácticas**
- Definir cada métrica una sola vez en dbt Semantic Layer
- Fabric Semantic Model consume Gold vía DirectLake — cero copia
- Versionar definiciones de métricas como cualquier otro código
- Un Semantic Model por dominio de negocio
- Exponer vía API REST para Azure ML y apps externas

**Nomenclatura**
```
Métricas dbt:         {nombre_metrica}     ej. ingresos_netos_mensuales
Dimensiones:          dim_{entidad}        ej. dim_cliente · dim_fecha
Hechos:               fct_{proceso}        ej. fct_ventas · fct_pagos
Semantic Models:      sm_{dominio}         ej. sm_ventas · sm_finanzas
```

**Herramientas**

| Herramienta | Descripción | Docs |
|-------------|-------------|------|
| dbt Semantic Layer | Métricas en YAML versionadas y portables | [→](https://docs.getdbt.com/docs/use-dbt-semantic-layer/dbt-sl) |
| Fabric Semantic Model | DirectLake desde OneLake a Power BI | [→](https://learn.microsoft.com/es-es/fabric/get-started/microsoft-fabric-overview) |
| Power BI DirectLake | Consulta OneLake sin copiar datos | [→](https://learn.microsoft.com/es-es/fabric/fundamentals/direct-lake-overview) |
| Analysis Services | OLAP tabular para modelos semánticos complejos | [→](https://learn.microsoft.com/es-es/azure/analysis-services/analysis-services-overview) |

---

### 🚀 APROVECHAR

> El dato genera valor: BI, ML, IA Generativa, Feature Engineering. Dato como Feature (DaaF).

**Mejores prácticas**
- Power BI conecta SIEMPRE al Semantic Model via DirectLake — nunca a tablas crudas
- Feature Store centralizado para consistencia entrenamiento/inferencia
- Versionar modelos ML con MLflow en Azure ML Workspace
- RAG con Azure OpenAI + Azure AI Search sobre datos del Lakehouse
- Fabric Notebooks para Feature Engineering sobre OneLake con PySpark

**Nomenclatura**
```
Experimentos ML:  {proyecto}_{algoritmo}_{version}    ej. churn_xgboost_v3
Features:         {entidad}_{caracteristica}_{ventana} ej. cliente_compras_30d
Reportes PBI:     RPT_{dominio}_{nombre}               ej. RPT_Ventas_Ejecutivo
Endpoints ML:     ep_{modelo}_{entorno}                ej. ep_churn_prod
```

**Herramientas**

| Herramienta | Descripción | Docs |
|-------------|-------------|------|
| Power BI + DirectLake | BI líder con consulta directa sobre OneLake | [→](https://learn.microsoft.com/es-es/power-bi/fundamentals/power-bi-overview) |
| Azure Machine Learning | MLOps: entrenamiento, registro y despliegue | [→](https://learn.microsoft.com/es-es/azure/machine-learning/overview-what-is-azure-machine-learning) |
| Fabric Notebooks | PySpark integrado en Fabric para ML | [→](https://learn.microsoft.com/es-es/fabric/data-engineering/how-to-use-notebook) |
| Azure OpenAI Service | GPT-4o y embeddings sobre datos propios (RAG) | [→](https://learn.microsoft.com/es-es/azure/ai-services/openai/overview) |
| MLflow en Azure ML | Tracking y versionado del ciclo de vida ML | [→](https://learn.microsoft.com/es-es/azure/machine-learning/concept-mlflow) |

---

### 🗄️ ALMACENAR

> OneLake como Single Store. Delta/Parquet abierto. Sin copias entre capas — solo punteros.

**Mejores prácticas**
- OneLake como única fuente de verdad física
- Delta Lake como formato base: ACID, time travel, schema evolution
- Lakehouse items para Bronze/Silver, Warehouse para Gold/Semántica
- Managed Identity siempre — nunca connection strings en código
- F-SKUs: escalar por dominio según demanda real

**Nomenclatura**
```
Lakehouse items: lh_{capa}_{dominio}   ej. lh_bronze_crm · lh_silver · lh_gold
Warehouse items: wh_{dominio}          ej. wh_ventas · wh_finanzas
Workspaces:      {org}-fabric-{env}    ej. acme-fabric-prod
Schemas:         {capa}_{dominio}      ej. silver_clientes · gold_ventas
```

**Herramientas**

| Herramienta | Descripción | Docs |
|-------------|-------------|------|
| Fabric Lakehouse | Bronze y Silver sobre Delta Lake en OneLake | [→](https://learn.microsoft.com/es-es/fabric/data-engineering/lakehouse-overview) |
| Fabric Warehouse | Gold y Semántica con SQL serverless | [→](https://learn.microsoft.com/es-es/fabric/data-warehouse/data-warehousing) |
| OneLake | Single Data Lake para toda la organización | [→](https://learn.microsoft.com/es-es/fabric/onelake/onelake-overview) |
| Delta Lake | ACID + time travel sobre Parquet abierto | [→](https://docs.delta.io/latest/index.html) |

---

### 🛡️ GOBERNAR

> One Governance con Purview + Fabric. Catálogo, linaje, contratos y RBAC desde el primer día.

**Mejores prácticas**
- Registrar todos los activos en Purview desde el día 1
- Data Contracts por fuente: schema, SLA, propietario (`meta.owner` en dbt)
- RBAC granular: acceso mínimo por rol y workspace de Fabric
- dbt Tests como contratos ejecutables en cada pipeline
- Code Review obligatorio con PR para cambios en modelos dbt Gold
- One Access Control Experience de Fabric: un solo punto de control

**Nomenclatura**
```
Dominios Purview:  {area_negocio}      ej. Finanzas · Clientes · Operaciones
Clasificaciones:   PII · Confidencial · Interno · Público
Roles Fabric:      Admin · Member · Contributor · Viewer (por workspace)
Contratos dbt:     contract_{sistema}_{entidad}_v{N}.yaml
```

**Herramientas**

| Herramienta | Descripción | Docs |
|-------------|-------------|------|
| Microsoft Purview | Catálogo, linaje y clasificación integrado con Fabric | [→](https://learn.microsoft.com/es-es/purview/purview) |
| Fabric One Access Control | Permisos unificados para todos los items de Fabric | [→](https://learn.microsoft.com/es-es/fabric/security/permission-model) |
| dbt Tests + Contracts | Tests YAML como contratos ejecutables | [→](https://docs.getdbt.com/docs/build/data-tests) |
| Azure Policy | Políticas de cumplimiento a escala para Azure | [→](https://learn.microsoft.com/es-es/azure/governance/policy/overview) |

---

### 🔭 OBSERVABILIDAD

> Detectar problemas de datos antes de impactar al negocio. Fabric Monitoring Hub + Elementary.

**Mejores prácticas**
- Métricas de calidad por dataset: completitud, unicidad, frescura
- Alertas automáticas cuando los datos no llegan en el SLA
- Linaje end-to-end con Purview + dbt Artifacts
- dbt Docs publicados como referencia interna
- Monitoring Hub de Fabric para visibilidad de todos los jobs

**Nomenclatura**
```
Alertas:  alert_{severidad}_{pipeline}_{condicion}
          ej. alert_P1_ingest_clientes_delay
Métricas: {entidad}_{dimension}
          ej. clientes_completitud · ventas_frescura
Tags:     criticidad=alta · dominio=ventas · propietario=equipo_data
```

**Herramientas**

| Herramienta | Descripción | Docs |
|-------------|-------------|------|
| Fabric Monitoring Hub | Centro unificado de monitoreo de todos los jobs Fabric | [→](https://learn.microsoft.com/es-es/fabric/admin/monitoring-hub) |
| Elementary OSS | Observabilidad nativa de dbt: anomalías y freshness | [→](https://docs.elementary-data.com) |
| Azure Monitor | Métricas, logs y alertas para toda la plataforma | [→](https://learn.microsoft.com/es-es/azure/azure-monitor/overview) |
| dbt Artifacts & Docs | Metadatos de ejecución y docs auto-generados | [→](https://docs.getdbt.com/reference/artifacts/dbt-artifacts) |

---

### 🤖 ORQUESTADOR

> Sistema nervioso central. ADF orquesta ingesta, dbt Jobs transforma, Airflow gestiona DAGs complejos.

**Mejores prácticas**
- DAGs explícitos — nunca cron sin gestión de dependencias
- ADF orquesta ingesta, dbt transforma — separar responsabilidades
- dbt Jobs en Fabric para ejecutar transformaciones en el mismo motor
- Mismo DAG en dev/stage/prod vía variables de entorno

**Nomenclatura**
```
DAGs Airflow:  {dominio}_{proceso}_{frecuencia}
               ej. ventas_ingesta_diaria
Pipelines ADF: pl_{accion}_{sistema}_{destino}
               ej. pl_copy_crm_lh_raw
Jobs dbt:      job_{env}_{tipo}_{frecuencia}
               ej. job_prod_incremental_daily
```

**Herramientas**

| Herramienta | Descripción | Docs |
|-------------|-------------|------|
| Azure Data Factory | Orquestador visual para ingesta E2E | [→](https://learn.microsoft.com/es-es/azure/data-factory/concepts-pipelines-activities) |
| dbt Jobs on Fabric | Transformaciones directo sobre Fabric | [→](https://docs.getdbt.com/docs/deploy/job-settings) |
| Apache Airflow | DAGs Python para orquestación compleja | [→](https://airflow.apache.org/docs/) |
| Fabric Data Pipelines | Pipelines nativos integrados con OneLake | [→](https://learn.microsoft.com/es-es/fabric/data-factory/data-factory-overview) |

---

## 🚀 Instalación

```bash
git clone https://github.com/lizandro-mc/modern-data-stack.git
cd modern-data-stack
npm install
npm run dev        # → localhost:5173/modern-data-stack/
npm run deploy     # → GitHub Pages
```

Cada `git push` a `main` despliega automáticamente vía GitHub Actions.

### Estructura del proyecto
```
src/
├── data/
│   ├── blockData.js      ← contenido de capas + dbt + Fabric
│   ├── partsConfig.js    ← partes + roadmap con hitos y entregables
│   └── objectives.js     ← principios DaaP
├── components/
│   ├── Header.jsx
│   ├── NavParts.jsx
│   ├── DiagramPart.jsx
│   ├── BlockDetail.jsx
│   ├── ProtagonistDetail.jsx  ← páginas dbt y Fabric
│   ├── ProgressCard.jsx
│   ├── RoadmapView.jsx        ← roadmap visual con entregables
│   ├── ToolsGrid.jsx
│   └── Tooltip.jsx
└── App.jsx                    ← tabs: Stack · dbt · Fabric · Roadmap
```

### Cómo editar contenido

| Qué cambiar | Dónde |
|-------------|-------|
| Herramientas / prácticas dbt | `src/data/blockData.js` → `DBT` |
| Herramientas / prácticas Fabric | `src/data/blockData.js` → `FABRIC` |
| Capas del pipeline | `src/data/blockData.js` → bloque correspondiente |
| Hitos del roadmap | `src/data/partsConfig.js` → `ROADMAP` |
| Entregables por fase | `src/components/RoadmapView.jsx` → `PARTS_INFO` |
| Principios DaaP | `src/data/objectives.js` |

---

<div align="center">
  <strong>Modern Data Stack · Azure DaaP · dbt + Microsoft Fabric</strong><br/>
  <a href="https://lizandro-mc.github.io/modern-data-stack">lizandro-mc.github.io/modern-data-stack</a>
</div>