import { SetMetadata } from '@nestjs/common'

import { UserRoles } from '../users/entities/user.entity'

export const ROLES_KEY = 'roles'
export const Roles = (...roles: UserRoles[]) => SetMetadata(ROLES_KEY, roles)
