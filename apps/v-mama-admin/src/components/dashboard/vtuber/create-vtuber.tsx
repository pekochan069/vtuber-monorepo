import { actions } from "astro:actions";
import { useKeyDownEvent } from "@solid-primitives/keyboard";
import { debounce } from "@solid-primitives/scheduled";
import { createForm } from "@tanstack/solid-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import {
  For,
  Match,
  Show,
  Switch,
  batch,
  createEffect,
  createResource,
  createSignal,
  onCleanup,
  onMount,
  untrack,
} from "solid-js";
import { createStore } from "solid-js/store";
import { Spinner, SpinnerType } from "solid-spinner";
import { z } from "zod";

import type { SocialType } from "@repo/db/schema";
import { Button } from "@repo/ui/button";
import { Checkbox, CheckboxControl, CheckboxLabel } from "@repo/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerLabel,
  DrawerTrigger,
} from "@repo/ui/drawer";
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemLabel,
} from "@repo/ui/radio-group";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";
import { TextArea } from "@repo/ui/textarea";
import { TextField, TextFieldLabel, TextFieldRoot } from "@repo/ui/textfield";
import { TbPlus } from "solid-icons/tb";
import { FieldInfo, WithFieldInfo } from "~/components/field-info";
import { prepareImage } from "~/lib/image";
import { CreateAgencyForm } from "../agency/create-agency";
import { DatePicker } from "../date-picker";
import { ImageUploadDialog } from "../image-uploader";
import { CreateSocial } from "../social/create-social";

