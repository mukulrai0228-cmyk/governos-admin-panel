import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type OrgSelectOption = { value: string; label: string; hint?: string };

/** Themed dropdown used across the Organization module (replaces native <select>). */
export function OrgSelect({
  label,
  value,
  onValueChange,
  options,
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: OrgSelectOption[];
  placeholder: string;
  className?: string;
}) {
  return (
    <Select value={value || "__all__"} onValueChange={(next) => onValueChange(next === "__all__" ? "" : next)}>
      <SelectTrigger
        aria-label={label}
        className={cn(
          "h-10 w-auto min-w-[190px] rounded-lg border-border/80 bg-card/80 px-3 text-sm shadow-sm backdrop-blur transition-colors hover:border-primary/40 focus:ring-2 focus:ring-ring/40 data-[state=open]:border-primary/60",
          className,
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-80 rounded-lg border-border/80 bg-popover/95 backdrop-blur">
        <SelectItem value="__all__">{placeholder}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <span className="flex flex-col items-start">
              <span>{option.label}</span>
              {option.hint && <span className="text-[11px] text-muted-foreground">{option.hint}</span>}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
