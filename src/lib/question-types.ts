import type { QuestionType } from "@prisma/client";

/**
 * Supported question types in the order they appear in the editor's type picker.
 * String literals (validated against the Prisma `QuestionType` via `satisfies`)
 * are used instead of the enum value so this module — and everything that imports
 * it — stays free of a runtime `@prisma/client` dependency and safe in the browser.
 * See `plan/choices.md` for the authoritative supported-vs-deferred list.
 */
export const QUESTION_TYPE_VALUES = [
  "SHORT_TEXT",
  "LONG_TEXT",
  "SINGLE_CHOICE",
  "MULTIPLE_CHOICE",
  "NUMBER",
  "STATEMENT",
] as const satisfies readonly QuestionType[];

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  SHORT_TEXT: "Short text",
  LONG_TEXT: "Long text",
  SINGLE_CHOICE: "Single choice",
  MULTIPLE_CHOICE: "Multiple choice",
  NUMBER: "Number",
  STATEMENT: "Statement",
};

export const QUESTION_TYPE_OPTIONS = QUESTION_TYPE_VALUES.map((value) => ({
  value,
  label: QUESTION_TYPE_LABELS[value],
}));

/** Choice-based types are the ones that own a list of `Option`s. */
export function isChoiceType(type: QuestionType): boolean {
  return type === "SINGLE_CHOICE" || type === "MULTIPLE_CHOICE";
}
