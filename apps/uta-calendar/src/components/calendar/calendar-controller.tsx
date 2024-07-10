import { DatePicker } from "@ark-ui/solid";
import { buttonVariants } from "@repo/ui/button";
import { cn } from "@repo/utils/cn";
import { TbChevronLeft, TbChevronRight } from "solid-icons/tb";

export function CalendarController(props: {
  currentMonth: number;
  currentYear: number;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
}) {
  return (
    <DatePicker.ViewControl>
      <div class="flex w-full items-center justify-center gap-8">
        <DatePicker.PrevTrigger
          class={cn(
            buttonVariants({
              variant: "ghost",
            }),
            "size-10 bg-transparent p-0 opacity-50 hover:opacity-100",
          )}
          onClick={() => {
            if (props.currentMonth > 1) {
              const newMonth = props.currentMonth - 1;
              props.setMonth(newMonth);
              const url = new URL(location.href);
              url.searchParams.set("m", `${newMonth}`);

              window.history.pushState({}, "", url.toString());
            } else {
              const newYear = props.currentYear - 1;
              props.setYear(newYear);
              const newMonth = 12;
              props.setMonth(newMonth);

              const url = new URL(location.href);
              url.searchParams.set("y", `${newYear}`);
              url.searchParams.set("m", `${newMonth}`);

              window.history.pushState({}, "", url.toString());
            }
          }}
        >
          <TbChevronLeft class="size-7" />
        </DatePicker.PrevTrigger>
        <DatePicker.RangeText class="text-lg" />
        <DatePicker.NextTrigger
          class={cn(
            buttonVariants({
              variant: "ghost",
            }),
            "size-10 bg-transparent p-0 opacity-50 hover:opacity-100",
          )}
          onClick={() => {
            if (props.currentMonth < 12) {
              const newMonth = props.currentMonth + 1;
              props.setMonth(newMonth);
              const url = new URL(location.href);
              url.searchParams.set("m", `${newMonth}`);

              window.history.pushState({}, "", url.toString());
            } else {
              const newYear = props.currentYear + 1;
              props.setYear(newYear);
              const newMonth = 1;
              props.setMonth(newMonth);
              const url = new URL(location.href);
              url.searchParams.set("y", `${newYear}`);
              url.searchParams.set("m", `${newMonth}`);

              window.history.pushState({}, "", url.toString());
            }
          }}
        >
          <TbChevronRight class="size-7" />
        </DatePicker.NextTrigger>
      </div>
    </DatePicker.ViewControl>
  );
}
