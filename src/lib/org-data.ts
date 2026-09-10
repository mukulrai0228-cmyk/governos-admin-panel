export type Entity = {
  id: string;
  name: string;
  type: string;
  est: number;
  people: number;
  accent: string;
};

export const HOLDING = {
  name: "AAA Holding",
  type: "Holding",
  est: 1978,
  people: 172,
};

export const ENTITIES: Entity[] = [
  { id: "bakemate", name: "Bakemate", type: "Manufacturing", est: 1985, people: 88, accent: "#38BDF8" },
  { id: "bakers-point", name: "Bakers Point / Al Khabbazeen", type: "Retail", est: 1995, people: 129, accent: "#F59E0B" },
  { id: "aaa-trading", name: "AAA Trading / Abed Food", type: "B2B Trading", est: 1990, people: 0, accent: "#A855F7" },
  { id: "khadija", name: "Khadija Cold Storage", type: "Logistics", est: 2005, people: 90, accent: "#14B8A6" },
  { id: "aaa-contracting", name: "AAA Contracting", type: "Construction & Facilities", est: 2008, people: 50, accent: "#EF4444" },
  { id: "restofair", name: "Restofair Saudi Arabia", type: "Hospitality", est: 2025, people: 0, accent: "#EC4899" },
  { id: "bakemate-bh", name: "Bakemate Bahrain", type: "Manufacturing (Intl)", est: 2018, people: 0, accent: "#6366F1" },
  { id: "aaa-transport", name: "AAA Transportation", type: "Logistics & Fleet", est: 2010, people: 82, accent: "#059669" },
  { id: "abed-foods", name: "Abed Foods FZC", type: "Trading (Dubai, UAE)", est: 2015, people: 0, accent: "#8B5CF6" },
];

export const LEADERSHIP = [
  { name: "Eng. Ahmed Abdul Wahab Abed", title: "Chairman and President of the Board" },
  { name: "Mohannad Ahmad Abdulwahab Abed", title: "Chief Executive Officer" },
  { name: "Saud Ahmad Abdulwahab Abed", title: "Bussines Director" },
];

export const DEPARTMENTS: Record<string, string[]> = {
  "AAA Holding": ["HR & General Administration", "Finance", "Supply Chain", "Sales", "IT"],
  Bakemate: ["Production", "Quality Assurance", "Maintenance", "R&D"],
  "Bakers Point / Al Khabbazeen": ["Retail", "Showrooms", "Merchandising"],
  "Khadija Cold Storage": ["Warehouses", "Cold Chain", "Dispatch"],
  "AAA Contracting": ["Projects", "Facilities", "Safety"],
  "AAA Transportation": ["Logistics", "Fleet", "Drivers"],
};

export type Person = {
  name: string;
  title: string;
  department: string;
  unit: string;
  location: string;
};

export const PEOPLE: Person[] = [
  { name: "Aamir Ilyas", title: "welder steel fabricator", department: "Warehouses", unit: "AAA Contracting", location: "Engineering Maintenance Jeddah" },
  { name: "Aamir Mehmood Sddiqu", title: "Executive Secretary", department: "HR & General Administration", unit: "AAA Holding", location: "Salah al-Din's Office" },
  { name: "Aamir Mohmmed Aslam", title: "Distribution Specialist", department: "Supply Chain", unit: "AAA Holding", location: "Riyadh Head Quarters" },
  { name: "Abazar Abbas Hamza Omer", title: "Salesman", department: "Sales", unit: "AAA Holding", location: "Riyadh Branch" },
  { name: "Abd Alrahman Mohamed Ali Salem", title: "Showroom In Charge", department: "Retail", unit: "Bakers Point / Al Khabbazeen", location: "Riyadh Showroom - Dabbab" },
  { name: "Abdalla Mirgani Mohamed Ahmed", title: "Driver", department: "Logistics", unit: "AAA Transportation", location: "Jeddah Warehouse" },
  { name: "Abdallrahman Ali Mohamedahmed Aged", title: "Driver", department: "Logistics", unit: "AAA Transportation", location: "Madina Branch" },
  { name: "Abdelrahman Khalid Hussein", title: "Cold Chain Supervisor", department: "Cold Chain", unit: "Khadija Cold Storage", location: "Khadija Cold Store" },
  { name: "Abdul Aziz Al-Harbi", title: "Production Operator", department: "Production", unit: "Bakemate", location: "Bakemate Factory Jeddah" },
  { name: "Abdul Kareem Saleh", title: "QA Inspector", department: "Quality Assurance", unit: "Bakemate", location: "Bakemate Factory Jeddah" },
  { name: "Ahmed Salem Al-Zahrani", title: "Maintenance Technician", department: "Maintenance", unit: "Bakemate", location: "Bakemate Factory Jeddah" },
  { name: "Ali Hassan Mahmoud", title: "Accountant", department: "Finance", unit: "AAA Holding", location: "Riyadh Head Quarters" },
  { name: "Amjad Yousef", title: "Site Engineer", department: "Projects", unit: "AAA Contracting", location: "Jeddah Site Office" },
  { name: "Bilal Ahmed Khan", title: "Fleet Coordinator", department: "Fleet", unit: "AAA Transportation", location: "Riyadh Depot" },
  { name: "Faisal Al-Otaibi", title: "Merchandiser", department: "Merchandising", unit: "Bakers Point / Al Khabbazeen", location: "Riyadh Showroom - Dabbab" },
  { name: "Hamza Nasser", title: "IT Support Specialist", department: "IT", unit: "AAA Holding", location: "Riyadh Head Quarters" },
  { name: "Ibrahim Sulaiman", title: "Warehouse Keeper", department: "Warehouses", unit: "Khadija Cold Storage", location: "Jeddah Warehouse" },
  { name: "Khalid Al-Ghamdi", title: "Safety Officer", department: "Safety", unit: "AAA Contracting", location: "Jeddah Site Office" },
  { name: "Layla Al-Qahtani", title: "R&D Specialist", department: "R&D", unit: "Bakemate", location: "Bakemate Factory Jeddah" },
  { name: "Mohammed Al-Harbi", title: "Sales Executive", department: "Sales", unit: "AAA Holding", location: "Jeddah Branch" },
  { name: "Noura Al-Saud", title: "HR Officer", department: "HR & General Administration", unit: "AAA Holding", location: "Riyadh Head Quarters" },
  { name: "Omar Al-Shehri", title: "Dispatch Supervisor", department: "Dispatch", unit: "Khadija Cold Storage", location: "Khadija Cold Store" },
  { name: "Rami Abdullah", title: "Facilities Coordinator", department: "Facilities", unit: "AAA Contracting", location: "Riyadh Head Quarters" },
  { name: "Saeed Al-Malki", title: "Driver", department: "Drivers", unit: "AAA Transportation", location: "Madina Branch" },
];

export const TOTAL_PEOPLE = 611;

export function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
