#!/usr/bin/env node
// Fail on one-line content-bearing theme components in Slidev markdown decks.
//
// Usage:
//   node <skill>/scripts/check-component-format.mjs slides.md sections/*.md
//
// This is intentionally narrow: it catches the common style violation where
// content is placed between the opening and closing tags on one line. It does
// not parse Vue, and it ignores inline Badge and self-closing media components.

import { readFileSync, statSync } from 'node:fs'
import { basename } from 'node:path'

const DEFAULT_COMPONENTS = ['Block', 'Box', 'Callout', 'ResultBox', 'Takeaway']

const args = process.argv.slice(2)
if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
  console.log(
    `Usage: node ${basename(process.argv[1])} [--components A,B,C] <deck.md> [more.md ...]`,
  )
  console.log(`Default components: ${DEFAULT_COMPONENTS.join(', ')}`)
  process.exit(args.length === 0 ? 2 : 0)
}

let components = DEFAULT_COMPONENTS
const files = []
for (let i = 0; i < args.length; i += 1) {
  const arg = args[i]
  if (arg === '--components') {
    const value = args[i + 1]
    if (!value) {
      console.error('check-component-format: --components needs a comma-separated value.')
      process.exit(2)
    }
    components = value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    i += 1
    continue
  }
  files.push(arg)
}

if (files.length === 0) {
  console.error('check-component-format: pass at least one markdown file.')
  process.exit(2)
}

const componentPattern = components.map(escapeRegExp).join('|')
const sameLineContent = new RegExp(
  `^\\s*<(${componentPattern})\\b([^>]*)>(\\s*\\S[\\s\\S]*?)</\\1>`,
)
const sameLineOpenText = new RegExp(`^\\s*<(${componentPattern})\\b([^>]*)>\\s*\\S`)

const findings = []
for (const file of files) {
  let stat
  try {
    stat = statSync(file)
  } catch {
    findings.push({ file, line: 0, text: 'file not found' })
    continue
  }
  if (!stat.isFile()) continue

  const lines = readFileSync(file, 'utf8').split(/\r?\n/)
  let inFence = false
  lines.forEach((line, idx) => {
    const trimmed = line.trim()
    if (/^(```|~~~)/.test(trimmed)) {
      inFence = !inFence
      return
    }
    if (inFence) return
    if (!trimmed || trimmed.startsWith('<!--')) return
    if (sameLineContent.test(trimmed) || sameLineOpenText.test(trimmed)) {
      findings.push({ file, line: idx + 1, text: trimmed })
    }
  })
}

if (findings.length > 0) {
  console.error('One-line content components found. Use:')
  console.error('<Component props>')
  console.error('')
  console.error('content')
  console.error('')
  console.error('</Component>')
  console.error('')
  for (const f of findings) {
    const location = f.line > 0 ? `${f.file}:${f.line}` : f.file
    console.error(`${location}: ${f.text}`)
  }
  process.exit(1)
}

console.log(`OK: no one-line content components in ${files.length} file(s).`)

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
