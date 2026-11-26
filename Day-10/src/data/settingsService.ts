export interface UserProfile {
  firstName: string
  lastName: string
  jobTitle: string
  email: string
}

const workspaceNameKey = 'peopleflow.workspace-name'
const userProfileKey = 'peopleflow.user-profile'

const defaultProfile: UserProfile = {
  firstName: 'Alex',
  lastName: 'Rivera',
  jobTitle: 'HR administrator',
  email: 'alex.rivera@acme.io',
}

export function getWorkspaceName() {
  return localStorage.getItem(workspaceNameKey) ?? 'Acme Studio'
}

export function saveWorkspaceName(name: string) {
  localStorage.setItem(workspaceNameKey, name)
}

export function getUserProfile(): UserProfile {
  const savedProfile = localStorage.getItem(userProfileKey)
  return savedProfile ? (JSON.parse(savedProfile) as UserProfile) : defaultProfile
}

export function saveUserProfile(profile: UserProfile) {
  localStorage.setItem(userProfileKey, JSON.stringify(profile))
}
