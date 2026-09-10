import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Plus, UserPlus } from "lucide-react";
import { COMPANIES, DEPARTMENTS } from "@/lib/org-v2-data";

function Field({ label, children, full }: { label: string; children: ReactNode; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <Label className="mb-1.5 block text-[13px] font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

const inputClass = "h-11 rounded-xl border-border/70 bg-background/35 backdrop-blur-md";

export function AddEmployeeDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", id: "", title: "", department: "", unit: "", location: "", email: "", phone: "" });
  const set = (key: keyof typeof form) => (value: string) => setForm((current) => ({ ...current, [key]: value }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) return;
    setOpen(false);
    setForm({ name: "", id: "", title: "", department: "", unit: "", location: "", email: "", phone: "" });
    toast.success("Employee form completed", { description: "This demo does not permanently save new records yet." });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="governos-action-button gap-1.5 rounded-lg"><UserPlus className="h-4 w-4" />Add employee</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl rounded-2xl p-0" aria-label="Add employee">
        <DialogHeader className="border-b border-border/70 px-6 py-5">
          <DialogTitle className="text-xl font-bold">Add employee</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit}>
          <div className="grid gap-x-5 gap-y-5 px-6 py-6 sm:px-7 sm:py-7 sm:grid-cols-2">
            <Field label="Full name"><Input required value={form.name} onChange={(event) => set("name")(event.target.value)} className={inputClass} /></Field>
            <Field label="Employee ID"><Input value={form.id} onChange={(event) => set("id")(event.target.value)} placeholder="Auto-generated if empty" className={inputClass} /></Field>
            <Field label="Title" full><Input value={form.title} onChange={(event) => set("title")(event.target.value)} className={inputClass} /></Field>
            <Field label="Department">
              <Select value={form.department} onValueChange={set("department")}>
                <SelectTrigger className={inputClass}><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((department) => <SelectItem key={department.id} value={department.id}>{department.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
             <Field label="Entity">
              <Select value={form.unit} onValueChange={set("unit")}>
                <SelectTrigger className={inputClass}><SelectValue placeholder="Select entity" /></SelectTrigger>
                <SelectContent>
                  {COMPANIES.map((company) => <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Location" full><Input value={form.location} onChange={(event) => set("location")(event.target.value)} className={inputClass} /></Field>
            <Field label="Email"><Input type="email" value={form.email} onChange={(event) => set("email")(event.target.value)} className={inputClass} /></Field>
            <Field label="Phone"><Input type="tel" value={form.phone} onChange={(event) => set("phone")(event.target.value)} className={inputClass} /></Field>
          </div>
          <DialogFooter className="border-t border-border/70 px-6 py-4">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="rounded-xl"><Plus className="h-4 w-4" />Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function AddDepartmentDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", entity: "", parent: "", kind: "department" });
  const set = (key: keyof typeof form) => (value: string) => setForm((current) => ({ ...current, [key]: value }));
  const parents = DEPARTMENTS.filter((department) => !form.entity || department.company === form.entity);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.entity) return;
    setOpen(false);
    setForm({ name: "", entity: "", parent: "", kind: "department" });
    toast.success("Department form completed", { description: "This demo does not permanently save new records yet." });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="governos-action-button gap-1.5 rounded-lg"><Building2 className="h-4 w-4" />Add department</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl rounded-2xl p-0" aria-label="Add department">
        <DialogHeader className="border-b border-border/70 px-6 py-5">
          <DialogTitle className="text-xl font-bold">Add department</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit}>
          <div className="grid gap-x-5 gap-y-5 px-6 py-6 sm:px-7 sm:py-7 sm:grid-cols-2">
            <Field label="Department name" full><Input required value={form.name} onChange={(event) => set("name")(event.target.value)} className={inputClass} /></Field>
            <Field label="Entity">
              <Select value={form.entity} onValueChange={(value) => { set("entity")(value); set("parent")(""); }}>
                <SelectTrigger className={inputClass}><SelectValue placeholder="Select entity" /></SelectTrigger>
                <SelectContent>
                  {COMPANIES.map((company) => <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Type">
              <Select value={form.kind} onValueChange={set("kind")}>
                <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="department">Department</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Reports under" full>
              <Select value={form.parent} onValueChange={set("parent")} disabled={!form.entity}>
                <SelectTrigger className={inputClass}><SelectValue placeholder={form.entity ? "None — top level" : "Pick an entity first"} /></SelectTrigger>
                <SelectContent>
                  {parents.map((department) => <SelectItem key={department.id} value={department.id}>{department.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <DialogFooter className="border-t border-border/70 px-6 py-4">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="rounded-xl" disabled={!form.name.trim() || !form.entity}><Plus className="h-4 w-4" />Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
