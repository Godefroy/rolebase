import { config } from 'dotenv'
import path from 'path'

// The package .env comes first, then the project root .env fills the rest
config({ path: path.join(__dirname, '../.env') })
config({ path: path.join(__dirname, '../../../.env') })

export function getEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing ${name} in .env`)
  return value
}
