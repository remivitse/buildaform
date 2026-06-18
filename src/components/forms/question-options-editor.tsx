"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { OPTION_LABEL_MAX_LENGTH } from "@/lib/validations/question";

type Option = { id: string; label: string };

type Props = {
  questionId: string;
  options: Option[];
  /** Question-level options error, e.g. "Add at least 2 options." */
  error?: string;
  /** Per-option label errors, keyed by the option's index. */
  optionErrors?: Record<number, string>;
  disabled?: boolean;
  onOptionChange: (optionId: string, label: string) => void;
  onOptionAdd: () => void;
  onOptionRemove: (optionId: string) => void;
};

export function QuestionOptionsEditor({
  questionId,
  options,
  error,
  optionErrors,
  disabled,
  onOptionChange,
  onOptionAdd,
  onOptionRemove,
}: Props) {
  const groupId = `options-${questionId}`;

  return (
    <div className="flex flex-col gap-2">
      <FieldLabel htmlFor={groupId}>Options</FieldLabel>
      <div className="flex flex-col gap-2" id={groupId}>
        {options.map((option, index) => {
          const optionError = optionErrors?.[index];
          return (
            <Field key={option.id} data-invalid={Boolean(optionError)}>
              <div className="flex items-center gap-2">
                <Input
                  value={option.label}
                  onChange={(event) => onOptionChange(option.id, event.target.value)}
                  placeholder={`Option ${index + 1}`}
                  maxLength={OPTION_LABEL_MAX_LENGTH}
                  aria-invalid={Boolean(optionError)}
                  disabled={disabled}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => onOptionRemove(option.id)}
                  disabled={disabled}
                >
                  <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                  <span className="sr-only">Remove option {index + 1}</span>
                </Button>
              </div>
              <FieldError>{optionError}</FieldError>
            </Field>
          );
        })}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="self-start"
          onClick={onOptionAdd}
          disabled={disabled}
        >
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} data-icon="inline-start" />
          Add option
        </Button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
