import { type NextRequest, NextResponse } from "next/server"
import { deleteExpiredLinks } from "@/api/queries/link"
import { deleteExpiredUserLinks } from "@/api/queries/user-link"

function isAuthorized(req: NextRequest): boolean {
  return (
    req.headers.get("Authorization") === `Bearer ${process.env.CRON_SECRET}`
  )
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  await deleteExpiredUserLinks()
  await deleteExpiredLinks()

  return NextResponse.json({ message: "success" })
}
