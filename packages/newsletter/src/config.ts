export const langs = ['fr', 'en'] as const
export type Lang = (typeof langs)[number]

// Recipients with another locale get this version
export const defaultLang: Lang = 'en'

export type Kind = 'legal' | 'product'

// Brevo templates (layouts for campaigns made in Brevo), pushed by `templates`
export const templateIds: Record<Kind, Record<Lang, number>> = {
  legal: { fr: 1, en: 2 },
  product: { fr: 3, en: 4 },
}

// Brevo sender "Rolebase <contact@rolebase.io>"
export const senderId = 4
export const contactEmail = 'contact@rolebase.io'

// Brevo folder holding one contact list per language
export const folderName = 'Rolebase'
export const getListName = (lang: Lang) =>
  `Rolebase users ${lang.toUpperCase()}`

// Production Nhost storage, hosting the campaign images
export const storageUrl =
  'https://fsudktxishllphxeibqs.storage.eu-central-1.nhost.run/v1'

export const siteUrl = 'https://rolebase.io'
