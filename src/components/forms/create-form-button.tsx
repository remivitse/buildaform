"use client";

import { Button } from "@/components/ui/button";
import { createForm } from "@/app/forms/actions";
import { useTransition } from "react";

export function CreateFormButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      onClick={() => startTransition(() => createForm())}
      disabled={isPending}
    >
      {isPending ? "Creating…" : "New Form"}
    </Button>
  );
}