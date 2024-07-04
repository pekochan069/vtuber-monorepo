import { DatePicker, DatePickerRoot } from "@ark-ui/solid";
import {
  CalendarDate,
  getWeeksInMonth,
  isEqualDay,
} from "@internationalized/date";
import { Index, Show, createEffect, createSignal, onMount } from "solid-js";

import { CalendarCell } from "./calendar-cell";
import { CalendarController } from "./calendar-controller";

const today = new Date();
today.setHours(today.getHours() + 9);
const CURRENT_YEAR = today.getFullYear();
const CURRENT_MONTH = today.getMonth() + 1;
const CURRENT_DAY = today.getDate();
const LOCALE = "ko-KR";

export function Calendar(props: { defaultMonth: number; defaultYear: number }) {
  const [month, setMonth] = createSignal(props.defaultMonth);
  const [year, setYear] = createSignal(CURRENT_YEAR);
  const startDate = () => new CalendarDate(CURRENT_YEAR, month(), 1);
  const weeksInMonth = () => getWeeksInMonth(startDate(), LOCALE);
  const [selectedDate, setSelectedDate] = createSignal(
    props.defaultMonth === CURRENT_MONTH && props.defaultYear === CURRENT_YEAR
      ? new CalendarDate(CURRENT_YEAR, CURRENT_MONTH, CURRENT_DAY)
      : new CalendarDate(props.defaultYear, props.defaultMonth, 1),
  );

  onMount(() => {
    window.addEventListener("locationchange", () => {
      const url = new URL(window.location.href);
      let m = Number(url.searchParams.get("m"));
      if (!m || m < 1 || m > 12) {
        m = props.defaultMonth;
      }

      if (m !== month()) {
        setMonth(m);
      }

      let y = Number(url.searchParams.get("y"));
      if (!y || y < 1) {
        y = CURRENT_YEAR;
      }

      if (y !== year()) {
        setYear(y);
      }
    });

    if (month() !== props.defaultMonth) {
      setSelectedDate(new CalendarDate(CURRENT_YEAR, month(), 1));
    }

    if (year() !== props.defaultYear) {
      setYear(props.defaultYear);
    }
  });

  createEffect(() => {
    if (month() !== CURRENT_MONTH) {
      setSelectedDate(new CalendarDate(CURRENT_YEAR, month(), 1));
    } else {
      setSelectedDate(
        new CalendarDate(CURRENT_YEAR, CURRENT_MONTH, CURRENT_DAY),
      );
    }
  });

  return (
    <DatePicker.Root
      open
      closeOnSelect={false}
      locale="ko-KR"
      timeZone="Asia/Seoul"
      defaultValue={[selectedDate().toString()]}
    >
      <DatePicker.Context>
        {(context) => (
          <>
            <DatePicker.View view="day">
              <CalendarController
                currentMonth={month()}
                setMonth={setMonth}
                currentYear={year()}
                setYear={setYear}
              />

              <DatePicker.Table>
                <DatePicker.TableHead>
                  <DatePicker.TableRow>
                    <Index each={context().weekDays}>
                      {(weekDay) => (
                        <DatePicker.TableHeader>
                          {weekDay().short}
                        </DatePicker.TableHeader>
                      )}
                    </Index>
                  </DatePicker.TableRow>
                </DatePicker.TableHead>

                <DatePicker.TableBody>
                  <Index each={context().weeks}>
                    {(week) => (
                      <DatePicker.TableRow>
                        <Index each={week()}>
                          {(day) => (
                            <Show
                              when={day().month === month()}
                              fallback={<td />}
                            >
                              <CalendarCell
                                date={day()}
                                onClick={(date) => {
                                  setSelectedDate(date);
                                }}
                                isSelected={isEqualDay(day(), selectedDate())}
                              />
                            </Show>
                          )}
                        </Index>
                      </DatePicker.TableRow>
                    )}
                  </Index>
                </DatePicker.TableBody>
              </DatePicker.Table>
            </DatePicker.View>
          </>
        )}
      </DatePicker.Context>
    </DatePicker.Root>
  );
}
