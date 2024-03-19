import dynamic from "next/dynamic"
import { Suspense } from "react"
import { HeroCarousel } from "@/components/hero-carousel"
import { LinkForm } from "@/components/links/link-form"
import { LinkList } from "@/components/links/link-list"
import { Navigation } from "@/components/navigation"
import { Skeleton } from "@/components/ui/skeleton"

const Meteors = dynamic(() => import("../components/ui/meteors"), {
  ssr: false,
})

const LinksSkeletons = ({ repeat = 1 }: { repeat?: number }) => (
  <>
    {[...Array(repeat)].map((_, i) => (
      <Skeleton
        key={i + "link-skeleton"}
        className="flex w-full items-center space-x-1 rounded-xl p-4"
      >
        <Skeleton className="aspect-square h-10 w-full max-w-10 rounded-full" />
        <div className="w-full space-y-2">
          <div className="flex gap-2">
            <Skeleton className="h-7 w-full max-w-[100px] md:max-w-[255px]" />
            <Skeleton className="h-7 w-full max-w-7" />
            <Skeleton className="h-7 w-full max-w-7" />
          </div>
          <div className="flex justify-between gap-4">
            <Skeleton className="h-3 w-full max-w-[380px]" />
            <Skeleton className="h-3 w-full max-w-20" />
          </div>
        </div>
      </Skeleton>
    ))}
  </>
)

export default function HomePage() {
  return (
    <main
      vaul-drawer-wrapper=""
      className="relative m-auto flex min-h-svh w-full flex-col justify-between gap-4 bg-background px-4 pt-4 md:max-w-xl md:justify-center md:px-0"
    >
      <Meteors number={10} />
      <Navigation />
      <nav className="flex w-full flex-col items-start justify-between gap-4">
        <div className="flex w-full flex-col items-center justify-center gap-2 tracking-tight">
          <h1 className="scroll-m-20 text-6xl font-black">Urlie</h1>
          <p className="text-pretty text-muted-foreground">
            Shorten your links with ease for free.
          </p>
        </div>
        <HeroCarousel />
      </nav>
      <div className="flex w-full flex-col items-center gap-4">
        <LinkForm />
        <Suspense fallback={<LinksSkeletons />}>
          <LinkList />
        </Suspense>
      </div>
    </main>
  )
}
