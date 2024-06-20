import { TbSearch } from "solid-icons/tb";
import { debounce, type Scheduled } from "@solid-primitives/scheduled";
import {
  createEffect,
  createResource,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
  type JSX,
} from "solid-js";
import { createForm } from "@tanstack/solid-form";

import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerLabel,
  DrawerTrigger,
} from "../ui/drawer";
import { TextField, TextFieldLabel, TextFieldRoot } from "../ui/textfield";
import { FieldInfo } from "../field-info";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export function SearchDialog() {
  const [isDesktop, setIsDesktop] = createSignal(false);

  onMount(() => {
    setIsDesktop(window.innerWidth >= 768);
  });

  return (
    <Show when={isDesktop()} fallback={<MobileDialog />}>
      <DesktopDialog />
    </Show>
  );
}

function MobileDialog() {
  const [open, setOpen] = createSignal(false);
  return (
    <Drawer open={open()} onOpenChange={setOpen}>
      <DrawerTrigger as={Button} variant="ghost" size="icon">
        <TbSearch class="size-5" />
      </DrawerTrigger>
      <DrawerContent>
        <div class="mx-auto h-[60svh] w-full max-w-3xl">
          <DrawerHeader>
            <DrawerLabel>버튜버 마마 검색</DrawerLabel>
          </DrawerHeader>
          <div class="p-4">
            <SearchForm />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function DesktopDialog() {
  const [open, setOpen] = createSignal(false);
  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger as={Button} variant="ghost" size="icon">
        <TbSearch class="size-5" />
      </DialogTrigger>
      <DialogContent class="max-w-3xl">
        <DialogHeader>
          <DialogTitle>버튜버 마마 검색</DialogTitle>
        </DialogHeader>
        <div class="p-4">
          <SearchForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SearchForm() {
  const form = createForm(() => ({
    defaultValues: {
      illustrator: "",
      vtuber: "",
      agency: "",
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div class="space-y-4">
        <form.Field name="illustrator">
          {(field) => (
            <>
              <InputField
                fetchFunction={getData1}
                name={field().name}
                label="일러스트레이터"
                value={field().state.value}
                onChange={(value) => field().handleChange(value)}
                onBlur={field().handleBlur}
              />
              <FieldInfo field={field()} />
            </>
          )}
        </form.Field>
        <form.Field name="agency">
          {(field) => (
            <>
              <InputField
                fetchFunction={getData2}
                name={field().name}
                label="소속사"
                value={field().state.value}
                onChange={(value) => field().handleChange(value)}
                onBlur={field().handleBlur}
              />
              <FieldInfo field={field()} />
            </>
          )}
        </form.Field>
        <form.Field name="vtuber">
          {(field) => (
            <>
              <InputField
                fetchFunction={getData3}
                name={field().name}
                label="버튜버"
                value={field().state.value}
                onChange={(value) => field().handleChange(value)}
                onBlur={field().handleBlur}
              />
              <FieldInfo field={field()} />
            </>
          )}
        </form.Field>
        <div class="py-4">
          <div class="grid grid-cols-2 gap-4">
            <Button type="clear" variant="secondary">
              초기화
            </Button>
            <Button type="submit" variant="default">
              검색
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

const data = [
  { name: "히라쿠즈 미유키", id: 0 },
  { name: "히메모리 루나", id: 1 },
  { name: "히메사마", id: 2 },
  { name: "히메하시마리", id: 3 },
  { name: "우사다 페코라", id: 4 },
  { name: "히메히나", id: 5 },
  { name: "가나다", id: 6 },
  { name: "abc", id: 7 },
  { name: "abc", id: 7 },
  { name: "abc", id: 7 },
  { name: "abc", id: 7 },
  { name: "abc", id: 7 },
  { name: "abc", id: 7 },
  { name: "abc", id: 7 },
  { name: "abc", id: 7 },
  { name: "def", id: 8 },
  { name: "ghi", id: 9 },
];

const data2 = [
  { name: "히라쿠즈 미유키", id: 0 },
  { name: "히메모리 루나", id: 1 },
  { name: "히메사마", id: 2 },
  { name: "히메하시마리", id: 3 },
  { name: "우사다 페코라", id: 4 },
  { name: "히메히나", id: 5 },
  { name: "가나다", id: 6 },
  { name: "abc", id: 7 },
  { name: "abc", id: 7 },
  { name: "abc", id: 7 },
  { name: "abc", id: 7 },
  { name: "abc", id: 7 },
  { name: "abc", id: 7 },
  { name: "abc", id: 7 },
  { name: "abc", id: 7 },
  { name: "def", id: 8 },
  { name: "ghi", id: 9 },
];

const data3 = [
  { name: "히라쿠즈 미유키", id: 0 },
  { name: "히메모리 루나", id: 1 },
  { name: "히메사마", id: 2 },
  { name: "히메하시마리", id: 3 },
  { name: "우사다 페코라", id: 4 },
  { name: "히메히나", id: 5 },
  { name: "가나다", id: 6 },
  { name: "abc", id: 7 },
  { name: "abc", id: 7 },
  { name: "abc", id: 7 },
  { name: "abc", id: 7 },
  { name: "abc", id: 7 },
  { name: "abc", id: 7 },
  { name: "abc", id: 7 },
  { name: "abc", id: 7 },
  { name: "def", id: 8 },
  { name: "ghi", id: 9 },
];

async function getData1(query: string) {
  if (!query || query.length < 1) return [];

  return data.filter((item) => item.name.includes(query));
}

async function getData2(query: string) {
  if (!query || query.length < 1) return [];

  return data.filter((item) => item.name.includes(query));
}

async function getData3(query: string) {
  if (!query || query.length < 1) return [];

  return data.filter((item) => item.name.includes(query));
}

function InputField(props: {
  fetchFunction: (query: string) => Promise<{ name: string; id: number }[]>;
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  let inputField: HTMLInputElement | undefined;

  const [debounced, setDebounced] = createSignal();
  const [autocompleteInput, setAutocompleteInput] = createSignal("");
  const [autocomplete] = createResource(autocompleteInput, props.fetchFunction);
  const [showAutocomplete, setShowAutocomplete] = createSignal(false);

  function clickOutside(e: MouseEvent) {
    if (inputField?.contains(e.target as Node)) return;
    setShowAutocomplete(false);
  }

  onMount(() => {
    document.addEventListener("click", clickOutside);
  });

  onCleanup(() => {
    document.removeEventListener("click", clickOutside);
  });

  createEffect(() => {
    // @ts-ignore
    debounced()?.clear();

    if (props.value.length < 1) {
      setDebounced(null);
      setAutocompleteInput("");
      setShowAutocomplete(false);
      return;
    }

    setDebounced(
      debounce(() => {
        setAutocompleteInput(props.value);
      }, 200),
    );
  });

  createEffect(() => {
    if (!autocomplete()) return;

    // @ts-ignore
    if (autocomplete().length > 0) {
      setShowAutocomplete(true);
    }
  });

  return (
    <div class="relative" ref={inputField}>
      <TextFieldRoot
        class="space-y-2"
        value={props.value}
        onChange={props.onChange}
      >
        <TextFieldLabel>{props.label}</TextFieldLabel>
        <TextField
          name={props.name}
          id={props.name}
          // onBlur={props.onBlur}
          onFocusIn={() => {
            // @ts-ignore
            if (autocomplete() && autocomplete().length > 0) {
              setShowAutocomplete(true);
            }
          }}
        />
      </TextFieldRoot>
      <Show when={showAutocomplete()}>
        <ul class="bg-background absolute z-10 mt-1 max-h-56 min-h-8 w-full overflow-y-auto rounded-md border shadow-lg">
          <For each={autocomplete()}>
            {(item) => (
              <li>
                <Button
                  variant="ghost"
                  type="button"
                  class="w-full justify-normal gap-3"
                >
                  <TbSearch />
                  <span>{item.name}</span>
                </Button>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </div>
  );
}
