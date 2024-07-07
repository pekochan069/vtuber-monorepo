import { actions } from "astro:actions";
import { createDropzone } from "@solid-primitives/upload";
import {
  Match,
  Show,
  Suspense,
  Switch,
  createEffect,
  createResource,
  createSignal,
  mergeProps,
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
import { DropdownMenu, DropdownMenuTrigger } from "@repo/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from "@repo/ui/tabs";
import { TextField, TextFieldLabel, TextFieldRoot } from "@repo/ui/textfield";

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
  defaultOpen?: "direct-upload" | "get-social-icon";
}) {
  const merged = mergeProps(
    { defaultOpen: "direct-upload" as "direct-upload" | "get-social-icon" },
    props,
  );
  const [isDesktop, setIsDesktop] = createSignal(false);

  onMount(() => {
    setIsDesktop(window.innerWidth > 768);
  });

  return (
    <Switch>
      <Match when={isDesktop()}>
        <DesktopUploader {...merged} />
      </Match>
      <Match when={!isDesktop()}>
        <MobileUploader {...merged} />
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
  defaultOpen: "direct-upload" | "get-social-icon";
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
            defaultOpen={props.defaultOpen}
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
  defaultOpen: "direct-upload" | "get-social-icon";
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
              defaultOpen={props.defaultOpen}
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
  defaultOpen: "direct-upload" | "get-social-icon";
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

  createEffect(() => {
    console.log(file());
  });

  createEffect(() => {
    console.log(image());
  });

  const [isDropping, setIsDropping] = createSignal(false);
  const [isUploading, setIsUploading] = createSignal(false);

  return (
    <div class="">
      <Tabs defaultValue={props.defaultOpen}>
        <TabsList class="mb-4 grid grid-cols-2">
          <TabsTrigger value="direct-upload">업로드</TabsTrigger>
          <TabsTrigger value="get-social-icon">아이콘 가져오기</TabsTrigger>
          {/* <TabsIndicator /> */}
        </TabsList>
        <TabsContent value="direct-upload">
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
        </TabsContent>
        <TabsContent value="get-social-icon">
          <GetSocialIcon setFile={setFile} />
        </TabsContent>
      </Tabs>
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

async function fetchImage(url: string) {
  if (url === "") return null;

  const res = await fetch(url);
  const blob = await res.blob();
  const file = new File([blob], "icon.png", { type: "image/png" });
  return file;
}

function GetSocialIcon(props: { setFile: (image: File) => void }) {
  const [handleInput, setHandleInput] = createSignal("");
  const [handle, setHandle] = createSignal("");
  const [icon] = createResource(handle, async (handle) => {
    if (handle === "") {
      return null;
    }

    return await actions.getYoutubeIcon(handle);
  });
  const [imageUrl, setImageUrl] = createSignal("");
  const [imageFile] = createResource(imageUrl, fetchImage);

  createEffect(() => {
    const i = icon();

    if (!i) return;

    if (i.ok === true) {
      setImageUrl(i.image);
    }
  });

  createEffect(() => {
    const f = imageFile();
    if (!f) return;

    props.setFile(f);
  });

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger as={Button}>아이콘 가져오기</DropdownMenuTrigger>
      </DropdownMenu>
      <TextFieldRoot
        value={handleInput()}
        onChange={(value) => setHandleInput(value)}
      >
        <TextFieldLabel>핸들</TextFieldLabel>
        <TextField placeholder="@Ado1024" />
      </TextFieldRoot>
      <button onClick={() => setHandle(handleInput())} type="button">
        유튜브 이미지 가져오기
      </button>
    </div>
  );
}
