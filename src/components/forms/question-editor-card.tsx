"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon } from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { QUESTION_TITLE_MAX_LENGTH } from "@/lib/validations/question";

type Props = {
  id: string;
  index: number;
  title: string;
  error?: string;
  disabled?: boolean;
  onTitleChange: (title: string) => void;
  onRemove: () => void;
};

export function QuestionEditorCard({
  id,
  index,
  title,
  error,
  disabled,
  onTitleChange,
  onRemove,
}: Props) {
  const inputId = `question-${id}`;

  return (
    <Card>
      <CardContent className="flex items-start gap-3">
        <Field className="flex-1" data-invalid={Boolean(error)}>
          <FieldLabel htmlFor={inputId}>Question {index + 1}</FieldLabel>
          <Input
            id={inputId}
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="Untitled question"
            maxLength={QUESTION_TITLE_MAX_LENGTH}
            aria-invalid={Boolean(error)}
            disabled={disabled}
          />
          <FieldError>{error}</FieldError>
        </Field>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="mt-7 text-muted-foreground hover:text-destructive"
          onClick={onRemove}
          disabled={disabled}
        >
          <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
          <span className="sr-only">Remove question {index + 1}</span>
        </Button>
      </CardContent>
    </Card>
  );
}
