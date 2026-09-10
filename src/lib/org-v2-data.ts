// GOS organization dataset. Terminology: entities, departments, positions, employees.

export type Company = { id: string; name: string; kind: string; established: number; parent: string | null; country: string };
export type Department = { id: string; company: string; name: string; parent: string | null; count: number; shared?: boolean };
export type GovernanceBody = { id: string; name: string; parent: string | null; kind: "Office" | "Body" | "Committee" | "Domain" };
export type Role = { id: string; name: string; scope: "operations" | "governance"; department?: string; body?: string; grade: string; authority: string; documents: number; head?: boolean; previousHolder?: { name: string; until: string } };
export type Employee = { id: string; name: string; company: string; department: string | null; role: string | null; governanceRole: string | null; location: string; locationType: string; email: string; phone: string; manager: string | null; status: "Active" | "Needs placement"; since: number };

export const COMPANIES: Company[] = [
  { id: "ent-hold", name: "AAA Holding", kind: "Holding company", established: 1978, parent: null, country: "Saudi Arabia" },
  { id: "ent-bake", name: "Bakemate", kind: "Manufacturing", established: 1985, parent: "ent-hold", country: "Saudi Arabia" },
  { id: "ent-bakeb", name: "Bakemate Bahrain", kind: "Manufacturing", established: 2018, parent: "ent-bake", country: "Bahrain" },
  { id: "ent-bpak", name: "Bakers Point / Al Khabbazeen", kind: "Retail", established: 1995, parent: "ent-hold", country: "Saudi Arabia" },
  { id: "ent-trade", name: "AAA Trading / Abed Food", kind: "B2B trading", established: 1990, parent: "ent-hold", country: "Saudi Arabia" },
  { id: "ent-fzc", name: "Abed Foods FZC", kind: "Trading", established: 2015, parent: "ent-trade", country: "United Arab Emirates" },
  { id: "ent-cold", name: "Khadija Cold Storage", kind: "Logistics", established: 2005, parent: "ent-hold", country: "Saudi Arabia" },
  { id: "ent-contr", name: "AAA Contracting", kind: "Construction & facilities", established: 2008, parent: "ent-hold", country: "Saudi Arabia" },
  { id: "ent-trans", name: "AAA Transportation", kind: "Logistics & fleet", established: 2010, parent: "ent-hold", country: "Saudi Arabia" },
  { id: "ent-resto", name: "Restofair Saudi Arabia", kind: "Hospitality", established: 2025, parent: "ent-hold", country: "Saudi Arabia" },
];
export const ENTITIES = COMPANIES;

