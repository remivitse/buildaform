import { prisma } from "@/lib/prisma";
import { FormCard } from "@/components/forms/form-card";
import { CreateFormButton } from "@/components/forms/create-form-button";

export default async function FormsPage() {
  const forms = await prisma.form.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { questions: true } } },
  });

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-heading font-bold">My Forms</h1>
        <CreateFormButton />
      </div>

      {forms.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">No forms yet.</p>
          <p className="text-sm mt-1">Create your first form to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {forms.map((form) => (
            <FormCard key={form.id} form={form} />
          ))}
        </div>
      )}
    </main>
  );
}