# 🏗️ Arquitectura Multi-Cliente de Fumadocs

Documento técnico que explica cómo funciona la arquitectura SaaS de Fumadocs y cómo escala para múltiples clientes.

## 📐 Visión General

Fumadocs es una aplicación **SaaS (Software as a Service)** que:

- **Un único código** (`src/`) que sirve a todos los clientes
- **Múltiples bases de contenido** (`src/content/{cliente}/`)
- **Detección automática de subdominio** para cargar el contenido correcto
- **Generación de archivos automática** desde Markdown

```
┌─────────────────────────────────────────────────────────┐
│                   helloprisma.com                        │
│                  (Una sola instancia)                    │
└────────────────┬──────────────────┬──────────────────────┘
                 │                  │
        ┌────────▼────────┐  ┌──────▼──────────┐
        │  acme.hellop... │  │ uber.hellop...  │
        │   (Subdominio)  │  │  (Subdominio)   │
        │   → Middleware  │  │   → Middleware  │
        │   → CLIENT_NAME │  │   → CLIENT_NAME │
        │     = "acme"    │  │     = "uber"    │
        └────────┬────────┘  └──────┬──────────┘
                 │                  │
        ┌────────▼────────┐  ┌──────▼──────────┐
        │  src/content/   │  │  src/content/   │
        │    acme/        │  │    uber/        │
        │ ├─ 10-intro/    │  │ ├─ 10-intro/    │
        │ ├─ 20-api/      │  │ ├─ 20-features/ │
        │ └─ 30-guias/    │  │ └─ 30-support/  │
        └─────────────────┘  └─────────────────┘
```

## 🔄 Flujo de Funcionamiento

### 1. Solicitud del usuario

```
Usuario accede a: acme.helloprisma.com/introduccion
```

### 2. Middleware detecta subdominio

**Archivo:** `src/middleware.ts`

```typescript
const hostname = "acme.helloprisma.com"
const parts = hostname.split(".") // ["acme", "helloprisma", "com"]
const clientName = parts[0] // "acme"
// Se pasa al header: x-client-name: acme
```

### 3. Next.js renderiza la página

**Archivo:** `src/app/introduccion/page.tsx`

```typescript
import MDX from "@/content/acme/10-introduccion/index.mdx"

export default function Page() {
  return <MDX />
}
```

### 4. Se carga el contenido correcto

El contenido viene de: `src/content/acme/10-introduccion/index.mdx`

### 5. Se aplica el branding

Los colores de `import/clientes/acme/config.json` se aplican al CSS.

---

## 📂 Estructura de carpetas

### Estructura de entrada (input)

```
import/clientes/
├── acme/                          ← CLIENTE A
│   ├── sections/                  ← Documentación en Markdown
│   │   ├── introduccion/
│   │   │   ├── index.md           ← Página principal
│   │   │   ├── capitulo-1.md      ← Página secundaria
│   │   │   └── capitulo-2.md
│   │   ├── api/
│   │   │   ├── index.md
│   │   │   └── endpoints.md
│   │   └── guias/
│   │       └── index.md
│   ├── config.json                ← Configuración de marca
│   └── public/
│       ├── logo.svg               ← Logo del cliente
│       └── images/
│           ├── screenshot-1.png
│           └── diagram.svg
│
└── uber/                          ← CLIENTE B
    ├── sections/
    ├── config.json
    └── public/
```

### Estructura de salida (output)

```
src/content/
├── acme/                          ← Contenido compilado CLIENTE A
│   ├── 10-introduccion/
│   │   ├── index.mdx              ← Convertido de .md a .mdx
│   │   ├── capitulo-1.mdx
│   │   └── capitulo-2.mdx
│   ├── 20-api/
│   │   ├── index.mdx
│   │   └── endpoints.mdx
│   └── 30-guias/
│       └── index.mdx
│
└── uber/                          ← Contenido compilado CLIENTE B
    ├── 10-introduccion/
    │   └── index.mdx
    └── ...

src/app/                           ← COMPARTIDO por todos
├── page.tsx                       ← Home
├── introduccion/
│   └── page.tsx                   ← Se importa src/content/{cliente}/10-intro/
├── api/
│   └── page.tsx
└── guias/
    └── page.tsx
```

**Nota importante:** El código en `src/app/` es único para todos, pero dinámicamente carga el contenido del cliente correcto.

---

## 🔧 Scripts de ingesta

### Localmente

```bash
# Procesar el primer cliente (alfabético)
pnpm ingest

# Procesar cliente específico
CLIENT_NAME=acme pnpm ingest
CLIENT_NAME=uber pnpm ingest
```

### En GitHub Actions

```yaml
# .github/workflows/docs.yml
- name: Ingest sources
  run: pnpm ingest
  env:
    CLIENT_NAME: acme  # O la variable que definas
```

### Flujo del script `ingest.ts`

```
1. Lee CLIENT_NAME del env → "acme"
2. Busca import/clientes/acme/sections/
3. Convierte .md → .mdx
4. Escribe en src/content/acme/
5. Genera páginas en src/app/
6. Lee import/clientes/acme/config.json
7. Aplica colores a Tailwind
8. Genera índice de búsqueda
9. Actualiza navegación (src/lib/nav.ts)
```

