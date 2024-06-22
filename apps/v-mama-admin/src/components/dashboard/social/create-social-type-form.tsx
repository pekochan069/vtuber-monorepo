import { createForm } from "@tanstack/solid-form";
import { FieldInfo } from "~/components/field-info";
import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";
import { prepareImages } from "~/lib/image";

export function CreateSocialTypeForm() {
  const form = createForm(() => ({
    defaultValues: {
      name: "",
      url: "",
      icon: "",
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  }));

  return (
    <form>
      <form.Field name="name">
        {(field) => (
          <div>
            <TextFieldRoot
              value={field().state.value}
              onChange={(value) => field().handleChange(value)}
            >
              <TextFieldLabel>Name</TextFieldLabel>
              <TextField
                name={field().name}
                id={field().name}
                onBlur={field().handleBlur}
              />
            </TextFieldRoot>
            <FieldInfo field={field()} />
          </div>
        )}
      </form.Field>
      <form.Field name="url">
        {(field) => (
          <div>
            <TextFieldRoot
              value={field().state.value}
              onChange={(value) => field().handleChange(value)}
            >
              <TextFieldLabel>URL</TextFieldLabel>
              <TextField
                name={field().name}
                id={field().name}
                onBlur={field().handleBlur}
              />
            </TextFieldRoot>
            <FieldInfo field={field()} />
          </div>
        )}
      </form.Field>
      <form.Field name="icon">
        {(field) => (
          <div>
            <TextFieldRoot
              value={field().state.value}
              onChange={(value) => field().handleChange(value)}
            >
              <TextFieldLabel>Icon</TextFieldLabel>
              <TextField
                name={field().name}
                id={field().name}
                onBlur={field().handleBlur}
              />
            </TextFieldRoot>
            <FieldInfo field={field()} />
          </div>
        )}
      </form.Field>
    </form>
  );
}

const prepareSocialTypeIcon = (file: File | null) =>
  prepareImages(file, 32, [1]);
