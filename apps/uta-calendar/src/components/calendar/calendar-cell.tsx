import { DatePicker } from "@ark-ui/solid";
import {
  type CalendarDate,
  getLocalTimeZone,
  isToday,
} from "@internationalized/date";
import type { DateValue } from "@internationalized/date";
import { cn } from "@repo/utils/cn";
import { Show } from "solid-js";

export function CalendarCell(props: {
  date: DateValue;
  onClick: (date: CalendarDate) => void;
  isSelected: boolean;
}) {
  const isDateToday = isToday(props.date, getLocalTimeZone());

  return (
    <DatePicker.TableCell value={props.date} class="relative px-0.5 py-0.5">
      <DatePicker.TableCellTrigger
        class="ring-ring group aspect-square w-full rounded-md outline-none ring-offset-0 hover:ring-2"
        onClick={() => {
          props.onClick(props.date as CalendarDate);
        }}
        aria-selected={props.isSelected}
      >
        <div
          class={cn(
            "aria-selected:bg-primary aria-selected:text-primary-foreground bg-accent text-accent-foreground flex size-full items-center justify-center rounded-md text-sm font-semibold",
          )}
          aria-selected={props.isSelected}
        >
          {props.date.day}
          <Show when={isDateToday}>
            <div
              class="bg-primary aria-selected:bg-primary-foreground absolute bottom-2.5 left-1/2 size-1.5 -translate-x-1/2 translate-y-1/2 transform rounded-full sm:bottom-4 md:bottom-4"
              aria-selected={props.isSelected}
            />
          </Show>
        </div>
      </DatePicker.TableCellTrigger>
    </DatePicker.TableCell>
  );
}
