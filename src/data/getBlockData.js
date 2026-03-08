import { blockData }   from './blockData'
import { blockDataEn } from './blockDataEn'

/**
 * Devuelve los datos de un bloque en el idioma indicado.
 * Para 'es' retorna blockData tal cual.
 * Para 'en' fusiona blockData (estructura + urls + colores) con blockDataEn
 * (solo campos traducibles), sin tocar los archivos originales.
 */
export function getBlockData(name, lang) {
  const base = blockData[name]
  if (!base) return null
  if (lang !== 'en') return base

  const en = blockDataEn[name]
  if (!en) return base

  return {
    ...base,

    // Campos de texto simples
    desc:        en.desc        ?? base.desc,
    practicas:   en.practicas   ?? base.practicas,
    nomenclatura: en.nomenclatura ?? base.nomenclatura,

    // herramientas: name + url vienen de base, solo desc se traduce
    herramientas: base.herramientas.map((h, i) => ({
      ...h,
      desc: en.herramientas?.[i]?.desc ?? h.desc,
    })),

    // metadataObligatoria: campo + tipo vienen de base, solo desc se traduce
    ...(base.metadataObligatoria && {
      metadataObligatoria: base.metadataObligatoria.map((m, i) => ({
        ...m,
        desc: en.metadataObligatoria?.[i]?.desc ?? m.desc,
      })),
    }),

    // secciones: titulo + items se traducen completos
    ...(base.secciones && {
      secciones: base.secciones.map((s, i) => ({
        ...s,
        titulo: en.secciones?.[i]?.titulo ?? s.titulo,
        items:  en.secciones?.[i]?.items  ?? s.items,
      })),
    }),

    // rbac: titulo, explicacion, permisos y matrizAcceso se traducen
    ...(base.rbac && {
      rbac: {
        ...base.rbac,
        titulo:      en.rbac?.titulo      ?? base.rbac.titulo,
        explicacion: en.rbac?.explicacion ?? base.rbac.explicacion,
        rolesFabric: base.rbac.rolesFabric.map((r, i) => ({
          ...r,
          permisos: en.rbac?.rolesFabric?.[i]?.permisos ?? r.permisos,
        })),
        rolesDatos: base.rbac.rolesDatos.map((r, i) => ({
          ...r,
          permisos: en.rbac?.rolesDatos?.[i]?.permisos ?? r.permisos,
        })),
        matrizAcceso: en.rbac?.matrizAcceso ?? base.rbac.matrizAcceso,
      },
    }),
  }
}