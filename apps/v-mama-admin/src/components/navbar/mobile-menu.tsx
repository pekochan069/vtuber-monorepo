import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { TbLogout, TbMenu } from "solid-icons/tb";
import { ThemeToggle } from "./theme-toggle";
import { actions } from "astro:actions";
import { createEffect, Show } from "solid-js";

export function MobileMenu(props: {
  role: "admin" | "user";
  loggedIn: boolean;
}) {
  createEffect(() => {
    console.log(props.role);
    console.log(props.loggedIn);
  });
  return (
    <Sheet>
      <SheetTrigger as={Button} variant="ghost" size="icon">
        <TbMenu class="size-5" />
      </SheetTrigger>
      <SheetContent class="w-64">
        <div class="flex h-full flex-col justify-between">
          <div class="mt-4 flex flex-col gap-2">
            <Show when={props.loggedIn}>
              <div>
                <Button
                  as="a"
                  href="/dashboard"
                  variant="linkHover2"
                  class="text-lg"
                >
                  Dashboard
                </Button>
              </div>
              <Show when={props.role === "admin"}>
                <div>
                  <Button
                    as="a"
                    href="/create-user"
                    variant="linkHover2"
                    class="text-lg"
                  >
                    Create User
                  </Button>
                </div>
              </Show>
            </Show>
          </div>
          <div class="flex justify-between gap-4">
            <div>
              <Show when={props.loggedIn}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={async () => {
                    const response = await actions.authLogout();

                    if (response.ok) {
                      window.location.href = "/";
                    }

                    console.error("Failed to logout");
                  }}
                >
                  <TbLogout class="size-5" />
                </Button>
              </Show>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
