import { isDevelopment } from "@/lib/utils"

export const configuration = {
  name: "Urlie, a link shortener on steroids",
  description:
    "Urlie is a free and open-source URL shortener. Shorten your links with ease. For free. API available.",
  links: {
    twitter: "https://twitter.com/dgaievskyi",
    github: "https://github.com/gaievskyi/urlie",
  },
  protocol: isDevelopment ? "http" : "https",
  domain: isDevelopment ? "localhost" : "urlie.vercel.com",
  port: isDevelopment ? 3000 : 80,
}

export const GUEST_LINK_EXPIRE_TIME = 60 * 60 * 24 // 1 day
export const GUEST_LINK_COOKIE_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30 // 30 days

export type Configuration = typeof configuration
