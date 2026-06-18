"use server";

import { z } from "zod";
import { createFormSchema } from "@/lib/validations/form";
import { saveQuestionsSchema } from "@/lib/validations/question";
import * as formsData from "@/lib/data/forms";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Re-exported for client components (e.g. FormEditor) that type their props
// against the persisted question shape.
export type { SavedQuestion } from "@/lib/data/forms";

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
    const form = await formsData.createForm({
      title: parsed.data.title,
      description: parsed.data.description || null,
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
  await formsData.deleteForm(formId);
  revalidatePath("/forms");
  redirect("/forms");
}

// Validation errors for a single question, split by the field they belong to so
// the UI can highlight the offending control rather than always the title.
export type QuestionErrors = {
  title?: string;
  options?: string;
  optionLabels?: Record<number, string>;
};

export type SaveFormQuestionsState = {
  questions?: formsData.SavedQuestion[];
  // Keyed by the question's index in the submitted draft.
  errors?: Record<number, QuestionErrors>;
  message?: string;
  savedAt?: number;
};

export async function saveFormQuestions(
  formId: string,
  draft: formsData.SavedQuestion[],
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

  try {
    const questions = await formsData.saveFormQuestions(formId, parsed.data);
    revalidatePath("/forms");
    revalidatePath(`/forms/${formId}`);
    return { questions, savedAt: Date.now() };
  } catch {
    return {
      message: "Something went wrong while saving. Please try again.",
    };
  }
}
