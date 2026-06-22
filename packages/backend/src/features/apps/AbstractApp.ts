import { UserAppFullFragment, gql } from '../../gql'
import settings from '../../settings'
import { adminRequest } from '../../utils/adminRequest'

export default class AbstractApp<SecretConfig, Config> {
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
