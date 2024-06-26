import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import * as TooltipPrimitive from "@kobalte/core/tooltip";
import { type ValidComponent, mergeProps, splitProps } from "solid-js";

import { cn } from "@repo/utils/cn";

export const TooltipTrigger = TooltipPrimitive.Trigger;

export const Tooltip = (props: TooltipPrimitive.TooltipRootProps) => {
  const merge = mergeProps<TooltipPrimitive.TooltipRootProps[]>(
    { gutter: 4 },
    props,
  );

  return <TooltipPrimitive.Root {...merge} />;
};

type TooltipContentProps = TooltipPrimitive.TooltipContentProps & {
  class?: string;
};

export const TooltipContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, TooltipContentProps>,
) => {
  const [local, rest] = splitProps(props as TooltipContentProps, ["class"]);

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        class={cn(
          "bg-primary text-primary-foreground data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0 data-[closed]:zoom-out-95 data-[expanded]:zoom-in-95 z-50 overflow-hidden rounded-md px-3 py-1.5 text-xs",
          local.class,
        )}
        {...rest}
      />
    </TooltipPrimitive.Portal>
  );
};
