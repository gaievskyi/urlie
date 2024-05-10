import { customAlphabet } from "nanoid"
import type { UseFormReturn } from "react-hook-form"
export { twMerge as cn } from "tailwind-merge"

export const isDevelopment = process.env.NODE_ENV === "development"
export const isProduction = process.env.NODE_ENV === "production"
export const isTest = process.env.NODE_ENV === "test"

export function getBaseUrl() {
  if (process.env.DOMAIN_URL) return process.env.DOMAIN_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export const slugRegex = /^[a-zA-Z0-9-_]*$/

export function nanoid(size = 4) {
  return customAlphabet(
    "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    size,
  )()
}

export function setFormErrors(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>,
  errors: Record<string, string[]>,
) {
  for (const [field, messages] of Object.entries(errors)) {
    form.setError(field, { message: messages.join(" ") })
  }
}

export function formatNumber(
  number: number | string,
  options: {
    digits?: number
    style?: Intl.NumberFormatOptions["style"]
    notation?: Intl.NumberFormatOptions["notation"]
  } = {},
) {
  const { digits = 1, style = "decimal", notation = "standard" } = options

  return new Intl.NumberFormat("en-US", {
    style,
    notation,
    maximumFractionDigits: digits,
  }).format(Number(number))
}

import { type User, type UserLink } from "@/api/db/schema"

export type UserWithLink = User & { userLink?: UserLink }

export type SafeActionError = {
  serverError?: string
  fetchError?: string
  validationErrors?: Record<string, string[]>
}

export function timeAgo(time: number, now = Date.now()) {
  const is = (interval: number, cycle: number) =>
    cycle >= interval ? Math.round(cycle / interval) : 0

  const secs = (now - time) / 1000
  const mins = is(60, secs)
  const hours = is(60, mins)
  const days = is(24, hours)
  const weeks = is(7, days)
  const months = is(30, days)
  const years = is(12, months)

  let amt = years
  let cycle = "year"

  if (secs <= 1) {
    return "just now"
  } else if (years > 0) {
    amt = years
    cycle = "year"
  } else if (months > 0) {
    amt = months
    cycle = "month"
  } else if (weeks > 0) {
    amt = weeks
    cycle = "week"
  } else if (days > 0) {
    amt = days
    cycle = "day"
  } else if (hours > 0) {
    amt = hours
    cycle = "hour"
  } else if (mins > 0) {
    amt = mins
    cycle = "minute"
  } else if (secs > 0) {
    amt = secs
    cycle = "second"
  }

  const v = Math.round(amt)

  return `${v === 1 ? (amt === hours ? "an" : "a") : v} ${cycle}${v > 1 ? "s" : ""} ago`
}
