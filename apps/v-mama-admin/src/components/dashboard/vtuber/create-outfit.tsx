import { actions } from "astro:actions";
import { debounce } from "@solid-primitives/scheduled";
import { TbPlus, TbX } from "solid-icons/tb";
import {
  For,
  Show,
  createEffect,
  createResource,
  createSignal,
  onMount,
} from "solid-js";
import { createStore, produce } from "solid-js/store";

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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";
import { TextField, TextFieldLabel, TextFieldRoot } from "@repo/ui/textfield";
import { CreateIllustratorForm } from "../illustrator/create-illustrator";

export function CreateOutfitForm() {
  const [outfits, setOutfits] = createStore<
    {
      id: string;
      image: Blob;
      illustratorId: string;
      illustratorName: string;
      name: string;
      presignedUrl: string;
    }[]
  >([]);

  return (
    <div>
      <CreateOutfit
        outfits={outfits}
        addOutfit={(outfit) => setOutfits(outfits.length, outfit)}
        removeOutfitAt={(index) =>
          setOutfits(produce((o) => o.splice(index, 1)))
        }
      />
    </div>
  );
}

function CreateOutfit(props: {
  outfits: {
    id: string;
    image: Blob;
    illustratorId: string;
    illustratorName: string;
    name: string;
    presignedUrl: string;
  }[];
  addOutfit: (outfits: {
    id: string;
    image: Blob;
    illustratorId: string;
    illustratorName: string;
    name: string;
    presignedUrl: string;
  }) => void;
  removeOutfitAt: (index: number) => void;
}) {
  const [openModal, setOpenModal] = createSignal(false);
  const [isDesktop, setIsDesktop] = createSignal(false);

  onMount(() => {
    setIsDesktop(window.innerWidth > 768);
  });

  return (
    <div class="flex flex-col justify-center">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>이미지</TableHead>
            <TableHead>일러스트레이터</TableHead>
            <TableHead>이름 (생략가능)</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          <For each={props.outfits}>
            {(outfit, i) => (
              <TableRow>
                <TableCell>image</TableCell>
                <TableCell>{outfit.illustratorName}</TableCell>
                <TableCell>{outfit.name}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="icon"
                    class="hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => props.removeOutfitAt(i())}
                  >
                    <TbX class="size-5" />
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </For>
        </TableBody>
      </Table>
      <div class="mt-4 flex justify-center">
        <Show
          when={isDesktop()}
          fallback={
            <MobileOutfitModal
              open={openModal()}
              setOpen={setOpenModal}
              addOutfit={props.addOutfit}
            />
          }
        >
          <DesktopOutfitModal
            open={openModal()}
            setOpen={setOpenModal}
            addOutfit={props.addOutfit}
          />
        </Show>
      </div>
      <TableCaption>의상</TableCaption>
    </div>
  );
}

function DesktopOutfitModal(props: {
  open: boolean;
  setOpen: (open: boolean) => void;
  addOutfit: (outfit: {
    id: string;
    image: Blob;
    illustratorId: string;
    illustratorName: string;
    name: string;
    presignedUrl: string;
  }) => void;
}) {
  return (
    <Dialog open={props.open} onOpenChange={(v) => props.setOpen(v)}>
      <DialogTrigger as={Button} variant="ghost" size="icon">
        <TbPlus class="size-5" />
        <span class="sr-only">일러스트레이터 추가</span>
      </DialogTrigger>
      <DialogContent class="max-w-3xl">
        <DialogHeader>
          <DialogTitle>일러스트레이터 추가</DialogTitle>
        </DialogHeader>
        <div class="py-4">
          <OutfitModal addOutfit={props.addOutfit} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MobileOutfitModal(props: {
  open: boolean;
  setOpen: (open: boolean) => void;
  addOutfit: (outfit: {
    id: string;
    image: Blob;
    illustratorId: string;
    illustratorName: string;
    name: string;
    presignedUrl: string;
  }) => void;
}) {
  return (
    <Drawer open={props.open} onOpenChange={(v) => props.setOpen(v)}>
      <DrawerTrigger as={Button} variant="ghost" size="icon">
        <TbPlus class="size-5" />
        <span class="sr-only">일러스트레이터 추가</span>
      </DrawerTrigger>
      <DrawerContent>
        <div class="mx-auto h-[60svh] w-full max-w-3xl">
          <DrawerHeader>
            <DrawerLabel>일러스트레이터 추가</DrawerLabel>
          </DrawerHeader>
          <div class="py-4">
            <OutfitModal addOutfit={props.addOutfit} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

async function queryIllustrators(query: string) {
  if (query === "") {
    return [];
  }

  return await actions.queryIllustrators(query);
}

function OutfitModal(props: {
  addOutfit: (outfit: {
    id: string;
    image: Blob;
    illustratorId: string;
    illustratorName: string;
    name: string;
    presignedUrl: string;
  }) => void;
}) {
  const [illustratorInput, setIllustratorInput] = createSignal("");
  const [illustratorQuery, setIllustratorQuery] = createSignal("");
  const trigger = debounce((value: string) => setIllustratorQuery(value), 200);
  const [illustrators] = createResource(illustratorQuery, queryIllustrators);

  const [outfit, setOutfit] = createStore<{
    name: string;
    illustratorId: string;
    image: Blob;
    presignedUrl: string;
  }>({});

  createEffect(() => {
    trigger(illustratorInput());
  });

  return (
    <div>
      <div class="space-y-4">
        <TextFieldRoot value={illustratorInput()} onChange={(value) => {}}>
          <TextFieldLabel>일러스트레이터</TextFieldLabel>
          <TextField />
        </TextFieldRoot>
      </div>
    </div>
  );
}
