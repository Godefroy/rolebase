import { describe, expect, it } from 'vitest'
import { isAllowedImportFileUrl } from './loadFileBuffer'

describe('isAllowedImportFileUrl', () => {
  it('accepts Holaspirit uploads over https', () => {
    expect(
      isAllowedImportFileUrl(
        'https://app.holaspirit.com/public/uploads/a/b/avatar.png'
      )
    ).toBe(true)
  })

  it.each([
    'http://app.holaspirit.com/public/uploads/a.png',
    'https://app.holaspirit.com.evil.test/public/uploads/a.png',
    'https://evil.test/public/uploads/a.png',
    'https://app.holaspirit.com/private/a.png',
    'https://app.holaspirit.com/public/uploads/../../internal',
    'https://user:pass@app.holaspirit.com/public/uploads/a.png',
    'https://app.holaspirit.com:8443/public/uploads/a.png',
    'http://127.0.0.1:8080/x',
    'http://169.254.169.254/latest/meta-data/',
    'file:///etc/passwd',
    'not a url',
  ])('refuses %s', (url) => {
    expect(isAllowedImportFileUrl(url)).toBe(false)
  })
})
