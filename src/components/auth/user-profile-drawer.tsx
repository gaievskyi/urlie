"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { UserWithLink } from "@/lib/utils"
import { ReloadIcon } from "@radix-ui/react-icons"
import { signOut } from "next-auth/react"
import { useState } from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerNestedRoot,
  DrawerTrigger,
} from "../ui/drawer"
import { Icons, iconVariants } from "../ui/icons"
import { Separator } from "../ui/separator"
import { UserProfileDialog } from "./user-profile-dialog"

type UserProfileDrawerProps = {
  user: UserWithLink
}

export const UserProfileDrawer = ({ user }: UserProfileDrawerProps) => {
  const [isSignoutLoading, setIsSignoutLoading] = useState(false)
  const [isUserProfileDialogOpen, setIsUserProfileDialogOpen] = useState(false)

  const nameInitials = user.name
    ?.match(/\b(\w)/g)
    ?.join("")
    .slice(0, 2)

  const handleSignOut = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault()
    setIsSignoutLoading(true)
    await signOut()
  }

  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <Button className="rounded-full" size="icon" variant="ghost">
            <Avatar className="size-9">
              <AvatarImage src={user.image ?? ""} alt="user profile image" />
              <AvatarFallback>{nameInitials}</AvatarFallback>
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-lg">
            <DrawerHeader>
              <DrawerNestedRoot>
                <DrawerTrigger asChild>
                  <div className="flex p-1">
                    <div className="relative">
                      <Avatar className="size-9">
                        <AvatarImage
                          src={user.image ?? ""}
                          alt="user profile image"
                        />
                        <AvatarFallback>{nameInitials}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-px end-[-1px] rounded-full bg-background p-0.5">
                        <div className="rounded-full bg-blue-500 p-1" />
                      </div>
                    </div>
                    <div className="ms-2 max-w-40">
                      <div className="truncate text-sm font-medium">
                        {user.name}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </DrawerTrigger>
                <DrawerContent className="flex flex-col items-center gap-4">
                  <Avatar className="size-28">
                    <AvatarImage
                      src={user.image ?? ""}
                      alt="user profile image"
                    />
                    <AvatarFallback>{nameInitials}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-3 p-4 text-sm">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center justify-between gap-2 text-muted-foreground">
                          <Icons.Link
                            className={iconVariants({ size: "sm" })}
                          />
                          Links shortened
                        </div>
                        <div>{user?.userLink?.totalLinks ?? 0}</div>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center justify-between gap-2 text-muted-foreground">
                          <Icons.Calendar
                            className={iconVariants({ size: "sm" })}
                          />
                          Joined
                        </div>
                        <div>
                          {new Intl.DateTimeFormat("en-US", {
                            dateStyle: "medium",
                          }).format(new Date(user.createdAt))}
                        </div>
                      </div>
                    </div>
                  </div>
                </DrawerContent>
              </DrawerNestedRoot>
            </DrawerHeader>
            <div className="mb-12 flex flex-col items-start gap-2">
              <Button
                variant="link"
                onClick={() =>
                  window.open("https://github.com/gaievskyi/urlie")
                }
              >
                <Icons.Code2 className={iconVariants({ className: "me-2" })} />
                Source
              </Button>
              <Button
                disabled
                variant="link"
                onClick={() => setIsUserProfileDialogOpen(true)}
              >
                <Icons.HeartHandshake
                  className={iconVariants({ className: "me-2" })}
                />
                Donate
              </Button>
              <Button
                variant="link"
                onClick={handleSignOut}
                disabled={isSignoutLoading}
              >
                {isSignoutLoading ? (
                  <>
                    <ReloadIcon className="mr-2 size-4 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  <>
                    <Icons.LogOut
                      className={iconVariants({ className: "me-2" })}
                    />
                    Logout
                  </>
                )}
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
      <UserProfileDialog
        user={user}
        isOpen={isUserProfileDialogOpen}
        onOpenChange={setIsUserProfileDialogOpen}
      />
    </>
  )
}
