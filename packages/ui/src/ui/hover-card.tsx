import * as HoverCardPrimitive from "@kobalte/core/hover-card";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { type ValidComponent, splitProps } from "solid-js";

import { cn } from "@repo/utils/cn";

export const HoverCard = HoverCardPrimitive.Root;
export const HoverCardTrigger = HoverCardPrimitive.Trigger;

type HoverCardContentProps = HoverCardPrimitive.HoverCardContentProps & {
  class?: string;
};

export const HoverCardContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, HoverCardContentProps>,
) => {
  const [local, rest] = splitProps(props as HoverCardContentProps, ["class"]);

  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        class={cn(
          "bg-popover text-popover-foreground data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0 data-[closed]:zoom-out-95 data-[expanded]:zoom-in-95 z-50 w-64 rounded-md border p-4 shadow-md outline-none",
          local.class,
        )}
        {...rest}
      />
    </HoverCardPrimitive.Portal>
  );
};
