import type { SocialType } from "@repo/db/schema";
import { actions } from "astro:actions";
import { TbPlus, TbX } from "solid-icons/tb";
import { createResource, For } from "solid-js";
import { produce, type SetStoreFunction } from "solid-js/store";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { TextField, TextFieldRoot } from "~/components/ui/textfield";

export function CreateSocial(props: {
  socials: { type: SocialType; handle: string; name?: string }[];
  onChange: SetStoreFunction<
    {
      type: SocialType;
      handle: string;
      name: string;
    }[]
  >;
}) {
  const [socialTypes] = createResource(actions.socialGetAllTypes);

  return (
    <div class="flex flex-col justify-center">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-40">타입</TableHead>
            <TableHead class="w-[45%]">핸들</TableHead>
            <TableHead>이름(생략가능)</TableHead>
            <TableHead class="w-6" />
          </TableRow>
        </TableHeader>
        <TableBody>
          <For each={props.socials}>
            {(social, i) => (
              <TableRow>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      as={Button}
                      variant="outline"
                      class="w-full"
                    >
                      <div class="flex items-center gap-2">
                        <img
                          src={`/icons/${social.type.icon}`}
                          alt={social.type.name}
                          class="h-6 w-6"
                        />
                        <span>{social.type.name}</span>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <For each={socialTypes()}>
                        {(type) => (
                          <DropdownMenuItem
                            onSelect={() => {
                              props.onChange(
                                i(),
                                produce((s) => {
                                  s.type = type;
                                }),
                              );
                            }}
                          >
                            <div class="flex items-center gap-2">
                              <img
                                src={`/icons/${type.icon}`}
                                alt={type.name}
                                class="h-6 w-6"
                              />
                              <span>{type.name}</span>
                            </div>
                          </DropdownMenuItem>
                        )}
                      </For>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell>
                  <TextFieldRoot
                    value={social.handle}
                    onChange={(value) => {
                      props.onChange(
                        i(),
                        // @ts-ignore
                        produce((s) => {
                          s.handle = value;
                        }),
                      );
                    }}
                  >
                    <TextField />
                  </TextFieldRoot>
                </TableCell>
                <TableCell>
                  <TextFieldRoot
                    value={social.name}
                    onChange={(value) => {
                      props.onChange(
                        i(),
                        produce((s) => {
                          s.name = value;
                        }),
                      );
                    }}
                  >
                    <TextField />
                  </TextFieldRoot>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="icon"
                    class="hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => {
                      props.onChange(produce((s) => s.splice(i(), 1)));
                    }}
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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            props.onChange(props.socials.length, {
              // biome-ignore lint/style/noNonNullAssertion: Google is always the first social type
              type: socialTypes()![0],
              handle: "",
              name: "",
            });
          }}
        >
          <TbPlus class="size-5" />
          <span class="sr-only">소셜 추가</span>
        </Button>
      </div>
      <TableCaption>Socials</TableCaption>
    </div>
  );
}
