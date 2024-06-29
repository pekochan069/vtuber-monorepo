import { TbSearch, TbX } from "solid-icons/tb";
import { debounce, type Scheduled } from "@solid-primitives/scheduled";
import {
  createEffect,
  createResource,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
  untrack,
  type JSX,
} from "solid-js";
import { createForm } from "@tanstack/solid-form";
import { actions } from "astro:actions";
import { Command as CommandPrimitive } from "cmdk-solid";
import { useKeyDownEvent } from "@solid-primitives/keyboard";

import { FieldInfo, WithFieldInfo } from "../field-info";
import { Button } from "@repo/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerLabel,
  DrawerTrigger,
} from "@repo/ui/drawer";
import { TextField, TextFieldLabel, TextFieldRoot } from "@repo/ui/textfield";
import { createStore, produce } from "solid-js/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@repo/ui/command";
import { Badge } from "@repo/ui/badge";

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
            <SearchForm isDesktop={false} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function DesktopDialog() {
  const [open, setOpen] = createSignal(true);
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
          <SearchForm isDesktop={true} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SearchForm(props: { isDesktop: boolean }) {
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
        {/* <form.Field name="illustrator"></form.Field> */}
        {/* <SearchFormTextInput /> */}
        <VtuberSearch />
      </div>
    </form>
  );
}

const aa = [
  {
    id: "1",
    name: "a",
  },
  {
    id: "2",
    name: "b",
  },
  {
    id: "3",
    name: "c",
  },
  {
    id: "4",
    name: "d",
  },
  {
    id: "5",
    name: "e",
  },
];

async function fetchVtubers(query: string) {
  if (query === "" || query.length < 2) {
    return [];
  }

  return actions.queryVtuber(query);
}

function VtuberSearch() {
  const [query, setQuery] = createSignal("");
  const [queriedVtubers] = createResource(query, fetchVtubers);

  return (
    <SearchFormTextInput
      setQuery={setQuery}
      queriedVtubers={queriedVtubers()}
      // queriedVtubers={aa}
    />
  );
}

function SearchFormTextInput(props: {
  setQuery: (value: string) => void;
  queriedVtubers: { id: string; name: string }[] | undefined;
  // value: string;
  // onChange: (value: string) => void;
}) {
  let commandRef: HTMLDivElement | undefined;
  let inputRef: HTMLInputElement | undefined;

  const [open, setOpen] = createSignal(false);
  const [input, setInput] = createSignal("");
  const trigger = debounce((value: string) => props.setQuery(value), 200);
  const [selected, setSelected] = createStore<{ id: string; name: string }[]>(
    [],
  );
  const [focusIndex, setFocusIndex] = createSignal(0);
  const keyDownEvent = useKeyDownEvent();

  function clickOutside(e: MouseEvent) {
    if (
      commandRef &&
      !commandRef.contains(e.target as Node) &&
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
    if (!open()) return;

    const e = keyDownEvent();

    untrack(() => {
      if (!e) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (props.queriedVtubers !== undefined) {
          setFocusIndex((index) =>
            index + 1 < props.queriedVtubers!.length ? index + 1 : index,
          );
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusIndex((index) => (index - 1 >= 0 ? index - 1 : index));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (props.queriedVtubers !== undefined) {
          setSelected(
            produce((selected) => {
              selected.push(props.queriedVtubers![focusIndex()]);
            }),
          );
          setInput("");
        }
      }
    });
  });

  return (
    <Command class="overflow-visible bg-transparent" ref={commandRef}>
      <div class="border-input ring-offset-background focus-within:ring-ring group rounded-md border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-offset-2">
        <div class="flex flex-wrap gap-1">
          <For each={selected}>
            {(item, i) => (
              <Badge variant="secondary">
                <span>{item.name}</span>
                <button
                  class="ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                  type="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setSelected(
                        produce((selected) => selected.splice(i(), 1)),
                      );
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelected(produce((selected) => selected.splice(i(), 1)));
                  }}
                >
                  <TbX class="text-muted-foreground hover:text-foreground size-3" />
                </button>
              </Badge>
            )}
          </For>
          <CommandPrimitive.Input
            class="placeholder:text-muted-foreground ml-2 flex-1 bg-transparent outline-none"
            ref={inputRef}
            value={input()}
            onValueChange={(search) => setInput(search)}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="검색어를 입력하세요"
          />
        </div>
      </div>
      <div class="relative mt-2">
        <CommandList>
          <Show when={open() && props.queriedVtubers}>
            {(vtubers) => (
              <Show when={vtubers().length > 0}>
                <div class="bg-popover text-popover-foreground animate-in absolute top-0 z-10 w-full rounded-md border shadow-md outline-none">
                  <div class="text-foreground h-full overflow-auto p-1">
                    <For each={vtubers()}>
                      {(vtuber, i) => (
                        <div
                          class="aria-selected:bg-accent aria-selected:text-accent-foreground relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-disabled:pointer-events-none aria-disabled:opacity-50"
                          aria-selected={focusIndex() === i()}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setInput("");
                            setSelected(selected.length, vtuber);
                          }}
                          onMouseEnter={() => setFocusIndex(i())}
                        >
                          {vtuber.name}
                        </div>
                      )}
                    </For>
                  </div>
                </div>
              </Show>
            )}
          </Show>
        </CommandList>
      </div>
    </Command>
  );
}
