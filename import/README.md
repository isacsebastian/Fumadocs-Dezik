# 📚 Sistema Multi-Cliente de Fumadocs

Este directorio contiene el sistema automatizado para importar y generar documentación para múltiples clientes en Fumadocs.

## 📁 Estructura

```
import/
└── clientes/                          # Carpeta raíz para todos los clientes
    ├── cliente-1/                     # Subdominio: cliente1.helloprisma.com
    │   ├── sections/                  # Secciones de documentación
    │   │   ├── introduccion/
    │   │   │   ├── index.md
    │   │   │   └── capitulo-1.md
    │   │   └── api/
    │   ├── config.json                # Branding: nombre, colores, dominio
    │   └── public/                    # Activos (logo, imágenes)
    │       └── logo.svg
    └── cliente-2/                     # Subdominio: cliente2.helloprisma.com
        ├── sections/
        ├── config.json
        └── public/
```

## 🚀 Cómo usar

### 1. Crear un nuevo cliente

Primero, crea la carpeta para un nuevo cliente:

```bash
mkdir -p import/clientes/acme
mkdir -p import/clientes/acme/sections
mkdir -p import/clientes/acme/public
```

### 2. Crear secciones de documentación

Dentro de `import/clientes/acme/sections/`, crea carpetas con contenido:

```bash
mkdir import/clientes/acme/sections/introduccion
mkdir import/clientes/acme/sections/api
```

### 3. Agregar contenido Markdown

**import/clientes/acme/sections/introduccion/index.md:**
```markdown
---
title: Introducción
---

# Introducción

Contenido de bienvenida...

## Primeros pasos

Guía para empezar...
```

### 4. Configurar la marca del cliente

**import/clientes/acme/config.json:**
```json
{
  "projectName": "Acme Docs",
  "domain": "acme.helloprisma.com",
  "secondaryColors": {
    "highlight": "#FF6B35",
    "accent": "#004E89",
    "hover": "#F7931E"
  }
}
```

### 5. Agregar logo (opcional)

Copia el logo a `import/clientes/acme/public/logo.svg`

### 6. Ejecutar ingesta para un cliente específico

```bash
# Por defecto, procesa el primer cliente (alfabéticamente)
pnpm ingest

# O especifica un cliente
CLIENT_NAME=acme pnpm ingest
```

Esto automáticamente:
- ✅ Convierte `.md` a `.mdx` en `src/content/acme/`
- ✅ Genera páginas en `src/app/`
- ✅ Actualiza la navegación
- ✅ Aplica branding a Tailwind
- ✅ Genera índice de búsqueda

## 📊 Estructura generada

Después de ejecutar `pnpm ingest` para el cliente `acme`:

```
src/content/
├── acme/                     # Contenido del cliente
│   ├── 10-introduccion/      # Secciones del cliente
│   │   ├── index.mdx
│   │   └── capitulo-1.mdx
│   └── 20-api/
├── otro-cliente/             # Otro cliente
│   └── 10-...

src/app/
├── page.tsx                  # Home (compartido)
├── introduccion/
│   └── page.tsx              # Generada automáticamente
├── api/
└── [otras secciones]/
```

**Nota:** Cada cliente tiene su propio contenido en `src/content/{cliente}/`, pero comparten el mismo `src/app/`. El middleware detecta el subdominio y carga el contenido correcto dinámicamente.

## 🎨 Sistema de numeración

Las secciones se ordenan automáticamente por prefijo numérico:

| Prefijo | Propósito |
|---------|-----------|
| 00-09 | Introducción |
| 10-19 | Tu primera sección importada |
| 20-29 | Referencias de API |
| 30-79 | Secciones adicionales |
| 80-89 | Temas avanzados |
| 90-98 | Guías/Tutoriales |
| 99 | Changelog |

## 📝 Frontmatter

Cada archivo `.md` puede incluir metadatos YAML:

