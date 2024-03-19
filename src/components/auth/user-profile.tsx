import { auth } from "@/api/auth"
import { getUserById } from "@/api/queries/user"
import { Button } from "@/components/ui/button"
import { SigninDialog } from "./signin-dialog"
import { UserProfileClient } from "./user-profile-client"

const RenderSigninDialog = () => (
  <SigninDialog>
    <Button size="sm">Sign In</Button>
  </SigninDialog>
)

export async function UserProfile() {
  const session = await auth()

  if (!session) {
    return <RenderSigninDialog />
  }

  const user = await getUserById(session.user.id)

  if (!user) {
    return <RenderSigninDialog />
  }

  return <UserProfileClient user={user} />
}
