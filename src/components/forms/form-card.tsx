import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  form: {
    id: string;
    title: string;
    description: string | null;
    _count: { questions: number };
  };
};

export function FormCard({form}: Props) {
  return (
    <Card className="gap-2 justify-between">
      <CardHeader>
        <CardTitle className="truncate">{form.title}</CardTitle>
        <CardAction>
          <Badge variant="secondary">
            {form._count.questions}{" "}
            {form._count.questions === 1 ? "question" : "questions"}
          </Badge>
        </CardAction>
      </CardHeader>
      {form.description &&
        <CardContent>
          <CardDescription className="line-clamp-2 mb-4">
            {form.description}
          </CardDescription>
        </CardContent>
      }
      <CardFooter>
        <Button className="w-full rounded-full" asChild>
          <Link href={`/forms/${form.id}`}>Edit</Link>
        </Button>
      </CardFooter>
    </Card>
  )
    ;
}