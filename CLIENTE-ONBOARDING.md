# 📖 Guía de Onboarding para Clientes - Fumadocs

Bienvenido a **Fumadocs**, la plataforma de documentación personalizada de Prisma. Esta guía te mostrará cómo crear y gestionar tu documentación.

## 🎯 ¿Qué es Fumadocs?

Fumadocs es un sistema automatizado que convierte tus documentos Markdown en una documentación profesional y personalizada, accesible en tu propio subdominio:

```
tu-empresa.helloprisma.com
```

## 📚 Estructura de carpetas

Tu documentación se organiza así:

```
import/clientes/
└── tu-empresa/                   # Tu nombre de cliente
    ├── sections/                 # Contenido de documentación
    │   ├── introduccion/
    │   │   ├── index.md          # Archivo principal (obligatorio)
    │   │   ├── capitulo-1.md
    │   │   └── capitulo-2.md
    │   ├── guias/
    │   │   └── index.md
    │   └── api/
    │       ├── index.md
    │       └── endpoints.md
    ├── config.json               # Personalización de marca
    └── public/
        └── logo.svg              # Logo de tu empresa
```

## 🚀 Pasos para comenzar

### Paso 1: Crear la carpeta de tu empresa

Tu documentación se guardará en: `import/clientes/{tu-empresa}/`

Estructura requerida:
```bash
import/clientes/acme/
├── sections/
├── config.json
└── public/
```

### Paso 2: Crear tus primeras secciones

Una sección es una carpeta dentro de `sections/`. Cada sección puede tener múltiples archivos:

**Ejemplo: Introducción**
```
import/clientes/acme/sections/introduccion/
├── index.md          # OBLIGATORIO - portada de la sección
├── capitulo-1.md     # Opcional - se genera como página separada
└── capitulo-2.md     # Opcional
```

**Ejemplo: API**
```
import/clientes/acme/sections/api/
├── index.md          # Información general de la API
├── autenticacion.md  # Guía de autenticación
├── endpoints.md      # Lista de endpoints
└── ejemplos.md       # Ejemplos de uso
```

### Paso 3: Escribir contenido Markdown

Cada archivo `.md` es una página. Usa Markdown estándar:

**introduccion/index.md:**
```markdown
---
title: Introducción
description: Bienvenido a nuestra documentación
---

# Introducción

Aquí va tu contenido de bienvenida.

## Primeros pasos

Explicaciones iniciales...

### Sección anidada

Más detalles...
```

**Encabezados:**
- `#` = H1 (título principal)
- `##` = H2 (subtítulo)
- `###` = H3 (sección)
- `####` = H4, etc.

**Texto:**
```markdown
**Texto en negrita**
*Texto en cursiva*
***Texto en negrita cursiva***

# Enlaces
[Texto del enlace](https://ejemplo.com)

# Listas
- Elemento 1
- Elemento 2
  - Elemento anidado

1. Paso 1
2. Paso 2
3. Paso 3

# Código
`código en línea`

# Bloque de código
\`\`\`javascript
console.log("Hola mundo");
\`\`\`

# Imagen
![Descripción](imagen.png)
```

### Paso 4: Configurar tu marca (config.json)

Personaliza los colores y nombre:

**import/clientes/acme/config.json:**
```json
{
  "projectName": "Acme Documentation",
  "domain": "acme.helloprisma.com",
  "secondaryColors": {
    "highlight": "#FF6B35",
    "accent": "#004E89",
    "hover": "#F7931E"
  }
}
```

**Significado de colores:**
- `highlight` - Color principal (enlaces, botones)
- `accent` - Color secundario (acentos, bordes)
- `hover` - Color al pasar el ratón

### Paso 5: Agregar tu logo

Copia tu logo a: `import/clientes/acme/public/logo.svg`

El logo aparecerá en la esquina superior izquierda.

### Paso 6: Imágenes y activos

Coloca imágenes en: `import/clientes/acme/public/images/`

En tu Markdown, referencíalas así:
```markdown
![Nombre descriptivo](imagen.png)
```

Se convertirá automáticamente a: `/images/imagen.png`

## 📋 Plantilla completa de inicio rápido

**Estructura mínima:**

1. Crea las carpetas:
```bash
import/clientes/mi-empresa/sections/inicio
```

2. Crea `import/clientes/mi-empresa/sections/inicio/index.md`:
```markdown
# Bienvenido

Tu documentación comienza aquí.
```

3. Crea `import/clientes/mi-empresa/config.json`:
```json
{
  "projectName": "Mi Empresa Docs",
  "domain": "mi-empresa.helloprisma.com",
  "secondaryColors": {
    "highlight": "#3B82F6",
    "accent": "#10B981",
    "hover": "#F59E0B"
  }
}
```

