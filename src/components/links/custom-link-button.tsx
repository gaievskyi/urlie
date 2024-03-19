"use client"

import type { ComponentPropsWithoutRef, ElementRef } from "react"
import { forwardRef } from "react"
import { Button } from "@/components/ui/button"
import { Icons, iconVariants } from "@/components/ui/icons"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const CustomLinkButton = forwardRef<
  ElementRef<"button">,
  ComponentPropsWithoutRef<"button">
>(({ className, disabled, ...props }, ref) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div>
        <Button
          type="button"
          size="icon"
          variant="secondary"
          disabled={disabled}
          ref={ref}
          {...props}
        >
          <Icons.Palette
            className={cn(className, iconVariants({ size: "lg" }))}
          />
          <span className="sr-only">Make custom link</span>
        </Button>
      </div>
    </TooltipTrigger>
    <TooltipContent>
      <p>{disabled ? "Sign in to customize your links" : "Customize link"}</p>
    </TooltipContent>
  </Tooltip>
))
CustomLinkButton.displayName = "CustomLinkButton"

export { CustomLinkButton }
