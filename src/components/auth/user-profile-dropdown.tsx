"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons, iconVariants } from "@/components/ui/icons"
import type { UserWithLink } from "@/lib/utils"
import { ReloadIcon } from "@radix-ui/react-icons"
import { signOut } from "next-auth/react"
import { useState } from "react"
import { UserProfileDialog } from "./user-profile-dialog"

type UserProfileDropdownProps = {
  user: UserWithLink
}

export const UserProfileDropdown = ({ user }: UserProfileDropdownProps) => {
  const [isSignoutLoading, setIsSignoutLoading] = useState(false)
  const [isUserProfileDialogOpen, setIsUserProfileDialogOpen] = useState(false)

  const nameInitials = user.name
    ?.match(/\b(\w)/g)
    ?.join("")
    .slice(0, 2)

  const handleSignOut = async (e: Event) => {
    e.preventDefault()
    setIsSignoutLoading(true)
    await signOut()
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="rounded-full" size="icon" variant="ghost">
            <Avatar className="size-9">
              <AvatarImage src={user.image ?? ""} alt="user profile image" />
              <AvatarFallback>{nameInitials}</AvatarFallback>
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-52">
          <div className="flex p-1">
            <div className="relative">
              <Avatar className="size-9">
                <AvatarImage src={user.image ?? ""} alt="user profile image" />
                <AvatarFallback>{nameInitials}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-px end-[-1px] rounded-full bg-background p-0.5">
                <div className="rounded-full bg-blue-500 p-1"></div>
              </div>
            </div>
            <div className="ms-2 max-w-40">
              <div className="truncate text-sm font-medium">{user.name}</div>
              <div className="truncate text-xs text-muted-foreground">
                {user.email}
              </div>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setIsUserProfileDialogOpen(true)}>
              <Icons.User className={iconVariants({ className: "me-2" })} />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuGroup></DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => window.open("https://github.com/gaievskyi/urlie")}
            >
              <Icons.Code2 className={iconVariants({ className: "me-2" })} />
              Source
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Icons.HeartHandshake
                className={iconVariants({ className: "me-2" })}
              />
              Donate
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={handleSignOut}
            disabled={isSignoutLoading}
          >
            {isSignoutLoading ? (
              <>
                <ReloadIcon className="mr-2 size-4 animate-spin" />
                Logging out...
              </>
            ) : (
              <>
                <Icons.LogOut className={iconVariants({ className: "me-2" })} />
                Logout
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UserProfileDialog
        user={user}
        isOpen={isUserProfileDialogOpen}
        onOpenChange={setIsUserProfileDialogOpen}
      />
    </>
  )
}
