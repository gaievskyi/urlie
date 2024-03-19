"use server"

import { kv } from "@vercel/kv"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { object, string } from "valibot"
import { type UserLink } from "@/api/db/schema"
import {
  checkSlugExists,
  deleteLinkAndRevalidate,
  generateShortLink,
  updateLinkBySlug,
} from "@/api/queries/link"
import {
  createNewUserLink,
  getOrCreateUserLinkById,
  getOrCreateUserLinkByUserId,
  getUserLinkByUserId,
  setUserLinkIdCookie,
} from "@/api/queries/user-link"
import { action, ApiError, protectedAction } from "@/lib/safe-action"
import {
  checkSlugSchema,
  editLinkSchema,
  insertLinkSchema,
} from "@/lib/validations/link"
import { auth } from "../auth"

export const createShortLink = action(
  insertLinkSchema,
  async ({ url, slug, description }) => {
    const session = await auth()

    if (session) {
      const userLink = await getOrCreateUserLinkByUserId(session.user.id)

      await generateShortLink({
        userLinkId: userLink.id,
        slug,
        url,
        description,
      })
    } else {
      const cookieStore = cookies()
      const userLinkId = cookieStore.get("user-link-id")?.value
      let userLink: UserLink | undefined

      if (!userLinkId) {
        userLink = await createNewUserLink()
      } else {
        userLink = await getOrCreateUserLinkById(userLinkId)
      }

      if (!userLink) {
        throw new ApiError("User link not found.")
      }

      if (userLink.id !== userLinkId) {
        setUserLinkIdCookie(userLink.id)
      }

      await generateShortLink({
        url,
        userLinkId: userLink.id,
        isGuestUser: true,
        slug: "",
      })
    }

    revalidatePath("/")
    return { message: "Link shortened!" }
  },
)

export const deleteShortLink = action(
  object({ slug: string() }),
  async ({ slug }) => {
    const cookieStore = cookies()
    const userLinkIdCookie = cookieStore.get("user-link-id")?.value

    if (userLinkIdCookie) {
      return await deleteLinkAndRevalidate(slug, userLinkIdCookie)
    }

    const session = await auth()
    if (!session) {
      throw new ApiError("Session not found")
    }

    const userLink = await getUserLinkByUserId(session.user.id)
    if (!userLink) {
      throw new ApiError("No user link found")
    }

    return await deleteLinkAndRevalidate(slug, userLink.id)
  },
)

export const editShortLink = protectedAction(
  editLinkSchema,
  async ({ slug, newLink }, { user }) => {
    const newUrl = encodeURIComponent(newLink.url)
    const newSlug = newLink.slug

    const userLink = await getUserLinkByUserId(user.id)
    if (!userLink) {
      throw new ApiError("No user link found")
    }

    const link = userLink.links.find((link) => link.slug === slug)
    if (!link) {
      throw new ApiError("Link not found")
    }

    const updatePromises: Promise<unknown>[] = []

    if (newSlug !== slug) {
      const slugExists = await checkSlugExists(newSlug)
      if (slugExists) {
        throw new ApiError("Slug already exists")
      }

      updatePromises.push(
        updateLinkBySlug(slug, newLink),
        kv.del(slug.toLowerCase()),
        kv.set(newSlug.toLowerCase(), newUrl),
      )
    } else {
      updatePromises.push(
        updateLinkBySlug(slug, {
          ...newLink,
          slug: slug,
        }),
      )

      if (newUrl !== link.url) {
        updatePromises.push(kv.set(slug.toLowerCase(), newUrl))
      }
    }

    await Promise.all(updatePromises)

    revalidatePath("/")
    return { message: "Link edited successfully" }
  },
)

export const checkSlug = protectedAction(checkSlugSchema, async ({ slug }) => {
  return await checkSlugExists(slug)
})
