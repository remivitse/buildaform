"use client";

import { useActionState } from "react";

import { createForm, type CreateFormState } from "@/app/forms/actions";
import {
  TITLE_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH,
} from "@/lib/validations/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialState: CreateFormState = {};

export function CreateFormDialog() {
  const [state, formAction, pending] = useActionState(createForm, initialState);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New Form</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new form</DialogTitle>
          <DialogDescription>
            Give your form a title to get started. You can change it later.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction}>
          <FieldGroup>
            <Field data-invalid={Boolean(state.errors?.title)}>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                id="title"
                name="title"
                placeholder="Untitled Form"
                maxLength={TITLE_MAX_LENGTH}
                aria-invalid={Boolean(state.errors?.title)}
                autoFocus
                required
              />
              <FieldError>{state.errors?.title?.[0]}</FieldError>
            </Field>

            <Field data-invalid={Boolean(state.errors?.description)}>
              <FieldLabel htmlFor="description">
                Description{" "}
                <span className="text-muted-foreground">(optional)</span>
              </FieldLabel>
              <Textarea
                id="description"
                name="description"
                placeholder="What is this form about?"
                maxLength={DESCRIPTION_MAX_LENGTH}
                aria-invalid={Boolean(state.errors?.description)}
              />
              <FieldError>{state.errors?.description?.[0]}</FieldError>
            </Field>

            {state.message && <FieldError>{state.message}</FieldError>}
          </FieldGroup>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? "Creating…" : "Create form"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
