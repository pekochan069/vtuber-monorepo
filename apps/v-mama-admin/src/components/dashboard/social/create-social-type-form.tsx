import { actions } from "astro:actions";
import { createForm } from "@tanstack/solid-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { Match, Show, Switch, createSignal } from "solid-js";
import { Spinner, SpinnerType } from "solid-spinner";
import { z } from "zod";

import { Button } from "@repo/ui/button";
import {
  TextField,
  TextFieldDescription,
  TextFieldLabel,
  TextFieldRoot,
} from "@repo/ui/textfield";
import { WithFieldInfo } from "~/components/field-info";
import { prepareImages } from "~/lib/image";

export function CreateSocialTypeForm() {
  const form = createForm(() => ({
    defaultValues: {
      name: "",
      url: "",
      icon: "",
    },
    onSubmit: async ({ value }) => {
      const res = await actions.createSocialType(value);

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("failed");
      }
    },
    validatorAdapter: zodValidator(),
  }));

  const [status, setStatus] = createSignal<"idle" | "failed" | "success">();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setStatus("idle");
        form.handleSubmit();
      }}
    >
      <div class="flex flex-col gap-4">
        <form.Field
          name="name"
          validators={{
            onChange: z.string().min(1, "Name is required"),
          }}
        >
          {(field) => (
            <WithFieldInfo field={field()}>
              <TextFieldRoot
                value={field().state.value}
                onChange={(value) => field().handleChange(value)}
              >
                <TextFieldLabel>Name</TextFieldLabel>
                <TextField
                  name={field().name}
                  id={field().name}
                  onBlur={field().handleBlur}
                />
              </TextFieldRoot>
            </WithFieldInfo>
          )}
        </form.Field>
        <form.Field
          name="url"
          validators={{
            onChange: z.string().url("Invalid URL"),
          }}
        >
          {(field) => (
            <WithFieldInfo field={field()}>
              <TextFieldRoot
                value={field().state.value}
                onChange={(value) => field().handleChange(value)}
              >
                <TextFieldLabel>URL</TextFieldLabel>
                <TextField
                  name={field().name}
                  id={field().name}
                  onBlur={field().handleBlur}
                />
              </TextFieldRoot>
            </WithFieldInfo>
          )}
        </form.Field>
        <form.Field
          name="icon"
          validators={{
            onChange: z.string().min(1, "Icon is required"),
          }}
        >
          {(field) => (
            <WithFieldInfo field={field()}>
              <TextFieldRoot
                value={field().state.value}
                onChange={(value) => field().handleChange(value)}
              >
                <TextFieldLabel>Icon</TextFieldLabel>
                <TextField
                  name={field().name}
                  id={field().name}
                  onBlur={field().handleBlur}
                />
                <TextFieldDescription>
                  Icon should be located at project_root/public/icons/
                </TextFieldDescription>
              </TextFieldRoot>
            </WithFieldInfo>
          )}
        </form.Field>
        <div class="mt-6">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {(state) => (
              <Button type="submit" disabled={!state()[0]} class="w-full">
                <Show when={state()[1]} fallback="Submit">
                  <Spinner type={SpinnerType.puff} />
                </Show>
              </Button>
            )}
          </form.Subscribe>
        </div>
        <Switch>
          <Match when={status() === "success"}>
            <div class="text-green-500">Successfully created new Agency</div>
          </Match>
          <Match when={status() === "failed"}>
            <div class="text-destructive">Failed to create new Agency</div>
          </Match>
        </Switch>
      </div>
    </form>
  );
}

const prepareSocialTypeIcon = (file: File | null) =>
  prepareImages(file, 32, [1]);
