"use client"

import { useState } from "react"
import type { ShortLink } from "@/api/db/schema"
import { CustomLinkButton } from "@/components/links/custom-link-button"
import { CustomLinkForm } from "@/components/links/custom-link-form"
import { Button } from "@/components/ui/button"
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/responsive-dialog"

type CustomLinkDialogProps = (
  | {
      isEditing: boolean
      defaultValues: ShortLink
    }
  | {
      isEditing?: undefined
      defaultValues?: undefined
    }
) &
  (
    | {
        open: boolean
        onOpenChange: (isOpen: boolean) => void
      }
    | {
        open?: undefined
        onOpenChange?: undefined
      }
  )

export const CustomLinkDialog = ({
  open = false,
  onOpenChange,
  defaultValues,
  isEditing = false,
}: CustomLinkDialogProps) => {
  const [isOpen, setIsOpen] = useState(open)
  const isControlled = onOpenChange !== undefined

  const handleOpenChange = (isOpen: boolean) => {
    if (!isControlled) {
      setIsOpen(isOpen)
    }
    onOpenChange?.(isOpen)
  }

  const openState = isControlled ? open : isOpen

  return (
    <ResponsiveDialog open={openState} onOpenChange={handleOpenChange}>
      {!isEditing && (
        <ResponsiveDialogTrigger asChild>
          <CustomLinkButton />
        </ResponsiveDialogTrigger>
      )}
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isEditing ? "Edit shortened link" : "Customize"}
          </ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <ResponsiveDialogBody>
          <CustomLinkForm
            onSetIsDialogOpen={handleOpenChange}
            defaultValues={defaultValues}
            isEditing={isEditing}
          />
        </ResponsiveDialogBody>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </ResponsiveDialogClose>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
