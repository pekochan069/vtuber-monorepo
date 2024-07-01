import { actions } from "astro:actions";
import { TextField as TextFieldPrimitive } from "@kobalte/core/text-field";
import { useKeyDownEvent } from "@solid-primitives/keyboard";
import { type Scheduled, debounce } from "@solid-primitives/scheduled";
import { createForm } from "@tanstack/solid-form";
import { Command as CommandPrimitive } from "cmdk-solid";
import { TbSearch, TbX } from "solid-icons/tb";
import {
  For,
  type JSX,
  Show,
  createEffect,
  createResource,
  createSignal,
  onCleanup,
  onMount,
  untrack,
} from "solid-js";

import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@repo/ui/command";
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
import { TextField, TextFieldLabel, TextFieldRoot } from "@repo/ui/textfield";
import { createStore, produce } from "solid-js/store";
import { FieldInfo, WithFieldInfo } from "../field-info";

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
      <div class="space-y-2">
        <IllustratorSearch />
        <AgencySearch />
        <VtuberSearch />
      </div>
    </form>
  );
}

function VtuberSearch() {
  const [query, setQuery] = createSignal("");
  const [queriedVtubers] = createResource(query, async (query: string) => {
    if (query === "") {
      return [];
    }

    return actions.queryVtuber(query);
  });

  return (
    <div class="space-y-1">
      <label for="vtuber-search" class="mb-2 text-sm">
        버튜버
      </label>
      <SearchFormTextInput
        setQuery={setQuery}
        queried={queriedVtubers() || []}
        inputId="vtuber-search"
      />
    </div>
  );
}

function AgencySearch() {
  const [query, setQuery] = createSignal("");
  const [queriedAgencies] = createResource(query, async (query: string) => {
    if (query === "") {
      return [];
    }

    return actions.queryAgency(query);
  });

  return (
    <div class="space-y-1">
      <label for="agency-search" class="mb-2 text-sm">
        소속사
      </label>
      <SearchFormTextInput
        setQuery={setQuery}
        queried={queriedAgencies() || []}
        inputId="agency-search"
      />
    </div>
  );
}

function IllustratorSearch() {
  const [query, setQuery] = createSignal("");
  const [queriedIllustrators] = createResource(query, async (query: string) => {
    if (query === "") {
      return [];
    }

    return actions.queryIllustrators(query);
  });

  return (
    <div class="space-y-1">
      <label for="illustrator-search" class="peer mb-2 text-sm">
        일러스트레이터
      </label>
      <SearchFormTextInput
        setQuery={setQuery}
        queried={queriedIllustrators() || []}
        inputId="illustrator-search"
      />
    </div>
  );
}

function SearchFormTextInput(props: {
  setQuery: (value: string) => void;
  queried: {
    id: string;
    name: string;
    jp: string | null;
    en: string | null;
    kr: string | null;
  }[];
  inputId: string;
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
    trigger(input());
  });

  createEffect(() => {
    if (!open()) return;

    const e = keyDownEvent();

    untrack(() => {
      if (!e) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (props.queried !== undefined) {
          setFocusIndex((index) =>
            index + 1 < props.queried!.length ? index + 1 : index,
          );
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusIndex((index) => (index - 1 >= 0 ? index - 1 : index));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (props.queried !== undefined) {
          setSelected(
            produce((selected) => {
              selected.push(props.queried![focusIndex()]);
            }),
          );
          setInput("");
        }
      }
    });
  });

  createEffect(() => {
    console.log(props.queried);
  });

  return (
    <Command class="bg-transparent; overflow-visible" ref={commandRef}>
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
          <input
            class="placeholder:text-muted-foreground ml-2 flex-1 bg-transparent outline-none"
            ref={inputRef}
            value={input()}
            onInput={(e) => setInput(e.currentTarget.value)}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="검색어를 입력하세요"
            id={props.inputId}
          />
        </div>
      </div>
      <div class="relative mt-2">
        <CommandList>
          <Show when={open() && props.queried}>
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
