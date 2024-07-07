import { actions } from "astro:actions";
import { createForm } from "@tanstack/solid-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { Match, Show, Switch, batch, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { Spinner, SpinnerType } from "solid-spinner";
import { z } from "zod";

import type { SocialType } from "@repo/db/schema";
import { Button } from "@repo/ui/button";
import { Checkbox, CheckboxControl, CheckboxLabel } from "@repo/ui/checkbox";
import { TextArea } from "@repo/ui/textarea";
import { TextField, TextFieldLabel, TextFieldRoot } from "@repo/ui/textfield";
import { WithFieldInfo } from "~/components/field-info";
import { prepareImage } from "~/lib/image";
import { ImageUploadDialog } from "../image-uploader";
import { CreateSocial } from "../social/create-social";

const MAX_ICON_HEIGHT = 256;

export function CreateIllustratorForm() {
  const form = createForm(() => ({
    defaultValues: {
      name: "",
      jp: "",
      en: "",
      kr: "",
      description: "",
      icon: "",
      website: "",
    },
    onSubmit: async ({ value }) => {
      const transformedSocials = socials.map((social) => ({
        type: social.type.id,
        handle: social.handle,
        name: social.name === "" ? social.type.name : social.name,
      }));

      if (value.jp === "") {
        value.jp = value.name;
      }
      if (value.en === "") {
        value.en = value.name;
      }
      if (value.kr === "") {
        value.kr = value.name;
      }

      const res = await Promise.all([
        actions.createIllustrator({
          ...value,
          socialList: transformedSocials,
        }),
        fetch(iconImage()!.presignedUrl, {
          method: "PUT",
          headers: {
            "Content-Type": iconImage()!.image.type,
          },
          body: iconImage()!.image,
        }),
      ]);

      if (res[0].ok) {
        setStatus("success");
      } else {
        setStatus("failed");
      }
    },
    validatorAdapter: zodValidator(),
  }));

  const [usePlaceholder, setUsePlaceholder] = createSignal(false);

  const [socials, setSocials] = createStore(
    [] as {
      type: SocialType;
      handle: string;
      name: string;
    }[],
  );

  const [iconImage, setIconImage] = createSignal<{
    image: Blob;
    id: string;
    presignedUrl: string;
  } | null>(null);

  const [status, setStatus] = createSignal<"idle" | "success" | "failed">(
    "idle",
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div class="flex flex-col gap-4">
        <form.Field
          name="name"
          validators={{
            onChange: z.string().min(1),
          }}
        >
          {(field) => (
            <WithFieldInfo field={field()}>
              <TextFieldRoot
                value={field().state.value}
                onChange={(value) => field().handleChange(value)}
              >
                <TextFieldLabel>이름</TextFieldLabel>
                <TextField
                  onBlur={field().handleBlur}
                  name={field().name}
                  id={field().name}
                />
              </TextFieldRoot>
            </WithFieldInfo>
          )}
        </form.Field>
        <form.Field name="jp">
          {(field) => (
            <WithFieldInfo field={field()}>
              <TextFieldRoot
                value={field().state.value}
                onChange={(value) => field().handleChange(value)}
                class="relative"
              >
                <TextFieldLabel>일본어</TextFieldLabel>
                <TextField
                  onBlur={field().handleBlur}
                  name={field().name}
                  id={field().name}
                />
                <Button
                  class="absolute bottom-0.5 right-0.5"
                  variant="ghost"
                  type="button"
                  size="sm"
                  onClick={() =>
                    field().handleChange(
                      form.getFieldInfo("name").instance?.state.value,
                    )
                  }
                >
                  이름 복사
                </Button>
              </TextFieldRoot>
            </WithFieldInfo>
          )}
        </form.Field>
        <form.Field name="en">
          {(field) => (
            <WithFieldInfo field={field()}>
              <TextFieldRoot
                value={field().state.value}
                onChange={(value) => field().handleChange(value)}
                class="relative"
              >
                <TextFieldLabel>영어</TextFieldLabel>
                <TextField
                  onBlur={field().handleBlur}
                  name={field().name}
                  id={field().name}
                />
                <Button
                  class="absolute bottom-0.5 right-0.5"
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() =>
                    field().handleChange(
                      form.getFieldInfo("name").instance?.state.value,
                    )
                  }
                >
                  이름 복사
                </Button>
              </TextFieldRoot>
            </WithFieldInfo>
          )}
        </form.Field>
        <form.Field name="kr">
          {(field) => (
            <WithFieldInfo field={field()}>
              <TextFieldRoot
                value={field().state.value}
                onChange={(value) => field().handleChange(value)}
                class="relative"
              >
                <TextFieldLabel>한국어</TextFieldLabel>
                <TextField
                  onBlur={field().handleBlur}
                  name={field().name}
                  id={field().name}
                />
                <Button
                  class="absolute bottom-0.5 right-0.5"
                  variant="ghost"
                  type="button"
                  size="sm"
                  onClick={() =>
                    field().handleChange(
                      form.getFieldInfo("name").instance?.state.value,
                    )
                  }
                >
                  이름 복사
                </Button>
              </TextFieldRoot>
            </WithFieldInfo>
          )}
        </form.Field>
        <form.Field name="description">
          {(field) => (
            <WithFieldInfo field={field()}>
              <TextFieldRoot
                value={field().state.value}
                onChange={(value) => field().handleChange(value)}
              >
                <TextFieldLabel>설명</TextFieldLabel>
                <TextArea
                  onBlur={field().handleBlur}
                  name={field().name}
                  id={field().name}
                  autoResize
                  class="max-h-[118px] resize-none"
                />
              </TextFieldRoot>
            </WithFieldInfo>
          )}
        </form.Field>
        <form.Field name="website">
          {(field) => (
            <WithFieldInfo field={field()}>
              <TextFieldRoot
                value={field().state.value}
                onChange={(value) => field().handleChange(value)}
              >
                <TextFieldLabel>웹사이트</TextFieldLabel>
                <TextField
                  onBlur={field().handleBlur}
                  name={field().name}
                  id={field().name}
                  type="url"
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
            <WithFieldInfo field={field()} class="relative flex flex-col gap-2">
              <ImageUploadDialog
                processImage={(file) => prepareImage(file, MAX_ICON_HEIGHT)}
                uploadHandler={(image) =>
                  actions.handleImageUpload({ image, prefix: "illustrator" })
                }
                setUploadImage={(image) => {
                  setUsePlaceholder(false);
                  setIconImage(image);
                  field().handleChange(image.id);
                }}
                maxHeight={MAX_ICON_HEIGHT}
              />
              <div>
                <Checkbox
                  class="flex items-center gap-2"
                  value={`${usePlaceholder()}`}
                  onChange={(value) => {
                    batch(() => {
                      if (value === true) {
                        field().handleChange("placeholder");
                      }

                      setUsePlaceholder(value);
                    });
                  }}
                >
                  <CheckboxControl />
                  <CheckboxLabel>Use Placeholder</CheckboxLabel>
                </Checkbox>
              </div>
              <Show when={usePlaceholder() === false && iconImage()}>
                {(image) => (
                  <img
                    src={URL.createObjectURL(image().image)}
                    alt="icon"
                    width={128}
                    height={128}
                    class="mx-auto mt-4 rounded-md shadow-md"
                  />
                )}
              </Show>
              <Show when={usePlaceholder() === true}>
                <img
                  src="https://pub-2d4e6c51bc9a44eeaffec2d6fadf51e9.r2.dev/vtuber/placeholder-128.png"
                  alt="placeholder"
                  width={128}
                  height={128}
                  class="mx-auto mt-4 rounded-md shadow-md"
                />
              </Show>
            </WithFieldInfo>
          )}
        </form.Field>
        <div>
          <CreateSocial socials={socials} onChange={setSocials} />
        </div>
        <div class="mt-6">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {(state) => (
              <Button type="submit" disabled={!state()[0]} class="w-full">
                <Show when={state()[1]} fallback="제출">
                  <Spinner type={SpinnerType.puff} />
                </Show>
              </Button>
            )}
          </form.Subscribe>
        </div>
        <Switch>
          <Match when={status() === "success"}>
            <div class="text-green-500">성공하였습니다</div>
          </Match>
          <Match when={status() === "failed"}>
            <div class="text-destructive">실패하였습니다</div>
          </Match>
        </Switch>
      </div>
    </form>
  );
}