---

## 🌐 Detección de subdominio

### En desarrollo (localhost)

```
localhost:3000          → CLIENT_NAME = "default"
localhost:3001          → CLIENT_NAME = "default"
```

### En producción

```
acme.helloprisma.com    → CLIENT_NAME = "acme"
uber.helloprisma.com    → CLIENT_NAME = "uber"
helloprisma.com         → CLIENT_NAME = "default"
```

### Código

```typescript
// src/middleware.ts
function getClientName(hostname: string): string {
  const parts = hostname.split('.')

  if (parts.length > 2 && hostname !== 'localhost') {
    return parts[0]  // Primer parte antes del punto
  }

  return 'default'
}
```

---

## 🎯 Casos de uso

### Caso 1: Nuevo cliente "Acme"

```bash
# 1. Crear estructura
mkdir -p import/clientes/acme/{sections,public}

# 2. Agregar contenido
echo "# Bienvenido" > import/clientes/acme/sections/inicio/index.md

# 3. Configurar marca
cat > import/clientes/acme/config.json << 'EOF'
{
  "projectName": "Acme Docs",
  "domain": "acme.helloprisma.com",
  "secondaryColors": {
    "highlight": "#FF6B35",
    "accent": "#004E89",
    "hover": "#F7931E"
  }
}
EOF

# 4. Generar (localmente o en CI/CD)
CLIENT_NAME=acme pnpm ingest
pnpm build
pnpm start

# 5. Acceder
# https://acme.helloprisma.com
```

### Caso 2: Actualizar contenido existente

```bash
# 1. Editar archivo
nano import/clientes/acme/sections/inicio/index.md

# 2. Regenerar
CLIENT_NAME=acme pnpm ingest

# 3. Recompilar Next.js
pnpm build
pnpm start
```

---

## 🚀 Deploy en Hostinger

### Configuración de dominio

1. En Hostinger, ve a **Dominios**
2. Crea un **Subdominio Wildcard:**
   - Nombre: `*`
   - Apunta a: `tu-servidor.com`
3. O crea subdominios específicos:
   - `acme.helloprisma.com`
   - `uber.helloprisma.com`

### Configuración de servidor

```bash
# En tu servidor (Hostinger/VPS)

# 1. Clona el repo
git clone https://github.com/tu-org/fumadocs.git
cd fumadocs

# 2. Instala dependencias
pnpm install

# 3. Genera contenido (todos los clientes)
# Opción A: Procesar primer cliente automáticamente
pnpm ingest

# Opción B: Script que procesa todos
for client in import/clientes/*/; do
  CLIENT_NAME=$(basename "$client") pnpm ingest
done

# 4. Build
pnpm build

# 5. Inicia con PM2 o similar
pm2 start "pnpm start" --name "fumadocs"
pm2 save
```

### Variable de entorno en CI/CD

Si usas GitHub Actions o similar, configura la variable:

```yaml
env:
  CLIENT_NAME: acme  # o el que necesites
```

---

## 📊 Ventajas de esta arquitectura

| Ventaja | Descripción |
|---------|-------------|
| **Escalabilidad** | Agrega clientes sin modificar código |
| **Bajo costo** | Una sola instancia de Next.js para todos |
| **Actualizaciones** | Mejoras benefician a todos automáticamente |
| **Seguridad** | Cada cliente ve solo su contenido |
| **Flexibilidad** | Cada cliente personaliza marca y dominio |
| **Automatización** | Markdown → HTML sin intervención manual |
| **Velocidad** | Build rápido, páginas estáticas |

---

## ⚠️ Limitaciones actuales

1. **Logo dinámico**: Todos usan `/logo.svg`. Solución futura: hacer dinámico por cliente
2. **Búsqueda**: Busca en todo el índice. Solución futura: filtrar por cliente
3. **Cache**: Puede ser compartido entre clientes. Solución: usar headers `x-client-name`

---

## 🔮 Mejoras futuras

1. **Panel de admin**: Subir documentación sin acceso FTP
2. **Versioning**: Mantener múltiples versiones de docs
3. **Analytics**: Ver qué páginas leen los usuarios
4. **Webhooks**: Auto-actualizar cuando hacen push a GitHub
5. **Temas personalizados**: Layout, colores, tipografía por cliente
6. **Multi-idioma**: Documentación en español, inglés, etc.

---

## 📚 Referencias

- Documentación de clientes: [CLIENTE-ONBOARDING.md](./CLIENTE-ONBOARDING.md)
- Sistema de ingesta: [import/README.md](./import/README.md)
- Configuración técnica: [next.config.ts](./next.config.ts)
- Middleware: [src/middleware.ts](./src/middleware.ts)
- Script ingest: [scripts/ingest.ts](./scripts/ingest.ts)

---

## 🤝 Contacto

¿Preguntas sobre la arquitectura? Contacta al equipo técnico de Prisma.

**Última actualización:** Noviembre 2025