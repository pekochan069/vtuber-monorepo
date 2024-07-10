import { actions } from "astro:actions";
import type { CalendarDate } from "@internationalized/date";
import { makeCache } from "@solid-primitives/resource";
import { For, Match, Suspense, Switch, createResource } from "solid-js";

export function CalendarContent(props: { selectedDate: CalendarDate }) {
  const month = () => props.selectedDate.month;

  const fetcher = (month: number) => actions.queryCalender(month);
  const [cachedFetcher, invalidate] = makeCache(fetcher);
  const [events, { refetch }] = createResource(month, fetcher);

  return (
    <div>
      <ul>
        <Suspense>
          <Switch>
            <Match when={events.loading}>Loading...</Match>
            <Match when={events()}>
              {(eventList) => {
                const eventOnSelectedDate = () =>
                  eventList().filter(
                    (e) =>
                      e.date.slice(3, 5) === props.selectedDate.day.toString(),
                  );

                return (
                  <For each={eventOnSelectedDate()}>
                    {(e) => (
                      <li class="flex">
                        <img
                          src={`https://pub-2d4e6c51bc9a44eeaffec2d6fadf51e9.r2.dev/vtuber/vtuber/${e.icon}.png`}
                          alt="vtuber icon"
                          width={128}
                          height={128}
                        />
                        <div class="flex flex-col">
                          <div>{e.type === "d" ? "데뷔" : "생일"}</div>
                          <div>{e.kr}</div>
                        </div>
                      </li>
                    )}
                  </For>
                );
              }}
            </Match>
          </Switch>
        </Suspense>
      </ul>
    </div>
  );
}