¡Listo! Tu documentación está lista.

## 🔄 Proceso de publicación

Una vez que tengas tu contenido:

1. **El equipo técnico ejecuta:**
```bash
CLIENT_NAME=mi-empresa pnpm ingest
```

2. **Se genera automáticamente:**
- ✅ Páginas HTML desde tu Markdown
- ✅ Navegación lateral
- ✅ Índice de búsqueda
- ✅ Estilos de tu marca

3. **Accedes a:**
```
https://mi-empresa.helloprisma.com
```

## 📝 Convenciones de nombres

Usa nombres descriptivos y en minúsculas:

**Bueno:**
- `introduccion`
- `guia-de-inicio`
- `api-reference`
- `best-practices`

**No recomendado:**
- `Introducción` (mayúsculas/acentos)
- `intro123` (confuso)
- `mi_intro` (guión bajo)

## 🎨 Estructura de navegación

La navegación se genera automáticamente:

```
Inicio (home)
├── Introducción
├── Guía de inicio
├── API Reference
├── Best Practices
└── Changelog
```

**El orden depende del nombre de la carpeta (alfabético).**

## 📊 Orden de secciones

Si quieres controlar el orden, usa prefijos numéricos:

```
sections/
├── 10-introduccion/
├── 20-guia-de-inicio/
├── 30-api/
└── 40-changelog/
```

Aparecerán en el orden: 10, 20, 30, 40...

## 💡 Tips y buenas prácticas

### 1. Estructura clara
- Cada sección = un tema principal
- Archivos dentro de secciones = subsecciones o capítulos
- Encabezados organizados (H1 > H2 > H3)

### 2. Contenido legible
- Párrafos cortos (2-3 líneas máximo)
- Listas en lugar de párrafos largos
- Ejemplos prácticos

### 3. Nombres consistentes
- Todos los nombres en minúsculas
- Usa guiones para separar palabras: `mi-seccion` (NO `mi_seccion`)
- Nombres descriptivos: `getting-started` (NO `inicio`)

### 4. Imágenes
- Usa formatos modernos: PNG, SVG, WebP
- Optimiza el tamaño (<200KB idealmente)
- Pon descripción en el atributo `alt`

### 5. Código
```markdown
\`\`\`javascript
// Especifica el lenguaje para syntax highlighting
const mensaje = "Hola mundo";
\`\`\`
```

Lenguajes soportados: javascript, python, typescript, bash, json, yaml, html, css, sql, etc.

## 🐛 Resolución de problemas

### Mi contenido no aparece
- ✅ Verifica que el `index.md` exista en cada carpeta de sección
- ✅ Asegúrate que el YAML (frontmatter) esté correctamente formateado
- ✅ Ejecuta `pnpm ingest` después de cambios

### Las imágenes no cargan
- ✅ Verifica que estén en `import/clientes/{tu-empresa}/public/images/`
- ✅ Usa nombres sin espacios: `mi-imagen.png` (NO `mi imagen.png`)
- ✅ En el Markdown: `![Alt](imagen.png)` (sin rutas complejas)

### Los colores no cambian
- ✅ Verifica el formato hexadecimal en `config.json`: `#RRGGBB`
- ✅ Ejecuta `pnpm ingest` después de cambiar `config.json`

### Mi logo no aparece
- ✅ Debe ser SVG: `logo.svg`
- ✅ Colócalo en: `import/clientes/{tu-empresa}/public/logo.svg`

## 📞 Soporte

Si tienes problemas:

1. Revisa esta guía
2. Consulta [import/README.md](./import/README.md)
3. Contacta al equipo técnico de Prisma

## ✨ Características disponibles

- ✅ Markdown con GitHub Flavored Markdown (GFM)
- ✅ Código con syntax highlighting
- ✅ Búsqueda global de contenido
- ✅ Navegación automática
- ✅ Branding personalizado (colores, logo)
- ✅ Responsive (funciona en móvil, tablet, desktop)
- ✅ Rápido y seguro

## 🎯 Próximos pasos

1. **Crea tu carpeta:** `import/clientes/{tu-empresa}/`
2. **Escribe tu contenido:** Usa Markdown
3. **Personaliza marca:** Edita `config.json`
4. **Solicita publicación:** Al equipo técnico
5. **¡Accede a tu docs!** En `{tu-empresa}.helloprisma.com`

---

**¡Listo para comenzar tu documentación!** 🚀

Si tienes dudas, revisa los ejemplos en las otras carpetas de clientes o contacta al equipo de Prisma.
