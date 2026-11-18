import { MeetingFragment } from '../gql'
import { VideoConfTypes } from '../model/meeting'
import generateJitsiUrl from './generateJitsiUrl'

// The URL is stored as is in a jsonb column, so it's only used as a link
// when it's an absolute http(s) URL (no javascript: or data: href)
export function isHttpUrl(url: unknown): url is string {
  if (typeof url !== 'string' || !url) return false
  try {
    const { protocol } = new URL(url)
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}

export default function getMeetingVideoConfUrl(
  meeting?: MeetingFragment,
  roleName?: string,
  displayName = ''
): string | undefined {
  if (!meeting?.videoConf) return
  if (meeting.videoConf.type === VideoConfTypes.Jitsi && roleName) {
    return generateJitsiUrl(meeting, roleName, displayName)
  }
  if (meeting.videoConf.type === VideoConfTypes.Url) {
    const { url } = meeting.videoConf
    return isHttpUrl(url) ? url : undefined
  }
}
