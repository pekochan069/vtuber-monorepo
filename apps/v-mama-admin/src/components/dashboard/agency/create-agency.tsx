import { createForm } from "@tanstack/solid-form";

export function CreateAgencyForm() {
  const form = createForm(() => ({
    defaultValues: {},
    onSubmit: async ({ value }) => {},
  }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div class=""></div>
    </form>
  );
}
