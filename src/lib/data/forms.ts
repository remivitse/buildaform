import type { QuestionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isChoiceType } from "@/lib/question-types";
import type { QuestionDraft } from "@/lib/validations/question";

/**
 * Data-access layer for forms and their questions/options. This module owns all
 * Prisma queries so server actions and route components stay free of direct
 * database access (validation/revalidation live in the actions, rendering in the
 * pages). Server-only by usage — never import it from a client component.
 */

export type SavedQuestion = {
  id: string;
  title: string;
  type: QuestionType;
  options: { id: string; label: string }[];
};

export function listForms() {
  return prisma.form.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      _count: { select: { questions: true } },
    },
  });
}

export function getFormForEditor(id: string) {
  return prisma.form.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      questions: {
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
      },
    },
  });
}

export function createForm(data: { title: string; description: string | null }) {
  return prisma.form.create({ data, select: { id: true } });
}

export function deleteForm(id: string) {
  return prisma.form.delete({ where: { id } });
}

/**
 * Persist a form's question set in a single transaction, diffing the submitted
 * draft against what is stored: questions/options absent from the draft are
 * deleted (options cascade), existing rows are updated, and new ones created.
 * Ids not already in the database are treated as new. `order` is derived from
 * array position for both questions and options. Returns the persisted rows so
 * callers can reconcile client-side temporary ids with real ones.
 */
export function saveFormQuestions(
  formId: string,
  questions: QuestionDraft[],
): Promise<SavedQuestion[]> {
  return prisma.$transaction(async (tx) => {
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
          await tx.option.deleteMany({ where: { id: { in: removedOptionIds } } });
        }
      } else {
        const created = await tx.question.create({
          data: { formId, title: question.title, type: question.type, order: index },
          select: { id: true },
        });
        questionId = created.id;
      }

      for (const [optionIndex, option] of options.entries()) {
        if (option.id && existingOptionIds.get(questionId)?.has(option.id)) {
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
}
