import { createForm } from "@tanstack/solid-form";
import { actions } from "astro:actions";
import { z } from "zod";
import {
  batch,
  createResource,
  createSignal,
  Index,
  Match,
  Show,
  Suspense,
  Switch,
} from "solid-js";
import { createStore } from "solid-js/store";
import { zodValidator } from "@tanstack/zod-form-adapter";

import type { SocialType } from "@repo/db/schema";
import { ImageUploadDialog } from "../image-uploader";
import { CreateSocial } from "../social/create-social";
import { FieldInfo } from "~/components/field-info";
import {
  DatePicker,
  DatePickerContent,
  DatePickerContext,
  DatePickerInput,
  DatePickerRangeText,
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
} from "~/components/ui/date-picker";
import { Button } from "~/components/ui/button";
import { Spinner, SpinnerType } from "solid-spinner";
import {
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
} from "~/components/ui/checkbox";
import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";
import { prepareImage } from "~/lib/image";
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemLabel,
} from "~/components/ui/radio-group";
import { TextArea } from "~/components/ui/textarea";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger,
} from "~/components/ui/combobox";

export function CreateVtuberForm() {
  const form = createForm(() => ({
    defaultValues: {
      name: "",
      jp: "",
      en: "",
      kr: "",
      description: "",
      debut: new Date().toISOString().split("T")[0],
      retired: false,
      retiredAt: new Date().toISOString().split("T")[0],
      gender: "f",
      birthday: new Date().toISOString().split("T")[0],
      website: "",
      icon: "",
      agencyId: "",
    },
    onSubmit: async ({ value }) => {
      const transformedSocials = socials.map((social) => ({
        type: social.type.id,
        handle: social.handle,
        name: social.name === "" ? social.type.name : social.name,
      }));

      if (value.jp === "") {
        value.jp = value.name;
      }
      if (value.en === "") {
        value.en = value.name;
      }
      if (value.kr === "") {
        value.kr = value.name;
      }

      const res = await actions.vtuberCreate({
        ...value,
        socialList: transformedSocials,
      });

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("failed");
      }
    },
    validatorAdapter: zodValidator(),
  }));
  const [image, setImage] = createSignal<Blob>();
  const [baseUrl, setBaseUrl] = createSignal<string>("");
  const [usePlaceholder, setUsePlaceholder] = createSignal<boolean>(false);
  const [socials, setSocials] = createStore(
    [] as {
      type: SocialType;
      handle: string;
      name: string;
    }[],
  );

  const [agencies] = createResource(actions.agencyGetAll);
  const agencyOptions = () => {
    if (agencies()) {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      return agencies()!.map((v) => ({
        value: v.id,
        label: v.name,
      }));
    }

    return [];
  };

  const [status, setStatus] = createSignal<"idle" | "success" | "failed">(
    "idle",
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setStatus("idle");
        form.handleSubmit();
      }}
    >
      <div class="flex flex-col gap-4">
        <form.Field
          name="name"
          validators={{
            onChange: z.string().min(1),
          }}
        >
          {(field) => (
            <div>
              <TextFieldRoot
                value={field().state.value}
                onChange={(value) => field().handleChange(value)}
              >
                <TextFieldLabel>이름</TextFieldLabel>
                <TextField
                  onBlur={field().handleBlur}
                  name={field().name}
                  id={field().name}
                />
              </TextFieldRoot>
              <FieldInfo field={field()} />
            </div>
          )}
        </form.Field>
        <form.Field name="jp">
          {(field) => (
            <div>
              <TextFieldRoot
                value={field().state.value}
                onChange={(value) => field().handleChange(value)}
                class="relative"
              >
                <TextFieldLabel>일본어</TextFieldLabel>
                <TextField
                  onBlur={field().handleBlur}
                  name={field().name}
                  id={field().name}
                />
                <Button
                  class="absolute bottom-0.5 right-0.5"
                  variant="ghost"
                  type="button"
                  size="sm"
                  onClick={() =>
                    field().handleChange(
                      form.getFieldInfo("name").instance?.state.value,
                    )
                  }
                >
                  이름 복사
                </Button>
              </TextFieldRoot>
              <FieldInfo field={field()} />
            </div>
          )}
        </form.Field>
        <form.Field name="en">
          {(field) => (
            <div>
              <TextFieldRoot
                value={field().state.value}
                onChange={(value) => field().handleChange(value)}
                class="relative"
              >
                <TextFieldLabel>영어</TextFieldLabel>
                <TextField
                  onBlur={field().handleBlur}
                  name={field().name}
                  id={field().name}
                />
                <Button
                  class="absolute bottom-0.5 right-0.5"
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() =>
                    field().handleChange(
                      form.getFieldInfo("name").instance?.state.value,
                    )
                  }
                >
                  이름 복사
                </Button>
              </TextFieldRoot>
              <FieldInfo field={field()} />
            </div>
          )}
        </form.Field>
        <form.Field name="kr">
          {(field) => (
            <div>
              <TextFieldRoot
                value={field().state.value}
                onChange={(value) => field().handleChange(value)}
                class="relative"
              >
                <TextFieldLabel>한국어</TextFieldLabel>
                <TextField
                  onBlur={field().handleBlur}
                  name={field().name}
                  id={field().name}
                />
                <Button
                  class="absolute bottom-0.5 right-0.5"
                  variant="ghost"
                  type="button"
                  size="sm"
                  onClick={() =>
                    field().handleChange(
                      form.getFieldInfo("name").instance?.state.value,
                    )
                  }
                >
                  이름 복사
                </Button>
              </TextFieldRoot>
              <FieldInfo field={field()} />
            </div>
          )}
        </form.Field>
        <form.Field
          name="agencyId"
          validators={{
            onChange: z.string().min(1, "Agency is required"),
          }}
        >
          {(field) => (
            <div>
              <div class="space-y-2">
                <label class="text-sm font-medium">소속</label>
                <Combobox
                  name={field().name}
                  options={agencyOptions()}
                  optionValue="value"
                  optionTextValue="label"
                  optionLabel="label"
                  onChange={(value) => field().handleChange(value.value)}
                  itemComponent={(props) => (
                    <ComboboxItem
                      item={props.item}
                      value={props.item.rawValue.value}
                    >
                      {props.item.rawValue.label}
                    </ComboboxItem>
                  )}
                >
                  <ComboboxTrigger>
                    <ComboboxInput />
                  </ComboboxTrigger>
                  <ComboboxContent />
                </Combobox>
              </div>
              <FieldInfo field={field()} />
            </div>
          )}
        </form.Field>
        <form.Field name="gender">
          {(field) => (
            <div>
              <div class="space-y-2">
                <div class="text-sm font-medium">성별</div>
                <RadioGroup
                  value={field().state.value}
                  onChange={(value) => field().handleChange(value)}
                  class="flex flex-row"
                >
                  <RadioGroupItem value="f">
                    <RadioGroupItemLabel>여성</RadioGroupItemLabel>
                  </RadioGroupItem>
                  <RadioGroupItem value="m">
                    <RadioGroupItemLabel>남성</RadioGroupItemLabel>
                  </RadioGroupItem>
                  <RadioGroupItem value="o">
                    <RadioGroupItemLabel>이외</RadioGroupItemLabel>
                  </RadioGroupItem>
                </RadioGroup>
              </div>
              <FieldInfo field={field()} />
            </div>
          )}
        </form.Field>
        <form.Field name="debut">
          {(field) => (
            <div>
              <div class="space-y-1">
                <label class="text-sm font-medium" for={field().name}>
                  데뷔일
                </label>
                <DatePicker
                  onValueChange={(value) =>
                    field().handleChange(value.valueAsString[0])
                  }
                  value={[field().state.value]}
                  locale="ko-KR"
                  timeZone="Asia/Seoul"
                  translate="yes"
                  format={(date) =>
                    `${date.year}년 ${date.month}월 ${date.day}일`
                  }
                >
                  <DatePickerInput
                    placeholder="Pick a date"
                    id={field().name}
                    name={field().name}
                    onBlur={field().handleBlur}
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
                                          <DatePickerTableCell
                                            value={month().value}
                                          >
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
                                          <DatePickerTableCell
                                            value={year().value}
                                          >
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
                </DatePicker>
              </div>
              <FieldInfo field={field()} />
            </div>
          )}
        </form.Field>
        <form.Field name="birthday">
          {(field) => (
            <div class="space-y-2">
              <label class="text-sm font-medium" for={field().name}>
                생일
              </label>
              <DatePicker
                onValueChange={(value) =>
                  field().handleChange(value.valueAsString[0])
                }
                value={[field().state.value]}
                format={(date) => `${date.month}월 ${date.day}일`}
                locale="ko-KR"
                timeZone="Asia/Seoul"
                translate="yes"
                lang="ko-KR"
              >
                <DatePickerInput
                  placeholder="Pick a date"
                  id={field().name}
                  name={field().name}
                  onBlur={field().handleBlur}
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
                                        <DatePickerTableCell
                                          value={month().value}
                                        >
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
                </DatePickerContent>
              </DatePicker>
              <div class="text-foreground/60 text-xs">
                연도는 상관없이 날짜만 신경쓰면 됩니다
              </div>
            </div>
          )}
        </form.Field>
        <form.Field name="description">
          {(field) => (
            <div>
              <TextFieldRoot
                value={field().state.value}
                onChange={(value) => field().handleChange(value)}
              >
                <TextFieldLabel>설명</TextFieldLabel>
                <TextArea
                  onBlur={field().handleBlur}
                  name={field().name}
                  id={field().name}
                  autoResize
                  class="max-h-[118px] resize-none"
                />
              </TextFieldRoot>
              <FieldInfo field={field()} />
            </div>
          )}
        </form.Field>
        <form.Field name="website">
          {(field) => (
            <div>
              <TextFieldRoot
                value={field().state.value}
                onChange={(value) => field().handleChange(value)}
              >
                <TextFieldLabel>웹사이트</TextFieldLabel>
                <TextField
                  onBlur={field().handleBlur}
                  name={field().name}
                  id={field().name}
                  type="url"
                />
              </TextFieldRoot>
              <FieldInfo field={field()} />
            </div>
          )}
        </form.Field>
        <form.Field
          name="icon"
          validators={{
            onChange: z.string().min(1, "Icon is required"),
          }}
        >
          {(field) => (
            <div class="relative flex flex-col gap-2">
              <TextFieldRoot
                value={field().state.value}
                onChange={(value) => field().handleChange(value)}
              >
                <TextFieldLabel>아이콘 ID</TextFieldLabel>
                <TextField
                  onBlur={field().handleBlur}
                  name={field().name}
                  id={field().name}
                  disabled={usePlaceholder()}
                  placeholder="이미 이미지를 업로드했을 경우에만 직접 ID를 입력하세요"
                />
              </TextFieldRoot>
              <ImageUploadDialog
                onUpload={(image, baseUrl) => {
                  batch(() => {
                    setImage(() => image);
                    setBaseUrl(() => baseUrl);
                    setUsePlaceholder(false);
                    field().handleChange(baseUrl);
                  });
                }}
                prepareImage={(file) => prepareImage(file, 128)}
                uploadHandler={(image) =>
                  actions.vtuberHandleIconUpload({ image })
                }
                maxHeight={128}
              />
              <div>
                <Checkbox
                  class="flex items-center gap-2"
                  value={`${usePlaceholder()}`}
                  onChange={(value) => {
                    batch(() => {
                      if (value === true) {
                        field().handleChange("placeholder");
                      } else {
                        field().handleChange(baseUrl());
                      }

                      setUsePlaceholder(value);
                    });
                  }}
                >
                  <CheckboxControl />
                  <CheckboxLabel>Use Placeholder</CheckboxLabel>
                </Checkbox>
              </div>
              <Show when={usePlaceholder() === false && field().state.value}>
                <img
                  // @ts-ignore
                  src={`https://pub-2d4e6c51bc9a44eeaffec2d6fadf51e9.r2.dev/vtuber/vtuber/${field().state.value}.png`}
                  alt="icon"
                  width={128}
                  height={128}
                  class="mx-auto mt-4 rounded-md shadow-md"
                />
              </Show>
              <Show when={usePlaceholder() === true}>
                <img
                  src="https://pub-2d4e6c51bc9a44eeaffec2d6fadf51e9.r2.dev/vtuber/placeholder-128.png"
                  alt="placeholder"
                  width={128}
                  height={128}
                  class="mx-auto mt-4 rounded-md shadow-md"
                />
              </Show>
              <FieldInfo field={field()} />
            </div>
          )}
        </form.Field>
        <div>
          <CreateSocial socials={socials} onChange={setSocials} />
        </div>
        <form.Field name="retired">
          {(field) => (
            <Checkbox
              class="mt-4 flex items-center"
              onChange={(value) => field().handleChange(value)}
              value={`${field().state.value}`}
            >
              <CheckboxControl />
              <CheckboxLabel class="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                졸업여부
              </CheckboxLabel>
            </Checkbox>
          )}
        </form.Field>
        <form.Field name="retiredAt">
          {(field) => (
            <div
              class="hidden data-[show=true]:block"
              data-show={form.getFieldValue("retired").valueOf()}
            >
              <div class="space-y-1">
                <label class="text-sm font-medium" for={field().name}>
                  졸업 일자
                </label>
                <DatePicker
                  value={[field().state.value]}
                  onValueChange={(value) =>
                    field().handleChange(value.valueAsString[0])
                  }
                  locale="ko-KR"
                  timeZone="Asia/Seoul"
                  translate="yes"
                  lang="ko-KR"
                  format={(date) =>
                    `${date.year}년 ${date.month}월 ${date.day}일`
                  }
                >
                  <DatePickerInput
                    placeholder="Pick a date"
                    id={field().name}
                    name={field().name}
                    onBlur={field().handleBlur}
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
                                          <DatePickerTableCell
                                            value={month().value}
                                          >
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
                                          <DatePickerTableCell
                                            value={year().value}
                                          >
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
                </DatePicker>
              </div>
              <FieldInfo field={field()} />
            </div>
          )}
        </form.Field>
        <div class="mt-6">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {(state) => (
              <Button type="submit" disabled={!state()[0]} class="w-full">
                <Show when={state()[1]} fallback="제출">
                  <Spinner type={SpinnerType.puff} />
                </Show>
              </Button>
            )}
          </form.Subscribe>
        </div>
        <Switch>
          <Match when={status() === "success"}>
            <div class="text-green-500">성공하였습니다</div>
          </Match>
          <Match when={status() === "failed"}>
            <div class="text-destructive">실패하였습니다</div>
          </Match>
        </Switch>
      </div>
    </form>
  );
}
