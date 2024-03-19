"use client"

import { useState } from "react"
import type { ShortLink } from "@/api/db/schema"
import { LinkQRCodeDialog } from "@/components/links/link-qrcode-dialog"
import { Button } from "@/components/ui/button"
import { Icons, iconVariants } from "@/components/ui/icons"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const CreateQrButton = ({ link }: { link: ShortLink }) => {
  const [isQRCodeDialogOpen, setIsQRCodeDialogOpen] = useState(false)
  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsQRCodeDialogOpen(true)}
            className="cursor-pointer opacity-50 transition-opacity hover:opacity-100"
          >
            <Icons.QrCode className={iconVariants({ size: "lg" })} />
            <span className="sr-only">QR Code</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-sans">Create QR code</p>
        </TooltipContent>
      </Tooltip>
      <LinkQRCodeDialog
        isOpen={isQRCodeDialogOpen}
        onOpenChange={setIsQRCodeDialogOpen}
        url={link.url}
        slug={link.slug}
      />
    </>
  )
}
