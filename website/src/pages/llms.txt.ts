import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import {
  getLangFromId,
  getNestedSlugFromId,
  getSlugFromId,
} from '../utils/i18n'

const siteUrl = import.meta.env.SITE?.replace(/\/$/, '') || ''

function notDraft(entry: { data: { draft?: boolean } }) {
  return !entry.data.draft
}

export const GET: APIRoute = async () => {
  const [docs, guides, developers, blog, clientCases, glossary] =
    await Promise.all([
      getCollection('docs'),
      getCollection('guides'),
      getCollection('developers'),
      getCollection('blog'),
      getCollection('client-cases'),
      getCollection('glossary', notDraft),
    ])

  // Filter English entries only for the index
  const en = <T extends { id: string }>(entries: T[]) =>
    entries.filter((e) => getLangFromId(e.id) === 'en')

  // Sort by order if available
  const byOrder = (
    a: { data: { order?: number } },
    b: { data: { order?: number } }
  ) => (a.data.order ?? 999) - (b.data.order ?? 999)

  const lines: string[] = [
    '# Rolebase',
    '',
    '> Open-source platform for self-managed organizations. Clarify roles, run efficient meetings, and make better decisions as a team.',
    '',
    `A markdown version of each page is available by replacing \`.html\` with \`.md\` in the URL (e.g., ${siteUrl}/en/docs/members.md).`,
    '',
    '## About',
    '',
    'Rolebase is an open-source governance platform for organizations using holacracy, sociocracy, or any form of self-management. It provides tools for role management, meetings, decisions, tasks, and threaded discussions.',
    '',
    `- [Homepage](${siteUrl}/en)`,
    `- [Features](${siteUrl}/en/features)`,
    `- [Pricing](${siteUrl}/en/pricing)`,
    `- [Contact](${siteUrl}/en/contact)`,
    `- [Blog](${siteUrl}/en/blog)`,
    `- [Case Studies](${siteUrl}/en/client-cases)`,
  ]

  function addSection(
    title: string,
    entries: {
      id: string
      data: { title: string; description?: string; summary?: string }
    }[],
    prefix: string,
    slugOf: (id: string) => string = getSlugFromId
  ) {
    lines.push('', `## ${title}`, '')
    for (const entry of entries) {
      const slug = slugOf(entry.id)
      const desc =
        entry.data.description || (entry.data as { summary?: string }).summary
      const suffix = desc ? `: ${desc}` : ''
      const path = slug ? `${prefix}/${slug}` : prefix
      lines.push(`- [${entry.data.title}](${siteUrl}/en/${path})${suffix}`)
    }
  }

  // The API references are nested under `developers/graphql-api/` and
  // `developers/trpc-api/`, and get a section of their own.
  const nestedUnder = (prefix: string) => (entry: { id: string }) =>
    getNestedSlugFromId(entry.id).startsWith(`${prefix}/`)
  const isNested = (entry: { id: string }) =>
    getNestedSlugFromId(entry.id).includes('/')

  addSection('Documentation', en(docs).sort(byOrder), 'docs')
  addSection('Guides', en(guides).sort(byOrder), 'guides')
  addSection(
    'Developers',
    en(developers).filter((e) => !isNested(e)).sort(byOrder),
    'developers',
    getNestedSlugFromId
  )
  addSection(
    'GraphQL API Reference',
    en(developers)
      .filter(nestedUnder('graphql-api'))
      .sort((a, b) => a.data.title.localeCompare(b.data.title)),
    'developers',
    getNestedSlugFromId
  )
  addSection(
    'tRPC API Reference',
    en(developers).filter(nestedUnder('trpc-api')).sort(byOrder),
    'developers',
    getNestedSlugFromId
  )
  addSection(
    'Blog',
    en(blog).sort(
      (a, b) => (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0)
    ),
    'blog'
  )
  addSection('Case Studies', en(clientCases), 'client-cases')

  // Glossary uses `name` instead of `title`
  lines.push('', '## Glossary', '')
  for (const entry of en(glossary).sort((a, b) =>
    a.data.name.localeCompare(b.data.name)
  )) {
    const slug = getSlugFromId(entry.id)
    const suffix = entry.data.summary ? `: ${entry.data.summary}` : ''
    lines.push(
      `- [${entry.data.name}](${siteUrl}/en/glossary/${slug})${suffix}`
    )
  }

  lines.push('')

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
