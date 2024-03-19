import { type ElementRef, useMemo, useRef } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons, iconVariants } from "@/components/ui/icons"
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { getQRAsCanvas, getQRAsSVGDataUri, QRCodeSVG } from "@/lib/qrcode"

type LinkQRCodeDialogProps = {
  slug: string
  url: string
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

const supportedFormats = [
  { label: "PNG", value: "png", icon: Icons.FileImage },
  { label: "JPEG", value: "jpeg", icon: Icons.Image },
  { label: "SVG", value: "svg", icon: Icons.FileCode2 },
]

export const LinkQRCodeDialog = ({
  slug,
  url,
  isOpen,
  onOpenChange,
}: LinkQRCodeDialogProps) => {
  const qrcodeRef = useRef<ElementRef<"div">>(null)
  const anchorRef = useRef<ElementRef<"a">>(null)

  const qrcode = useMemo(
    () => ({
      value: url,
      bgColor: "#ffffff",
      fgColor: "#000000",
      size: 1024,
      level: "Q",
    }),
    [url],
  )

  const handleCopyToClipboard = async () => {
    try {
      const userAgent = navigator.userAgent.toLowerCase()
      const isSafari = userAgent.includes("safari")
      const canvas = await getQRAsCanvas(qrcode, "image/png", true)
      if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error("Failed to make QR code canvas.")
      }

      if (isSafari) {
        if (!window.isSecureContext) {
          throw new Error("Cannot copy to clipboard in insecure context.")
        }
        const makeImagePromise = async () => {
          const data = await fetch(canvas.toDataURL("image/png"))
          return await data.blob()
        }
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": makeImagePromise(),
          }),
        ])
        toast.message("Image copied to clipboard", {
          description: "Use Ctrl/Command + V to paste.",
        })
        return
      }

      canvas.toBlob(async (blob) => {
        if (!blob) {
          throw new Error("Failed to convert QR Code canvas to image.")
        }
        const dataToCopy = [new ClipboardItem({ [blob.type]: blob })]
        await navigator.clipboard.write(dataToCopy)
        toast.message("Image copied to clipboard", {
          description: "Use Ctrl/Command + V to paste.",
        })
      })
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to copy QR Code. `, {
          description: error.message,
        })
      }
    }
  }

  const handleDownload = async (format: string) => {
    if (!anchorRef.current) return
    let dataUri
    switch (format) {
      case "png":
      case "jpeg":
        dataUri = await getQRAsCanvas(qrcode, `image/${format}`)
        break
      case "svg":
        dataUri = getQRAsSVGDataUri(qrcode)
        break
      default:
        throw new Error(`Unsupported format: ${format}`)
    }
    if (typeof dataUri === "string") {
      anchorRef.current.href = dataUri
    }
    anchorRef.current.download = `${slug}-qrcode.${format}`
    anchorRef.current.click()
  }

  return (
    <>
      <ResponsiveDialog open={isOpen} onOpenChange={onOpenChange}>
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>{`${process.env.VERCEL_URL || "urlie.vercel.app"}/${slug}`}</ResponsiveDialogTitle>
          </ResponsiveDialogHeader>
          <ResponsiveDialogBody className="flex flex-col items-center gap-6 px-4 py-6">
            <div className="rounded-lg border border-solid border-border p-4">
              <div ref={qrcodeRef}>
                <QRCodeSVG
                  value={url}
                  size={256}
                  bgColor="hsl(var(--background))"
                  fgColor="hsl(var(--foreground))"
                />
              </div>
            </div>
            <div className="flex w-full justify-center gap-2 px-4">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={handleCopyToClipboard}
              >
                <Icons.Clipboard
                  className={iconVariants({ className: "mr-2" })}
                />
                Copy
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex-1">
                    <Icons.Download
                      className={iconVariants({ className: "mr-2" })}
                    />
                    Download
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  {supportedFormats.map((format) => (
                    <DropdownMenuItem
                      key={format.value}
                      onClick={() => handleDownload(format.value)}
                    >
                      <format.icon
                        className={iconVariants({ className: "mr-2" })}
                      />
                      {format.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </ResponsiveDialogBody>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
      <a className="hidden" ref={anchorRef} />
    </>
  )
}
