import { getEntry } from 'astro:content'
import config from '../../website.config'

const { langs, defaultLang } = config
export type Lang = (typeof langs)[number]

export async function getTranslations(lang: Lang) {
  const entry = await getEntry('translations', lang)
  return entry!.data as Record<string, any>
}

export function getLangFromUrl(url: URL): Lang {
  const first = url.pathname.split('/')[1]?.replace(/\.html$/, '')
  return langs.includes(first as Lang) ? (first as Lang) : defaultLang
}

export function getOtherLangHref(path: string, lang: Lang): string {
  const other = lang === langs[0] ? langs[1] : langs[0]
  return path.replace(`/${lang}`, `/${other}`)
}

/** Extract the slug (folder name) from a content collection entry ID like "my-slug/en" */
export function getSlugFromId(id: string): string {
  return id.split('/')[0]
}

/** Get the lang suffix from a content collection entry ID like "my-slug/en" */
export function getLangFromId(id: string): Lang {
  return id.split('/')[1] as Lang
}

export function langPath(lang: Lang, path: string): string {
  return `/${lang}${path}`
}
