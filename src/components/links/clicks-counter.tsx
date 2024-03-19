import type { ShortLink } from "@/api/db/schema"
import { Icons, iconVariants } from "@/components/ui/icons"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatNumber } from "@/lib/utils"

type ClicksCounterProps = {
  value: ShortLink["clicks"]
}

export const ClicksCounter = ({ value }: ClicksCounterProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="group mt-1 flex items-center gap-1">
        <span className="text-[10px] font-medium text-muted-foreground transition-colors group-hover:text-foreground">
          {formatNumber(value, { notation: "compact" })}
        </span>
        <Icons.Eye
          className={iconVariants({
            size: "sm",
            className:
              "text-muted-foreground group-hover:text-foreground transition-colors",
          })}
        />
      </div>
    </TooltipTrigger>
    <TooltipContent>
      <p>
        {formatNumber(value, { notation: "standard" })} click(-s) on this link
      </p>
    </TooltipContent>
  </Tooltip>
)
