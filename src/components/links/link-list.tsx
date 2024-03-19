import { cookies } from "next/headers"
import { type Session } from "next-auth"
import { auth } from "@/api/auth"
import { type ShortLink } from "@/api/db/schema"
import { getLinkBySlug, getLinksByUserLinkId } from "@/api/queries/link"
import { getUserLinkByUserId } from "@/api/queries/user-link"
import { SigninDialog } from "@/components/auth/signin-dialog"
import { LinkCard } from "@/components/links/link-card"

const fetchLinksBySessionOrCookie = async (
  session: Session | null,
): Promise<ShortLink[]> => {
  const cookieStore = cookies()

  if (session) {
    const userLink = await getUserLinkByUserId(session.user.id)
    return userLink?.links ?? []
  } else {
    const userLinkIdCookie = cookieStore.get("user-link-id")?.value
    if (!userLinkIdCookie) {
      return []
    }

    return await getLinksByUserLinkId(userLinkIdCookie)
  }
}

export const LinkList = async () => {
  const session = await auth()
  let shortLinks: ShortLink[] = []
  let defaultAppLink: ShortLink | undefined

  if (!session) {
    defaultAppLink = await getLinkBySlug("github")
  }

  try {
    shortLinks = await fetchLinksBySessionOrCookie(session)
  } catch (err) {
    throw new Error("Failed to fetch links")
  }

  return (
    <div className="mb-2 flex w-full flex-col items-center justify-between gap-4">
      <div className="flex w-full flex-col gap-2">
        {defaultAppLink && <LinkCard link={defaultAppLink} />}
        {shortLinks.map((link) => (
          <LinkCard key={link.slug} link={link} />
        ))}
      </div>
      {!session && shortLinks.length > 0 && (
        <div className="text-xs text-muted-foreground">
          <SigninDialog>
            <span className="cursor-pointer text-foreground underline underline-offset-2">
              Sign in
            </span>
          </SigninDialog>{" "}
          to expand links lifetime and access more features.
        </div>
      )}
    </div>
  )
}
