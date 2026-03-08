# 🚀 Guía de despliegue — Modern Data Stack en GitHub Pages

## Requisitos previos
- [Node.js 18+](https://nodejs.org) instalado
- [Git](https://git-scm.com) instalado
- Cuenta en [GitHub](https://github.com)

---

## PASO 1 — Crear el repositorio en GitHub

1. Ve a [github.com/new](https://github.com/new)
2. Nombre del repositorio: `modern-data-stack`
3. Visibilidad: **Public** ✅
4. NO inicialices con README (lo crearemos nosotros)
5. Haz clic en **"Create repository"**

---

## PASO 2 — Crear el proyecto React localmente

Abre tu terminal y ejecuta:

```bash
# Crear el proyecto con Vite
npm create vite@latest modern-data-stack -- --template react
cd modern-data-stack
```

---

## PASO 3 — Instalar dependencias y gh-pages

```bash
npm install
npm install gh-pages --save-dev
```

---

## PASO 4 — Copiar los archivos del proyecto

Reemplaza o crea estos archivos con el contenido que te generé:

```
modern-data-stack/
├── package.json              ← reemplazar
├── vite.config.js            ← reemplazar
├── index.html                ← dejar el que crea Vite (solo cambiar el <title>)
├── README.md                 ← crear
└── src/
    ├── main.jsx              ← dejar el que crea Vite
    ├── index.css             ← vaciar (o dejar)
    ├── App.jsx               ← reemplazar
    ├── data/
    │   ├── blockData.js
    │   ├── partsConfig.js
    │   └── objectives.js
    └── components/
        ├── Header.jsx
        ├── NavParts.jsx
        ├── DiagramPart.jsx
        ├── BlockDetail.jsx
        ├── ProgressCard.jsx
        ├── ToolsGrid.jsx
        └── Tooltip.jsx
```

> 💡 **Tip:** Puedes copiar y pegar cada archivo desde los artefactos que te generé en Claude.

---

## PASO 5 — Verificar vite.config.js

Asegúrate de que el `base` coincida con el nombre de tu repo:

```js
export default defineConfig({
  plugins: [react()],
  base: '/modern-data-stack/',  // ← nombre exacto de tu repositorio
})
```

---

## PASO 6 — Probar localmente

```bash
npm run dev
```

Abre [http://localhost:5173/modern-data-stack/](http://localhost:5173/modern-data-stack/) — debería verse todo correctamente.

---

## PASO 7 — Subir a GitHub

```bash
# Inicializar git y subir el código fuente
git init
git add .
git commit -m "feat: Modern Data Stack Azure DaaP - initial release"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/modern-data-stack.git
git push -u origin main
```

> ⚠️ Reemplaza `TU_USUARIO` con tu usuario real de GitHub.

---

## PASO 8 — Desplegar en GitHub Pages

```bash
npm run deploy
```

Este comando:
1. Ejecuta `vite build` → genera la carpeta `dist/`
2. Publica `dist/` en la rama `gh-pages` de tu repositorio

---

## PASO 9 — Activar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Haz clic en **Settings** → **Pages** (menú izquierdo)
3. En **"Branch"**, selecciona: `gh-pages` / `/ (root)`
4. Haz clic en **Save**
5. Espera ~2 minutos

Tu app estará disponible en:
```
https://TU_USUARIO.github.io/modern-data-stack/
```

---

## 🔄 Cómo actualizar después de cambios

```bash
# 1. Hacer tus cambios en los archivos src/
# 2. Guardar en git
git add .
git commit -m "docs: actualizar estimados parte 3"
git push

# 3. Redesplegar
npm run deploy
```

---

## 🛠️ Solución de problemas frecuentes

| Problema | Solución |
|---|---|
| Página en blanco en GitHub Pages | Verificar que `base` en `vite.config.js` coincide con el nombre del repo |
| Error 404 en assets | Mismo problema — revisar `base` |
| `gh-pages` no encontrado | Ejecutar `npm install gh-pages --save-dev` |
| Cambios no se ven | Limpiar caché del navegador o esperar 2-3 minutos |
| Error de permisos git | Configurar token de acceso en GitHub Settings → Developer settings |

---

## ✨ Mejora opcional: GitHub Actions (CI/CD automático)

Crea el archivo `.github/workflows/deploy.yml` para que cada `git push` a `main` despliegue automáticamente:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

Con esto, cada vez que hagas `git push`, GitHub despliega automáticamente. ¡No necesitas correr `npm run deploy` manualmente!