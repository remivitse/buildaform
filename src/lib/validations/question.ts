import { z } from "zod";
import { QUESTION_TYPE_VALUES, isChoiceType } from "@/lib/question-types";

export const QUESTION_TITLE_MAX_LENGTH = 300;
export const OPTION_LABEL_MAX_LENGTH = 200;
export const MIN_CHOICE_OPTIONS = 2;

export const optionDraftSchema = z.object({
  // Existing options carry their database id; new ones carry a client-generated
  // temporary id. The server treats any id not already in the database as new.
  id: z.string().optional(),
  label: z
    .string()
    .trim()
    .min(1, { message: "Please enter an option label." })
    .max(OPTION_LABEL_MAX_LENGTH, {
      message: `Option must be ${OPTION_LABEL_MAX_LENGTH} characters or fewer.`,
    }),
});

export const questionDraftSchema = z
  .object({
    id: z.string().optional(),
    type: z.enum(QUESTION_TYPE_VALUES),
    title: z
      .string()
      .trim()
      .min(1, { message: "Please enter a question title." })
      .max(QUESTION_TITLE_MAX_LENGTH, {
        message: `Title must be ${QUESTION_TITLE_MAX_LENGTH} characters or fewer.`,
      }),
    options: z.array(optionDraftSchema).default([]),
  })
  .superRefine((question, ctx) => {
    if (isChoiceType(question.type) && question.options.length < MIN_CHOICE_OPTIONS) {
      ctx.addIssue({
        code: "custom",
        path: ["options"],
        message: `Add at least ${MIN_CHOICE_OPTIONS} options.`,
      });
    }
  });

export const saveQuestionsSchema = z.array(questionDraftSchema);

export type OptionDraft = z.infer<typeof optionDraftSchema>;
export type QuestionDraft = z.infer<typeof questionDraftSchema>;
