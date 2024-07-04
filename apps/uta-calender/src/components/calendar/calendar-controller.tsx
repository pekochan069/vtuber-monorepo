import { DatePicker } from "@ark-ui/solid";

export function CalendarController(props: {
  currentMonth: number;
  currentYear: number;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
}) {
  return (
    <DatePicker.ViewControl>
      <DatePicker.PrevTrigger
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
        Prev
      </DatePicker.PrevTrigger>
      <DatePicker.ViewTrigger>
        <DatePicker.RangeText />
      </DatePicker.ViewTrigger>
      <DatePicker.NextTrigger
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
        Next
      </DatePicker.NextTrigger>
    </DatePicker.ViewControl>
  );
}
