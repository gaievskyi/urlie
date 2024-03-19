import { type BuiltInProviderType } from "next-auth/providers/index"
import { type LiteralUnion } from "next-auth/react"
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef,
} from "react"
import { Button, type ButtonVariant } from "@/components/ui/button"
import { type Icon, Icons, iconVariants } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

const OAuthProviderButton = forwardRef<
  ElementRef<"button">,
  ComponentPropsWithoutRef<"button"> & {
    provider: LiteralUnion<BuiltInProviderType>
    providerName: string
    handleSignin: (provider: LiteralUnion<BuiltInProviderType>) => void
    variant?: ButtonVariant
    isLoading: boolean
  }
>(
  (
    {
      variant,
      provider,
      providerName,
      isLoading,
      handleSignin,
      className,
      ...props
    },
    ref,
  ) => {
    const ProviderIcon = Icons[provider as keyof typeof Icons] as Icon
    return (
      <Button
        className={cn(className)}
        onClick={() => handleSignin(provider)}
        variant={variant}
        disabled={isLoading}
        ref={ref}
        {...props}
      >
        {!isLoading && (
          <ProviderIcon className={iconVariants({ className: "mr-2" })} />
        )}
        {isLoading
          ? `Redirecting to ${providerName}...`
          : `Continue with ${providerName}`}
      </Button>
    )
  },
)
OAuthProviderButton.displayName = "OAuthProviderButton"

export { OAuthProviderButton }
