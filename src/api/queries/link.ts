import { kv } from "@vercel/kv"
import { and, desc, eq, gte, lte, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { db } from "@/api/db"
import {
  links,
  type NewShortLink,
  type ShortLink,
  userLinks,
} from "@/api/db/schema"
import { GUEST_LINK_EXPIRE_TIME } from "@/config/site"
import { ApiError } from "@/lib/safe-action"
import { nanoid } from "@/lib/utils"

export async function checkSlugExists(slug: string): Promise<boolean> {
  return Boolean(await kv.exists(slug.toLowerCase()))
}

export async function generateRandomSlug(): Promise<string> {
  const slug = nanoid()
  const link = await checkSlugExists(slug)
  if (link) {
    return generateRandomSlug()
  }
  return slug
}

export async function getLinkBySlug(
  slug: string,
): Promise<ShortLink | undefined> {
  const link = await db.query.links.findFirst({
    where: eq(links.slug, slug).append(sql`COLLATE NOCASE`),
  })
  return link
}

export async function getLinksByUserLinkId(
  userLinkId: string,
): Promise<ShortLink[]> {
  const currentDate = new Date()
  const oneDayAgo = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000)

  const shortLinks = await db.query.links.findMany({
    where: and(
      eq(links.userLinkId, userLinkId),
      gte(links.createdAt, oneDayAgo),
      lte(links.createdAt, currentDate),
    ),
    orderBy: desc(links.createdAt),
  })
  return shortLinks
}

export async function generateShortLink({
  slug,
  url,
  userLinkId,
  isGuestUser,
  description,
}: NewShortLink & { isGuestUser?: boolean }): Promise<void> {
  const encodedURL = encodeURIComponent(url)

  if (slug) {
    const link = await checkSlugExists(slug)
    if (link) {
      throw new ApiError("Slug already exists")
    }
  } else {
    slug = await generateRandomSlug()
  }

  const redisOptions = isGuestUser ? { ex: GUEST_LINK_EXPIRE_TIME } : undefined

  await Promise.all([
    db
      .insert(links)
      .values({ slug, url: encodedURL, userLinkId, description })
      .run(),
    db
      .update(userLinks)
      .set({ totalLinks: sql`${userLinks.totalLinks} + 1` })
      .where(eq(userLinks.id, userLinkId))
      .run(),
    kv.set(slug.toLowerCase(), encodedURL, redisOptions),
  ])
}

export async function deleteLink(
  slug: string,
  userLinkId: string,
): Promise<void> {
  const link = await getLinkBySlug(slug)
  if (!link) {
    throw new ApiError("Link not found")
  }

  if (link.userLinkId !== userLinkId) {
    throw new ApiError("Link not found")
  }

  await Promise.all([
    db.delete(links).where(eq(links.slug, slug)).run(),
    kv.del(slug.toLowerCase()),
  ])
}

export async function deleteLinkAndRevalidate(slug: string, id: string) {
  await deleteLink(slug, id)

  revalidatePath("/")

  return { message: "Link removed successfully" }
}

export async function updateLinkBySlug(
  slug: string,
  newLink: Partial<NewShortLink>,
): Promise<ShortLink | undefined> {
  const updatedLink = await db
    .update(links)
    .set(newLink)
    .where(eq(links.slug, slug))
    .returning()
  return updatedLink[0]
}

export async function updateLinksByUserLinkId(
  userLinkId: string,
  data: Partial<ShortLink>,
): Promise<void> {
  await db.update(links).set(data).where(eq(links.userLinkId, userLinkId)).run()
}

export async function deleteExpiredLinks() {
  await db.run(
    sql`DELETE FROM link WHERE userLinkId IN (SELECT id FROM userLink WHERE userId IS NULL) AND created_at < strftime('%s', 'now', '-1 day');`,
  )
}
