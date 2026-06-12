// Convert editor contents from Lexical JSON to markdown, backing up
// original values in *_legacy columns. Re-runnable and idempotent:
// - only values starting with '{' are converted
// - *_legacy columns are written once (first conversion)
// - --from-legacy re-converts from the backups (to fix a conversion bug)
//
// Usage:
//   npx tsx scripts/migrateEditorContent.ts --audit       # count values to convert
//   npx tsx scripts/migrateEditorContent.ts --dry-run     # show what would be converted
//   npx tsx scripts/migrateEditorContent.ts               # convert everything
//   npx tsx scripts/migrateEditorContent.ts --table role  # convert a single table
//   npx tsx scripts/migrateEditorContent.ts --from-legacy # re-convert from backups

import { exportToMarkdown } from '@rolebase/editor-legacy'
import { nhost } from '../src/utils/nhost'

const BATCH_SIZE = 100

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const fromLegacy = args.includes('--from-legacy')
const audit = args.includes('--audit')
const tableArgIndex = args.indexOf('--table')
const onlyTable = tableArgIndex === -1 ? undefined : args[tableArgIndex + 1]

interface SimpleTable {
  table: string
  fields: string[]
}

const simpleTables: SimpleTable[] = [
  {
    table: 'role',
    fields: [
      'purpose',
      'domain',
      'accountabilities',
      'checklist',
      'indicators',
      'notes',
    ],
  },
  { table: 'decision', fields: ['description'] },
  { table: 'task', fields: ['description'] },
  { table: 'member', fields: ['description'] },
  { table: 'meeting', fields: ['summary'] },
  { table: 'meeting_step', fields: ['notes'] },
]

// Editor fields nested in thread_activity.data, by activity type
const activityFields: Record<string, string> = {
  Message: 'message',
  Poll: 'question',
  MeetingNote: 'notes',
}

// Editor fields nested in log.changes, by entity type
const logEntityFields: Record<string, string[]> = {
  roles: [
    'purpose',
    'domain',
    'accountabilities',
    'checklist',
    'indicators',
    'notes',
  ],
  members: ['description'],
  tasks: ['description'],
  decisions: ['description'],
}

let totalConverted = 0
let totalErrors = 0

async function request<T = any>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const result = await nhost.graphql.request({ query, variables })
  const body = result.body as { data?: T; errors?: unknown[] }
  if (body.errors?.length) {
    throw new Error(JSON.stringify(body.errors))
  }
  if (!body.data) {
    throw new Error('No data returned')
  }
  return body.data
}

function isLexicalJSON(value: unknown): value is string {
  return typeof value === 'string' && value[0] === '{'
}

// Convert a Lexical JSON value to markdown.
// Returns undefined when the conversion fails.
function convert(value: string, context: string): string | undefined {
  const markdown = exportToMarkdown(value)
  if (isLexicalJSON(markdown)) {
    // exportToMarkdown returns the value untouched on parse error
    console.error(`  ⚠️ Conversion failed, skipping: ${context}`)
    totalErrors++
    return undefined
  }
  return markdown
}

function preview(value: string): string {
  const singleLine = value.replace(/\n/g, '⏎')
  return singleLine.length > 80 ? `${singleLine.slice(0, 80)}…` : singleLine
}

async function processSimpleTable({ table, fields }: SimpleTable) {
  const legacyFields = fields.map((field) => `${field}_legacy`)
  const baseWhere = fromLegacy
    ? { _or: legacyFields.map((field) => ({ [field]: { _is_null: false } })) }
    : { _or: fields.map((field) => ({ [field]: { _like: '{%' } })) }

  let after: string | undefined
  let count = 0

  for (;;) {
    const where = after
      ? { _and: [baseWhere, { id: { _gt: after } }] }
      : baseWhere
    const data = await request<{ rows: Array<Record<string, any>> }>(
      `query($where: ${table}_bool_exp!, $limit: Int!) {
        rows: ${table}(where: $where, order_by: {id: asc}, limit: $limit) {
          id ${fields.join(' ')} ${legacyFields.join(' ')}
        }
      }`,
      { where, limit: BATCH_SIZE }
    )
    if (data.rows.length === 0) break
    after = data.rows[data.rows.length - 1].id

    for (const row of data.rows) {
      const set: Record<string, string> = {}
      for (const field of fields) {
        const legacyField = `${field}_legacy`
        const source = fromLegacy
          ? row[legacyField]
          : (row[legacyField] ?? row[field])
        if (!fromLegacy && !isLexicalJSON(row[field])) continue
        if (!isLexicalJSON(source)) continue
        const markdown = convert(source, `${table}.${field} id=${row.id}`)
        if (markdown === undefined) continue
        set[field] = markdown
        if (!row[legacyField]) {
          set[legacyField] = source
        }
      }
      if (Object.keys(set).length === 0) continue
      count++
      if (dryRun) {
        if (count <= 3) {
          for (const field of fields) {
            if (set[field] === undefined) continue
            console.log(`  ${table}.${field} id=${row.id}`)
            console.log(`    → ${preview(set[field])}`)
          }
        }
        continue
      }
      await request(
        `mutation($id: uuid!, $set: ${table}_set_input!) {
          update_${table}_by_pk(pk_columns: {id: $id}, _set: $set) { id }
        }`,
        { id: row.id, set }
      )
    }
  }

  totalConverted += count
  console.log(`${table}: ${count} row(s) ${dryRun ? 'to convert' : 'converted'}`)
}

