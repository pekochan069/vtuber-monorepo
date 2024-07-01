import { actions } from "astro:actions";
import { TbPlus, TbX } from "solid-icons/tb";
import { For, Match, Switch, createResource } from "solid-js";
import { type SetStoreFunction, produce } from "solid-js/store";

import type { SocialType } from "@repo/db/schema";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";
import { TextField, TextFieldRoot } from "@repo/ui/textfield";

const INVERT_LIST = ["x.svg", "niconico.svg"];

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
  const [socialTypes] = createResource(actions.getSocialTypes);

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
                              <Switch
                                fallback={
                                  <img
                                    src={`/icons/${type.icon}`}
                                    alt={type.name}
                                    class="h-6 w-6"
                                  />
                                }
                              >
                                <Match
                                  when={INVERT_LIST.find(
                                    (v) => v === type.icon,
                                  )}
                                >
                                  <img
                                    src={`/icons/${type.icon}`}
                                    alt={type.name}
                                    class="h-6 w-6 dark:invert"
                                  />
                                </Match>
                              </Switch>
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