export const DEPARTMENTS: Department[] = [
  // AAA Holding — 16 department records, 169 placed + 3 unplaced = 172
  { id: "dep-h-exec", company: "ent-hold", name: "Executive", parent: null, count: 3 },
  { id: "dep-h-sales", company: "ent-hold", name: "Sales", parent: null, count: 3 },
  { id: "dep-h-sales-ry", company: "ent-hold", name: "Sales · Riyadh region", parent: "dep-h-sales", count: 24 },
  { id: "dep-h-sales-jd", company: "ent-hold", name: "Sales · Jeddah region", parent: "dep-h-sales", count: 21 },
  { id: "dep-h-sales-ea", company: "ent-hold", name: "Sales · Eastern region", parent: "dep-h-sales", count: 15 },
  { id: "dep-h-fin", company: "ent-hold", name: "Finance", parent: null, count: 40 },
  { id: "dep-h-sc", company: "ent-hold", name: "Supply Chain", parent: null, count: 21 },
  { id: "dep-h-hr", company: "ent-hold", name: "HR & General Administration", parent: null, count: 18 },
  { id: "dep-h-tech", company: "ent-hold", name: "Technology", parent: null, count: 5 },
  { id: "dep-h-tech-app", company: "ent-hold", name: "Technology · Applications", parent: "dep-h-tech", count: 3 },
  { id: "dep-h-log", company: "ent-hold", name: "Logistics", parent: null, count: 4 },
  { id: "dep-h-wh", company: "ent-hold", name: "Warehouses", parent: null, count: 3 },
  { id: "dep-h-cs", company: "ent-hold", name: "Customer Service", parent: null, count: 3 },
  { id: "dep-h-mkt", company: "ent-hold", name: "Marketing", parent: null, count: 3 },
  { id: "dep-h-leg", company: "ent-hold", name: "Legal", parent: null, count: 2 },
  { id: "dep-h-mnt", company: "ent-hold", name: "Maintenance", parent: null, count: 1 },
  // Bakemate — 88
  { id: "dep-b-prod", company: "ent-bake", name: "Production Operations", parent: null, count: 31 },
  { id: "dep-b-wh", company: "ent-bake", name: "Warehouses", parent: null, count: 12 },
  { id: "dep-b-rnd", company: "ent-bake", name: "R&D & Innovation", parent: null, count: 9 },
  { id: "dep-b-sc", company: "ent-bake", name: "Supply Chain", parent: null, count: 8 },
  { id: "dep-b-qa", company: "ent-bake", name: "Quality Assurance", parent: null, count: 7, shared: true },
  { id: "dep-b-fin", company: "ent-bake", name: "Finance", parent: null, count: 6 },
  { id: "dep-b-mnt", company: "ent-bake", name: "Maintenance", parent: null, count: 6 },
  { id: "dep-b-hr", company: "ent-bake", name: "HR & General Administration", parent: null, count: 5 },
  { id: "dep-b-sales", company: "ent-bake", name: "Sales", parent: null, count: 4 },
  // Bakers Point — 127 placed + 2 unplaced = 129
  { id: "dep-p-ret", company: "ent-bpak", name: "Retail", parent: null, count: 69 },
  { id: "dep-p-sales", company: "ent-bpak", name: "Sales", parent: null, count: 18 },
  { id: "dep-p-log", company: "ent-bpak", name: "Logistics", parent: null, count: 9 },
  { id: "dep-p-fin", company: "ent-bpak", name: "Finance", parent: null, count: 8 },
  { id: "dep-p-wh", company: "ent-bpak", name: "Warehouses", parent: null, count: 8 },
  { id: "dep-p-hr", company: "ent-bpak", name: "HR & General Administration", parent: null, count: 6 },
  { id: "dep-p-mkt", company: "ent-bpak", name: "Marketing", parent: null, count: 5 },
  { id: "dep-p-cs", company: "ent-bpak", name: "Customer Service", parent: null, count: 4 },
  // Khadija Cold Storage — 90
  { id: "dep-k-wh", company: "ent-cold", name: "Warehouses", parent: null, count: 44 },
  { id: "dep-k-log", company: "ent-cold", name: "Logistics", parent: null, count: 22 },
  { id: "dep-k-mnt", company: "ent-cold", name: "Maintenance", parent: null, count: 9 },
  { id: "dep-k-qa", company: "ent-cold", name: "Quality Assurance", parent: null, count: 6, shared: true },
  { id: "dep-k-fin", company: "ent-cold", name: "Finance", parent: null, count: 4 },
  { id: "dep-k-hr", company: "ent-cold", name: "HR & General Administration", parent: null, count: 3 },
  { id: "dep-k-sales", company: "ent-cold", name: "Sales", parent: null, count: 2 },
  // AAA Contracting — 48 placed + 2 unplaced = 50
  { id: "dep-c-mnt", company: "ent-contr", name: "Maintenance", parent: null, count: 14 },
  { id: "dep-c-wh", company: "ent-contr", name: "Warehouses", parent: null, count: 14 },
  { id: "dep-c-sc", company: "ent-contr", name: "Supply Chain", parent: null, count: 6 },
  { id: "dep-c-fin", company: "ent-contr", name: "Finance", parent: null, count: 5 },
  { id: "dep-c-hr", company: "ent-contr", name: "HR & General Administration", parent: null, count: 4 },
  { id: "dep-c-tech", company: "ent-contr", name: "Technology", parent: null, count: 3 },
  { id: "dep-c-qa", company: "ent-contr", name: "Quality Assurance", parent: null, count: 2, shared: true },
  // AAA Transportation — 82
  { id: "dep-t-log", company: "ent-trans", name: "Logistics", parent: null, count: 51 },
  { id: "dep-t-mnt", company: "ent-trans", name: "Maintenance", parent: null, count: 12 },
  { id: "dep-t-wh", company: "ent-trans", name: "Warehouses", parent: null, count: 8 },
  { id: "dep-t-fin", company: "ent-trans", name: "Finance", parent: null, count: 5 },
  { id: "dep-t-hr", company: "ent-trans", name: "HR & General Administration", parent: null, count: 3 },
  { id: "dep-t-cs", company: "ent-trans", name: "Customer Service", parent: null, count: 3 },
];

