# ✅ Estructura Limpia y Ordenada de Fumadocs

Documento que muestra la estructura final ordenada del proyecto después de la implementación multi-cliente.

## 📁 Estructura del proyecto (Raíz)

```
Fumadocs-Dezik/
├── .github/
│   └── workflows/
│       └── docs.yml                    ✅ CI/CD arreglado (pnpm)
├── import/                             🆕 Sistema multi-cliente
│   └── clientes/
│       └── example/                    📋 Cliente de ejemplo
│           ├── sections/
│           │   └── inicio/
│           │       └── index.md        # Contenido del cliente
│           ├── config.json             # Branding del cliente
│           └── public/
│               └── .gitkeep
├── src/
│   ├── app/                            # Páginas (compartidas)
│   ├── content/                        # Contenido compilado (por cliente)
│   │   └── example/                    # Contenido de "example"
│   ├── components/
│   ├── hooks/                          🆕 Nuevos hooks
│   │   └── useClientName.ts
│   ├── lib/
│   ├── styles/
│   └── middleware.ts                   🆕 Detección de subdominio
├── scripts/
│   └── ingest.ts                       ✅ Multi-cliente
├── public/
├── pnpm-lock.yaml                      ✅ Ahora trackeado en git
├── .gitignore                          ✅ Sin pnpm-lock.yaml
├── package.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── CLIENTE-ONBOARDING.md               📖 Guía para clientes
├── ARQUITECTURA-MULTICLIENTE.md        📖 Docs técnica
└── IMPLEMENTACION-RESUMEN.md           📖 Resumen de cambios
```

---

## 📂 Carpeta `import/clientes/` - LA IMPORTANTE

```
import/clientes/
├── example/                            # CLIENTE DE EJEMPLO
│   ├── sections/                       # Contenido en Markdown
│   │   ├── inicio/
│   │   │   └── index.md               # Obligatorio
│   │   ├── api/
│   │   │   ├── index.md
│   │   │   └── endpoints.md
│   │   └── guias/
│   │       └── index.md
│   ├── config.json                     # Personalización
│   └── public/
│       ├── logo.svg                    # Logo del cliente
│       └── images/
│           ├── screenshot.png
│           └── diagram.svg
│
├── acme/                               # TU CLIENTE A
│   ├── sections/
│   ├── config.json
│   └── public/
│
└── uber/                               # TU CLIENTE B
    ├── sections/
    ├── config.json
    └── public/
```

**¡AQUÍ ES DONDE AGREGAS NUEVOS CLIENTES!**

---

## 🗂️ Carpeta `src/content/` - CONTENIDO COMPILADO

```
src/content/
├── example/                            # Contenido compilado de "example"
│   ├── 10-inicio/
│   │   └── index.mdx                  # .md convertido a .mdx
│   ├── 20-api/
│   │   ├── index.mdx
│   │   └── endpoints.mdx
│   └── 30-guias/
│       └── index.mdx
│
├── acme/                               # Contenido compilado de "acme"
│   ├── 10-intro/
│   ├── 20-features/
│   └── 30-pricing/
│
└── uber/                               # Contenido compilado de "uber"
    ├── 10-welcome/
    ├── 20-getting-started/
    └── 30-support/
```

**⚠️ NO EDITES ESTO MANUALMENTE**
Se genera automáticamente con `pnpm ingest`

---

## 🧠 Cómo funciona el flujo

```
1. Usuario accede a: acme.helloprisma.com/intro

2. Middleware detecta:
   hostname = "acme.helloprisma.com"
   → CLIENT_NAME = "acme"

3. React carga página:
   src/app/intro/page.tsx

4. Página importa contenido:
   @/content/acme/10-intro/index.mdx

5. Resultado:
   ✅ Contenido de Acme
   ✅ Colores de Acme
   ✅ Logo de Acme
```

---

## 🚀 Cómo agregar un nuevo cliente (Paso a paso)

### Paso 1: Crea la carpeta

```bash
mkdir -p import/clientes/mi-empresa/{sections,public}/images
```

### Paso 2: Agrega contenido Markdown

```bash
mkdir -p import/clientes/mi-empresa/sections/introduccion
echo "# Bienvenido" > import/clientes/mi-empresa/sections/introduccion/index.md
```

### Paso 3: Crea config.json

```bash
cat > import/clientes/mi-empresa/config.json << 'EOF'
{
  "projectName": "Mi Empresa",
  "domain": "mi-empresa.helloprisma.com",
  "secondaryColors": {
    "highlight": "#FF6B35",
    "accent": "#004E89",
    "hover": "#F7931E"
  }
}
EOF
```

### Paso 4: Genera la documentación

```bash
CLIENT_NAME=mi-empresa pnpm ingest
```

### Paso 5: Build

```bash
pnpm build
pnpm start
```

### Paso 6: Accede a

```
https://mi-empresa.helloprisma.com
```

---

## 📋 Limpieza realizada

### ❌ Eliminado:
- `import/sections/` - Ya no existe (estructura vieja)
- `import/config.json` - Movido a `import/clientes/example/config.json`

### ✅ Agregado:
- `pnpm-lock.yaml` - Ahora en git (necesario para CI/CD)
- `import/clientes/example/` - Cliente de ejemplo
- `.gitignore` - Actualizado (pnpm-lock.yaml permitido)

---

## 🔧 Variables de entorno

### En desarrollo:
```bash
CLIENT_NAME=example pnpm ingest
pnpm dev
```

### En GitHub Actions:
```yaml
env:
  CLIENT_NAME: example  # Cambia según necesites
```

---

## 📊 Resumen de archivos

| Archivo | Estado | Descripción |
|---------|--------|-------------|
| `.github/workflows/docs.yml` | ✅ Arreglado | Instala pnpm antes de usarlo |
| `scripts/ingest.ts` | ✅ Mejorado | Detecta CLIENT_NAME automáticamente |
| `src/middleware.ts` | ✨ Nuevo | Detecta subdominio |
| `src/hooks/useClientName.ts` | ✨ Nuevo | Hook para acceder al cliente |
| `pnpm-lock.yaml` | ✅ Trackeado | Necesario para reproducibilidad |
| `.gitignore` | ✅ Actualizado | Permite pnpm-lock.yaml |
| `import/` | ✅ Limpio | Solo carpeta `clientes/` |

---

## ✨ Características

- ✅ Multi-cliente con un solo deployment
- ✅ Detección automática de subdominio
- ✅ Contenido aislado por cliente
- ✅ Branding personalizado por cliente
- ✅ 100% automatizado
- ✅ CI/CD funcionando

---

## 📞 Documentación

- 📖 [CLIENTE-ONBOARDING.md](./CLIENTE-ONBOARDING.md) - Para equipos de clientes
- 📖 [ARQUITECTURA-MULTICLIENTE.md](./ARQUITECTURA-MULTICLIENTE.md) - Para desarrolladores
- 📖 [import/README.md](./import/README.md) - Sistema técnico

---

## 🎯 Estado actual

✅ **Proyecto listo para producción**

- Estructura limpia y ordenada
- Sin archivos innecesarios
- pnpm-lock.yaml en git (CI/CD funciona)
- Multi-cliente completamente implementado
- Documentación completa
- Ejemplo de cliente incluido

**¡Listo para empezar a onboardear clientes! 🚀**