"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import type { QuestionType } from "@prisma/client";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";

import {
  saveFormQuestions,
  type SavedQuestion,
  type QuestionErrors,
} from "@/app/forms/actions";
import { isChoiceType } from "@/lib/question-types";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { QuestionEditorCard } from "@/components/forms/question-editor-card";

type DraftOption = { id: string; label: string };
type DraftQuestion = {
  id: string;
  title: string;
  type: QuestionType;
  options: DraftOption[];
};

type Props = {
  formId: string;
  initialQuestions: SavedQuestion[];
};

function seedChoiceOptions(): DraftOption[] {
  return [
    { id: crypto.randomUUID(), label: "Option 1" },
    { id: crypto.randomUUID(), label: "Option 2" },
  ];
}

export function FormEditor({ formId, initialQuestions }: Props) {
  const [questions, setQuestions] = useState<DraftQuestion[]>(initialQuestions);
  const [savedSnapshot, setSavedSnapshot] =
    useState<DraftQuestion[]>(initialQuestions);
  const [errors, setErrors] = useState<Record<number, QuestionErrors>>({});
  const [message, setMessage] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const isDirty = useMemo(
    () => JSON.stringify(questions) !== JSON.stringify(savedSnapshot),
    [questions, savedSnapshot],
  );

  // Any structural edit invalidates index-keyed errors from a previous attempt.
  function resetFeedback() {
    setErrors({});
    setMessage(undefined);
  }

  function updateQuestion(id: string, patch: Partial<DraftQuestion>) {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...patch } : q)),
    );
  }

  function addQuestion() {
    resetFeedback();
    setQuestions((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title: "Untitled question", type: "SHORT_TEXT", options: [] },
    ]);
  }

  function updateTitle(id: string, title: string) {
    resetFeedback();
    updateQuestion(id, { title });
  }

  function changeType(id: string, type: QuestionType) {
    resetFeedback();
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;
        if (!isChoiceType(type)) return { ...q, type, options: [] };
        // Switching to a choice type: seed two options if none exist yet.
        const options = q.options.length > 0 ? q.options : seedChoiceOptions();
        return { ...q, type, options };
      }),
    );
  }

  function removeQuestion(id: string) {
    resetFeedback();
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }

  function addOption(questionId: string) {
    resetFeedback();
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [
                ...q.options,
                { id: crypto.randomUUID(), label: `Option ${q.options.length + 1}` },
              ],
            }
          : q,
      ),
    );
  }

  function updateOption(questionId: string, optionId: string, label: string) {
    resetFeedback();
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((o) =>
                o.id === optionId ? { ...o, label } : o,
              ),
            }
          : q,
      ),
    );
  }

  function removeOption(questionId: string, optionId: string) {
    resetFeedback();
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.filter((o) => o.id !== optionId) }
          : q,
      ),
    );
  }

  function save() {
    startTransition(async () => {
      const result = await saveFormQuestions(formId, questions);
      if (result.questions) {
        setQuestions(result.questions);
        setSavedSnapshot(result.questions);
        setErrors({});
        setMessage(undefined);
      } else {
        setErrors(result.errors ?? {});
        setMessage(result.message);
      }
    });
  }

  const statusText = isPending
    ? "Saving…"
    : isDirty
      ? "Unsaved changes"
      : "All changes saved";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-semibold">Questions</h2>
        <Button type="button" variant="outline" onClick={addQuestion} disabled={isPending}>
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} data-icon="inline-start" />
          Add question
        </Button>
      </div>

      {questions.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No questions yet</EmptyTitle>
            <EmptyDescription>
              Add your first question to start building this form.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-col gap-4">
          {questions.map((question, index) => (
            <QuestionEditorCard
              key={question.id}
              id={question.id}
              index={index}
              title={question.title}
              type={question.type}
              options={question.options}
              error={errors[index]}
              disabled={isPending}
              onTitleChange={(title) => updateTitle(question.id, title)}
              onTypeChange={(type) => changeType(question.id, type)}
              onOptionChange={(optionId, label) =>
                updateOption(question.id, optionId, label)
              }
              onOptionAdd={() => addOption(question.id)}
              onOptionRemove={(optionId) => removeOption(question.id, optionId)}
              onRemove={() => removeQuestion(question.id)}
            />
          ))}
        </div>
      )}

      {message && (
        <p role="alert" className="text-sm text-destructive">
          {message}
        </p>
      )}

      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">{statusText}</span>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/forms">Cancel</Link>
          </Button>
          <Button type="button" onClick={save} disabled={isPending || !isDirty}>
            {isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