export const GOVERNANCE: GovernanceBody[] = [
  { id: "gov-chair", name: "Chairman", parent: null, kind: "Office" },
  { id: "gov-board", name: "Board of Directors", parent: "gov-chair", kind: "Body" },
  { id: "gov-audit", name: "Audit Committee", parent: "gov-board", kind: "Committee" },
  { id: "gov-risk", name: "Risk & Compliance Committee", parent: "gov-board", kind: "Committee" },
  { id: "gov-ceo", name: "Chief Executive Officer", parent: "gov-board", kind: "Office" },
  { id: "gov-dh-fin", name: "Domain Head · Finance", parent: "gov-ceo", kind: "Domain" },
  { id: "gov-dh-tech", name: "Domain Head · Technology", parent: "gov-ceo", kind: "Domain" },
  { id: "gov-dh-sc", name: "Domain Head · Supply Chain", parent: "gov-ceo", kind: "Domain" },
  { id: "gov-dh-hr", name: "Domain Head · People", parent: "gov-ceo", kind: "Domain" },
  { id: "gov-dh-leg", name: "Domain Head · Legal", parent: "gov-ceo", kind: "Domain" },
];

export const GRADE_LABELS: Record<string, string> = {
  A: "A · Executive",
  B: "B · Senior Leadership",
  C: "C · Management",
  D: "D · Senior Professional",
  E: "E · Professional",
  F: "F · Supervisory",
  G: "G · General / Operations",
};

const GRADE_OF_TITLE: Record<string, string> = {};
const registerGrade = (grade: string, titles: string[]) => titles.forEach((title) => { GRADE_OF_TITLE[title] = grade; });
registerGrade("A", ["Chairman and President of the Board", "Chief Executive Officer"]);
registerGrade("B", ["Business Director", "Domain Head of Finance", "Domain Head of Technology", "Domain Head of Supply Chain", "Domain Head of People", "Domain Head of Legal", "Chair of the Audit Committee", "Chair of the Risk Committee", "Board Member"]);
registerGrade("C", ["Finance Manager", "Sales Manager", "Supply Chain Manager", "HR Manager", "IT Manager", "Logistics Manager", "National Warehouse Manager", "Customer Service Manager", "Marketing Manager", "Head of Legal", "Maintenance Manager", "Production Manager", "Head of R&D", "Quality Manager", "Retail Operations Manager", "Executive Secretary"]);
registerGrade("D", ["Regional Sales Manager", "Applications Lead", "Distribution Manager", "Branch Supervisor", "Warehouse Supervisor", "Line Supervisor", "Collection Supervisor", "Showroom In Charge"]);
registerGrade("E", ["Accountant", "Branch Accountant", "Treasury Officer", "Financial Analyst", "ERP Analyst", "SAP Consultant", "Systems Administrator", "Network Engineer", "Procurement Officer", "Demand Planner", "Distribution Specialist", "Food Technologist", "Product Developer", "Quality Inspector", "Food Safety Officer", "Contracts Officer", "HR Officer", "Government Relations Officer", "Marketing Specialist", "Brand Coordinator"]);
registerGrade("F", ["Collection Officer", "Sales Executive", "Fleet Coordinator", "Dispatcher", "Inventory Controller", "Maintenance Planner", "Service Coordinator", "B2B Customer Service"]);
registerGrade("G", ["Salesman", "Driver", "Storekeeper", "Forklift Operator", "Welder Steel Fabricator", "Electrician", "Maintenance Technician", "Production Operator", "Packaging Operator", "Retail Associate", "Cashier", "Call Centre Agent", "Cleaner"]);

const AUTHORITY: Record<string, string> = { A: "Unlimited", B: "Up to SAR 1,000,000", C: "Up to SAR 250,000", D: "Up to SAR 50,000", E: "None", F: "None", G: "None" };
const gradeCode = (title: string) => GRADE_OF_TITLE[title] ?? "G";
const gradeLabel = (title: string) => GRADE_LABELS[gradeCode(title)];
const authorityOf = (title: string) => AUTHORITY[gradeCode(title)];

