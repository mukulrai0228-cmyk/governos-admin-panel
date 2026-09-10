import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Ellipsis, Pencil, Plus, Trash2, UserPlus } from "lucide-react";
import { COMPANIES, DEPARTMENTS, removeEmployee, updateEmployee, type Employee } from "@/lib/org-v2-data";

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

type EmployeeFormValues = Pick<Employee, "name" | "email" | "phone" | "location"> & { company: string; department: string };

function employeeFormValues(employee: Employee): EmployeeFormValues {
  return { name: employee.name, email: employee.email, phone: employee.phone, location: employee.location, company: employee.company, department: employee.department ?? "" };
}

export function EditEmployeeDialog({ employee, onSaved }: { employee: Employee; onSaved?: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(() => employeeFormValues(employee));
  const set = (key: keyof EmployeeFormValues) => (value: string) => setForm((current) => ({ ...current, [key]: value }));

  const openEditor = (next: boolean) => {
    setOpen(next);
    if (next) setForm(employeeFormValues(employee));
  };
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) return;
    updateEmployee(employee.id, { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), location: form.location.trim(), company: form.company, department: form.department === "__none__" ? null : form.department || null });
    setOpen(false);
    onSaved?.();
    toast.success("Employee updated", { description: `${form.name.trim()} has been updated.` });
  };

  return (
    <Dialog open={open} onOpenChange={openEditor}>
      <DialogTrigger asChild><DropdownMenuItem className="text-foreground focus:text-accent-foreground" onSelect={(event) => event.preventDefault()}><Pencil className="h-4 w-4" />Edit employee</DropdownMenuItem></DialogTrigger>
      <DialogContent className="max-w-2xl rounded-2xl p-0" aria-label={`Edit ${employee.name}`}>
        <DialogHeader className="border-b border-border/70 px-6 py-5"><DialogTitle className="text-xl font-bold">Edit employee</DialogTitle></DialogHeader>
        <form onSubmit={submit}>
          <div className="grid gap-x-5 gap-y-5 px-6 py-6 sm:grid-cols-2 sm:px-7 sm:py-7">
            <Field label="Full name" full><Input required value={form.name} onChange={(event) => set("name")(event.target.value)} className={inputClass} /></Field>
            <Field label="Entity"><Select value={form.company} onValueChange={set("company")}><SelectTrigger className={inputClass}><SelectValue placeholder="Select entity" /></SelectTrigger><SelectContent>{COMPANIES.map((company) => <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>)}</SelectContent></Select></Field>
            <Field label="Department"><Select value={form.department || "__none__"} onValueChange={set("department")}><SelectTrigger className={inputClass}><SelectValue placeholder="No department" /></SelectTrigger><SelectContent><SelectItem value="__none__">No department</SelectItem>{DEPARTMENTS.filter((department) => department.company === form.company).map((department) => <SelectItem key={department.id} value={department.id}>{department.name}</SelectItem>)}</SelectContent></Select></Field>
            <Field label="Location" full><Input value={form.location} onChange={(event) => set("location")(event.target.value)} className={inputClass} /></Field>
            <Field label="Email"><Input type="email" value={form.email} onChange={(event) => set("email")(event.target.value)} className={inputClass} /></Field>
            <Field label="Phone"><Input type="tel" value={form.phone} onChange={(event) => set("phone")(event.target.value)} className={inputClass} /></Field>
          </div>
          <DialogFooter className="border-t border-border/70 px-6 py-4"><Button type="button" variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" className="rounded-xl"><Pencil className="h-4 w-4" />Save changes</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EmployeeActions({ employee, onChanged, onDeleted }: { employee: Employee; onChanged?: () => void; onDeleted?: () => void }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const confirmDelete = () => {
    removeEmployee(employee.id);
    setDeleteOpen(false);
    onDeleted?.();
    toast.success("Employee deleted", { description: `${employee.name} was removed from the directory.` });
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 rounded-full" aria-label={`Actions for ${employee.name}`} title="Employee actions"><Ellipsis className="h-4 w-4" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <EditEmployeeDialog employee={employee} onSaved={onChanged} />
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => setDeleteOpen(true)}><Trash2 className="h-4 w-4" />Delete employee</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete {employee.name}?</AlertDialogTitle><AlertDialogDescription>This will remove the employee from the directory and their profile. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={confirmDelete}>Delete employee</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
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
