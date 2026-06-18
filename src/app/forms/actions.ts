"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createFormSchema } from "@/lib/validations/form";
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
}