const DEPARTMENT_TITLES: Record<string, string[]> = {
  Executive: ["Chairman and President of the Board", "Chief Executive Officer", "Business Director"],
  Sales: ["Sales Manager", "Sales Executive", "Collection Officer", "Branch Supervisor", "Salesman"],
  "Sales · region": ["Regional Sales Manager", "Sales Executive", "Collection Officer", "Salesman"],
  Finance: ["Finance Manager", "Accountant", "Branch Accountant", "Treasury Officer", "Financial Analyst"],
  "Supply Chain": ["Supply Chain Manager", "Distribution Manager", "Distribution Specialist", "Procurement Officer", "Demand Planner"],
  "HR & General Administration": ["HR Manager", "HR Officer", "Executive Secretary", "Government Relations Officer"],
  Technology: ["IT Manager", "Systems Administrator", "Network Engineer"],
  "Technology · Applications": ["Applications Lead", "ERP Analyst", "SAP Consultant"],
  Logistics: ["Logistics Manager", "Fleet Coordinator", "Dispatcher", "Driver"],
  Warehouses: ["National Warehouse Manager", "Warehouse Supervisor", "Inventory Controller", "Storekeeper", "Forklift Operator", "Welder Steel Fabricator"],
  "Customer Service": ["Customer Service Manager", "Service Coordinator", "B2B Customer Service", "Call Centre Agent"],
  Marketing: ["Marketing Manager", "Marketing Specialist", "Brand Coordinator"],
  Legal: ["Head of Legal", "Contracts Officer"],
  Maintenance: ["Maintenance Manager", "Maintenance Planner", "Maintenance Technician", "Electrician"],
  "Production Operations": ["Production Manager", "Line Supervisor", "Production Operator", "Packaging Operator"],
  "R&D & Innovation": ["Head of R&D", "Food Technologist", "Product Developer"],
  "Quality Assurance": ["Quality Manager", "Quality Inspector", "Food Safety Officer"],
  Retail: ["Retail Operations Manager", "Showroom In Charge", "Retail Associate", "Cashier"],
};
const titlesFor = (name: string) => DEPARTMENT_TITLES[name.startsWith("Sales · ") ? "Sales · region" : name] ?? ["Department Manager", "Officer"];

type LocationRecord = { name: string; type: string };
export const LOCATIONS: Record<string, LocationRecord[]> = {
  "ent-hold": [
    { name: "Riyadh Head Quarters", type: "Office" }, { name: "Jeddah Head Quarters", type: "Office" }, { name: "Riyadh Branch", type: "Branch" },
    { name: "Jeddah Branch", type: "Branch" }, { name: "Makkah Branch", type: "Branch" }, { name: "Madina Branch", type: "Branch" },
    { name: "Hail Branch", type: "Branch" }, { name: "Khamis Branch", type: "Branch" }, { name: "Al Hassa Branch", type: "Branch" },
    { name: "Hafr Al Batin Branch", type: "Branch" }, { name: "Qassim Branch", type: "Branch" },
  ],
  "ent-bake": [{ name: "Bakemate Factory FP&Y", type: "Plant" }, { name: "Bakemate Factory Line 2", type: "Plant" }, { name: "Bakemate Head Office", type: "Office" }],
  "ent-bakeb": [{ name: "Manama Plant", type: "Plant" }],
  "ent-bpak": [
    { name: "Riyadh Showroom · Dabbab", type: "Showroom" }, { name: "Qassim Showroom · Buraida 3", type: "Showroom" }, { name: "Al Qunfudhah Showroom", type: "Showroom" },
    { name: "Jeddah Showroom · Souq 7", type: "Showroom" }, { name: "Madina Showroom", type: "Showroom" }, { name: "Bakers Point Head Office", type: "Office" },
  ],
  "ent-trade": [{ name: "Riyadh Trading Office", type: "Office" }],
  "ent-fzc": [{ name: "Dubai Office", type: "Office" }],
  "ent-cold": [{ name: "Central Warehouse", type: "Warehouse" }, { name: "Khamis Warehouse", type: "Warehouse" }, { name: "Jeddah Warehouse", type: "Warehouse" }, { name: "Dammam Cold Store", type: "Warehouse" }],
  "ent-contr": [{ name: "Engineering Maintenance Jeddah", type: "Branch" }, { name: "Riyadh Works Yard", type: "Plant" }, { name: "Contracting Head Office", type: "Office" }],
  "ent-trans": [{ name: "Riyadh Fleet Depot", type: "Warehouse" }, { name: "Dammam Fleet Depot", type: "Warehouse" }, { name: "Jeddah Transport Yard", type: "Plant" }, { name: "Madina Transport Branch", type: "Branch" }],
  "ent-resto": [{ name: "Riyadh Head Quarters", type: "Office" }],
};

