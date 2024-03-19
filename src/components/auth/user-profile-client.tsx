"use client"

import { useMediaQuery } from "@/hooks/use-media-query"
import type { UserWithLink } from "@/lib/utils"
import { UserProfileDrawer } from "./user-profile-drawer"
import { UserProfileDropdown } from "./user-profile-dropdown"

export const UserProfileClient = ({ user }: { user: UserWithLink }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  return isDesktop ? (
    <UserProfileDropdown user={user} />
  ) : (
    <UserProfileDrawer user={user} />
  )
}
