"use server";

import { z } from "zod";
import type { QuestionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createFormSchema } from "@/lib/validations/form";
import { saveQuestionsSchema, type QuestionDraft } from "@/lib/validations/question";
import { isChoiceType } from "@/lib/question-types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type CreateFormState = {
  errors?: {
    title?: string[];
    description?: string[];
  };
  message?: string;
};

export async function createForm(
  _prevState: CreateFormState,
  formData: FormData,
): Promise<CreateFormState> {
  const parsed = createFormSchema.safeParse({
    title: formData.get("title") ?? "",
    description: formData.get("description") ?? undefined,
  });

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  let formId: string;
  try {
    const form = await prisma.form.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description || null,
      },
      select: { id: true },
    });
    formId = form.id;
  } catch {
    return { message: "Something went wrong while creating the form. Please try again." };
  }

  revalidatePath("/forms");
  // redirect throws an internal control-flow error, so it must run outside the
  // try/catch above — otherwise it would be swallowed as a creation failure.
  redirect(`/forms/${formId}`);
}

export async function deleteForm(formId: string) {
  await prisma.form.delete({ where: { id: formId } });
  revalidatePath("/forms");
  redirect("/forms");
}

export type SavedQuestion = {
  id: string;
  title: string;
  type: QuestionType;
  options: { id: string; label: string }[];
};

// Validation errors for a single question, split by the field they belong to so
// the UI can highlight the offending control rather than always the title.
export type QuestionErrors = {
  title?: string;
  options?: string;
  optionLabels?: Record<number, string>;
};

export type SaveFormQuestionsState = {
  questions?: SavedQuestion[];
  // Keyed by the question's index in the submitted draft.
  errors?: Record<number, QuestionErrors>;
  message?: string;
  savedAt?: number;
};

export async function saveFormQuestions(
  formId: string,
  draft: QuestionDraft[],
): Promise<SaveFormQuestionsState> {
  const parsed = saveQuestionsSchema.safeParse(draft);

  if (!parsed.success) {
    const errors: Record<number, QuestionErrors> = {};
    for (const issue of parsed.error.issues) {
      const [questionIndex, field, optionIndex, optionField] = issue.path;
      if (typeof questionIndex !== "number") continue;
      const entry = (errors[questionIndex] ??= {});

      if (field === "title") {
        entry.title ??= issue.message;
      } else if (field === "options") {
        if (typeof optionIndex === "number" && optionField === "label") {
          (entry.optionLabels ??= {})[optionIndex] ??= issue.message;
        } else {
          entry.options ??= issue.message;
        }
      }
    }
    return {
      errors,
      message: "Some questions need attention before saving.",
    };
  }

  const questions = parsed.data;

  try {
    const saved = await prisma.$transaction(async (tx) => {
      const existing = await tx.question.findMany({
        where: { formId },
        select: { id: true, options: { select: { id: true } } },
      });
      const existingIds = new Set(existing.map((q) => q.id));
      const existingOptionIds = new Map(
        existing.map((q) => [q.id, new Set(q.options.map((o) => o.id))]),
      );
      const keptIds = new Set(
        questions
          .map((q) => q.id)
          .filter((id): id is string => !!id && existingIds.has(id)),
      );

      const removedIds = [...existingIds].filter((id) => !keptIds.has(id));
      if (removedIds.length > 0) {
        // Options cascade-delete with their question.
        await tx.question.deleteMany({ where: { id: { in: removedIds } } });
      }

      // Persist in submitted order; `order` is derived from array position for
      // both questions and their options. Only choice types keep options.
      for (const [index, question] of questions.entries()) {
        const options = isChoiceType(question.type) ? question.options : [];

        let questionId: string;
        if (question.id && existingIds.has(question.id)) {
          await tx.question.update({
            where: { id: question.id },
            data: { title: question.title, type: question.type, order: index },
          });
          questionId = question.id;

          // Sync this question's options against what's already stored.
          const priorOptionIds = existingOptionIds.get(question.id) ?? new Set();
          const keptOptionIds = new Set(
            options
              .map((o) => o.id)
              .filter((id): id is string => !!id && priorOptionIds.has(id)),
          );
          const removedOptionIds = [...priorOptionIds].filter(
            (id) => !keptOptionIds.has(id),
          );
          if (removedOptionIds.length > 0) {
            await tx.option.deleteMany({
              where: { id: { in: removedOptionIds } },
            });
          }
        } else {
          const created = await tx.question.create({
            data: { formId, title: question.title, type: question.type, order: index },
            select: { id: true },
          });
          questionId = created.id;
        }

        for (const [optionIndex, option] of options.entries()) {
          if (
            option.id &&
            existingOptionIds.get(questionId)?.has(option.id)
          ) {
            await tx.option.update({
              where: { id: option.id },
              data: { label: option.label, order: optionIndex },
            });
          } else {
            await tx.option.create({
              data: { questionId, label: option.label, order: optionIndex },
            });
          }
        }
      }

      return tx.question.findMany({
        where: { formId },
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          type: true,
          options: {
            orderBy: { order: "asc" },
            select: { id: true, label: true },
          },
        },
      });
    });

    revalidatePath("/forms");
    revalidatePath(`/forms/${formId}`);

    return { questions: saved, savedAt: Date.now() };
  } catch {
    return {
      message: "Something went wrong while saving. Please try again.",
    };
  }
}