const FIRST_NAMES = ["Aamir", "Abdulaziz", "Abdulhameed", "Abdullah", "Abdulrahman", "Adham", "Ahmed", "Ali", "Amina", "Amjad", "Anas", "Basim", "Bilal", "Dana", "Danish", "Faisal", "Farhan", "Fatima", "Ghassan", "Hamza", "Hassan", "Huda", "Ibrahim", "Imran", "Jakir", "Javed", "Kamal", "Khalid", "Layla", "Maha", "Mahmoud", "Majed", "Mansour", "Mariam", "Mohannad", "Mustafa", "Nabil", "Nadia", "Naveed", "Nawaf", "Noura", "Omar", "Rania", "Rashid", "Riajul", "Saad", "Salman", "Samir", "Sara", "Saud", "Shahid", "Sultan", "Sunam", "Tariq", "Turki", "Usman", "Waleed", "Yasir", "Younis", "Zaid"];
const SURNAMES = ["Abed", "Ahmed", "Alaidarous", "Al-Bilali", "Alkhamis", "Alkurdi", "Almahud", "Al-Saiari", "Alshamari", "Alsubaie", "Anayet Ullah", "Aslam", "Basudan", "Dirab", "Farooq", "Habib", "Harbi", "Hassan", "Islam", "Jaber", "Khan", "Malik", "Masahud", "Mohamed", "Mutairi", "Nasser", "Omer", "Orabi", "Otaibi", "Qahtani", "Qureshi", "Rahman", "Saleh", "Sattar", "Shaikh", "Sharif", "Shehri", "Siddiqui", "Sultan", "Tamimi", "Zahrani", "Ghamdi", "Balawi", "Juhani", "Dosari", "Rashidi", "Anazi", "Salami", "Amoudi", "Bakri", "Hamdan", "Yousef", "Karim", "Nawaz", "Hussain", "Iqbal", "Latif", "Munir", "Rafiq", "Waheed"];

const VACANT_HEADS: Record<string, string> = {
  "dep-h-tech-app": "Applications Lead",
  "dep-h-sales": "Sales Manager",
  "dep-k-wh": "National Warehouse Manager",
  "dep-b-qa": "Quality Manager",
};

const GOVERNANCE_POSITIONS: { id: string; name: string; body: string; documents: number; vacant?: boolean; previousHolder?: { name: string; until: string } }[] = [
  { id: "pos-gov-chair", name: "Chairman and President of the Board", body: "gov-chair", documents: 6 },
  { id: "pos-gov-board-1", name: "Board Member", body: "gov-board", documents: 0 },
  { id: "pos-gov-board-2", name: "Board Member", body: "gov-board", documents: 0 },
  { id: "pos-gov-board-3", name: "Board Member", body: "gov-board", documents: 0 },
  { id: "pos-gov-board-4", name: "Board Member", body: "gov-board", documents: 0 },
  { id: "pos-gov-board-5", name: "Board Member", body: "gov-board", documents: 0 },
  { id: "pos-gov-audit", name: "Chair of the Audit Committee", body: "gov-audit", documents: 9, vacant: true, previousHolder: { name: "Khalid Qahtani", until: "March 2026" } },
  { id: "pos-gov-risk", name: "Chair of the Risk Committee", body: "gov-risk", documents: 4, vacant: true, previousHolder: { name: "Rania Al-Saiari", until: "January 2026" } },
  { id: "pos-gov-ceo", name: "Chief Executive Officer", body: "gov-ceo", documents: 14 },
  { id: "pos-gov-fin", name: "Domain Head of Finance", body: "gov-dh-fin", documents: 21 },
  { id: "pos-gov-tech", name: "Domain Head of Technology", body: "gov-dh-tech", documents: 17 },
  { id: "pos-gov-sc", name: "Domain Head of Supply Chain", body: "gov-dh-sc", documents: 12 },
  { id: "pos-gov-hr", name: "Domain Head of People", body: "gov-dh-hr", documents: 8 },
  { id: "pos-gov-leg", name: "Domain Head of Legal", body: "gov-dh-leg", documents: 11, vacant: true, previousHolder: { name: "Tariq Malik", until: "June 2026" } },
];

