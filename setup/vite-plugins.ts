import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { isAbsolute, join, normalize, relative, resolve } from 'node:path'

// Vite plugin for the theme. Handles HMR invalidation of Slidev virtual slide
// modules when .md files change, and suppresses HMR when selected markdown files
// only changed Slidev speaker notes (HTML comments). The entities sourcemap
// warning is filtered in vite.config.ts via customLogger.

export const notesOnlyHmrFiles = ['slides.md', 'sections/*.md']

type UstcThemeViteConfig = {
  root?: string
  ustcTheme?: {
    notesOnlyHmrFiles?: string[]
    extraNotesOnlyHmrFiles?: string[]
  }
}

function normalizeFile(file: string): string {
  return normalize(resolve(file))
}

function projectRelativePath(file: string, projectRoot: string): string {
  const normalizedFile = normalizeFile(file)
  const relativeFile = relative(projectRoot, normalizedFile).replaceAll('\\', '/')

  if (!relativeFile || relativeFile.startsWith('..') || isAbsolute(relativeFile)) {
    return ''
  }

  return relativeFile
}

export function isNotesOnlyHmrFile(
  file: string,
  projectRoot = resolve(),
  patterns = notesOnlyHmrFiles,
): boolean {
  const relativeFile = projectRelativePath(file, projectRoot)
  return patterns.some((pattern) => globToRegExp(pattern).test(relativeFile))
}

function snapshotNotesOnlyHmrFiles(
  snapshots: Map<string, string>,
  projectRoot: string,
  patterns: string[],
): void {
  for (const pattern of patterns) {
    for (const file of expandGlob(projectRoot, pattern)) {
      snapshots.set(normalizeFile(file), stripSlidevNotes(readFileSync(file, 'utf8')))
    }
  }
}

function expandGlob(projectRoot: string, pattern: string): string[] {
  const files: string[] = []
  expandGlobSegments(projectRoot, pattern.replaceAll('\\', '/').split('/'), files)
  return files
}

function expandGlobSegments(dir: string, segments: string[], files: string[]): void {
  const [segment, ...rest] = segments
  if (!segment) return

  if (segment.includes('*')) {
    if (!existsSync(dir)) return

    const matcher = globSegmentToRegExp(segment)
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!matcher.test(entry.name)) continue

      const file = join(dir, entry.name)
      if (rest.length === 0 && entry.isFile()) {
        files.push(file)
      } else if (rest.length > 0 && entry.isDirectory()) {
        expandGlobSegments(file, rest, files)
      }
    }
    return
  }

  const file = join(dir, segment)
  if (!existsSync(file)) return

  const stats = statSync(file)
  if (rest.length === 0 && stats.isFile()) {
    files.push(file)
  } else if (rest.length > 0 && stats.isDirectory()) {
    expandGlobSegments(file, rest, files)
  }
}

function globToRegExp(pattern: string): RegExp {
  return new RegExp(
    `^${pattern.replaceAll('\\', '/').split('/').map(globSegmentToSource).join('/')}$`,
    'i',
  )
}

function globSegmentToRegExp(segment: string): RegExp {
  return new RegExp(`^${globSegmentToSource(segment)}$`, 'i')
}

function globSegmentToSource(segment: string): string {
  return segment.replace(/[.+^${}()|[\]\\]/g, '\\$&').replaceAll('*', '[^/]*')
}

