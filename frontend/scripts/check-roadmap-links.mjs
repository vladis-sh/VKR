#!/usr/bin/env node
/**
 * Проверяет доступность всех ссылок из entities/roadmap.ts.
 * Запуск: node frontend/scripts/check-roadmap-links.mjs
 *
 * Для каждого URL делается HEAD (fallback на GET), код ответа
 * и финальный URL выводятся в stdout. В конце — сводка по broken.
 */
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const ROADMAP_PATH = path.resolve(ROOT, '../src/entities/roadmap.ts')

const CONCURRENCY = 10
const TIMEOUT_MS = 15000

async function extractResources(source) {
  // Ловим строки вида r('...', 'https://...', '...'[, '...'])
  const regex = /r\(\s*'([^']+)'\s*,\s*'(https?:\/\/[^']+)'\s*,\s*'([^']+)'/g
  const items = []
  let m
  while ((m = regex.exec(source)) !== null) {
    items.push({ title: m[1], url: m[2], source: m[3] })
  }
  return items
}

async function checkOne(item) {
  const { url } = item
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    let res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: ctrl.signal,
      headers: { 'User-Agent': 'roadmap-link-checker/1.0' },
    })
    // Некоторые сайты не поддерживают HEAD — пробуем GET без тела
    if (res.status === 405 || res.status === 403 || res.status >= 500) {
      res = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: ctrl.signal,
        headers: { 'User-Agent': 'roadmap-link-checker/1.0' },
      })
    }
    return { ...item, status: res.status, finalUrl: res.url }
  } catch (err) {
    return { ...item, status: 0, error: err.message }
  } finally {
    clearTimeout(timer)
  }
}

async function run() {
  const source = await readFile(ROADMAP_PATH, 'utf8')
  const items = await extractResources(source)
  console.log(`Нашёл ${items.length} ссылок\n`)

  const results = []
  let idx = 0
  async function worker() {
    while (idx < items.length) {
      const mine = idx++
      const item = items[mine]
      const r = await checkOne(item)
      results.push(r)
      const tag = r.status === 0 ? `ERR(${r.error})` : String(r.status)
      const ok = r.status >= 200 && r.status < 400
      process.stdout.write(
        `${(mine + 1).toString().padStart(3)}/${items.length}  ${ok ? 'OK ' : 'FAIL'}  ${tag.padEnd(10)}  ${r.url}\n`
      )
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker))

  const broken = results.filter((r) => r.status === 0 || r.status >= 400)
  console.log(`\n=== Итог: ${broken.length} проблемных из ${items.length} ===`)
  for (const b of broken) {
    console.log(`  [${b.status || 'ERR'}]  ${b.url}`)
    console.log(`         ${b.title}  (${b.source})`)
    if (b.error) console.log(`         error: ${b.error}`)
  }
  if (broken.length === 0) console.log('Все ссылки отвечают 2xx/3xx ✓')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
