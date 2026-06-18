import { listForms } from "@/lib/data/forms";
import { FormCard } from "@/components/forms/form-card";
import { CreateFormDialog } from "@/components/forms/create-form-dialog";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";

export default async function FormsPage() {
  const forms = await listForms();

  return (
    <main className="mx-auto container p-8">
      <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">
        <h1 className="font-heading text-3xl font-bold">My Forms</h1>
        <CreateFormDialog />
      </div>

      {forms.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No forms yet</EmptyTitle>
            <EmptyDescription>
              Create your first form to get started.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] auto-rows-fr gap-6">
          {forms.map((form) => (
            <FormCard key={form.id} form={form} />
          ))}
        </div>
      )}
    </main>
  );
}