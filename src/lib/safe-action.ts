import { createSafeActionClient } from "next-safe-action"
import { auth } from "@/api/auth"

export class ApiError extends Error {}

export const action = createSafeActionClient({
  handleReturnedServerError(e) {
    if (e instanceof ApiError) {
      return e.message
    }

    return "Internal Server Error"
  },
})

export const protectedAction = createSafeActionClient({
  async middleware() {
    const session = await auth()

    if (!session) {
      throw new Error("Session not found")
    }

    return { user: session.user }
  },
  handleReturnedServerError(e) {
    if (e instanceof ApiError) {
      return e.message
    }

    return "Internal Server Error"
  },
})
