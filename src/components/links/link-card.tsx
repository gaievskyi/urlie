import Image from "next/image"
import { type ShortLink } from "@/api/db/schema"
import { ClicksCounter } from "@/components/links/clicks-counter"
import { CreateQrButton } from "@/components/links/create-qr-button"
import { LinkOptionsDropdown } from "@/components/links/link-options-dropdown"
import { ShortenedLinkCopyButton } from "@/components/links/shortened-link-copy-button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getBaseUrl, timeAgo } from "@/lib/utils"

type LinkCardProps = {
  link: ShortLink
}

export const LinkCard = ({ link }: LinkCardProps) => {
  const { slug, url, clicks } = link
  const decodedURL = decodeURIComponent(url)
  const shortenedURL = `${getBaseUrl()}/${slug}`

  return (
    <>
      <Card className="relative transition-colors hover:border-foreground dark:hover:border-neutral-500">
        <CardContent className="flex gap-2 p-3">
          <div className="flex min-w-8 flex-col justify-center">
            <Image
              src={`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${
                new URL(decodedURL).origin
              }&size=64`}
              className="rounded-full"
              alt="link favicon"
              width={32}
              height={32}
              quality={100}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center pe-8">
              <a
                href={shortenedURL}
                className="mr-1 w-[182px] truncate font-mono text-sm font-semibold text-foreground underline-offset-2 hover:underline md:w-[260px] md:text-xl"
                target="_blank"
                rel="noopener noreferrer"
              >
                {shortenedURL.split("://")[1]}
              </a>
              <ShortenedLinkCopyButton textToCopy={shortenedURL} />
              <CreateQrButton link={link} />
            </div>
            <div className="flex w-full max-w-48 flex-col gap-2 text-[10px] text-muted-foreground sm:max-w-[400px]">
              <a
                href={decodedURL}
                className="truncate text-xs underline-offset-2 hover:underline md:text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                {decodedURL}
              </a>
              {link.description && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="line-clamp-1 cursor-pointer">
                      {link.description}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px]">
                    <p>{link.description}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </CardContent>
        <LinkOptionsDropdown link={{ ...link, url: decodedURL }} />
        <div className="absolute bottom-2 right-4 m-auto flex items-center gap-2">
          <ClicksCounter value={clicks} />
          {slug !== "github" && (
            <Tooltip>
              <TooltipTrigger>
                <span className="text-[10px] font-medium text-muted-foreground transition-colors hover:text-foreground">
                  {timeAgo(link.createdAt.getTime())}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "long",
                    timeStyle: "short",
                  }).format(new Date(link.createdAt))}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </Card>
    </>
  )
}
