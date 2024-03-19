import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons, iconVariants } from "@/components/ui/icons"
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Separator } from "@/components/ui/separator"
import type { UserWithLink } from "@/lib/utils"

type UserProfileDialogProps = {
  user: UserWithLink
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

export const UserProfileDialog = ({
  user,
  isOpen,
  onOpenChange,
}: UserProfileDialogProps) => {
  const nameInitials = user.name
    ?.match(/\b(\w)/g)
    ?.join("")
    .slice(0, 2)

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Profile</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <ResponsiveDialogBody className="flex flex-col items-center gap-4">
          <Avatar className="size-28">
            <AvatarImage src={user.image ?? ""} alt="user profile image" />
            <AvatarFallback>{nameInitials}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
          <div className="flex w-full flex-col gap-3 p-4 text-sm">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-between gap-2 text-muted-foreground">
                  <Icons.Link className={iconVariants({ size: "sm" })} />
                  Links shortened
                </div>
                <div>{user?.userLink?.totalLinks ?? 0}</div>
              </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-between gap-2 text-muted-foreground">
                  <Icons.Calendar className={iconVariants({ size: "sm" })} />
                  Joined
                </div>
                <div>
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "full",
                  }).format(new Date(user.createdAt))}
                </div>
              </div>
            </div>
          </div>
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
