import type { FieldApi } from "@tanstack/solid-form";
import { Index } from "solid-js";

import { FieldInfo } from "../field-info";
import {
  DatePickerContent,
  DatePickerContext,
  DatePickerInput,
  DatePickerRangeText,
  DatePicker as DatePickerRoot,
  DatePickerTable,
  DatePickerTableBody,
  DatePickerTableCell,
  DatePickerTableCellTrigger,
  DatePickerTableHead,
  DatePickerTableHeader,
  DatePickerTableRow,
  DatePickerView,
  DatePickerViewControl,
  DatePickerViewTrigger,
} from "../ui/date-picker";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function DatePicker(props: { field: FieldApi<any, any, any, any> }) {
  return (
    <DatePickerRoot
      onValueChange={(value) =>
        props.field.handleChange(value.valueAsString[0])
      }
      value={[props.field.state.value]}
      locale="ko-KR"
      timeZone="Asia/Seoul"
      translate="yes"
      format={(date) => `${date.year}년 ${date.month}월 ${date.day}일`}
    >
      <DatePickerInput
        placeholder="Pick a date"
        id={props.field.name}
        name={props.field.name}
        onBlur={props.field.handleBlur}
      />
      <DatePickerContent>
        <DatePickerView view="day">
          <DatePickerContext>
            {(api) => (
              <>
                <DatePickerViewControl>
                  <DatePickerViewTrigger>
                    <DatePickerRangeText />
                  </DatePickerViewTrigger>
                </DatePickerViewControl>
                <DatePickerTable>
                  <DatePickerTableHead>
                    <DatePickerTableRow>
                      <Index each={api().weekDays}>
                        {(weekDay) => (
                          <DatePickerTableHeader>
                            {weekDay().short}
                          </DatePickerTableHeader>
                        )}
                      </Index>
                    </DatePickerTableRow>
                  </DatePickerTableHead>
                  <DatePickerTableBody>
                    <Index each={api().weeks}>
                      {(week) => (
                        <DatePickerTableRow>
                          <Index each={week()}>
                            {(day) => (
                              <DatePickerTableCell value={day()}>
                                <DatePickerTableCellTrigger>
                                  {day().day}
                                </DatePickerTableCellTrigger>
                              </DatePickerTableCell>
                            )}
                          </Index>
                        </DatePickerTableRow>
                      )}
                    </Index>
                  </DatePickerTableBody>
                </DatePickerTable>
              </>
            )}
          </DatePickerContext>
        </DatePickerView>
        <DatePickerView
          view="month"
          class="w-[calc(var(--preference-width)-(0.75rem*2))]"
        >
          <DatePickerContext>
            {(api) => (
              <>
                <DatePickerViewControl>
                  <DatePickerViewTrigger>
                    <DatePickerRangeText />
                  </DatePickerViewTrigger>
                </DatePickerViewControl>
                <DatePickerTable>
                  <DatePickerTableBody>
                    <Index
                      each={api().getMonthsGrid({
                        columns: 4,
                        format: "short",
                      })}
                    >
                      {(months) => (
                        <DatePickerTableRow>
                          <Index each={months()}>
                            {(month) => (
                              <DatePickerTableCell value={month().value}>
                                <DatePickerTableCellTrigger>
                                  {month().label}
                                </DatePickerTableCellTrigger>
                              </DatePickerTableCell>
                            )}
                          </Index>
                        </DatePickerTableRow>
                      )}
                    </Index>
                  </DatePickerTableBody>
                </DatePickerTable>
              </>
            )}
          </DatePickerContext>
        </DatePickerView>
        <DatePickerView
          view="year"
          class="w-[calc(var(--preference-width)-(0.75rem*2))]"
        >
          <DatePickerContext>
            {(api) => (
              <>
                <DatePickerViewControl>
                  <DatePickerViewTrigger>
                    <DatePickerRangeText />
                  </DatePickerViewTrigger>
                </DatePickerViewControl>
                <DatePickerTable>
                  <DatePickerTableBody>
                    <Index
                      each={api().getYearsGrid({
                        columns: 4,
                      })}
                    >
                      {(years) => (
                        <DatePickerTableRow>
                          <Index each={years()}>
                            {(year) => (
                              <DatePickerTableCell value={year().value}>
                                <DatePickerTableCellTrigger>
                                  {year().label}
                                </DatePickerTableCellTrigger>
                              </DatePickerTableCell>
                            )}
                          </Index>
                        </DatePickerTableRow>
                      )}
                    </Index>
                  </DatePickerTableBody>
                </DatePickerTable>
              </>
            )}
          </DatePickerContext>
        </DatePickerView>
      </DatePickerContent>
    </DatePickerRoot>
  );
}
