import axios from 'axios'

export async function loadFileBuffer(
  url: string
): Promise<Uint8Array | undefined> {
  try {
    const result = await axios.get(url, { responseType: 'arraybuffer' })
    return new Uint8Array(result.data)
  } catch (e) {
    console.warn(`Error downloading file: ${url}`)
  }
}
