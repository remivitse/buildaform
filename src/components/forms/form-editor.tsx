"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";

import {
  saveFormQuestions,
  type SavedQuestion,
} from "@/app/forms/actions";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { QuestionEditorCard } from "@/components/forms/question-editor-card";

type DraftQuestion = {
  id: string;
  title: string;
};

type Props = {
  formId: string;
  initialQuestions: SavedQuestion[];
};

export function FormEditor({ formId, initialQuestions }: Props) {
  const [questions, setQuestions] = useState<DraftQuestion[]>(initialQuestions);
  const [savedSnapshot, setSavedSnapshot] =
    useState<DraftQuestion[]>(initialQuestions);
  const [errors, setErrors] = useState<Record<number, string[]>>({});
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

  function addQuestion() {
    resetFeedback();
    setQuestions((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title: "Untitled question" },
    ]);
  }

  function updateTitle(id: string, title: string) {
    resetFeedback();
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, title } : q)),
    );
  }

  function removeQuestion(id: string) {
    resetFeedback();
    setQuestions((prev) => prev.filter((q) => q.id !== id));
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
              error={errors[index]?.[0]}
              disabled={isPending}
              onTitleChange={(title) => updateTitle(question.id, title)}
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