const UNPLACED: [string, number][] = [["ent-hold", 3], ["ent-bpak", 2], ["ent-contr", 2]];

function rng(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}
const deaccent = (value: string) => value.toLowerCase().normalize("NFD").replace(/[^a-z]/g, "");

function buildOrganization() {
  const random = rng(20260902);
  const roles: Role[] = [];
  const employees: Employee[] = [];
  let employeeNumber = 11000000;
  let positionNumber = 0;
  const usedNames = new Set<string>();

  const nextName = () => {
    for (let attempt = 0; attempt < 200; attempt++) {
      const first = FIRST_NAMES[Math.floor(random() * FIRST_NAMES.length)];
      const last = SURNAMES[Math.floor(random() * SURNAMES.length)];
      const full = `${first} ${last}`;
      if (!usedNames.has(full) || attempt === 199) { usedNames.add(full); return { first, last, full }; }
    }
    return { first: "Ahmed", last: "Abed", full: "Ahmed Abed" };
  };

  const makePosition = (title: string, departmentId: string, head: boolean): Role => {
    const position: Role = { id: `pos-${++positionNumber}`, name: title, scope: "operations", department: departmentId, grade: gradeLabel(title), authority: authorityOf(title), documents: 0, head };
    roles.push(position);
    return position;
  };

  const makeEmployee = (companyId: string, departmentId: string | null, positionId: string | null): Employee => {
    const { first, last, full } = nextName();
    const options = LOCATIONS[companyId] ?? LOCATIONS["ent-hold"];
    const place = options[Math.floor(random() * options.length)];
    const employee: Employee = {
      id: String(++employeeNumber),
      name: full,
      company: companyId,
      department: departmentId,
      role: positionId,
      governanceRole: null,
      location: place.name,
      locationType: place.type,
      email: `${deaccent(first)}.${deaccent(last)}@aaa-group.com`,
      phone: `+966 5${String(10000000 + Math.floor(random() * 89999999))}`,
      manager: null,
      status: departmentId ? "Active" : "Needs placement",
      since: 2008 + Math.floor(random() * 18),
    };
    employees.push(employee);
    return employee;
  };

  const headEmployeeOf: Record<string, Employee | null> = {};

  // Executive department is fixed.
  const executive = DEPARTMENTS.find((item) => item.id === "dep-h-exec")!;
  const execTitles = titlesFor(executive.name);
  const execEmployees = execTitles.map((title) => {
    const position = makePosition(title, executive.id, title === "Business Director");
    return makeEmployee(executive.company, executive.id, position.id);
  });
  const [chairman, chief, businessDirector] = execEmployees;
  chairman.manager = null;
  chief.manager = chairman.id;
  businessDirector.manager = chief.id;
  headEmployeeOf[executive.id] = businessDirector;

  for (const department of DEPARTMENTS) {
    if (department.id === "dep-h-exec") continue;
    const titles = titlesFor(department.name);
    const headTitle = titles[0];
    const vacantHead = VACANT_HEADS[department.id] === headTitle;
    const headPosition = makePosition(headTitle, department.id, true);
    if (vacantHead) headPosition.previousHolder = { name: `${FIRST_NAMES[(positionNumber * 7) % FIRST_NAMES.length]} ${SURNAMES[(positionNumber * 11) % SURNAMES.length]}`, until: "earlier this year" };
    let head: Employee | null = null;
    if (!vacantHead) head = makeEmployee(department.company, department.id, headPosition.id);
    headEmployeeOf[department.id] = head;

    const staffTitles = titles.slice(1);
    const staffCount = department.count - (head ? 1 : 0);
    for (let index = 0; index < staffCount; index++) {
      const title = staffTitles.length ? staffTitles[index % staffTitles.length] : headTitle;
      const position = makePosition(title, department.id, false);
      makeEmployee(department.company, department.id, position.id);
    }
  }

  // Reporting lines.
  const resolveManager = (department: Department): Employee | null => {
    let current: Department | undefined = department;
    while (current) {
      const head = headEmployeeOf[current.id];
      if (head) return head;
      current = DEPARTMENTS.find((item) => item.id === current!.parent);
    }
    return businessDirector;
  };

  for (const employee of employees) {
    if (!employee.department || employee.department === "dep-h-exec") continue;
    const department = DEPARTMENTS.find((item) => item.id === employee.department)!;
    const head = headEmployeeOf[department.id];
    if (head && head.id === employee.id) {
      const parent = DEPARTMENTS.find((item) => item.id === department.parent);
      employee.manager = (parent ? resolveManager(parent) : businessDirector)?.id ?? businessDirector.id;
    } else {
      employee.manager = (head ?? resolveManager(department))?.id ?? businessDirector.id;
    }
  }

  // Governance positions.
  for (const item of GOVERNANCE_POSITIONS) {
    roles.push({ id: item.id, name: item.name, scope: "governance", body: item.body, grade: gradeLabel(item.name), authority: authorityOf(item.name), documents: item.documents, previousHolder: item.previousHolder });
  }

  const assignGovernance = (employee: Employee | undefined | null, positionId: string) => { if (employee) employee.governanceRole = positionId; };
  assignGovernance(chairman, "pos-gov-chair");
  assignGovernance(chief, "pos-gov-ceo");
  assignGovernance(headEmployeeOf["dep-h-fin"], "pos-gov-fin");
  assignGovernance(headEmployeeOf["dep-h-tech"], "pos-gov-tech");
  assignGovernance(headEmployeeOf["dep-h-sc"], "pos-gov-sc");
  assignGovernance(headEmployeeOf["dep-h-hr"], "pos-gov-hr");

  const boardCandidates = employees.filter((employee) => employee.company === "ent-hold" && !employee.governanceRole && employee.department && employee.department !== "dep-h-exec");
  ["pos-gov-board-1", "pos-gov-board-2", "pos-gov-board-3", "pos-gov-board-4", "pos-gov-board-5"].forEach((positionId, index) => {
    assignGovernance(boardCandidates[index * 7], positionId);
  });

  // Employees on payroll with no department.
  for (const [companyId, count] of UNPLACED) {
    for (let index = 0; index < count; index++) {
      const employee = makeEmployee(companyId, null, null);
      employee.manager = businessDirector.id;
    }
  }

  return { roles, employees };
}

