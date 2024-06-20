import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { TbDeviceDesktop, TbMoon, TbSun } from "solid-icons/tb";

export function ThemeToggle() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger as={Button} variant="ghost" size="icon">
        <TbSun class="size-5 transition-transform dark:rotate-90 dark:scale-0" />
        <TbMoon class="absolute size-5 -rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-28">
        <DropdownMenuItem
          class="space-x-2"
          onSelect={() => document.documentElement.classList.remove("dark")}
        >
          <TbSun class="size-5" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          class="space-x-2"
          onSelect={() => document.documentElement.classList.add("dark")}
        >
          <TbMoon class="size-5" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          class="space-x-2"
          onSelect={() => {
            const dark = window.matchMedia(
              "(prefers-color-scheme: dark)",
            ).matches;

            document.documentElement.classList[dark ? "add" : "remove"]("dark");
          }}
        >
          <TbDeviceDesktop class="size-5" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