const SMALL_ICON_SIZE = 128;
const MAX_ICON_HEIGHT = 256;

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
      smallIcon: "",
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

      const res = await Promise.all([
        actions.createVtuber({
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

  const [usePlaceholder, setUsePlaceholder] = createSignal<boolean>(false);
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
          {(field) => {
            const [agencyInput, setAgencyInput] = createSignal("");
            return (
              <WithFieldInfo field={field()}>
                <div class="space-y-2">
                  <label class="text-sm font-medium">소속</label>
                  <SelectAgency
                    onSelect={(agency) => {
                      field().handleChange(agency.id);
                    }}
                    setInput={agencyInput()}
                  />
                  <CreateAgencyModal
                    onCreateAgency={(agency) => {
                      field().handleChange(agency.id);
                      setAgencyInput(agency.name);
                    }}
                  />
                </div>
              </WithFieldInfo>
            );
          }}
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
              <div>메인 이미지</div>
              <ImageUploadDialog
                processImage={(file) => prepareImage(file, MAX_ICON_HEIGHT)}
                uploadHandler={(image) =>
                  actions.handleImageUpload({ image, prefix: "vtuber" })
                }
                setUploadImage={(uploadImage) => {
                  setUsePlaceholder(false);
                  field().handleChange(uploadImage.id);
                  setIconImage(() => uploadImage);
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
        <form.Field
          name="smallIcon"
          validators={{
            onChange: z.string().min(1, "Icon is required"),
          }}
        >
          {(field) => (
            <WithFieldInfo field={field()} class="relative flex flex-col gap-2">
              <div>작은 아이콘</div>
              <ImageUploadDialog
                processImage={(file) => prepareImage(file, SMALL_ICON_SIZE)}
                uploadHandler={(image) =>
                  actions.handleImageUpload({ image, prefix: "vtuber" })
                }
                setUploadImage={(uploadImage) => {
                  setUsePlaceholder(false);
                  field().handleChange(uploadImage.id);
                  setIconImage(() => uploadImage);
                }}
                maxHeight={SMALL_ICON_SIZE}
                defaultOpen="get-social-icon"
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
                    width={64}
                    height={64}
                    class="mx-auto mt-4 rounded-md shadow-md"
                  />
                )}
              </Show>
              <Show when={usePlaceholder() === true}>
                <img
                  src="https://pub-2d4e6c51bc9a44eeaffec2d6fadf51e9.r2.dev/vtuber/placeholder-128.png"
                  alt="placeholder"
                  width={64}
                  height={64}
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

export async function queryAgencies(query: string) {
  if (query === "") {
    return [];
  }

  return await actions.queryAgencies(query);
}

function SelectAgency(props: {
  onSelect: (agency: { id: string; name: string }) => void;
  setInput: string;
}) {
  let ref: HTMLDivElement | undefined;
  let inputRef: HTMLInputElement | undefined;

  const [open, setOpen] = createSignal(false);

  const [query, setQuery] = createSignal("");
  const [agencies] = createResource(query, queryAgencies);

  const [useTrigger, setUseTrigger] = createSignal(true);
  const trigger = debounce((value: string) => setQuery(value), 200);
  const [input, setInput] = createSignal("");

  const [focusIndex, setFocusIndex] = createSignal(0);

  const keyDownEvent = useKeyDownEvent();

  function clickOutside(e: MouseEvent) {
    if (
      ref &&
      !ref.contains(e.target as Node) &&
      inputRef &&
      !inputRef.contains(e.target as Node)
    ) {
      setOpen(false);
    }
  }

  onMount(() => {
    document.addEventListener("mousedown", clickOutside);
  });

  onCleanup(() => {
    document.removeEventListener("mousedown", clickOutside);
  });

  createEffect(() => {
    if (input() !== "" && input().length > 1) {
      trigger(input());
    }
  });

  createEffect(() => {
    if (props.setInput === "") {
      return;
    }

    setUseTrigger(false);
    setInput(props.setInput);
  });

  createEffect(() => {
    if (!open()) return;

    const e = keyDownEvent();

    untrack(() => {
      if (!e) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (agencies() && agencies()!.length > 0) {
          setFocusIndex((index) =>
            index + 1 < agencies()!.length ? index + 1 : index,
          );
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusIndex((index) => (index - 1 >= 0 ? index - 1 : index));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (agencies() && agencies()!.length > 0) {
          setUseTrigger(false);
          setInput(agencies()![focusIndex()].name);
          props.onSelect(agencies()![focusIndex()]);
        }
      }
    });
  });

  createEffect(() => {
    if (useTrigger()) {
      trigger(input());
    }
  });

  return (
    <div ref={ref}>
      <TextFieldRoot
        value={input()}
        onChange={(value) => {
          if (useTrigger() === false) {
            setUseTrigger(true);
          }
          setInput(value);
        }}
      >
        <TextField
          ref={inputRef}
          autocomplete="off"
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
        />
      </TextFieldRoot>
      <div class="relative mt-2">
        <Show when={open() && agencies()}>
          {(agencyList) => (
            <Show when={agencyList().length > 0}>
              <div class="bg-popover text-popover-foreground animate-in absolute top-0 z-10 w-full rounded-md border p-1 shadow-md outline-none">
                <ul>
                  <For each={agencyList()}>
                    {(agency, i) => (
                      <div
                        class="aria-selected:bg-accent aria-selected:text-accent-foreground relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-disabled:pointer-events-none aria-disabled:opacity-50"
                        aria-selected={focusIndex() === i()}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setUseTrigger(false);
                          setInput(agency.name);
                          props.onSelect(agency);
                        }}
                        onMouseEnter={() => setFocusIndex(i())}
                      >
                        {agency.name}
                      </div>
                    )}
                  </For>
                </ul>
              </div>
            </Show>
          )}
        </Show>
      </div>
    </div>
  );
}

function CreateAgencyModal(props: {
  onCreateAgency: (agency: { id: string; name: string }) => void;
}) {
  const [isDesktop, setIsDesktop] = createSignal(false);

  onMount(() => {
    setIsDesktop(window.innerWidth > 768);
  });

  return (
    <Show
      when={isDesktop()}
      fallback={<CreateAgencyMobile onCreateAgency={props.onCreateAgency} />}
    >
      <CreateAgencyDesktop onCreateAgency={props.onCreateAgency} />
    </Show>
  );
}

function CreateAgencyMobile(props: {
  onCreateAgency: (agency: { id: string; name: string }) => void;
}) {
  const [open, setOpen] = createSignal(false);
  return (
    <Drawer open={open()} onOpenChange={setOpen}>
      <DrawerTrigger as={Button} variant="secondary" class="w-full">
        <div>새로운 소속사 생성</div>
      </DrawerTrigger>
      <DrawerContent>
        <div class="mx-auto h-[60svh] w-full max-w-3xl overflow-auto">
          <DrawerHeader>
            <DrawerLabel>소속사 생성</DrawerLabel>
          </DrawerHeader>
          <div class="p-4">
            <CreateAgencyForm onCreateAgency={props.onCreateAgency} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function CreateAgencyDesktop(props: {
  onCreateAgency: (agency: { id: string; name: string }) => void;
}) {
  const [open, setOpen] = createSignal(false);
  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger as={Button} variant="secondary" class="w-full">
        <div>새로운 소속사 생성</div>
      </DialogTrigger>
      <DialogContent class="max-h-[80svh] max-w-3xl overflow-auto">
        <DialogHeader>
          <DialogTitle>소속사 생성</DialogTitle>
        </DialogHeader>
        <div class="p-4">
          <CreateAgencyForm onCreateAgency={props.onCreateAgency} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
