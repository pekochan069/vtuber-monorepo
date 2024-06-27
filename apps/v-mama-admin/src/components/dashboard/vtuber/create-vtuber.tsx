import { createForm } from "@tanstack/solid-form";
import { actions } from "astro:actions";
import { z } from "zod";
import {
  batch,
  createResource,
  createSignal,
  Index,
  Match,
  Show,
  Suspense,
  Switch,
} from "solid-js";
import { createStore } from "solid-js/store";
import { zodValidator } from "@tanstack/zod-form-adapter";

import type { SocialType } from "@repo/db/schema";
import { ImageUploadDialog } from "../image-uploader";
import { CreateSocial } from "../social/create-social";
import { FieldInfo, WithFieldInfo } from "~/components/field-info";
import { DatePicker } from "../date-picker";
import { Button } from "~/components/ui/button";
import { Spinner, SpinnerType } from "solid-spinner";
import {
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
} from "~/components/ui/checkbox";
import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";
import { prepareImage } from "~/lib/image";
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemLabel,
} from "~/components/ui/radio-group";
import { TextArea } from "~/components/ui/textarea";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger,
} from "~/components/ui/combobox";

export function CreateVtuberForm() {
  const form = createForm(() => ({
    defaultValues: {
      name: "",
      jp: "",
      en: "",
      kr: "",
      description: "",
      debut: new Date().toISOString().split("T")[0],
      retired: false,
      retiredAt: new Date().toISOString().split("T")[0],
      gender: "f",
      birthday: new Date().toISOString().split("T")[0],
      website: "",
      icon: "",
      agencyId: "",
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

      const res = await actions.createVtuber({
        ...value,
        socialList: transformedSocials,
      });

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("failed");
      }
    },
    validatorAdapter: zodValidator(),
  }));

  const [baseUrl, setBaseUrl] = createSignal<string>("");
  const [usePlaceholder, setUsePlaceholder] = createSignal<boolean>(false);
  const [socials, setSocials] = createStore(
    [] as {
      type: SocialType;
      handle: string;
      name: string;
    }[],
  );

  const [agencies] = createResource(actions.getAgencies);
  const agencyOptions = () => {
    if (agencies()) {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      return agencies()!.map((v) => ({
        value: v.id,
        label: v.name,
      }));
    }

    return [];
  };

  const [status, setStatus] = createSignal<"idle" | "success" | "failed">(
    "idle",
  );

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
        <form.Field
          name="agencyId"
          validators={{
            onChange: z.string().min(1, "Agency is required"),
          }}
        >
          {(field) => (
            <WithFieldInfo field={field()}>
              <div class="space-y-2">
                <label class="text-sm font-medium">소속</label>
                <Combobox
                  name={field().name}
                  options={agencyOptions()}
                  optionValue="value"
                  optionTextValue="label"
                  optionLabel="label"
                  onChange={(value) => field().handleChange(value.value)}
                  itemComponent={(props) => (
                    <ComboboxItem
                      item={props.item}
                      value={props.item.rawValue.value}
                    >
                      {props.item.rawValue.label}
                    </ComboboxItem>
                  )}
                >
                  <ComboboxTrigger>
                    <ComboboxInput />
                  </ComboboxTrigger>
                  <ComboboxContent />
                </Combobox>
              </div>
            </WithFieldInfo>
          )}
        </form.Field>
        <form.Field name="gender">
          {(field) => (
            <WithFieldInfo field={field()}>
              <div class="space-y-2">
                <div class="text-sm font-medium">성별</div>
                <RadioGroup
                  value={field().state.value}
                  onChange={(value) => field().handleChange(value)}
                  class="flex flex-row"
                >
                  <RadioGroupItem value="f">
                    <RadioGroupItemLabel>여성</RadioGroupItemLabel>
                  </RadioGroupItem>
                  <RadioGroupItem value="m">
                    <RadioGroupItemLabel>남성</RadioGroupItemLabel>
                  </RadioGroupItem>
                  <RadioGroupItem value="o">
                    <RadioGroupItemLabel>이외</RadioGroupItemLabel>
                  </RadioGroupItem>
                </RadioGroup>
              </div>
            </WithFieldInfo>
          )}
        </form.Field>
        <form.Field name="debut">
          {(field) => (
            <WithFieldInfo field={field()}>
              <div class="space-y-1">
                <label class="text-sm font-medium" for={field().name}>
                  데뷔일
                </label>
                <DatePicker field={field()} />
              </div>
            </WithFieldInfo>
          )}
        </form.Field>
        <form.Field name="birthday">
          {(field) => (
            <div class="space-y-2">
              <label class="text-sm font-medium" for={field().name}>
                생일
              </label>
              <DatePicker field={field()} />
              <div class="text-foreground/60 text-xs">
                연도는 상관없이 날짜만 신경쓰면 됩니다
              </div>
            </div>
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
              <TextFieldRoot
                value={field().state.value}
                onChange={(value) => field().handleChange(value)}
              >
                <TextFieldLabel>아이콘 ID</TextFieldLabel>
                <TextField
                  onBlur={field().handleBlur}
                  name={field().name}
                  id={field().name}
                  disabled={usePlaceholder()}
                  placeholder="이미 이미지를 업로드했을 경우에만 직접 ID를 입력하세요"
                />
              </TextFieldRoot>
              <ImageUploadDialog
                onUpload={(image, baseUrl) => {
                  batch(() => {
                    setBaseUrl(() => baseUrl);
                    setUsePlaceholder(false);
                    field().handleChange(baseUrl);
                  });
                }}
                processImage={(file) => prepareImage(file, 128)}
                uploadHandler={(image) =>
                  actions.handleImageUpload({ image, prefix: "vtuber" })
                }
                maxHeight={128}
              />
              <div>
                <Checkbox
                  class="flex items-center gap-2"
                  value={`${usePlaceholder()}`}
                  onChange={(value) => {
                    batch(() => {
                      if (value === true) {
                        field().handleChange("placeholder");
                      } else {
                        field().handleChange(baseUrl());
                      }

                      setUsePlaceholder(value);
                    });
                  }}
                >
                  <CheckboxControl />
                  <CheckboxLabel>Use Placeholder</CheckboxLabel>
                </Checkbox>
              </div>
              <Show when={usePlaceholder() === false && field().state.value}>
                <img
                  src={`https://pub-2d4e6c51bc9a44eeaffec2d6fadf51e9.r2.dev/vtuber/vtuber/${field().state.value}.png`}
                  alt="icon"
                  width={128}
                  height={128}
                  class="mx-auto mt-4 rounded-md shadow-md"
                />
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
        <form.Field name="retired">
          {(field) => (
            <Checkbox
              class="mt-4 flex items-center"
              onChange={(value) => field().handleChange(value)}
              value={`${field().state.value}`}
            >
              <CheckboxControl />
              <CheckboxLabel class="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                졸업여부
              </CheckboxLabel>
            </Checkbox>
          )}
        </form.Field>
        <form.Field name="retiredAt">
          {(field) => (
            <div
              class="hidden data-[show=true]:block"
              data-show={form.getFieldValue("retired").valueOf()}
            >
              <div class="space-y-1">
                <label class="text-sm font-medium" for={field().name}>
                  졸업 일자
                </label>
                <DatePicker field={field()} />
              </div>
              <FieldInfo field={field()} />
            </div>
          )}
        </form.Field>
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
