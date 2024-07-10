import { actions } from "astro:actions";
import type { CalendarDate } from "@internationalized/date";
import { Skeleton } from "@repo/ui/skeleton";
import { makeCache } from "@solid-primitives/resource";
import {
  For,
  Match,
  Suspense,
  Switch,
  createEffect,
  createResource,
} from "solid-js";

export function CalendarContent(props: { selectedDate: CalendarDate }) {
  const month = () => props.selectedDate.month;

  const fetcher = (month: number) => actions.queryCalender(month);
  const [cachedFetcher, invalidate] = makeCache(fetcher);
  const [events, { refetch }] = createResource(month, cachedFetcher);

  return (
    <div>
      <Suspense>
        <Switch>
          <Match when={events.loading}>
            <>
              <div class="space-y-4">
                <div class="border-border space-y-2 rounded-lg border px-4 py-3 shadow-sm">
                  <h3 class="text-lg font-semibold">생일</h3>
                  <ul class="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
                    <For each={[...Array(6).keys()]}>
                      {(i) => (
                        <li class="border-border flex w-full flex-col items-center gap-1 rounded-md border p-2 shadow-sm">
                          <Skeleton class="aspect-square w-full" />
                          <Skeleton class="h-4 w-full" />
                        </li>
                      )}
                    </For>
                  </ul>
                </div>
                <div class="border-border space-y-2 rounded-lg border px-4 py-3 shadow-sm">
                  <h3 class="text-lg font-semibold">n주년</h3>
                  <ul class="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
                    <For each={[...Array(6).keys()]}>
                      {(i) => (
                        <li class="border-border flex w-full flex-col items-center gap-1 rounded-md border p-2 shadow-sm">
                          <Skeleton class="aspect-square w-full" />
                          <Skeleton class="h-4 w-full" />
                        </li>
                      )}
                    </For>
                  </ul>
                </div>
              </div>
            </>
          </Match>
          <Match when={events()}>
            {(eventList) => {
              const eventOnSelectedDate = () =>
                eventList().filter(
                  (e) =>
                    e.date.slice(3, 5) ===
                    props.selectedDate.day.toString().padStart(2, "0"),
                );
              const grouped = () =>
                Object.groupBy(eventOnSelectedDate(), (e) => e.type);
              const birthday = () =>
                (grouped().b || []).sort((a, b) => (a.kr > b.kr ? 1 : -1));
              const debut = () =>
                (grouped().d || []).sort((a, b) => (a.kr > b.kr ? 1 : -1));

              return (
                <>
                  <div class="space-y-4">
                    <div class="border-border space-y-2 rounded-lg border px-4 py-3 shadow-sm">
                      <h3 class="text-lg font-semibold">생일</h3>
                      <ul class="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
                        <For each={birthday()}>{(e) => <Row item={e} />}</For>
                      </ul>
                    </div>
                    <div class="border-border space-y-2 rounded-lg border px-4 py-3 shadow-sm">
                      <h3 class="text-lg font-semibold">n주년</h3>
                      <ul class="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
                        <For each={debut()}>{(e) => <Row item={e} />}</For>
                      </ul>
                    </div>
                  </div>
                </>
              );
            }}
          </Match>
        </Switch>
      </Suspense>
    </div>
  );
}

function Row(props: {
  item: { type: string; date: string; id: string; kr: string; icon: string };
}) {
  return (
    <li class="border-border flex h-fit w-fit flex-col items-center gap-1 rounded-md border p-2 shadow-sm">
      <img
        class="rounded-md"
        src={`https://pub-2d4e6c51bc9a44eeaffec2d6fadf51e9.r2.dev/vtuber/vtuber/${props.item.icon}.png`}
        alt="vtuber icon"
        loading="lazy"
      />
      <div>
        <h4 class="break-words [text-wrap:stable] [word-break:break-all]">
          {props.item.kr}
        </h4>
      </div>
    </li>
  );
}
