import { defineCollection } from 'astro:content'
import { file, glob } from 'astro/loaders'
import { z } from 'astro/zod'

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // Optional SEO `<title>` / headline split: `title` stays the document
      // title and JSON-LD headline, `h1` overrides the visible on-page H1.
      h1: z.string().optional(),
      summary: z.string(),
      date: z.coerce.date().optional(),
      update: z.coerce.date().optional(),
      image: image().optional(),
      author: z.string().optional(),
      similarPosts: z.array(z.string()).optional(),
      // Key takeaways rendered as a highlighted box at the top of the article.
      takeaways: z.array(z.string()).default([]),
      // Drafts are excluded from the blog index and from the generated pages.
      draft: z.boolean().default(false),
      // Opt a single post out of the auto-inserted mid-article CTA.
      hideInlineCta: z.boolean().default(false),
    }),
})

const clientCases = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/client-cases',
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      // Company name, used as the alt text of the logo. Falls back to `title`,
      // which reads as a full headline rather than as an image description.
      client: z.string().optional(),
      sector: z.string().optional(),
      teamSize: z.string().optional(),
      logo: image().optional(),
    }),
})

const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number().optional(),
    // Set to false on titles that already name the brand, so the document
    // title is not suffixed with it twice.
    titleBrand: z.boolean().default(true),
  }),
})

const guides = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number().optional(),
    // Set to false on titles that already name the brand, so the document
    // title is not suffixed with it twice.
    titleBrand: z.boolean().default(true),
  }),
})

const developers = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/developers' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number().optional(),
    // Sidebar group of a GraphQL API reference page (`graphql-api/<entity>`),
    // matching an id of `api-categories.yaml`.
    category: z.string().optional(),
    wide: z.boolean().optional(),
    titleBrand: z.boolean().default(true),
  }),
})

const apiCategories = defineCollection({
  loader: file('./src/content/api-categories.yaml'),
  schema: z.object({
    // Group heading per language, keyed by lang code.
    title: z.record(z.string(), z.string()),
    order: z.number().optional(),
  }),
})

const glossary = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/glossary',
  }),
  schema: z.object({
    name: z.string(),
    summary: z.string(),
    // SEO `<title>` override. Entries default to `<name> - Definition`, which
    // promises exactly what the competing dictionaries promise. Set this on the
    // terms where a distinct promise earns the click.
    title: z.string().optional(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
    update: z.coerce.date().optional(),
    draft: z.boolean().optional(),
  }),
})

const translations = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/translations' }),
})

const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    // Meta description, rendered by `BaseLayout` and the social preview.
    description: z.string().optional(),
    titleBrand: z.boolean().default(true),
  }),
})

export const collections = {
  blog,
  'client-cases': clientCases,
  docs,
  guides,
  developers,
  'api-categories': apiCategories,
  glossary,
  translations,
  pages,
}
