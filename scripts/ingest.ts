import fs from 'fs-extra'
import path from 'path'
import globby from 'globby'
import matter from 'gray-matter'

const SRC = process.cwd()
const CONTENT = path.join(SRC, 'src', 'content')
const APP = path.join(SRC, 'src', 'app')
const PUBLIC_DIR = path.join(SRC, 'public')

type RouteMap = Map<string, string>

async function copyREADME() {
  const f = ['README.md', 'readme.md'].map(p => path.join(SRC, p)).find(fs.existsSync)
  if (!f) return
  const raw = await fs.readFile(f, 'utf8')
  const out = matter.stringify(raw, { title: 'Introducción' })
  await fs.outputFile(path.join(CONTENT, '00-intro.mdx'), out)
  console.log('• README → src/content/00-intro.mdx')
}

async function openapiToMDX() {
  const f = ['openapi.yaml','openapi.yml','openapi.json'].map(p => path.join(SRC, p)).find(fs.existsSync)
  if (!f) return
  const raw = await fs.readFile(f, 'utf8')
  const mdx = matter.stringify(`\n# Referencia OpenAPI\n\n<pre>\n${raw}\n</pre>\n`, { title: 'API (OpenAPI)' })
  await fs.outputFile(path.join(CONTENT, '20-api', 'index.mdx'), mdx)
  console.log('• OpenAPI → src/content/20-api/index.mdx')
}

async function graphqlToMDX() {
  const f = ['schema.graphql','schema.gql'].map(p => path.join(SRC, p)).find(fs.existsSync)
  if (!f) return
  const raw = await fs.readFile(f, 'utf8')
  const mdx = matter.stringify(`\n# Esquema GraphQL\n\n<pre>\n${raw}\n</pre>\n`, { title: 'API (GraphQL)' })
  const target = path.join(CONTENT, '20-api', 'graphql.mdx')
  await fs.outputFile(target, mdx)
  console.log('• GraphQL → src/content/20-api/graphql.mdx')
}

async function changelogToMDX() {
  const f = ['CHANGELOG.md', 'changelog.md'].map(p => path.join(SRC, p)).find(fs.existsSync)
  if (!f) return
  const raw = await fs.readFile(f, 'utf8')
  const out = matter.stringify(raw, { title: 'Changelog' })
  await fs.outputFile(path.join(CONTENT, '99-changelog.mdx'), out)
  console.log('• CHANGELOG → src/content/99-changelog.mdx')
}

function normaliseContentPath(file: string) {
  return file.replace(/\\/g, '/')
}

function toPlainText(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*]\(([^)]+)\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_\-~`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function buildRouteMap(): Promise<RouteMap> {
  const routeMap: RouteMap = new Map()
  const pageFiles = await globby('**/page.tsx', { cwd: APP })

  for (const rel of pageFiles) {
    const route =
      rel === 'page.tsx'
        ? '/'
        : `/${rel.replace(/\/page\.tsx$/, '').replace(/\/index$/, '')}`
    const absolute = path.join(APP, rel)
    const source = await fs.readFile(absolute, 'utf8')
    const importMatch = source.match(/from\s+["']@\/content\/([^"']+)["']/)
    if (!importMatch) continue
    const contentPath = importMatch[1].replace(/^\.\//, '')
    const normalized = normaliseContentPath(contentPath)
    routeMap.set(normalized, route)
  }

  return routeMap
}

async function buildSearchIndex(routeMap: RouteMap) {
  const mdxFiles = await globby('**/*.mdx', { cwd: CONTENT })
  const entries: Array<{ title: string; href: string; content: string; section?: string }> = []

  for (const rel of mdxFiles) {
    const absolute = path.join(CONTENT, rel)
    const raw = await fs.readFile(absolute, 'utf8')
    const parsed = matter(raw)
    const plain = toPlainText(parsed.content)
    if (!plain) continue

    const route =
      routeMap.get(normaliseContentPath(rel)) ||
      `/${rel.replace(/\.mdx$/, '').replace(/index$/, '').replace(/\/+/g, '/')}`

    const cleanRoute = route.replace(/\/\/+/g, '/').replace(/\/$/, '') || '/'
    const section = cleanRoute === '/' ? 'inicio' : cleanRoute.slice(1).split('/')[0]

    entries.push({
      title:
        (parsed.data?.title as string | undefined) ||
        rel.replace(/\.mdx$/, '').split('/').pop() ||
        'Documento',
      href: cleanRoute,
      content: plain.slice(0, 1200),
      section,
    })
  }

  const output = path.join(PUBLIC_DIR, 'search-index.json')
  await fs.ensureDir(PUBLIC_DIR)
  await fs.writeJson(output, entries, { spaces: 2 })
  console.log('• Índice de búsqueda → public/search-index.json')
}

async function main() {
  await fs.ensureDir(CONTENT)
  await fs.ensureDir(path.join(CONTENT, '20-api'))
  await copyREADME()
  await openapiToMDX()
  await graphqlToMDX()
  await changelogToMDX()
  const routes = await buildRouteMap()
  await buildSearchIndex(routes)
}

main().catch(e => { console.error(e); process.exit(1) })
