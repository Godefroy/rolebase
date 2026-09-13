import { Resolver } from 'node:dns/promises'
import * as yup from 'yup'
import { publicProcedure } from '../../trpc'

// Public: it runs on the sign-in email step, before any session exists. It
// only receives the domain, never the full address.

// DNS answers meaning the domain exists without mail servers, or not at all
const NO_MAIL_CODES = ['ENOTFOUND', 'ENODATA', 'ENODOMAIN']

// A hostname made of letters, digits and hyphens (punycode included)
const DOMAIN_REGEX =
  /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,63}|xn--[a-z0-9-]{1,59})$/

// A slow DNS server must not hold a request for long
const resolver = new Resolver({ timeout: 2000, tries: 1 })

// Answers kept in memory, so repeated calls on a domain skip the DNS lookup
const CACHE_TTL_MS = 60 * 60 * 1000
const CACHE_MAX_ENTRIES = 1000
const cache = new Map<string, { valid: boolean; expiresAt: number }>()

async function lookupDomain(domain: string): Promise<boolean> {
  try {
    const records = await resolver.resolveMx(domain)
    // A "null MX" (RFC 7505, exchange ".") declares that the domain accepts
    // no email at all
    return records.some((record) => record.exchange !== '')
  } catch (error: any) {
    // Any other DNS failure (timeout, network) is not the domain's fault: the
    // address is then considered valid so sign-in is never blocked
    return !NO_MAIL_CODES.includes(error?.code)
  }
}

// Tells whether an email domain can receive emails, before sending a sign-in
// code to it
export default publicProcedure
  .input(yup.object().shape({ domain: yup.string().max(253).required() }))
  .query(async (opts): Promise<{ valid: boolean }> => {
    const domain = opts.input.domain.trim().toLowerCase()
    if (!DOMAIN_REGEX.test(domain)) return { valid: false }

    const cached = cache.get(domain)
    if (cached && cached.expiresAt > Date.now()) return { valid: cached.valid }

    const valid = await lookupDomain(domain)

    // Refresh the entry's position, then drop the oldest one when full (a Map
    // iterates in insertion order)
    cache.delete(domain)
    if (cache.size >= CACHE_MAX_ENTRIES) {
      cache.delete(cache.keys().next().value!)
    }
    cache.set(domain, { valid, expiresAt: Date.now() + CACHE_TTL_MS })

    return { valid }
  })
