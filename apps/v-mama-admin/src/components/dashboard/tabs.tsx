import { createSignal, onMount } from "solid-js";

import { Tabs, TabsList, TabsTrigger } from "@repo/ui/tabs";

export function DashboardTabs() {
  let tabsRef: HTMLDivElement | undefined;

  const [defaultValue, setDefaultValue] = createSignal<undefined | string>();

  onMount(() => {
    const path = window.location.pathname.split("/").pop();

    const local = localStorage.getItem("dashboard-tab");

    if (local) {
      setDefaultValue(local);

      let url = `/dashboard/${local}`;
      if (local === "home") {
        url = "/dashboard";
      }

      window.history.pushState({}, "", url);
    } else {
      if (path === "vtuber" || path === "agency" || path === "illustrator") {
        setDefaultValue(path);
      }
    }
  });

  return (
    <Tabs value={defaultValue()} ref={tabsRef}>
      <TabsList class="">
        <TabsTrigger
          as="a"
          href="/dashboard"
          value="home"
          onClick={() => {
            localStorage.setItem("dashboard-tab", "home");
          }}
        >
          Home
        </TabsTrigger>
        <TabsTrigger
          as="a"
          href="/dashboard/vtuber"
          value="vtuber"
          onClick={() => {
            localStorage.setItem("dashboard-tab", "vtuber");
          }}
        >
          Vtuber
        </TabsTrigger>
        <TabsTrigger
          as="a"
          href="/dashboard/agency"
          value="agency"
          onClick={() => {
            localStorage.setItem("dashboard-tab", "agency");
          }}
        >
          Agency
        </TabsTrigger>
        <TabsTrigger
          as="a"
          href="/dashboard/illustrator"
          value="illustrator"
          onClick={() => {
            localStorage.setItem("dashboard-tab", "illustrator");
          }}
        >
          Illustrator
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
