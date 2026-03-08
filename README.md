# 🏗️ Modern Data Stack — Azure DaaP

Arquitectura interactiva del Modern Data Stack sobre Azure, diseñada como **Data as a Product (DaaP)**.

Incluye las 5 partes de implementación progresiva, mejores prácticas, estrategias de nomenclatura, herramientas con documentación oficial, estimados de tiempo y progreso por etapa.

🔗 **Demo en vivo:** [https://TU_USUARIO.github.io/modern-data-stack](https://TU_USUARIO.github.io/modern-data-stack)

---

## 🧱 Stack cubierto

| Capa | Tecnologías |
|---|---|
| **EXTRAER** | Azure Data Factory, Event Hubs, Airbyte |
| **CARGAR** | ADF, Synapse Pipelines, dbt Seeds |
| **TRANSFORMAR** | dbt Core/Cloud, Azure Databricks, Synapse |
| **SEMÁNTICA** | Microsoft Fabric, dbt Metrics, Power BI |
| **APROVECHAR** | Power BI, Azure ML, Azure OpenAI, MLflow |
| **ALMACENAR** | ADLS Gen2, Fabric Lakehouse, Delta Lake |
| **GOBERNAR** | Microsoft Purview, Azure Policy, RBAC |
| **OBSERVABILIDAD** | Elementary, Azure Monitor, dbt Artifacts |
| **ORQUESTADOR** | ADF, Apache Airflow, dbt Jobs |

---

## 🚀 Despliegue local

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/modern-data-stack.git
cd modern-data-stack

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

---

## 📦 Despliegue en GitHub Pages

```bash
# Construir y desplegar
npm run deploy
```

Esto ejecuta `vite build` y publica la carpeta `dist/` en la rama `gh-pages`.

---

## 🗂️ Estructura del proyecto

```
modern-data-stack/
├── public/
│   └── favicon.ico
├── src/
│   ├── data/
│   │   ├── blockData.js        # Descripción, prácticas, nomenclatura y herramientas por bloque
│   │   ├── partsConfig.js      # Configuración de cada parte (%, días, bloques activos)
│   │   └── objectives.js       # Principios DaaP
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── NavParts.jsx
│   │   ├── DiagramPart.jsx     # Diagrama principal interactivo
│   │   ├── BlockDetail.jsx     # Página de detalle por bloque
│   │   ├── ProgressCard.jsx    # Barra de progreso y estimados
│   │   ├── ToolsGrid.jsx       # Vista rápida de herramientas
│   │   └── Tooltip.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## ✏️ Cómo editar contenido

Todo el contenido está separado en archivos de datos en `src/data/`:

- **Agregar herramienta:** edita `src/data/blockData.js` → sección `herramientas` del bloque correspondiente.
- **Cambiar estimados:** edita `src/data/partsConfig.js` → campo `dias` de cada parte.
- **Agregar nueva parte:** agrega un objeto en `partsConfig.js` con su `activeBlocks`.
- **Cambiar principios DaaP:** edita `src/data/objectives.js`.

---

## 📄 Licencia

MIT — libre para uso, modificación y distribución.
