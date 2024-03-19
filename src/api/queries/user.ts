import { eq } from "drizzle-orm"
import { db } from "@/api/db"
import { users } from "@/api/db/schema"
import type { UserWithLink } from "@/lib/utils"

export async function getUserById(
  id: string,
): Promise<UserWithLink | undefined> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
    with: {
      userLink: true,
    },
  })
  return user
}
