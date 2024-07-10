import { actions } from "astro:actions";
import { useKeyDownEvent } from "@solid-primitives/keyboard";
import { debounce } from "@solid-primitives/scheduled";
import {
  For,
  Show,
  createEffect,
  createResource,
  createSignal,
  onCleanup,
  onMount,
  untrack,
} from "solid-js";

import type { Vtuber } from "@repo/db/schema";
import { TextField, TextFieldLabel, TextFieldRoot } from "@repo/ui/textfield";

export function EditVtuber() {
  return (
    <div>
      <FindVtuber onSelect={(vtuber) => { }} />
    </div>
  )
}

async function queryVtubers(query: string) {
  if (query === "") {
    return [];
  }

  return await actions.queryVtubers(query);
}

export function FindVtuber(props: { onSelect: (vtuber: Vtuber) => void }) {
  let ref: HTMLDivElement | undefined;
  let inputRef: HTMLInputElement | undefined;

  const [open, setOpen] = createSignal(false);

  const [query, setQuery] = createSignal("");
  const [vtubers] = createResource(query, queryVtubers);

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
    setUseTrigger(false);
  });

  createEffect(() => {
    if (!open()) return;

    const e = keyDownEvent();

    untrack(() => {
      if (!e) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (vtubers() && vtubers()!.length > 0) {
          setFocusIndex((index) =>
            index + 1 < vtubers()!.length ? index + 1 : index,
          );
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusIndex((index) => (index - 1 >= 0 ? index - 1 : index));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (vtubers() && vtubers()!.length > 0) {
          setOpen(false)
          setUseTrigger(false);
          setInput(vtubers()![focusIndex()].name);
          props.onSelect(vtubers()![focusIndex()]);
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
          if (open() === false) {
            setOpen(true);
          }
          if (useTrigger() === false) {
            setUseTrigger(true);
          }
          setInput(value);
        }}
      >
        <TextFieldLabel>버튜버 검색</TextFieldLabel>
        <TextField
          ref={inputRef}
          autocomplete="off"
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
        />
      </TextFieldRoot>
      <div class="relative mt-2">
        <Show when={open() && vtubers()}>
          {(vtuberList) => (
            <Show when={vtuberList().length > 0}>
              <div class="bg-popover text-popover-foreground animate-in absolute top-0 z-10 w-full rounded-md border p-1 shadow-md outline-none">
                <ul>
                  <For each={vtuberList()}>
                    {(vtuber, i) => (
                      <div
                        class="aria-selected:bg-accent aria-selected:text-accent-foreground relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-disabled:pointer-events-none aria-disabled:opacity-50"
                        aria-selected={focusIndex() === i()}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setUseTrigger(false);
                          setInput(vtuber.name);
                          setOpen(false)
                          props.onSelect(vtuber);
                        }}
                        onMouseEnter={() => setFocusIndex(i())}
                      >
                        {vtuber.name}
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
