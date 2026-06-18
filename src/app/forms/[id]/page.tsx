import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { deleteForm } from "@/app/forms/actions";
import { FormEditor } from "@/components/forms/form-editor";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function FormEditPage({ params }: Props) {
  const { id } = await params;

  const form = await prisma.form.findUnique({
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

  if (!form) notFound();

  const handleDelete = async () => {
    "use server";
    await deleteForm(form.id);
  };

  return (
    <main className="mx-auto container p-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="font-heading text-3xl font-bold">{form.title}</h1>
            {form.description && (
              <p className="text-muted-foreground">{form.description}</p>
            )}
          </div>

          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href="/forms">Back to forms</Link>
            </Button>
            <form action={handleDelete}>
              <Button type="submit" variant="destructive">
                Delete
              </Button>
            </form>
          </div>
        </div>

        <FormEditor formId={form.id} initialQuestions={form.questions} />
      </div>
    </main>
  );
}
