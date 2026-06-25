import sendNotificationEmail from '@rolebase/emails/helpers/sendNotificationEmail'
import { App_Type_Enum, UserAppFullFragment, gql } from '../../gql'
import i18n, { defaultLang } from '../../i18n'
import settings from '../../settings'
import { adminRequest } from '../../utils/adminRequest'

const APP_TYPE_LABELS: Record<App_Type_Enum, string> = {
  [App_Type_Enum.GoogleCalendar]: 'Google Calendar',
  [App_Type_Enum.Office365]: 'Office 365',
}

const noop = () => undefined

// Process-wide locks keyed by user_app id, so concurrent syncs of the same
// connection never refresh its OAuth tokens in parallel. Microsoft rotates
// (single-use) refresh tokens, so a parallel refresh with the same token makes
// one of the calls fail with invalid_grant even though the account is healthy.
const refreshLocks = new Map<string, Promise<unknown>>()

export default class AbstractApp<SecretConfig, Config> {
  constructor(public userApp: UserAppFullFragment) {}

  // Run `task` exclusively per connection (user_app id): concurrent calls queue
  // and execute one after another instead of in parallel.
  protected async withRefreshLock<T>(task: () => Promise<T>): Promise<T> {
    const key = this.userApp.id
    const previous = refreshLocks.get(key) ?? Promise.resolve()
    const result = previous.then(task, task)
    const tail = result.then(noop, noop)
    refreshLocks.set(key, tail)
    tail.then(() => {
      if (refreshLocks.get(key) === tail) refreshLocks.delete(key)
    })
    return result
  }

  protected get secretConfig(): SecretConfig {
    return this.userApp.secretConfig
  }

  protected get config(): Config {
    return this.userApp.config
  }

  protected get tmpData(): any {
    return this.userApp.tmpData
  }

  protected get timezone(): string {
    return this.userApp.user?.metadata.timezone || settings.defaultTimezone
  }

  public async uninstall() {
    await this.archive()
  }

  // Permanently disconnect a broken connection (OAuth access revoked or refresh
  // token expired): archive it so it stops being synced, and email the user to
  // reconnect. The archive only matches a still-active row, so only the call
  // that actually performs the active -> archived transition emails: concurrent
  // sync failures (or an already-archived row) never notify the user twice.
  public async disconnect() {
    const archived = await this.archive()
    if (!archived) return
    await this.notifyDisconnected()
  }

  // Archive the connection if it is still active. Returns whether this call
  // performed the transition (false if it was already archived).
  private async archive(): Promise<boolean> {
    const { update_user_app } = await adminRequest(ARCHIVE_USER_APP, {
      id: this.userApp.id,
      archivedAt: new Date().toISOString(),
    })
    return Boolean(update_user_app?.affected_rows)
  }

  private async notifyDisconnected() {
    const { users } = await adminRequest(GET_USER_FOR_APP_NOTIFICATION, {
      userId: this.userApp.userId,
    })
    const user = users[0]
    if (!user?.email) return

    const lng = user.locale || defaultLang
    const appName = APP_TYPE_LABELS[this.userApp.type] || this.userApp.type
    const replace = { appName }
    const t = (key: string) =>
      i18n.t(`app.disconnected.${key}` as any, { lng, replace })

    await sendNotificationEmail({
      recipients: [{ Email: user.email, Name: user.displayName || user.email }],
      subject: t('subject'),
      title: t('title'),
      paragraphs: [t('body1'), t('body2')],
      ctaUrl: `${settings.url}/apps`,
      ctaLabel: t('cta'),
    })
  }

  protected async updateSecretConfig(values: Partial<SecretConfig>) {
    this.userApp.secretConfig = { ...this.secretConfig, ...values }
    await adminRequest(UPDATE_USER_APP, {
      id: this.userApp.id,
      values: { secretConfig: this.userApp.secretConfig },
    })
  }

  // Reload secretConfig from the database. Used to recover from OAuth refresh
  // token rotation races: when a concurrent sync has already rotated and
  // persisted a new token, our in-memory copy is stale.
  protected async reloadSecretConfig(): Promise<SecretConfig> {
    const { user_app_by_pk } = await adminRequest(GET_USER_APP, {
      id: this.userApp.id,
    })
    if (user_app_by_pk) {
      this.userApp.secretConfig = user_app_by_pk.secretConfig
    }
    return this.secretConfig
  }

  protected async updateConfig(values: Partial<Config>) {
    this.userApp.config = { ...this.config, ...values }
    await adminRequest(UPDATE_USER_APP, {
      id: this.userApp.id,
      values: { config: this.userApp.config },
    })
  }

  protected async updateTmpData(values: any) {
    this.userApp.tmpData = { ...this.tmpData, ...values }
    await adminRequest(UPDATE_USER_APP, {
      id: this.userApp.id,
      values: { tmpData: this.userApp.tmpData },
    })
  }
}

const UPDATE_USER_APP = gql(`
  mutation updateUserApp($id: uuid!, $values: user_app_set_input!) {
    update_user_app_by_pk(pk_columns: { id: $id }, _set: $values) {
      id
    }
  }
`)

// Archive the connection only while it is still active, returning how many rows
// changed so callers can tell whether they performed the transition. Postgres
// re-checks `archivedAt IS NULL` on the locked row, so under concurrency exactly
// one caller gets affected_rows = 1.
const ARCHIVE_USER_APP = gql(`
  mutation archiveUserApp($id: uuid!, $archivedAt: timestamptz!) {
    update_user_app(
      where: { id: { _eq: $id }, archivedAt: { _is_null: true } }
      _set: { archivedAt: $archivedAt }
    ) {
      affected_rows
    }
  }
`)

export const GET_USER_APP = gql(`
  query getUserApp($id: uuid!) {
    user_app_by_pk(id: $id) {
      ...UserAppFull
    }
  }
`)

const GET_USER_FOR_APP_NOTIFICATION = gql(`
  query getUserForAppNotification($userId: uuid!) {
    users(where: { id: { _eq: $userId } }) {
      id
      email
      displayName
      locale
    }
  }
`)
