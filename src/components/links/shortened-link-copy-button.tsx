"use client"

import { Clipboard } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Icons, iconVariants } from "@/components/ui/icons"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type LinkCopyButtonProps = {
  textToCopy: string
}

export const ShortenedLinkCopyButton = ({
  textToCopy,
}: LinkCopyButtonProps) => {
  const handleOnCopy = async () => {
    await navigator.clipboard.writeText(textToCopy)
    toast.message("Link copied to clipboard", {
      icon: <Clipboard className="size-5" />,
      description: "Use Ctrl/Command + V to paste.",
    })
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="cursor-copy opacity-50 transition-opacity hover:opacity-100"
          aria-label="Copy to clipboard"
          type="button"
        >
          <Icons.Copy
            className={iconVariants({ size: "lg" })}
            onClick={handleOnCopy}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-sans">Copy link to clipboard</p>
      </TooltipContent>
    </Tooltip>
  )
}
