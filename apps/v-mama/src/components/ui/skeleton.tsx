import { cn } from "~/libs/cn";
import { type ComponentProps, splitProps } from "solid-js";

export const Skeleton = (props: ComponentProps<"div">) => {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      class={cn("bg-primary/10 animate-pulse rounded-md", local.class)}
      {...rest}
    />
  );
};
