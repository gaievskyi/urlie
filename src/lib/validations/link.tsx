import { custom, maxLength, object, optional, string, url } from "valibot"
import { slugRegex } from "@/lib/utils"

export const checkSlugSchema = object({
  slug: string([
    maxLength(30, "Maximum 30 characters allowed."),
    custom(
      (requirement) => slugRegex.test(requirement),
      "Slugs can only contain letters, numbers, hyphens, and underscores.",
    ),
  ]),
})

export const insertLinkSchema = object({
  url: string([url()]),
  slug: string([
    maxLength(30, "Maximum 30 characters allowed."),
    custom(
      (requirement) => slugRegex.test(requirement),
      "Slugs can only contain letters, numbers, hyphens, and underscores.",
    ),
  ]),
  description: optional(
    string([maxLength(255, "Maximum 255 characters allowed.")]),
  ),
})

export const editLinkSchema = object({
  slug: string(),
  newLink: insertLinkSchema,
})
