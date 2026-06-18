"use client";

import type { QuestionType } from "@prisma/client";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon } from "@hugeicons/core-free-icons";

import type { QuestionErrors } from "@/app/forms/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  QUESTION_TYPE_OPTIONS,
  isChoiceType,
} from "@/lib/question-types";
import { QUESTION_TITLE_MAX_LENGTH } from "@/lib/validations/question";
import { QuestionOptionsEditor } from "@/components/forms/question-options-editor";

type Option = { id: string; label: string };

type Props = {
  id: string;
  index: number;
  title: string;
  type: QuestionType;
  options: Option[];
  error?: QuestionErrors;
  disabled?: boolean;
  onTitleChange: (title: string) => void;
  onTypeChange: (type: QuestionType) => void;
  onOptionChange: (optionId: string, label: string) => void;
  onOptionAdd: () => void;
  onOptionRemove: (optionId: string) => void;
  onRemove: () => void;
};

export function QuestionEditorCard({
  id,
  index,
  title,
  type,
  options,
  error,
  disabled,
  onTitleChange,
  onTypeChange,
  onOptionChange,
  onOptionAdd,
  onOptionRemove,
  onRemove,
}: Props) {
  const titleId = `question-${id}`;
  const typeId = `question-type-${id}`;

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <Field className="flex-1" data-invalid={Boolean(error?.title)}>
            <FieldLabel htmlFor={titleId}>Question {index + 1}</FieldLabel>
            <Input
              id={titleId}
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder="Untitled question"
              maxLength={QUESTION_TITLE_MAX_LENGTH}
              aria-invalid={Boolean(error?.title)}
              disabled={disabled}
            />
            <FieldError>{error?.title}</FieldError>
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
        </div>

        <Field>
          <FieldLabel htmlFor={typeId}>Type</FieldLabel>
          <Select
            value={type}
            onValueChange={(value) => onTypeChange(value as QuestionType)}
            disabled={disabled}
          >
            <SelectTrigger id={typeId} className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {QUESTION_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        {isChoiceType(type) && (
          <QuestionOptionsEditor
            questionId={id}
            options={options}
            error={error?.options}
            optionErrors={error?.optionLabels}
            disabled={disabled}
            onOptionChange={onOptionChange}
            onOptionAdd={onOptionAdd}
            onOptionRemove={onOptionRemove}
          />
        )}
      </CardContent>
    </Card>
  );
}
