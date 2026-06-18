import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deleteForm } from "@/app/forms/actions";

type Props = {
  form: {
    id: string;
    title: string;
    createdAt: Date;
    _count: { questions: number };
  };
};

export function FormCard({ form }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="truncate">{form.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary">
          {form._count.questions} {form._count.questions === 1 ? "question" : "questions"}
        </Badge>
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="text-sm text-muted-foreground">
          {new Date(form.createdAt).toLocaleDateString()}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/forms/${form.id}`}>Edit</Link>
          </Button>
          <form action={deleteForm.bind(null, form.id)}>
            <Button variant="destructive" size="sm" type="submit">
              Delete
            </Button>
          </form>
        </div>
      </CardFooter>
    </Card>
  );
}