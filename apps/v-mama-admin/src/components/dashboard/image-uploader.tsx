import {
  createResource,
  createSignal,
  For,
  Match,
  onMount,
  Show,
  Suspense,
  Switch,
} from "solid-js";
import { createDropzone } from "@solid-primitives/upload";
import { Spinner, SpinnerType } from "solid-spinner";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerLabel,
  DrawerTrigger,
} from "../ui/drawer";

export function ImageUploadDialog(props: {
  onUpload: (image: Blob, baseUrl: string) => void;
  prepareImage: (file: File) => Promise<Blob>;
  uploadHandler: (image: {
    size: number;
    type: string;
    width: number;
  }) => Promise<{ id: string; presignedUrl: string }>;
  width: number;
}) {
  const [isDesktop, setIsDesktop] = createSignal(false);

  onMount(() => {
    setIsDesktop(window.innerWidth > 768);
  });

  return (
    <Switch>
      <Match when={isDesktop()}>
        <DesktopUploader {...props} />
      </Match>
      <Match when={!isDesktop()}>
        <MobileUploader {...props} />
      </Match>
    </Switch>
  );
}

function DesktopUploader(props: {
  onUpload: (image: Blob, baseUrl: string) => void;
  prepareImage: (file: File) => Promise<Blob>;
  uploadHandler: (image: {
    size: number;
    type: string;
    width: number;
  }) => Promise<{ id: string; presignedUrl: string }>;
  width: number;
}) {
  const [open, setOpen] = createSignal(false);
  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger as={Button} variant="secondary" class="w-full">
        Upload Logo
      </DialogTrigger>
      <DialogContent class="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
        </DialogHeader>
        <div class="py-4">
          <ImageUploader
            onUpload={(image, baseUrl) => {
              props.onUpload(image, baseUrl);
              setOpen(false);
            }}
            prepareImage={props.prepareImage}
            uploadHandler={props.uploadHandler}
            width={props.width}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MobileUploader(props: {
  onUpload: (image: Blob, baseUrl: string) => void;
  prepareImage: (file: File) => Promise<Blob>;
  uploadHandler: (image: {
    size: number;
    type: string;
    width: number;
  }) => Promise<{ id: string; presignedUrl: string }>;
  width: number;
}) {
  const [open, setOpen] = createSignal(false);
  return (
    <Drawer open={open()} onOpenChange={setOpen}>
      <DrawerTrigger as={Button} variant="secondary" class="w-full">
        Upload Logo
      </DrawerTrigger>
      <DrawerContent>
        <div class="mx-auto h-[60svh] w-full max-w-3xl">
          <DrawerHeader>
            <DrawerLabel>Upload Image</DrawerLabel>
          </DrawerHeader>
          <div class="py-4">
            <ImageUploader
              onUpload={(image, baseUrl) => {
                props.onUpload(image, baseUrl);
                setOpen(false);
              }}
              prepareImage={props.prepareImage}
              uploadHandler={props.uploadHandler}
              width={props.width}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function ImageUploader(props: {
  onUpload: (image: Blob, baseUrl: string) => void;
  prepareImage: (file: File) => Promise<Blob>;
  uploadHandler: (image: {
    size: number;
    type: string;
    width: number;
  }) => Promise<{ id: string; presignedUrl: string }>;
  width: number;
}) {
  const [file, setFile] = createSignal<File | null>(null);
  const [image] = createResource(file, props.prepareImage);
  const { setRef: dropzoneRef, files: droppedFiles } = createDropzone({
    onDrop: async (files) => {
      setIsDropping(false);
      setFile(() => files[0].file);
    },
    onDragEnter: () => {
      setIsDropping(true);
    },
    onDragLeave: () => {
      setIsDropping(false);
    },
  });

  const [isDropping, setIsDropping] = createSignal(false);
  const [isUploading, setIsUploading] = createSignal(false);

  return (
    <div>
      <div
        ref={dropzoneRef}
        class="border-foreground/50 data-[dropping=true]:border-primary flex h-32 flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed"
        data-dropping={isDropping()}
      >
        <span>Drop image here</span>
        <Button as="label" type="file">
          Or click this
          <input
            type="file"
            class="hidden"
            accept="image/*"
            onInput={(e) => {
              if (e.target.files) {
                const f = e.target.files[0];
                setFile(() => f);
              }
            }}
          />
        </Button>
      </div>
      <div class="mt-4">
        <h3 class="text-lg font-semibold">Logo</h3>
        <div class="mt-6 flex min-h-32 justify-center">
          <Suspense>
            <Switch>
              <Match when={image.error}>
                <div class="text-destructive">Error: {image.error.message}</div>
              </Match>
              <Match when={image()}>
                <div class="flex items-end justify-center gap-6">
                  <img
                    // biome-ignore lint/style/noNonNullAssertion: <explanation>
                    src={URL.createObjectURL(image()!)}
                    alt="uploaded"
                    class="rounded-md object-cover shadow-md"
                    height={128}
                  />
                </div>
              </Match>
            </Switch>
          </Suspense>
        </div>
      </div>
      <div class="mt-4">
        <Button
          disabled={isUploading()}
          class="w-full"
          onClick={() => {
            const temp = image();
            if (temp === undefined) return;

            const upload = {
              size: temp.size,
              width: props.width,
              type: temp.type,
            };

            setIsUploading(true);
            props
              .uploadHandler(upload)
              .then(async (res) => {
                await fetch(res.presignedUrl, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "image/png",
                  },
                  body: temp,
                });
                // biome-ignore lint/style/noNonNullAssertion: <explanation>
                props.onUpload(image()!, res.id);
                setIsUploading(false);
              })
              .catch((err) => {
                console.error(err);
              });
          }}
        >
          <Show when={isUploading()} fallback="Upload">
            <Spinner type={SpinnerType.puff} />
          </Show>
        </Button>
      </div>
    </div>
  );
}
