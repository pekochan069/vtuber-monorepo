import { createForm, Field } from "@tanstack/solid-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import { createDropzone } from "@solid-primitives/upload";
import {
  For,
  Index,
  Match,
  Show,
  Suspense,
  Switch,
  batch,
  createResource,
  createSignal,
  onMount,
} from "solid-js";

import { FieldInfo } from "~/components/field-info";
import { Button } from "~/components/ui/button";
import { TextArea } from "~/components/ui/textarea";
import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";
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
import {
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
} from "~/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerLabel,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { actions } from "astro:actions";
import { Spinner, SpinnerType } from "solid-spinner";
import { prepareImages } from "~/lib/image";
import { ImageUploadDialog } from "../image-uploader";

const LOGO_SIZES = [512, 256, 128, 64];
const prepareAgencyIcon = (file: File | null) =>
  prepareImages(file, LOGO_SIZES[0], LOGO_SIZES);

export function CreateAgencyForm() {
  const form = createForm(() => ({
    defaultValues: {
      name: "",
      jp: "",
      en: "",
      kr: "",
      description: "",
      website: "",
      createdAt: new Date().toISOString().split("T")[0],
      defunct: false,
      defunctAt: new Date().toISOString().split("T")[0],
      icon: "",
    },
    onSubmit: async ({ value }) => {
      const res = await actions.agencyCreate(value);

      if (res.status === 201) {
        setStatus("success");
      } else {
        setStatus("failed");
      }
    },
    validatorAdapter: zodValidator(),
  }));
  const [isDesktop, setIsDesktop] = createSignal(false);
  const [image, setImage] = createSignal<Blob>();
  const [baseUrl, setBaseUrl] = createSignal<string>("");
  const [usePlaceholder, setUsePlaceholder] = createSignal(false);
  const [status, setStatus] = createSignal<"idle" | "success" | "failed">(
    "idle",
  );

  onMount(() => {
    setIsDesktop(window.innerWidth >= 768);
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setStatus("idle");
        form.handleSubmit();
      }}
    >
      <div class="flex flex-col gap-2">
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
                <TextFieldLabel>Name</TextFieldLabel>
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
                <TextFieldLabel>jp</TextFieldLabel>
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
                  Copy Name
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
                <TextFieldLabel>en</TextFieldLabel>
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
                  Copy Name
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
                <TextFieldLabel>kr</TextFieldLabel>
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
                  Copy Name
                </Button>
              </TextFieldRoot>
              <FieldInfo field={field()} />
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
                <TextFieldLabel>Description</TextFieldLabel>
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
                <TextFieldLabel>Website</TextFieldLabel>
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
        <form.Field name="createdAt">
          {(field) => (
            <div>
              <div class="space-y-1">
                <label class="text-sm font-medium" for={field().name}>
                  Created At
                </label>
                <DatePicker
                  onValueChange={(value) =>
                    field().handleChange(value.valueAsString[0])
                  }
                  value={[field().state.value]}
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
        <form.Field
          name="icon"
          validators={{
            onChange: z.string().min(1, "Icon is required"),
          }}
        >
          {(field) => (
            <div class="relative mt-4">
              <ImageUploadDialog
                onUpload={(image, baseUrl) => {
                  batch(() => {
                    setImage(() => image);
                    setBaseUrl(() => baseUrl);
                    setUsePlaceholder(false);
                    field().handleChange(baseUrl);
                  });
                }}
                prepareImages={prepareAgencyIcon}
                uploadHandler={(images) =>
                  actions.agencyHandleLogoUpload({ images })
                }
                widths={LOGO_SIZES}
              />
              <div>
                <Checkbox
                  class="mt-2 flex items-center gap-2"
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
              <Show when={usePlaceholder() === false && image()}>
                <img
                  // @ts-ignore
                  src={URL.createObjectURL(image())}
                  alt="icon"
                  width={128}
                  height={128}
                  class="mx-auto mt-4 rounded-md shadow-md"
                />
              </Show>
              <Show when={usePlaceholder() === true}>
                <img
                  src="https://pub-2d4e6c51bc9a44eeaffec2d6fadf51e9.r2.dev/placeholder-128.png"
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
        <form.Field name="defunct">
          {(field) => (
            <Checkbox
              class="mt-4 flex items-center"
              onChange={(value) => field().handleChange(value)}
              value={`${field().state.value}`}
            >
              <CheckboxControl />
              <CheckboxLabel class="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Defunct
              </CheckboxLabel>
            </Checkbox>
          )}
        </form.Field>
        <form.Field name="defunctAt">
          {(field) => (
            <div
              class="hidden data-[show=true]:block"
              data-show={form.getFieldValue("defunct").valueOf()}
            >
              <div class="space-y-1">
                <label class="text-sm font-medium" for={field().name}>
                  Defunct At
                </label>
                <DatePicker
                  value={[field().state.value]}
                  onValueChange={(value) =>
                    field().handleChange(value.valueAsString[0])
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
                <Show when={state()[1]} fallback="Submit">
                  <Spinner type={SpinnerType.puff} />
                </Show>
              </Button>
            )}
          </form.Subscribe>
        </div>
        <Switch>
          <Match when={status() === "success"}>
            <div class="text-green-500">Successfully created new Agency</div>
          </Match>
          <Match when={status() === "failed"}>
            <div class="text-destructive">Failed to create new Agency</div>
          </Match>
        </Switch>
      </div>
    </form>
  );
}
