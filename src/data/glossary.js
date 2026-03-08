export const glossary = [
  // ── A ─────────────────────────────────────────────────────────────────────
  {
    term: 'ACID',
    full: 'Atomicity, Consistency, Isolation, Durability',
    desc: 'Las 4 propiedades que garantizan transacciones confiables. Delta Lake implementa ACID sobre Parquet.',
    url: 'https://docs.delta.io/latest/concurrency-control.html',
  },
  {
    term: 'ADF',
    full: 'Azure Data Factory',
    desc: 'Orquestación e integración de datos de Azure. +90 conectores nativos. En banca se usa con Self-Hosted IR para conectar sistemas on-prem.',
    url: 'https://learn.microsoft.com/es-es/azure/data-factory/introduction',
  },
  {
    term: 'ADLS Gen2',
    full: 'Azure Data Lake Storage Generation 2',
    desc: 'Almacenamiento jerárquico de Azure optimizado para analítica a escala. Base física de OneLake.',
    url: 'https://learn.microsoft.com/es-es/azure/storage/blobs/data-lake-storage-introduction',
  },
  {
    term: 'ALM',
    full: 'Asset Liability Management',
    desc: 'Gestión del balance bancario: mide el gap entre activos y pasivos por plazo y tasa. Fuente para los modelos de tesorería y riesgo de mercado.',
    url: 'https://learn.microsoft.com/es-es/azure/architecture/data-guide/',
  },
  {
    term: 'AML',
    full: 'Anti-Money Laundering (Prevención de Lavado de Dinero)',
    desc: 'Exige monitoreo transaccional, detección de patrones sospechosos y reporte a la UIF. Caso de uso de ML en tiempo real sobre Event Hubs.',
    url: 'https://www.fatf-gafi.org/',
  },
  {
    term: 'API',
    full: 'Application Programming Interface',
    desc: 'Interfaz para comunicar sistemas. En este stack se usa para exponer la capa semántica desde herramientas externas.',
    url: 'https://learn.microsoft.com/es-es/azure/architecture/best-practices/api-design',
  },
  // ── B ─────────────────────────────────────────────────────────────────────
  {
    term: 'BI',
    full: 'Business Intelligence',
    desc: 'Tecnologías para analizar datos de negocio. Power BI es la herramienta principal, conectando al Fabric Semantic Model vía DirectLake.',
    url: 'https://learn.microsoft.com/es-es/power-bi/fundamentals/power-bi-overview',
  },
  // ── C ─────────────────────────────────────────────────────────────────────
  {
    term: 'CAP',
    full: 'Consistency, Availability, Partition Tolerance',
    desc: 'Teorema: un sistema distribuido solo garantiza 2 de estas 3 propiedades. Explica por qué existen OLTP y OLAP como sistemas separados.',
    url: 'https://www.ibm.com/topics/cap-theorem',
  },
  {
    term: 'CDC',
    full: 'Change Data Capture',
    desc: 'Captura solo los cambios (inserciones, actualizaciones, eliminaciones) en el origen. Reduce la carga hasta 90% vs carga completa. Clave para conectar el core bancario.',
    url: 'https://learn.microsoft.com/es-es/azure/data-factory/concepts-change-data-capture',
  },
  {
    term: 'CI/CD',
    full: 'Continuous Integration / Continuous Delivery',
    desc: 'Automatiza integración y despliegue. En dbt: cada PR ejecuta dbt test automáticamente antes de merge a producción.',
    url: 'https://docs.getdbt.com/docs/deploy/continuous-integration',
  },
  {
    term: 'CNBV',
    full: 'Comisión Nacional Bancaria y de Valores',
    desc: 'Regulador bancario de México. Exige reportes periódicos R01-R11 y supervisión del balance y riesgo. El stack debe producir estos reportes desde el dominio regulatorio.',
    url: 'https://www.cnbv.gob.mx/',
  },
  {
    term: 'CRS',
    full: 'Common Reporting Standard',
    desc: 'Estándar OCDE de intercambio automático de información fiscal entre países. Obliga a los bancos a identificar residentes fiscales extranjeros y reportarlos.',
    url: 'https://www.oecd.org/tax/automatic-exchange/',
  },
  // ── D ─────────────────────────────────────────────────────────────────────
  {
    term: 'DaaF',
    full: 'Data as a Feature',
    desc: 'Los datos son features de modelos ML, preparados con la misma rigurosidad que software. Feature Store centralizado para consistencia entre entrenamiento e inferencia.',
    url: 'https://learn.microsoft.com/es-es/azure/machine-learning/concept-data',
  },
  {
    term: 'DaaP',
    full: 'Data as a Product',
    desc: 'Los datasets son productos con propietario, documentación, tests, SLA y usuarios. Principio fundador de este stack.',
    url: 'https://martinfowler.com/articles/data-mesh-principles.html',
  },
  {
    term: 'DAG',
    full: 'Directed Acyclic Graph (Grafo Acíclico Dirigido)',
    desc: 'Grafo de dependencias entre tareas sin ciclos. En Airflow define el orden del pipeline. En dbt, el linaje de modelos es un DAG automático.',
    url: 'https://airflow.apache.org/docs/apache-airflow/stable/concepts/dags.html',
  },
  {
    term: 'dbt',
    full: 'Data Build Tool',
    desc: 'Herramienta de transformación SQL como código: versionado en Git, tests automáticos, documentación ejecutable y CI/CD. Estándar de la industria para la capa de transformación.',
    url: 'https://docs.getdbt.com/docs/introduction',
  },
  {
    term: 'Delta Lake',
    full: 'Delta Lake (formato abierto)',
    desc: 'ACID, time travel (viajes en el tiempo) y schema enforcement sobre Parquet. Formato base de OneLake y Fabric Lakehouse. Portable a cualquier plataforma.',
    url: 'https://docs.delta.io/latest/index.html',
  },
  {
    term: 'DirectLake',
    full: 'DirectLake (modo Power BI en Fabric)',
    desc: 'Power BI lee Delta en OneLake directamente sin copiar ni importar datos. Combina velocidad de Import Mode con frescura de DirectQuery.',
    url: 'https://learn.microsoft.com/es-es/fabric/fundamentals/direct-lake-overview',
  },
  {
    term: 'DW',
    full: 'Data Warehouse (Almacén de Datos)',
    desc: 'Base de datos OLAP para análisis masivo. En este stack: Fabric Warehouse para la capa Gold y Semántica.',
    url: 'https://learn.microsoft.com/es-es/fabric/data-warehouse/data-warehousing',
  },
  // ── E ─────────────────────────────────────────────────────────────────────
  {
    term: 'EAD',
    full: 'Exposure At Default',
    desc: 'Exposición del banco al momento en que un deudor entra en default. Componente clave del cálculo ECL en IFRS 9: ECL = PD × LGD × EAD.',
    url: 'https://www.bis.org/bcbs/publ/d424.htm',
  },
  {
    term: 'ECL',
    full: 'Expected Credit Loss (Pérdida Esperada)',
    desc: 'Provisión contable central de IFRS 9. ECL = PD × LGD × EAD. Se calcula por staging (Stage 1/2/3) y requiere modelos estadísticos versionados con MRM.',
    url: 'https://www.ifrs.org/issued-standards/list-of-standards/ifrs-9-financial-instruments/',
  },
  {
    term: 'ELT',
    full: 'Extract, Load, Transform',
    desc: 'Cargar primero al almacén cloud en crudo y transformar después dentro del motor. Opuesto a ETL. Patrón base de este stack.',
    url: 'https://learn.microsoft.com/es-es/azure/architecture/data-guide/relational-data/etl',
  },
  {
    term: 'ETL',
    full: 'Extract, Transform, Load',
    desc: 'Patrón tradicional: transformar antes de cargar. Este stack usa ELT para aprovechar la potencia del motor cloud.',
    url: 'https://learn.microsoft.com/es-es/azure/architecture/data-guide/relational-data/etl',
  },
  {
    term: 'ExpressRoute',
    full: 'Azure ExpressRoute',
    desc: 'Conexión privada dedicada entre las instalaciones del banco y Azure sin pasar por internet público. Obligatorio para entornos productivos bancarios.',
    url: 'https://learn.microsoft.com/es-es/azure/expressroute/expressroute-introduction',
  },
  // ── F ─────────────────────────────────────────────────────────────────────
  {
    term: 'FATCA',
    full: 'Foreign Account Tax Compliance Act',
    desc: 'Ley de EEUU que obliga a bancos extranjeros a reportar cuentas de ciudadanos americanos al IRS. Requiere identificación KYC y flujo de reporte al SAT/IRS.',
    url: 'https://www.irs.gov/businesses/corporations/foreign-account-tax-compliance-act-fatca',
  },
  {
    term: 'FRTB',
    full: 'Fundamental Review of the Trading Book',
    desc: 'Marco Basilea IV para riesgo de mercado. Exige cálculo de VaR, Expected Shortfall y sensibilidades por factor de riesgo.',
    url: 'https://www.bis.org/bcbs/publ/d457.htm',
  },
  {
    term: 'F-SKU',
    full: 'Fabric Stock Keeping Unit',
    desc: 'Unidad de capacidad de cómputo en Microsoft Fabric, medida en CUs. En banca: separar F-SKUs obligatoriamente entre zona PCI, regulatoria y analítica.',
    url: 'https://learn.microsoft.com/es-es/fabric/enterprise/licenses',
  },
  // ── G ─────────────────────────────────────────────────────────────────────
  {
    term: 'GDPR',
    full: 'General Data Protection Regulation',
    desc: 'Regulación EU sobre datos personales. Aplica si el banco procesa datos de ciudadanos europeos. Requiere consentimiento, derecho al olvido y notificación de brechas.',
    url: 'https://gdpr.eu/',
  },
  // ── I ─────────────────────────────────────────────────────────────────────
  {
    term: 'IFRS 9',
    full: 'International Financial Reporting Standard 9',
    desc: 'Norma contable: provisiones por pérdida esperada (ECL), staging de créditos (Stage 1/2/3). Requiere modelos PD/LGD/EAD y SCD 2 para historial de staging.',
    url: 'https://www.ifrs.org/issued-standards/list-of-standards/ifrs-9-financial-instruments/',
  },
  // ── K ─────────────────────────────────────────────────────────────────────
  {
    term: 'KPI',
    full: 'Key Performance Indicator (Indicador Clave de Rendimiento)',
    desc: 'Métrica cuantificable de rendimiento. Se define una sola vez en la capa semántica (dbt Metrics / Fabric Semantic Model) para todos los consumidores.',
    url: 'https://docs.getdbt.com/docs/build/metrics-overview',
  },
  {
    term: 'KYC',
    full: 'Know Your Customer (Conoce a tu Cliente)',
    desc: 'Proceso obligatorio de identificación y verificación de la identidad del cliente. Base del cumplimiento AML. Genera datos PII que requieren máxima protección.',
    url: 'https://www.fatf-gafi.org/en/topics/fatf-recommendations.html',
  },
  // ── L ─────────────────────────────────────────────────────────────────────
  {
    term: 'LCR',
    full: 'Liquidity Coverage Ratio (Ratio de Cobertura de Liquidez)',
    desc: 'Exigencia Basilea III: activos líquidos de alta calidad / salidas netas de efectivo en 30 días ≥ 100%. Calculado diariamente en el dominio de tesorería.',
    url: 'https://www.bis.org/publ/bcbs238.htm',
  },
  {
    term: 'LGD',
    full: 'Loss Given Default (Pérdida Dado el Incumplimiento)',
    desc: 'Porcentaje del EAD que el banco pierde si el deudor hace default. Componente de ECL en IFRS 9 y cálculo de capital en Basilea.',
    url: 'https://www.bis.org/bcbs/publ/d424.htm',
  },
  {
    term: 'LOS',
    full: 'Loan Origination System (Sistema de Originación de Créditos)',
    desc: 'Sistema que gestiona solicitudes, evaluación, aprobación y desembolso de créditos. Fuente clave para los dominios de riesgo de crédito e IFRS 9.',
    url: 'https://learn.microsoft.com/es-es/azure/architecture/data-guide/',
  },
  // ── M ─────────────────────────────────────────────────────────────────────
  {
    term: 'Medallion',
    full: 'Arquitectura Medallion (Bronze / Silver / Gold)',
    desc: 'Bronze (datos crudos descompuestos), Silver (limpios, enmascarados para dev), Gold (lógica regulatoria y de negocio). Estándar en Fabric y dbt.',
    url: 'https://learn.microsoft.com/es-es/azure/databricks/lakehouse/medallion',
  },
  {
    term: 'ML',
    full: 'Machine Learning (Aprendizaje Automático)',
    desc: 'En banca: scoring IFRS 9, detección de fraude, AML, churn, propensión. Azure ML gestiona el ciclo completo con validación MRM obligatoria.',
    url: 'https://learn.microsoft.com/es-es/azure/machine-learning/overview-what-is-azure-machine-learning',
  },
  {
    term: 'MLOps',
    full: 'Machine Learning Operations',
    desc: 'DevOps aplicado a modelos ML: entrenamiento, registro, despliegue, monitoreo y reentrenamiento. MLflow en Azure ML para trazabilidad completa.',
    url: 'https://learn.microsoft.com/es-es/azure/machine-learning/concept-model-management-and-deployment',
  },
  {
    term: 'MPP',
    full: 'Massively Parallel Processing',
    desc: 'Arquitectura que distribuye consultas entre nodos para procesarlas en paralelo a escala de petabytes. Base de Fabric Warehouse y Azure Synapse.',
    url: 'https://learn.microsoft.com/es-es/azure/synapse-analytics/sql-data-warehouse/massively-parallel-processing-mpp-architecture',
  },
  {
    term: 'MRM',
    full: 'Model Risk Management (Gestión del Riesgo de Modelos)',
    desc: 'Proceso de validación independiente de modelos estadísticos y ML. Exigido por reguladores bancarios para modelos usados en decisiones de capital y riesgo (IFRS 9, scoring).',
    url: 'https://www.bis.org/publ/work683.htm',
  },
  // ── N ─────────────────────────────────────────────────────────────────────
  {
    term: 'NPL',
    full: 'Non-Performing Loan (Crédito en Mora)',
    desc: 'Crédito con pagos vencidos >90 días. Ratio NPL = cartera vencida / cartera total. KPI regulatorio clave reportado a CNBV y analizado en el dominio de riesgo de crédito.',
    url: 'https://www.bis.org/bcbs/publ/d424.htm',
  },
  {
    term: 'NSFR',
    full: 'Net Stable Funding Ratio (Ratio de Financiación Estable Neta)',
    desc: 'Exigencia Basilea III: fuentes de financiación estable disponible / fuentes requeridas ≥ 100%. Calculado mensualmente en el dominio de tesorería.',
    url: 'https://www.bis.org/bcbs/publ/d295.htm',
  },
  // ── O ─────────────────────────────────────────────────────────────────────
  {
    term: 'OLAP',
    full: 'Online Analytical Processing',
    desc: 'Bases de datos para análisis masivo de datos históricos. Fabric Warehouse y Lakehouse son OLAP. Optimizadas para lectura, no para escrituras frecuentes.',
    url: 'https://learn.microsoft.com/es-es/azure/architecture/data-guide/relational-data/online-analytical-processing',
  },
  {
    term: 'OLTP',
    full: 'Online Transaction Processing',
    desc: 'Bases de datos operacionales (core bancario, CRM, LOS). Optimizadas para escrituras rápidas. No aptas para análisis directo — se extrae vía CDC hacia el stack.',
    url: 'https://learn.microsoft.com/es-es/azure/architecture/data-guide/relational-data/online-transaction-processing',
  },
  {
    term: 'OneLake',
    full: 'OneLake (Microsoft Fabric)',
    desc: 'Único data lake lógico de Fabric. Base física: ADLS Gen2. Todos los items Fabric almacenan datos aquí en Delta/Parquet abierto.',
    url: 'https://learn.microsoft.com/es-es/fabric/onelake/onelake-overview',
  },
  {
    term: 'OSS',
    full: 'Open Source Software (Software de Código Abierto)',
    desc: 'En este stack: dbt Core, Airbyte, Debezium, Elementary, Apache Airflow. Reduce costos y dependencia de proveedores.',
    url: 'https://opensource.org/osd',
  },
  // ── P ─────────────────────────────────────────────────────────────────────
  {
    term: 'Parquet',
    full: 'Apache Parquet (formato columnar)',
    desc: 'Formato columnar optimizado para análisis. Base de Delta Lake. Hasta 10x más rápido y compacto que CSV o JSON para cargas analíticas.',
    url: 'https://parquet.apache.org/docs/',
  },
  {
    term: 'PCI DSS',
    full: 'Payment Card Industry Data Security Standard',
    desc: 'Estándar de seguridad para datos de tarjetas. Prohíbe almacenar CVV, exige enmascarar PAN. En Fabric: workspace PCI aislado con F-SKU y Private Link dedicados.',
    url: 'https://www.pcisecuritystandards.org/',
  },
  {
    term: 'PD',
    full: 'Probability of Default (Probabilidad de Incumplimiento)',
    desc: 'Probabilidad de que un deudor no pueda pagar en los próximos 12 meses (Stage 1) o en vida del crédito (Stage 2/3). Componente central de IFRS 9 y Basilea.',
    url: 'https://www.bis.org/bcbs/publ/d424.htm',
  },
  {
    term: 'PII',
    full: 'Personally Identifiable Information',
    desc: 'Datos que identifican a una persona: nombre, email, RFC, CURP, teléfono. En Silver: siempre enmascarados para dev/stage. En prod: sensitivity label Purview.',
    url: 'https://learn.microsoft.com/es-es/purview/sensitivity-labels',
  },
  {
    term: 'PR',
    full: 'Pull Request (Solicitud de Integración)',
    desc: 'Propuesta de cambio en Git con revisión de pares. En dbt: obligatorio para cambios en modelos Gold, métricas regulatorias o contratos de datos.',
    url: 'https://docs.github.com/es/pull-requests',
  },
  // ── R ─────────────────────────────────────────────────────────────────────
  {
    term: 'RAG',
    full: 'Retrieval Augmented Generation',
    desc: 'LLM (GPT-4o) + búsqueda sobre datos propios del banco para respuestas contextualizadas. Azure OpenAI + Azure AI Search indexando datos del Lakehouse.',
    url: 'https://learn.microsoft.com/es-es/azure/search/retrieval-augmented-generation-overview',
  },
  {
    term: 'RBAC',
    full: 'Role-Based Access Control (Control de Acceso Basado en Roles)',
    desc: 'Permisos asignados a roles, no a personas. En banca: roles DataOwner, DataEngineer, DataReader, MLEngineer, Auditor. El Auditor tiene lectura completa pero no puede exportar.',
    url: 'https://learn.microsoft.com/es-es/fabric/security/permission-model',
  },
  {
    term: 'REST',
    full: 'Representational State Transfer',
    desc: 'Estilo arquitectónico para APIs web. La capa semántica del stack se expone vía API REST para consumo desde sistemas regulatorios externos.',
    url: 'https://learn.microsoft.com/es-es/azure/architecture/best-practices/api-design',
  },
  {
    term: 'RLS',
    full: 'Row-Level Security (Seguridad a Nivel de Fila)',
    desc: 'Cada usuario solo ve las filas a las que tiene acceso (ej: un gerente de sucursal solo ve sus clientes). Configurado en Fabric Warehouse y Semantic Model.',
    url: 'https://learn.microsoft.com/es-es/fabric/security/service-admin-row-level-security',
  },
  {
    term: 'RPO',
    full: 'Recovery Point Objective (Objetivo de Punto de Recuperación)',
    desc: 'Pérdida máxima de datos aceptable ante un desastre. Ej: RPO = 1h significa perder máximo 1h de datos. Define la frecuencia mínima de respaldo o replicación.',
    url: 'https://learn.microsoft.com/es-es/azure/reliability/disaster-recovery-overview',
  },
  {
    term: 'RTO',
    full: 'Recovery Time Objective (Objetivo de Tiempo de Recuperación)',
    desc: 'Tiempo máximo para restaurar el servicio tras un desastre. Ej: RTO = 4h. Define el nivel de redundancia y automatización de failover necesario.',
    url: 'https://learn.microsoft.com/es-es/azure/reliability/disaster-recovery-overview',
  },
  // ── S ─────────────────────────────────────────────────────────────────────
  {
    term: 'SCD',
    full: 'Slowly Changing Dimension (Dimensión que Cambia Lentamente)',
    desc: 'Patrón para manejar cambios históricos en dimensiones (clientes, productos). SCD 2 es el estándar bancario: guarda historial completo con valid_from / valid_to. Crítico para IFRS 9 (staging) y análisis de cohortes.',
    url: 'https://docs.getdbt.com/docs/build/snapshots',
  },
  {
    term: 'Schema-on-Read',
    full: 'Schema-on-Read (Esquema en Lectura)',
    desc: 'Datos almacenados sin estructura impuesta (tal como llegan) y el esquema se aplica al leerlos. Usado en RAW/Bronze para preservar archivos COBOL y JSON intactos.',
    url: 'https://docs.delta.io/latest/schema-validation.html',
  },
  {
    term: 'SHIR',
    full: 'Self-Hosted Integration Runtime',
    desc: 'Agente ADF instalado dentro de la red del banco para conectar sistemas on-prem con Azure sin exponer puertos. Obligatorio para bancos con core bancario on-prem.',
    url: 'https://learn.microsoft.com/es-es/azure/data-factory/create-self-hosted-integration-runtime',
  },
  {
    term: 'SLA',
    full: 'Service Level Agreement (Acuerdo de Nivel de Servicio)',
    desc: 'Compromiso formal de disponibilidad, frescura o calidad de un dato. En banca: el reporte R01 a Banxico tiene SLA regulatorio — no puede llegar tarde.',
    url: 'https://learn.microsoft.com/es-es/azure/azure-monitor/alerts/alerts-overview',
  },
  {
    term: 'SOC 2',
    full: 'Service Organization Control 2',
    desc: 'Auditoría de seguridad cloud. Microsoft Fabric y Azure tienen certificación SOC 2 Tipo II — requerida para uso en entornos bancarios regulados.',
    url: 'https://learn.microsoft.com/es-es/azure/compliance/offerings/offering-soc-2',
  },
  {
    term: 'SQL',
    full: 'Structured Query Language',
    desc: 'Lenguaje estándar para bases de datos relacionales. dbt usa SQL para todos los modelos de transformación.',
    url: 'https://docs.getdbt.com/docs/core/connect-data-platform/about-core-connections',
  },
  // ── U ─────────────────────────────────────────────────────────────────────
  {
    term: 'UIF',
    full: 'Unidad de Inteligencia Financiera',
    desc: 'Organismo de la SHCP en México receptor de reportes de operaciones sospechosas (AML). Los bancos deben reportar dentro de plazos estrictos con datos trazables.',
    url: 'https://www.uif.hacienda.gob.mx/',
  },
  // ── V ─────────────────────────────────────────────────────────────────────
  {
    term: 'VaR',
    full: 'Value at Risk (Valor en Riesgo)',
    desc: 'Pérdida máxima esperada en un portafolio con un nivel de confianza dado (ej: 99%) en un horizonte temporal. Métrica central de riesgo de mercado.',
    url: 'https://www.bis.org/publ/work347.htm',
  },
  // ── Z ─────────────────────────────────────────────────────────────────────
  {
    term: 'Zero-copy',
    full: 'Zero-copy (clonación sin duplicar datos)',
    desc: 'Referencia (shortcut) a datos en lugar de duplicarlos físicamente. OneLake usa zero-copy para compartir datos entre dominios sin moverlos.',
    url: 'https://learn.microsoft.com/es-es/fabric/onelake/onelake-shortcuts',
  },
]