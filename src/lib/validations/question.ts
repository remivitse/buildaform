import { z } from "zod";

export const QUESTION_TITLE_MAX_LENGTH = 300;

export const questionDraftSchema = z.object({
  // Existing questions carry their database id; new ones carry a client-generated
  // temporary id. The server treats any id not already in the database as new.
  id: z.string().optional(),
  title: z
    .string()
    .trim()
    .min(1, { message: "Please enter a question title." })
    .max(QUESTION_TITLE_MAX_LENGTH, {
      message: `Title must be ${QUESTION_TITLE_MAX_LENGTH} characters or fewer.`,
    }),
});

export const saveQuestionsSchema = z.array(questionDraftSchema);

export type QuestionDraft = z.infer<typeof questionDraftSchema>;
