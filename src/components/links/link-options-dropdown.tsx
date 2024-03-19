"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"
import { type ShortLink } from "@/api/db/schema"
import { CustomLinkDialog } from "@/components/links/custom-link-dialog"
import { DeleteLinkDialog } from "@/components/links/delete-link-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons, iconVariants } from "@/components/ui/icons"
import { ProtectedFeature } from "../protected-feature"

type LinkOptionsDropdownProps = {
  link: ShortLink
}

export const LinkOptionsDropdown = ({ link }: LinkOptionsDropdownProps) => {
  const session = useSession()
  const isAuth = !!session.data

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditLinkDialogOpen, setIsEditLinkDialogOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="absolute right-2 top-3 cursor-pointer opacity-50 transition-opacity hover:opacity-100"
            type="button"
          >
            <Icons.MoreVertical className={iconVariants({ size: "lg" })} />
            <span className="sr-only">Link actions menu</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <ProtectedFeature tooltip="Sign in to edit links">
            <DropdownMenuItem
              onClick={
                isAuth ? () => setIsEditLinkDialogOpen(true) : () => undefined
              }
              disabled={!isAuth}
            >
              <Icons.Pencil className={iconVariants({ className: "mr-2" })} />
              Edit
            </DropdownMenuItem>
          </ProtectedFeature>
          <DropdownMenuItem
            className="text-red-500 focus:bg-red-500/10 focus:text-red-500"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={link.slug === "github"}
          >
            <Icons.Trash2 className={iconVariants({ className: "mr-2" })} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteLinkDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        slug={link.slug}
      />
      <CustomLinkDialog
        open={isEditLinkDialogOpen}
        onOpenChange={setIsEditLinkDialogOpen}
        defaultValues={link}
        isEditing
      />
    </>
  )
}
