import { describe, expect, it } from 'vitest'
import {
  getNameFromEmailDomain,
  isSharedEmailDomain,
} from './getNameFromEmailDomain'

describe('isSharedEmailDomain', () => {
  it.each([
    'gmail.com',
    'hotmail.fr',
    'yahoo.co.uk',
    'yopmail.com',
    'ik.me',
    'mailo.com',
    'relay.firefox.com',
    'mozmail.com',
    'simplelogin.com',
    'etu.unige.ch',
    'student.uva.nl',
    'ac-aix-marseille.fr',
    'edu.ge.ch',
    'sydneycollege.nsw.edu.au',
    'mit.edu',
  ])('treats %s as shared', (domain) => {
    expect(isSharedEmailDomain(domain)).toBe(true)
  })

  it.each([
    'munatherapeutics.com',
    'acme-corp.co.uk',
    'universite-du-nous.org',
    'univ-pau.fr',
    'mheducation.com',
    'educagri.fr',
    'tue.nl',
  ])('treats %s as a company or institution', (domain) => {
    expect(isSharedEmailDomain(domain)).toBe(false)
  })
})

describe('getNameFromEmailDomain', () => {
  it('derives a name from a company domain', () => {
    expect(getNameFromEmailDomain('jean@acme-corp.co.uk')).toBe('Acme Corp')
  })

  it('is empty for a shared domain', () => {
    expect(getNameFromEmailDomain('jean@yopmail.com')).toBe('')
    expect(getNameFromEmailDomain('jean@etu.unige.ch')).toBe('')
  })
})
