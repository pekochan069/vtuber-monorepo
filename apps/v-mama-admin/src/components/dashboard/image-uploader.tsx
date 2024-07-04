import { createDropzone } from "@solid-primitives/upload";
import {
  Match,
  Show,
  Suspense,
  Switch,
  createResource,
  createSignal,
  onMount,
} from "solid-js";
import { Spinner, SpinnerType } from "solid-spinner";

import { Button } from "@repo/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerLabel,
  DrawerTrigger,
} from "@repo/ui/drawer";

export function ImageUploadDialog(props: {
  processImage: (file: File) => Promise<Blob>;
  uploadHandler: (image: {
    size: number;
    type: string;
  }) => Promise<{ id: string; presignedUrl: string }>;
  setUploadImage: (image: {
    image: Blob;
    id: string;
    presignedUrl: string;
  }) => void;
  maxHeight: number;
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
  processImage: (file: File) => Promise<Blob>;
  uploadHandler: (image: {
    size: number;
    type: string;
  }) => Promise<{ id: string; presignedUrl: string }>;
  setUploadImage: (image: {
    image: Blob;
    id: string;
    presignedUrl: string;
  }) => void;
  maxHeight: number;
}) {
  const [open, setOpen] = createSignal(false);
  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger as={Button} variant="secondary" class="w-full">
        이미지 업로드
      </DialogTrigger>
      <DialogContent class="max-w-3xl">
        <DialogHeader>
          <DialogTitle>이미지 업로드</DialogTitle>
        </DialogHeader>
        <div class="py-4">
          <ImageUploader
            processImage={props.processImage}
            uploadHandler={props.uploadHandler}
            setUploadImage={(image) => {
              setOpen(false);
              props.setUploadImage(image);
            }}
            maxHeight={props.maxHeight}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MobileUploader(props: {
  processImage: (file: File) => Promise<Blob>;
  uploadHandler: (image: {
    size: number;
    type: string;
  }) => Promise<{ id: string; presignedUrl: string }>;
  setUploadImage: (image: {
    image: Blob;
    id: string;
    presignedUrl: string;
  }) => void;
  maxHeight: number;
}) {
  const [open, setOpen] = createSignal(false);
  return (
    <Drawer open={open()} onOpenChange={setOpen}>
      <DrawerTrigger as={Button} variant="secondary" class="w-full">
        이미지 업로드
      </DrawerTrigger>
      <DrawerContent>
        <div class="mx-auto h-[60svh] w-full max-w-3xl">
          <DrawerHeader>
            <DrawerLabel>이미지 업로드</DrawerLabel>
          </DrawerHeader>
          <div class="py-4">
            <ImageUploader
              processImage={props.processImage}
              uploadHandler={props.uploadHandler}
              setUploadImage={(image) => {
                setOpen(false);
                props.setUploadImage(image);
              }}
              maxHeight={props.maxHeight}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function ImageUploader(props: {
  processImage: (file: File) => Promise<Blob>;
  uploadHandler: (image: {
    size: number;
    type: string;
  }) => Promise<{ id: string; presignedUrl: string }>;
  setUploadImage: (image: {
    image: Blob;
    id: string;
    presignedUrl: string;
  }) => void;
  maxHeight: number;
}) {
  const [file, setFile] = createSignal<File | null>(null);
  const [image] = createResource(file, props.processImage);
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
        <span>이미지를 여기에 놓으세요</span>
        <Button as="label" type="file">
          아니면 여기를 클릭하세요
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
        <h3 class="text-lg font-semibold">이미지</h3>
        <div class="mt-6 flex min-h-32 justify-center">
          <Suspense>
            <Switch>
              <Match when={image.error}>
                <div class="text-destructive">에러: {image.error.message}</div>
              </Match>
              <Match when={image()}>
                <div class="flex items-end justify-center gap-6">
                  <img
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
              maxHeight: props.maxHeight,
              type: temp.type,
            };

            setIsUploading(true);
            props
              .uploadHandler(upload)
              .then((res) => {
                props.setUploadImage({ image: temp, ...res });
                setIsUploading(false);
              })
              .catch((err) => {
                console.error(err);
              });
            // .then(async (res) => {
            //   await fetch(res.presignedUrl, {
            //     method: "PUT",
            //     headers: {
            //       "Content-Type": "image/png",
            //     },
            //     body: temp,
            //   });
            //   props.onUpload(image()!, res.id);
            //   setIsUploading(false);
            // })
            // .catch((err) => {
            //   console.error(err);
            // });
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
