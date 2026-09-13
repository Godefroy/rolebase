export enum UserLocalStorageKeys {
  AlgoliaConfig = 'algolia-config-{id}',
  ThreadDrafts = 'thread-draft-{id}',
  SidebarWidth = 'sidebar-width',
  DefaultOrgId = 'default-org-id',
  OnboardingTodoCollapsed = 'onboarding-todo-collapsed-{id}',
  OrgLifecycleTracked = 'org-lifecycle-{id}',
}

export function resetUserLocalStorage() {
  for (const key in localStorage) {
    for (const keyPattern of Object.values(UserLocalStorageKeys)) {
      if (
        new RegExp('^' + keyPattern.replace(/\{id\}/, '.*') + '$').test(key)
      ) {
        localStorage.removeItem(key)
      }
    }
  }
}
