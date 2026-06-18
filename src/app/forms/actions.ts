"use server";

import { z } from "zod";
import { QuestionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createFormSchema } from "@/lib/validations/form";
import { saveQuestionsSchema, type QuestionDraft } from "@/lib/validations/question";
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
};

export type SaveFormQuestionsState = {
  questions?: SavedQuestion[];
  // Validation errors keyed by the question's index in the submitted draft.
  errors?: Record<number, string[]>;
  message?: string;
  savedAt?: number;
};

export async function saveFormQuestions(
  formId: string,
  draft: QuestionDraft[],
): Promise<SaveFormQuestionsState> {
  const parsed = saveQuestionsSchema.safeParse(draft);

  if (!parsed.success) {
    const errors: Record<number, string[]> = {};
    for (const issue of parsed.error.issues) {
      const index = issue.path[0];
      if (typeof index === "number") {
        (errors[index] ??= []).push(issue.message);
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
        select: { id: true },
      });
      const existingIds = new Set(existing.map((q) => q.id));
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

      // Persist in submitted order; `order` is derived from array position.
      for (const [index, question] of questions.entries()) {
        if (question.id && existingIds.has(question.id)) {
          await tx.question.update({
            where: { id: question.id },
            // Preserve type/required (edited in later issues); only title/order here.
            data: { title: question.title, order: index },
          });
        } else {
          await tx.question.create({
            data: {
              formId,
              title: question.title,
              order: index,
              type: QuestionType.SHORT_TEXT,
            },
          });
        }
      }

      return tx.question.findMany({
        where: { formId },
        orderBy: { order: "asc" },
        select: { id: true, title: true },
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
