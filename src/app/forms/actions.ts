"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createForm() {
  const form = await prisma.form.create({
    data: { title: "Untitled Form" },
  });
  redirect(`/forms/${form.id}`);
}

export async function deleteForm(formId: string) {
  await prisma.form.delete({ where: { id: formId } });
  revalidatePath("/forms");
}