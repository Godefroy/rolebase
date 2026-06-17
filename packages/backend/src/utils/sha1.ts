import crypto, { type BinaryLike } from 'crypto'

export function sha1(input: BinaryLike) {
  const hash = crypto.createHash('sha1')
  hash.update(input)
  return hash.digest('hex')
}