export function stripSlidevNotes(content: string): string {
  const lines = content.replace(/\r\n?/g, '\n').match(/[^\n]*\n|[^\n]+$/g) ?? []
  let output = ''
  let inComment = false
  let inFence = false
  let fenceChar = ''
  let fenceLength = 0

  for (const line of lines) {
    const fence = line.match(/^[ \t]*(`{3,}|~{3,})/)

    if (!inComment && fence) {
      const marker = fence[1]
      if (!inFence) {
        inFence = true
        fenceChar = marker[0]
        fenceLength = marker.length
      } else if (marker[0] === fenceChar && marker.length >= fenceLength) {
        inFence = false
      }

      output += line
      continue
    }

    if (inFence) {
      output += line
      continue
    }

    let index = 0
    let strippedLine = ''

    while (index < line.length) {
      if (inComment) {
        const end = line.indexOf('-->', index)
        if (end === -1) break
        index = end + 3
        inComment = false
      } else {
        const start = line.indexOf('<!--', index)
        if (start === -1) {
          strippedLine += line.slice(index)
          break
        }

        strippedLine += line.slice(index, start)
        index = start + 4
        inComment = true
      }
    }

    output += strippedLine
  }

  return output
}

type NotesOnlyHmrOptions = {
  projectRoot?: string
  patterns?: string[]
  log?: (message: string) => void
}

type NotesOnlyHotUpdateContext = {
  type?: string
  file: string
  timestamp?: number
  read: () => string | Promise<string>
}

export function createNotesOnlyHmrHandler(options: NotesOnlyHmrOptions = {}) {
  const projectRoot = normalize(resolve(options.projectRoot ?? process.cwd()))
  const patterns = options.patterns ?? notesOnlyHmrFiles
  const log = options.log ?? console.log
  const snapshots = new Map<string, string>()
  const processedUpdates = new Map<string, [] | undefined>()

  snapshotNotesOnlyHmrFiles(snapshots, projectRoot, patterns)

  return async ({ file, read, timestamp, type }: NotesOnlyHotUpdateContext) => {
    if (type !== 'update' || !isNotesOnlyHmrFile(file, projectRoot, patterns)) return

    const normalizedFile = normalizeFile(file)
    const processedKey = typeof timestamp === 'number' ? `${normalizedFile}:${timestamp}` : ''
    if (processedKey && processedUpdates.has(processedKey)) {
      return processedUpdates.get(processedKey)
    }

    const previous = snapshots.get(normalizedFile)
    const current = stripSlidevNotes(await read())
    let result: [] | undefined

    if (previous === undefined) {
      snapshots.set(normalizedFile, current)
    } else if (current === previous) {
      log(
        `[slidev] ignored notes-only HMR update ${projectRelativePath(normalizedFile, projectRoot)}`,
      )
      result = []
    } else {
      snapshots.set(normalizedFile, current)
    }

    if (processedKey) processedUpdates.set(processedKey, result)
    return result
  }
}

export function resolveNotesOnlyHmrFiles(config: UstcThemeViteConfig = {}): string[] {
  const configured = Array.isArray(config.ustcTheme?.notesOnlyHmrFiles)
    ? config.ustcTheme.notesOnlyHmrFiles
    : notesOnlyHmrFiles
  const extra = Array.isArray(config.ustcTheme?.extraNotesOnlyHmrFiles)
    ? config.ustcTheme.extraNotesOnlyHmrFiles
    : []

  return [...new Set([...configured, ...extra])]
}

export function isSlidevVirtualSlideModuleId(value: unknown): boolean {
  if (typeof value !== 'string') return false
  return (
    /__slidev_\d+\.(?:md|frontmatter)(?:\?|$)/.test(value) ||
    /(?:^|\/)@slidev\/slides(?:\/|$|\?)/.test(value)
  )
}

export function collectSlideHmrModules(moduleGraph: any): any[] {
  const result: any[] = []
  const seen = new Set<any>()

  const visit = (mod: any) => {
    if (!mod || seen.has(mod)) return
    if (!isSlidevVirtualSlideModuleId(mod.url) && !isSlidevVirtualSlideModuleId(mod.id)) return
    seen.add(mod)
    result.push(mod)
  }

  for (const mod of moduleGraph?.urlToModuleMap?.values?.() ?? []) visit(mod)
  for (const mod of moduleGraph?.idToModuleMap?.values?.() ?? []) visit(mod)

  return result
}

export function handleSlideMarkdownHotUpdate(ctx: any, moduleGraph = ctx.server?.moduleGraph) {
  if (!/\.(?:md|mdx)$/.test(ctx.file)) return

  const slideModules = collectSlideHmrModules(moduleGraph)
  for (const mod of slideModules) moduleGraph?.invalidateModule?.(mod)

  return [...new Set([...(ctx.modules ?? []), ...slideModules])]
}

export default () => {
  const notesOnlyHmrHandler = createNotesOnlyHmrHandler()
  let resolvedNotesOnlyHmrHandler = notesOnlyHmrHandler

  return {
    name: 'ustc-vite-tweaks',
    configResolved(config: UstcThemeViteConfig) {
      resolvedNotesOnlyHmrHandler = createNotesOnlyHmrHandler({
        projectRoot: config.root,
        patterns: resolveNotesOnlyHmrFiles(config),
      })
    },
    hotUpdate: {
      order: 'post',
      async handler(this: any, ctx: any) {
        const notesOnlyResult = await resolvedNotesOnlyHmrHandler(ctx)
        if (notesOnlyResult) return notesOnlyResult

        return handleSlideMarkdownHotUpdate(
          ctx,
          this.environment?.moduleGraph ?? ctx.server?.moduleGraph,
        )
      },
    },
    async handleHotUpdate(ctx: any) {
      const notesOnlyResult = await resolvedNotesOnlyHmrHandler({ ...ctx, type: 'update' })
      if (notesOnlyResult) return notesOnlyResult

      return handleSlideMarkdownHotUpdate(ctx)
    },
  }
}
