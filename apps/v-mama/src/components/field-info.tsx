import type { FieldApi } from "@tanstack/solid-form";
import { type JSX, Show } from "solid-js";

// biome-ignore lint/suspicious/noExplicitAny: any field can be passed to this component
export function FieldInfo(props: { field: FieldApi<any, any, any, any> }) {
  return (
    <>
      <Show when={props.field.state.meta.touchedErrors}>
        <em>{props.field.state.meta.touchedErrors}</em>
      </Show>
      <Show when={props.field.state.meta.isValidating}>
        <span>Validating...</span>
      </Show>
    </>
  );
}

export function WithFieldInfo(props: {
  children: JSX.Element;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  field: FieldApi<any, any, any, any>;
  class?: string;
}) {
  return (
    <div class={props.class}>
      {props.children}
      <FieldInfo field={props.field} />
    </div>
  );
}
