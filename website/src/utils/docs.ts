import { langPath, type Lang } from './i18n'

/** Whether the URL belongs to the developer documentation tab. */
export function isDeveloperDocs(url: URL, lang: Lang): boolean {
  return url.pathname.startsWith(langPath(lang, '/developers'))
}