export const { roles: ROLES, employees: EMPLOYEES } = buildOrganization();
export const POSITIONS = ROLES;

export const companyById = (id: string | null | undefined) => COMPANIES.find((item) => item.id === id);
export const departmentById = (id: string | null | undefined) => DEPARTMENTS.find((item) => item.id === id);
export const governanceById = (id: string | null | undefined) => GOVERNANCE.find((item) => item.id === id);
export const roleById = (id: string | null | undefined) => ROLES.find((item) => item.id === id);
export const initials = (name: string) => name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();
export const companyDescendants = (id: string) => { const result = [id]; const visit = (parent: string) => COMPANIES.filter((item) => item.parent === parent).forEach((item) => { result.push(item.id); visit(item.id); }); visit(id); return result; };
export const departmentDescendants = (id: string) => { const result = [id]; const visit = (parent: string) => DEPARTMENTS.filter((item) => item.parent === parent).forEach((item) => { result.push(item.id); visit(item.id); }); visit(id); return result; };
export const positionHolders = (id: string) => EMPLOYEES.filter((employee) => employee.role === id || employee.governanceRole === id);
export const isVacant = (id: string) => positionHolders(id).length === 0;

export const ORG_SUMMARY = {
  employees: EMPLOYEES.length,
  entities: COMPANIES.length,
  departments: DEPARTMENTS.filter((department) => !department.parent).length,
  unplaced: EMPLOYEES.filter((employee) => !employee.department).length,
  positions: ROLES.length,
  vacantPositions: ROLES.filter((role) => isVacant(role.id)).length,
  unownedDocuments: ROLES.filter((role) => isVacant(role.id)).reduce((sum, role) => sum + role.documents, 0),
  governancePositions: ROLES.filter((role) => role.scope === "governance").length,
  governanceDocuments: ROLES.filter((role) => role.scope === "governance").reduce((sum, role) => sum + role.documents, 0),
};
