import { AdminShell } from "./shell";
import { Card } from "@/components/ui/card";
import { Construction } from "lucide-react";

export function AdminPlaceholder({ title }: { title: string }) {
  return (
    <AdminShell>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h1>
      </div>

      <Card className="p-16 flex flex-col items-center justify-center text-center border-dashed border-2 border-border/60 bg-muted/20 rounded-xl shadow-none">
        <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
          <Construction className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold">{title} module</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          This section is part of the BakeMate Operations System template. Wire it to your
          data source to bring it to life.
        </p>
      </Card>
    </AdminShell>
  );
}