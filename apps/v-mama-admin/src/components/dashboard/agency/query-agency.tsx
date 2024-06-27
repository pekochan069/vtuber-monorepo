import { actions } from "astro:actions";
import {
  createResource,
  createSignal,
  createEffect,
  Suspense,
  For,
  onCleanup,
  onMount,
  Switch,
  Match,
  untrack,
  batch,
  Show,
} from "solid-js";
import { debounce } from "@solid-primitives/scheduled";
import {
  useCurrentlyHeldKey,
  useKeyDownEvent,
} from "@solid-primitives/keyboard";
import { Spinner, SpinnerType } from "solid-spinner";
import { TbSearch } from "solid-icons/tb";

import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";
import type { Agency } from "@repo/db/schema";

async function getAgencies(searchTerm: string) {
  if (searchTerm.length < 3) return [];

  const res = await actions.queryAgencies(searchTerm);

  return res;
}

export function QueryAgency() {
  let searchBoxRef: HTMLDivElement | undefined;

  const [searchTerm, setSearchTerm] = createSignal("");
  const [input, setInput] = createSignal("");
  const trigger = debounce((value: string) => setSearchTerm(value), 200);
  const [useTrigger, setUseTrigger] = createSignal(true);
  const [showOptions, setShowOptions] = createSignal(false);
  const [agencies] = createResource(searchTerm, getAgencies);
  const [focusIndex, setFocusIndex] = createSignal<number>();
  const keyDownEvent = useKeyDownEvent();
  const [selectedAgency, setSelectedAgency] = createSignal<Agency | null>(null);
  const [agencies2] = createSignal<Agency[]>([
    {
      createdAt: new Date("2021-09-01T00:00:00.000Z"),
      defunct: false,
      defunctAt: null,
      description: "description",
      en: "en",
      icon: "icon",
      id: "id1",
      jp: "jp",
      kr: "kr",
      name: "name1",
      website: "website",
    },
    {
      createdAt: new Date("2021-09-01T00:00:00.000Z"),
      defunct: false,
      defunctAt: null,
      description: "description",
      en: "en",
      icon: "icon",
      id: "id2",
      jp: "jp",
      kr: "kr",
      name: "name2",
      website: "website",
    },
    {
      createdAt: new Date("2021-09-01T00:00:00.000Z"),
      defunct: false,
      defunctAt: null,
      description: "description",
      en: "en",
      icon: "icon",
      id: "id3",
      jp: "jp",
      kr: "kr",
      name: "name3",
      website: "website",
    },
    {
      createdAt: new Date("2021-09-01T00:00:00.000Z"),
      defunct: false,
      defunctAt: null,
      description: "description",
      en: "en",
      icon: "icon",
      id: "id4",
      jp: "jp",
      kr: "kr",
      name: "name4",
      website: "website",
    },
  ]);

  function clickOutsideSearchBox(e: MouseEvent) {
    // @ts-ignore
    if (searchBoxRef && !searchBoxRef.contains(e.target)) {
      setShowOptions(false);
    }
  }

  onMount(() => {
    document.addEventListener("click", clickOutsideSearchBox);
  });

  onCleanup(() => {
    document.removeEventListener("click", clickOutsideSearchBox);
  });

  function setAgency(agency: Agency) {
    batch(() => {
      setShowOptions(false);
      setUseTrigger(false);

      if (agency.jp?.includes(input())) {
        setInput(agency.jp);
      } else if (agency.en?.includes(input())) {
        setInput(agency.en);
      } else if (agency.kr?.includes(input())) {
        setInput(agency.kr);
      } else {
        setInput(agency.name);
      }

      setSelectedAgency(agency);
    });
  }

  createEffect(() => {
    if (useTrigger()) {
      trigger(input());
    }
  });

  createEffect(() => {
    if (showOptions()) {
      const e = keyDownEvent();

      untrack(() => {
        if (e) {
          const index = focusIndex();

          if (e.key === "ArrowDown") {
            e.preventDefault();
            if (index === undefined) {
              setFocusIndex(0);
            } else {
              setFocusIndex(index < agencies2().length - 1 ? index + 1 : index);
            }
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (index === undefined) {
              setFocusIndex(agencies2().length - 1);
            } else {
              setFocusIndex(index > 0 ? index - 1 : index);
            }
          } else if (e.key === "Enter") {
            e.preventDefault();
            if (index !== undefined) {
              setAgency(agencies2()[index]);
            }
          }
        }
      });
    }
  });

  return (
    <div class="pt-4">
      <div class="relative" ref={searchBoxRef}>
        <TextFieldRoot
          value={input()}
          onChange={(value) => {
            batch(() => {
              if (!useTrigger()) {
                setUseTrigger(true);
              }
              if (!showOptions()) {
                setShowOptions(true);
              }
              setInput(value);
            });
          }}
        >
          <div class="relative">
            <TextField
              autocomplete="off"
              placeholder="소속사 검색"
              class="peer !placeholder-transparent"
            />
            <div class="ease-expo-in-out text-muted-foreground pointer-events-none absolute left-3 top-1/2 translate-y-[-200%] text-sm transition-transform peer-placeholder-shown:-translate-y-1/2">
              소속사 검색
            </div>
            <TbSearch class="text-input-foreground absolute right-4 top-1/2 -translate-y-1/2" />
          </div>
        </TextFieldRoot>
        <Suspense>
          <Switch>
            <Match when={agencies.loading}>
              <div class="bg-popover text-popover-foreground border-border absolute top-[calc(100%+0.1rem)] flex w-full justify-center rounded-md border shadow-md">
                <Spinner type={SpinnerType.puff} />
              </div>
            </Match>
            <Match when={showOptions() && agencies()}>
              {(agencyList) => (
                <Show when={agencyList().length > 0}>
                  <div class="bg-popover text-popover-foreground border-border absolute top-[calc(100%+0.1rem)] w-full rounded-md border shadow-md">
                    <ul class="p-1">
                      <For each={agencyList()}>
                        {(agency, i) => (
                          <li>
                            <button
                              class="data-[focus=true]:bg-accent relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none"
                              type="button"
                              onMouseEnter={() => setFocusIndex(i())}
                              onClick={() => setAgency(agency)}
                              data-focus={focusIndex() === i()}
                            >
                              <div>{agency.name}</div>
                            </button>
                          </li>
                        )}
                      </For>
                    </ul>
                  </div>
                </Show>
              )}
            </Match>
          </Switch>
        </Suspense>
      </div>
      <div class="mt-8">
        <Show when={selectedAgency()}>
          {(agency) => (
            <div>
              <div>asd</div>
            </div>
          )}
        </Show>
      </div>
    </div>
  );
}
