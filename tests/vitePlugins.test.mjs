// Run: pnpm exec tsx --test tests/vitePlugins.test.mjs

import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import createUstcViteTweaks, {
  createNotesOnlyHmrHandler,
  isNotesOnlyHmrFile,
  notesOnlyHmrFiles,
  resolveNotesOnlyHmrFiles,
  stripSlidevNotes,
} from '../setup/vite-plugins.ts'

test('notes-only HMR whitelist matches slides.md and one-level sections markdown only', () => {
  const root = '/deck'

  assert.equal(isNotesOnlyHmrFile('/deck/slides.md', root, notesOnlyHmrFiles), true)
  assert.equal(isNotesOnlyHmrFile('/deck/sections/intro.md', root, notesOnlyHmrFiles), true)
  assert.equal(isNotesOnlyHmrFile('/deck/sections/nested/intro.md', root, notesOnlyHmrFiles), false)
  assert.equal(isNotesOnlyHmrFile('/deck/notes.md', root, notesOnlyHmrFiles), false)
  assert.equal(isNotesOnlyHmrFile('/outside/slides.md', root, notesOnlyHmrFiles), false)
})

test('stripSlidevNotes removes HTML comments outside fences only', () => {
  const source = [
    '# Title',
    '',
    '<!-- presenter note -->',
    '',
    'Visible content <!-- inline note --> stays.',
    '',
    '```html',
    '<!-- rendered code sample -->',
    '```',
    '',
  ].join('\r\n')

  assert.equal(
    stripSlidevNotes(source),
    [
      '# Title',
      '',
      '',
      '',
      'Visible content  stays.',
      '',
      '```html',
      '<!-- rendered code sample -->',
      '```',
      '',
    ].join('\n'),
  )
})

test('stripSlidevNotes preserves Markdown-significant whitespace', () => {
  assert.notEqual(stripSlidevNotes('A  \nB\n'), stripSlidevNotes('A\nB\n'))
  assert.equal(stripSlidevNotes('A  \nB\n'), 'A  \nB\n')
  assert.equal(stripSlidevNotes('A\n\n\nB\n'), 'A\n\n\nB\n')
})

test('notes-only HMR handler ignores comment-only updates for whitelisted files', async () => {
  const root = mkdtempSync(join(tmpdir(), 'ustc-hmr-'))

  try {
    mkdirSync(join(root, 'sections'))
    const slidesFile = join(root, 'slides.md')
    const otherFile = join(root, 'notes.md')

    writeFileSync(slidesFile, '# Title\n\nVisible\n\n<!-- old note -->\n')
    writeFileSync(otherFile, '# Notes\n\n<!-- old note -->\n')

    const handler = createNotesOnlyHmrHandler({ projectRoot: root, log: () => {} })

    assert.deepEqual(
      await handler({
        type: 'update',
        file: slidesFile,
        read: () => '# Title\n\nVisible\n\n<!-- new note -->\n',
      }),
      [],
      'existing whitelisted files are snapshotted when the handler is created',
    )

    assert.deepEqual(
      await handler({
        type: 'update',
        file: slidesFile,
        read: () => '# Title\n\nVisible\n\n<!-- newer note -->\n',
      }),
      [],
    )

    assert.equal(
      await handler({
        type: 'update',
        file: slidesFile,
        read: () => '# Title\n\nChanged\n\n<!-- newer note -->\n',
      }),
      undefined,
    )

    assert.equal(
      await handler({
        type: 'update',
        timestamp: 100,
        file: slidesFile,
        read: () => '# Title\n\nChanged again\n\n<!-- newer note -->\n',
      }),
      undefined,
    )

    assert.equal(
      await handler({
        type: 'update',
        timestamp: 100,
        file: slidesFile,
        read: () => '# Title\n\nChanged again\n\n<!-- newer note -->\n',
      }),
      undefined,
      'the same Vite timestamp is processed consistently across environments',
    )

    assert.equal(
      await handler({
        type: 'update',
        file: otherFile,
        read: () => '# Notes\n\n<!-- new note -->\n',
      }),
      undefined,
      'non-whitelisted markdown still follows normal HMR',
    )
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('theme plugin accepts extra notes-only HMR files from deck vite config', async () => {
  const root = mkdtempSync(join(tmpdir(), 'ustc-hmr-config-'))

  try {
    mkdirSync(join(root, 'chapters'))
    const chapterFile = join(root, 'chapters', 'intro.md')
    writeFileSync(chapterFile, '# Chapter\n\n<!-- old note -->\n')

    assert.deepEqual(resolveNotesOnlyHmrFiles({}), notesOnlyHmrFiles)
    assert.deepEqual(
      resolveNotesOnlyHmrFiles({
        ustcTheme: { extraNotesOnlyHmrFiles: ['chapters/*.md'] },
      }),
      [...notesOnlyHmrFiles, 'chapters/*.md'],
    )

    const originalLog = console.log
    console.log = () => {}
    try {
      const plugin = createUstcViteTweaks()
      plugin.configResolved({
        root,
        ustcTheme: { extraNotesOnlyHmrFiles: ['chapters/*.md'] },
      })

      assert.deepEqual(
        await plugin.hotUpdate.handler({
          type: 'update',
          file: chapterFile,
          read: () => '# Chapter\n\n<!-- new note -->\n',
        }),
        [],
      )
    } finally {
      console.log = originalLog
    }
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
