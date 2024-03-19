import { Suspense } from "react"
import { UserProfile } from "./auth/user-profile"
import { CreatorLink } from "./ui/creator-link"
import { ThemeToggle } from "./ui/theme-toggle"

export const Navigation = () => (
  <nav className="flex items-center justify-between gap-6">
    <div className="flex items-center gap-2">
      <Suspense fallback={null}>
        <UserProfile />
      </Suspense>
      <ThemeToggle />
    </div>
    <CreatorLink text="by @dgaievskyi" />
  </nav>
)
