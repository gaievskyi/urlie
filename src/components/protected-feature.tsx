"use client"

import { useSession } from "next-auth/react"
import type { PropsWithChildren, ReactNode } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type RestrictedFeatureProps = PropsWithChildren & {
  fallback?: ReactNode
  tooltip?: ReactNode
}

const DisabledFeature = ({
  children,
  tooltip,
}: Omit<RestrictedFeatureProps, "fallback">) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="cursor-not-allowed">{children}</div>
    </TooltipTrigger>
    <TooltipContent>{tooltip}</TooltipContent>
  </Tooltip>
)

export const ProtectedFeature = ({
  children,
  fallback,
  tooltip = "Sign in to access this feature",
}: RestrictedFeatureProps) => {
  const session = useSession()
  const isAuth = !!session.data

  if (!isAuth) {
    return fallback ? (
      fallback
    ) : (
      <DisabledFeature tooltip={tooltip}>{children}</DisabledFeature>
    )
  }

  return children
}
