import {
  type ComponentProps,
  type ParentComponent,
  splitProps,
} from "solid-js";

import { cn } from "~/lib/utils";

export const Card = (props: ComponentProps<"div">) => {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      class={cn(
        "bg-card text-card-foreground rounded-xl border shadow",
        local.class,
      )}
      {...rest}
    />
  );
};

export const CardHeader = (props: ComponentProps<"div">) => {
  const [local, rest] = splitProps(props, ["class", "classList"]);
  return (
    <div class={cn("flex flex-col space-y-1.5 p-6", local.class)} {...rest} />
  );
};

export const CardTitle: ParentComponent<ComponentProps<"h1">> = (props) => {
  const [local, rest] = splitProps(props, ["class", "classList"]);
  return (
    <h1
      class={cn("font-semibold leading-none tracking-tight", local.class)}
      {...rest}
    />
  );
};

export const CardDescription: ParentComponent<ComponentProps<"h3">> = (
  props,
) => {
  const [local, rest] = splitProps(props, ["class", "classList"]);
  return (
    <h3 class={cn("text-muted-foreground text-sm", local.class)} {...rest} />
  );
};

export const CardContent = (props: ComponentProps<"div">) => {
  const [local, rest] = splitProps(props, ["class", "classList"]);
  return <div class={cn("p-6 pt-0", local.class)} {...rest} />;
};

export const CardFooter = (props: ComponentProps<"div">) => {
  const [local, rest] = splitProps(props, ["class", "classList"]);
  return (
    <div class={cn("flex items-center p-6 pt-0", local.class)} {...rest} />
  );
};
