import { createForm } from "@tanstack/solid-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { FieldInfo } from "~/components/field-info";
import { createSignal, Match, Show, Switch } from "solid-js";
import { Spinner, SpinnerType } from "solid-spinner";
import { actions } from "astro:actions";
import { z } from "zod";

import type { CreateUserTags } from "~/actions/auth";
import { TextField, TextFieldLabel, TextFieldRoot } from "../ui/textfield";
import { Button } from "../ui/button";
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemLabel,
} from "../ui/radio-group";

export function CreateUserForm() {
  const form = createForm(() => ({
    defaultValues: {
      username: "",
      password: "",
      role: "user" as "user" | "admin",
    },
    onSubmit: async ({ value }) => {
      const response = await actions.authCreateUser(value);

      setSubmitStateTag(response._tag);
    },
    validatorAdapter: zodValidator(),
  }));

  const [submitStateTag, setSubmitStateTag] = createSignal<CreateUserTags | "">(
    "",
  );

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
        <h1 class="mb-8 text-center text-3xl font-bold">Create User</h1>
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
                    required
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
                  />
                </TextFieldRoot>
                <FieldInfo field={field()} />
              </div>
            )}
          </form.Field>
          <form.Field
            name="role"
            validators={{
              onChange: z
                .enum(["user", "admin"], {
                  message: "Role must be either 'user' or 'admin'",
                })
                .default("user"),
            }}
          >
            {(field) => (
              <div class="flex min-h-24 flex-col justify-start">
                <label class="text-sm font-medium" for="role">
                  Role
                </label>
                <RadioGroup
                  value={field().state.value}
                  onChange={(value) => {
                    // @ts-ignore
                    field().handleChange(value);
                  }}
                  class="flex gap-4"
                >
                  <RadioGroupItem value="user" class="flex items-center gap-2">
                    <RadioGroupItemControl id="role-user" />
                    <RadioGroupItemLabel for="role-user">
                      User
                    </RadioGroupItemLabel>
                  </RadioGroupItem>
                  <RadioGroupItem value="admin" class="flex items-center gap-2">
                    <RadioGroupItemControl id="role-admin" />
                    <RadioGroupItemLabel for="role-user">
                      Admin
                    </RadioGroupItemLabel>
                  </RadioGroupItem>
                </RadioGroup>
                <FieldInfo field={field()} />
              </div>
            )}
          </form.Field>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <Switch>
              <Match when={submitStateTag() === "DatabaseError"}>
                <div class="text-lg font-medium text-red-500">
                  Cannot create new User
                </div>
              </Match>
              <Match when={submitStateTag() === "InvalidFormData"}>
                <div class="text-lg font-medium text-red-500">
                  Invalid username or password
                </div>
              </Match>
              <Match when={submitStateTag() === "Success"}>
                <div class="text-lg font-medium text-green-500">
                  Successfully created new user
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
                    <Show when={state()[1]} fallback="Create">
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