async function processThreadActivities() {
  let after: string | undefined
  let count = 0

  for (;;) {
    const where: Record<string, unknown> = {
      type: { _in: Object.keys(activityFields) },
      ...(after ? { id: { _gt: after } } : {}),
    }
    const data = await request<{ rows: Array<Record<string, any>> }>(
      `query($where: thread_activity_bool_exp!, $limit: Int!) {
        rows: thread_activity(where: $where, order_by: {id: asc}, limit: $limit) {
          id type data data_legacy
        }
      }`,
      { where, limit: BATCH_SIZE }
    )
    if (data.rows.length === 0) break
    after = data.rows[data.rows.length - 1].id

    for (const row of data.rows) {
      const field = activityFields[row.type]
      const source = fromLegacy ? row.data_legacy : (row.data_legacy ?? row.data)
      const value = source?.[field]
      if (!fromLegacy && !isLexicalJSON(row.data?.[field])) continue
      if (!isLexicalJSON(value)) continue
      const markdown = convert(
        value,
        `thread_activity.data.${field} id=${row.id}`
      )
      if (markdown === undefined) continue

      count++
      if (dryRun) {
        if (count <= 3) {
          console.log(`  thread_activity.data.${field} id=${row.id}`)
          console.log(`    → ${preview(markdown)}`)
        }
        continue
      }
      await request(
        `mutation($id: uuid!, $data: json!, $dataLegacy: json!) {
          update_thread_activity_by_pk(
            pk_columns: {id: $id}
            _set: {data: $data, data_legacy: $dataLegacy}
          ) { id }
        }`,
        {
          id: row.id,
          data: { ...row.data, [field]: markdown },
          dataLegacy: row.data_legacy ?? row.data,
        }
      )
    }
  }

  totalConverted += count
  console.log(
    `thread_activity: ${count} row(s) ${dryRun ? 'to convert' : 'converted'}`
  )
}

// Check if a log changes payload still contains Lexical JSON values
function hasLexicalValues(changes: Record<string, any> | null): boolean {
  if (!changes) return false
  for (const entityType of Object.keys(logEntityFields)) {
    for (const change of changes[entityType] ?? []) {
      for (const key of ['data', 'prevData', 'newData']) {
        const entity = change[key]
        if (!entity) continue
        for (const field of logEntityFields[entityType]) {
          if (isLexicalJSON(entity[field])) return true
        }
      }
    }
  }
  return false
}

async function processLogs() {
  let after: string | undefined
  let count = 0

  for (;;) {
    const where: Record<string, unknown> = after ? { id: { _gt: after } } : {}
    const data = await request<{ rows: Array<Record<string, any>> }>(
      `query($where: log_bool_exp!, $limit: Int!) {
        rows: log(where: $where, order_by: {id: asc}, limit: $limit) {
          id changes changes_legacy
        }
      }`,
      { where, limit: BATCH_SIZE }
    )
    if (data.rows.length === 0) break
    after = data.rows[data.rows.length - 1].id

    for (const row of data.rows) {
      // In normal mode, skip rows whose current changes are already converted
      if (!fromLegacy && !hasLexicalValues(row.changes)) continue
      const source = fromLegacy
        ? row.changes_legacy
        : (row.changes_legacy ?? row.changes)
      if (!source) continue
      const changes = JSON.parse(JSON.stringify(source))
      let converted = false

      for (const entityType of Object.keys(logEntityFields)) {
        for (const change of changes[entityType] ?? []) {
          for (const key of ['data', 'prevData', 'newData']) {
            const entity = change[key]
            if (!entity) continue
            for (const field of logEntityFields[entityType]) {
              if (!isLexicalJSON(entity[field])) continue
              const markdown = convert(
                entity[field],
                `log.changes.${entityType}.${key}.${field} id=${row.id}`
              )
              if (markdown === undefined) continue
              entity[field] = markdown
              converted = true
            }
          }
        }
      }

      if (!converted) continue

      count++
      if (dryRun) continue
      await request(
        `mutation($id: uuid!, $changes: json!, $changesLegacy: json!) {
          update_log_by_pk(
            pk_columns: {id: $id}
            _set: {changes: $changes, changes_legacy: $changesLegacy}
          ) { id }
        }`,
        {
          id: row.id,
          changes,
          changesLegacy: row.changes_legacy ?? row.changes,
        }
      )
    }
  }

  totalConverted += count
  console.log(`log: ${count} row(s) ${dryRun ? 'to convert' : 'converted'}`)
}

async function auditTable(table: string, fields: string[]) {
  for (const field of fields) {
    const data = await request<{ agg: { aggregate: { count: number } } }>(
      `query {
        agg: ${table}_aggregate(where: {${field}: {_like: "{%"}}) {
          aggregate { count }
        }
      }`
    )
    const count = data.agg.aggregate.count
    if (count > 0) {
      console.log(`${table}.${field}: ${count} JSON value(s)`)
    }
  }
}

async function main() {
  if (audit) {
    console.log('Audit: counting Lexical JSON values…')
    for (const { table, fields } of simpleTables) {
      await auditTable(table, fields)
    }
    // Tables converted through nested JSON are audited by a dry run
    console.log('For thread_activity and log, run with --dry-run')
    return
  }

  console.log(
    `${dryRun ? 'Dry run' : 'Converting'}${fromLegacy ? ' from *_legacy backups' : ''}…`
  )

  for (const tableConfig of simpleTables) {
    if (onlyTable && tableConfig.table !== onlyTable) continue
    await processSimpleTable(tableConfig)
  }
  if (!onlyTable || onlyTable === 'thread_activity') {
    await processThreadActivities()
  }
  if (!onlyTable || onlyTable === 'log') {
    await processLogs()
  }

  console.log(
    `Done: ${totalConverted} row(s) ${dryRun ? 'to convert' : 'converted'}, ${totalErrors} error(s)`
  )
  if (totalErrors > 0) process.exitCode = 1
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
