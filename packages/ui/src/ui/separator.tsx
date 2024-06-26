import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import * as SeparatorPrimitive from "@kobalte/core/separator";
import { type ValidComponent, splitProps } from "solid-js";

import { cn } from "@repo/utils/cn";

type SeparatorProps = SeparatorPrimitive.SeparatorRootProps & {
  class?: string;
};

export const Separator = <T extends ValidComponent = "hr">(
  props: PolymorphicProps<T, SeparatorProps>,
) => {
  const [local, rest] = splitProps(props as SeparatorProps, ["class"]);

  return (
    <SeparatorPrimitive.Root
      class={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-[1px] data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-[1px]",
        local.class,
      )}
      {...rest}
    />
  );
};
