import { z } from "zod";

export const TITLE_MAX_LENGTH = 100;
export const DESCRIPTION_MAX_LENGTH = 500;

export const createFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Please enter a title." })
    .max(TITLE_MAX_LENGTH, {
      message: `Title must be ${TITLE_MAX_LENGTH} characters or fewer.`,
    }),
  description: z
    .string()
    .trim()
    .max(DESCRIPTION_MAX_LENGTH, {
      message: `Description must be ${DESCRIPTION_MAX_LENGTH} characters or fewer.`,
    })
    .optional(),
});

export type CreateFormInput = z.infer<typeof createFormSchema>;
