import sendNotificationEmail from '@rolebase/emails/helpers/sendNotificationEmail'
import { App_Type_Enum, UserAppFullFragment, gql } from '../../gql'
import i18n, { defaultLang } from '../../i18n'
import settings from '../../settings'
import { adminRequest } from '../../utils/adminRequest'

const APP_TYPE_LABELS: Record<App_Type_Enum, string> = {
  [App_Type_Enum.GoogleCalendar]: 'Google Calendar',
  [App_Type_Enum.Office365]: 'Office 365',
}

export default class AbstractApp<SecretConfig, Config> {
  // Set once the connection has been disconnected, to avoid sending the
  // reconnection email more than once for a given app instance.
  private disconnected = false

  constructor(public userApp: UserAppFullFragment) {}

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
    await adminRequest(ARCHIVE_USER_APP, {
      id: this.userApp.id,
      archivedAt: new Date().toISOString(),
    })
  }

  // Permanently disconnect a broken connection (OAuth access revoked or refresh
  // token expired): archive it so it stops being synced, and email the user to
  // reconnect. Safe to call several times: only the first call has an effect.
  public async disconnect() {
    if (this.disconnected) return
    this.disconnected = true
    await this.uninstall()
    await this.notifyDisconnected()
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

const ARCHIVE_USER_APP = gql(`
  mutation archiveUserApp($id: uuid!, $archivedAt: timestamptz!) {
    update_user_app_by_pk(pk_columns: { id: $id }, _set: { archivedAt: $archivedAt }) {
      id
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
