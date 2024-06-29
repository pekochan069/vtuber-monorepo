import { createForm } from "@tanstack/solid-form";
import { createSignal, Match, Show, Switch } from "solid-js";
import { Spinner, SpinnerType } from "solid-spinner";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { actions } from "astro:actions";

import { TextField, TextFieldLabel, TextFieldRoot } from "@repo/ui/textfield";
import { Button } from "@repo/ui/button";
import { FieldInfo } from "~/components/field-info";
import type { LoginTags } from "~/actions/auth";

export function LoginForm() {
  const form = createForm(() => ({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const response = await actions.authLogin(value);

      if (response.ok) {
        window.location.href = "/dashboard";
      }

      setSubmitStateTag(response._tag);
    },
    validatorAdapter: zodValidator(),
  }));

  const [submitStateTag, setSubmitStateTag] = createSignal<LoginTags | "">("");

  return (
    <form
      method="post"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();

        if (submitStateTag() !== "") {
          setSubmitStateTag("");
        }

        form.handleSubmit();
      }}
    >
      <div class="mx-auto w-full max-w-2xl rounded-lg border px-6 py-4">
        <h1 class="mb-8 text-center text-3xl font-bold">Login</h1>
        <div class="flex flex-col">
          <form.Field
            name="username"
            validators={{
              onChange: z
                .string()
                .min(3, "Username must be at least 3 characters")
                .max(32, "Username must be at most 32 characters")
                .regex(/^[a-zA-Z0-9_]+$/, "Username must be alphanumeric"),
            }}
          >
            {(field) => (
              <div class="min-h-24">
                <TextFieldRoot
                  onChange={(value) => {
                    if (submitStateTag() !== "") {
                      setSubmitStateTag("");
                    }

                    field().handleChange(value);
                  }}
                  validationState={
                    submitStateTag() === "InvalidFormData" ? "invalid" : "valid"
                  }
                >
                  <TextFieldLabel>Username</TextFieldLabel>
                  <TextField
                    name={field().name}
                    id={field().name}
                    onBlur={field().handleBlur}
                    autocomplete="username"
                  />
                </TextFieldRoot>
                <FieldInfo field={field()} />
              </div>
            )}
          </form.Field>
          <form.Field
            name="password"
            validators={{
              onChange: z
                .string()
                .min(8, "Password must be at least 8 characters")
                .max(256, "Password must be at most 256 characters"),
            }}
          >
            {(field) => (
              <div class="min-h-24">
                <TextFieldRoot
                  onChange={(value) => {
                    if (submitStateTag() !== "") {
                      setSubmitStateTag("");
                    }
                    field().handleChange(value);
                  }}
                  validationState={
                    submitStateTag() === "InvalidFormData" ? "invalid" : "valid"
                  }
                >
                  <TextFieldLabel>Password</TextFieldLabel>
                  <TextField
                    name={field().name}
                    id={field().name}
                    onBlur={field().handleBlur}
                    type="password"
                    required
                    autocomplete="current-password"
                  />
                </TextFieldRoot>
                <FieldInfo field={field()} />
              </div>
            )}
          </form.Field>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <Switch>
              <Match when={submitStateTag() === "DatabaseError"}>
                <div class="text-lg font-medium text-red-500">Cannot login</div>
              </Match>
              <Match when={submitStateTag() === "InvalidFormData"}>
                <div class="text-lg font-medium text-red-500">
                  Invalid username or password
                </div>
              </Match>
              <Match when={submitStateTag() === "NoUserFound"}>
                <div class="text-lg font-medium text-red-500">
                  No matching user found
                </div>
              </Match>
            </Switch>
          </div>
          <div class="flex gap-4">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {(state) => (
                <>
                  <Button type="reset" variant="link">
                    Reset
                  </Button>
                  <Button type="submit" disabled={!state()[0]}>
                    <Show when={state()[1]} fallback="Login">
                      <Spinner type={SpinnerType.puff} />
                    </Show>
                  </Button>
                </>
              )}
            </form.Subscribe>
          </div>
        </div>
      </div>
    </form>
  );
}
