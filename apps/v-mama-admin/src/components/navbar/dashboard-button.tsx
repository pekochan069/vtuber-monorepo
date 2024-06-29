import { TbArrowRight } from "solid-icons/tb";

import { Button } from "@repo/ui/button";

export function DashboardButton() {
  return (
    <Button
      as="a"
      href="/dashboard"
      variant="expandIcon"
      iconPlacement="right"
      Icon={() => <TbArrowRight />}
    >
      Dashboard
    </Button>
  );
}
