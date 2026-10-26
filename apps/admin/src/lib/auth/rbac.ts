export type UserRole = 'ADMIN' | 'RECEPTIONIST' | 'HOUSEKEEPING' | 'GUEST'

const ROLE_HIERARCHY: Record<UserRole, number> = {
  ADMIN: 4,
  RECEPTIONIST: 3,
  HOUSEKEEPING: 2,
  GUEST: 1,
}

export function hasPermission(actorRole: UserRole, requiredRole: UserRole): boolean {
  const actorRank = ROLE_HIERARCHY[actorRole] ?? 0
  const requiredRank = ROLE_HIERARCHY[requiredRole] ?? 99
  return actorRank >= requiredRank
}

export function assertRole(actorRole: UserRole, requiredRole: UserRole) {
  if (!hasPermission(actorRole, requiredRole)) {
    throw new Error(`[Forbidden] Access Denied: Action requires ${requiredRole} role, but actor has ${actorRole} role.`)
  }
}
