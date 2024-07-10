import { createSignal, onMount } from "solid-js";

import { Tabs, TabsList, TabsTrigger } from "@repo/ui/tabs";

export function DashboardTabs() {
  let tabsRef: HTMLDivElement | undefined;

  const [defaultValue, setDefaultValue] = createSignal<undefined | string>();

  onMount(() => {
    const path = window.location.pathname.split("/")[2];

    if (path === "vtuber" || path === "agency" || path === "illustrator") {
      setDefaultValue(path);
    }
  });

  return (
    <Tabs value={defaultValue()} ref={tabsRef}>
      <TabsList class="grid grid-cols-4 sm:block">
        <TabsTrigger
          as="a"
          href="/dashboard"
          value="home"
          onClick={(e) => e.preventDefault()}
        >
          Home
        </TabsTrigger>
        <TabsTrigger
          as="a"
          href="/dashboard/vtuber"
          value="vtuber"
          onClick={(e) => e.preventDefault()}
        >
          Vtuber
        </TabsTrigger>
        <TabsTrigger
          as="a"
          href="/dashboard/agency"
          value="agency"
          onClick={(e) => e.preventDefault()}
        >
          Agency
        </TabsTrigger>
        <TabsTrigger
          as="a"
          href="/dashboard/illustrator"
          value="illustrator"
          onClick={(e) => e.preventDefault()}
        >
          Illustrator
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