```markdown
---
title: Título de la página
description: Descripción opcional
---

# Contenido...
```

Si no incluyes `title`, se usará el nombre del archivo.

## 🎨 Branding automático

Los colores en `config.json` se aplican automáticamente a:
- Tailwind CSS (`theme.colors.brand`)
- Enlaces en el contenido
- Componentes personalizados

Puedes usar estos colores en tu Markdown con clases Tailwind:

```markdown
<div className="text-brand-highlight font-bold">
  Texto importante
</div>
```

## ⚡ Tips

1. **Orden alfabético**: Las secciones dentro de `import/sections/` se ordenan alfabéticamente
2. **Index.md requerido**: Cada carpeta debe tener un `index.md`
3. **Nombres de carpeta**: Usa nombres descriptivos en minúsculas con guiones (ej: `getting-started`, `best-practices`)
4. **No manual**: No edites `src/content/` ni `src/app/` directamente para secciones importadas
5. **Regenerar**: Ejecuta `pnpm ingest` cada vez que cambies `import/`

## 🔄 Flujo completo

```bash
# 1. Agrega tu sección
mkdir import/sections/nueva-seccion
echo "# Nueva Sección" > import/sections/nueva-seccion/index.md

# 2. Personaliza config.json si necesitas
# (ya tiene valores por defecto)

# 3. Genera la documentación
pnpm ingest

# 4. Levanta el servidor
pnpm dev

# 5. Abre http://localhost:3000/nueva-seccion
```

## 🌐 Cómo funciona con subdominios

La aplicación detecta automáticamente el subdominio y carga la documentación correcta:

```
Cliente A → acme.helloprisma.com  → src/content/acme/
Cliente B → uber.helloprisma.com  → src/content/uber/
Cliente C → localhost:3000        → src/content/default/
```

Esto se logra mediante:
1. **Middleware** (`src/middleware.ts`) - Detecta el subdominio
2. **Variable de entorno** (`CLIENT_NAME`) - Se pasa al script `ingest`
3. **Estructura de carpetas** - Cada cliente tiene su carpeta

## 📚 Dominio en Hostinger

Para configurar subdominios en Hostinger:

1. Ve a **Dominios** → tu dominio (`helloprisma.com`)
2. Crea un **subdominio wildcard** `*.helloprisma.com` que apunte a tu servidor
3. O crea subdominios específicos: `acme.helloprisma.com`, `uber.helloprisma.com`
4. Todo apunta a la misma aplicación (una instancia de Next.js)

## ❓ FAQ

**P: ¿Debo crear manualmente las páginas en src/app/?**
R: No, se generan automáticamente cuando ejecutas `pnpm ingest`.

**P: ¿Cómo suben los clientes su documentación?**
R: Los clientes pueden:
- Subirla a un repositorio privado que sincroniza con `import/clientes/{nombre}/sections/`
- Usar un panel de admin (requisito futuro)
- FTP/SSH directo a la carpeta

**P: ¿Puedo personalizar el nombre en la navegación?**
R: Sí, usa el campo `title` en el frontmatter del `index.md` de cada sección.

**P: ¿Qué pasa si ejecuto `pnpm ingest` múltiples veces?**
R: Es seguro. El script es idempotente y solo actualiza lo necesario.

**P: ¿Puedo tener múltiples clientes simultáneamente?**
R: Sí, cada cliente tiene su carpeta. Para cambiar de cliente: `CLIENT_NAME=otro-cliente pnpm ingest`

**P: ¿Dónde están los archivos después de `pnpm ingest`?**
R: En `src/content/{cliente-name}/{numero}-{nombre-seccion}/` como archivos `.mdx`

**P: ¿Cómo edito el logo de un cliente?**
R: En el layout, cambia la ruta de `src="/logo.svg"` a una dinámica que lea el cliente.

---

**¡Listo para comenzar! 🚀**

Crea tu primera sección y ejecuta `pnpm ingest` para verla en acción.
