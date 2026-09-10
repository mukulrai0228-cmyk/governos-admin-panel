// Deterministic job description content derived from a role and its department.
import { GRADE_LABELS, departmentById, type Role } from "@/lib/org-v2-data";

const JOB_FAMILY: Record<string, string> = {
  Executive: "Executive Leadership",
  Sales: "Commercial",
  Finance: "Finance",
  "Supply Chain": "Supply Chain",
  Warehouses: "Supply Chain",
  Logistics: "Supply Chain",
  "HR & General Administration": "People & Administration",
  Technology: "Technology",
  "Customer Service": "Customer Experience",
  Marketing: "Marketing",
  Legal: "Legal & Compliance",
  Maintenance: "Engineering & Maintenance",
  "Production Operations": "Manufacturing",
  "R&D & Innovation": "Research & Development",
  "Quality Assurance": "Quality & Food Safety",
  Retail: "Retail Operations",
};

const CORE_COMPETENCIES = ["Integrity & compliance", "Communication", "Collaboration & teamwork", "Accountability & ownership", "Customer focus"];

const FUNCTIONAL_BY_GRADE: Record<string, string[]> = {
  A: ["Strategic direction", "Governance & stewardship", "Stakeholder leadership"],
  B: ["Strategic planning", "Financial stewardship", "Organizational development"],
  C: ["Team leadership", "Budget management", "Performance management"],
  D: ["Planning & scheduling", "Process improvement", "Coaching & supervision"],
  E: ["Analytical thinking", "Technical expertise", "Problem solving"],
  F: ["Coordination", "Record keeping & accuracy", "Issue resolution"],
  G: ["Process execution", "Record keeping & accuracy", "Continuous improvement"],
};

const RESPONSIBILITIES_BY_GRADE: Record<string, string[]> = {
  A: ["Set the direction and long-term priorities for the group", "Chair and inform the decisions of the governing bodies", "Approve policies, budgets and major commitments", "Represent the group with regulators, partners and shareholders"],
  B: ["Translate group strategy into domain plans and targets", "Own the domain budget, policies and approval chain", "Build and develop the leadership team", "Report performance and risk to executive management"],
  C: ["Plan, direct and review the department's day-to-day work", "Manage the departmental budget, resources and suppliers", "Set objectives, review performance and develop the team", "Ensure compliance with AAA policies, standards and KPIs"],
  D: ["Plan and schedule the work of the assigned team or area", "Supervise execution and resolve day-to-day operational issues", "Monitor quality, cost and delivery against agreed targets", "Coach team members and support their development"],
  E: ["Deliver specialist work within the function to agreed standards", "Analyse data and prepare recommendations and reports", "Support projects and improvement initiatives", "Maintain accurate records and compliance evidence"],
  F: ["Coordinate daily activities and schedules for the assigned area", "Track progress and escalate exceptions promptly", "Maintain accurate records and compliance evidence", "Support colleagues and continuous improvement efforts"],
  G: ["Perform assigned duties per approved procedures and standards", "Maintain accurate records and compliance evidence", "Collaborate with the team to meet objectives", "Escalate issues and support continuous improvement"],
};

const QUALIFICATIONS_BY_GRADE: Record<string, string[]> = {
  A: ["Postgraduate qualification in business or a related field", "Extensive board-level and executive leadership experience", "Deep knowledge of corporate governance and regulation", "Outstanding stakeholder and communication skills"],
  B: ["Degree, with a professional or postgraduate qualification preferred", "10+ years of experience including senior leadership", "Strong knowledge of applicable policies, standards and regulations", "Excellent communication and stakeholder-management skills"],
  C: ["Relevant degree or professional qualification", "7+ years of experience including team management", "Strong knowledge of applicable policies, standards and regulations", "Good communication and stakeholder-management skills"],
  D: ["Relevant degree or diploma", "5+ years of relevant experience, including supervision", "Working knowledge of applicable policies and standards", "Good planning and communication skills"],
  E: ["Relevant degree or professional qualification", "3+ years of experience in a similar role", "Strong knowledge of applicable policies, standards and regulations", "Good communication and stakeholder-management skills"],
  F: ["Diploma or equivalent qualification", "2+ years of relevant experience", "Working knowledge of applicable procedures and systems", "Good communication and organizational skills"],
  G: ["Relevant degree or professional qualification", "Proven experience in a similar role", "Strong knowledge of applicable policies, standards and regulations", "Good communication and stakeholder-management skills"],
};

export type JobDescription = {
  purpose: string;
  responsibilities: string[];
  qualifications: string[];
  core: string[];
  functional: string[];
  jobFamily: string;
  gradeBand: string;
  gradeCode: string;
  status: string;
  version: string;
  lastReviewed: string;
};

export function jobDescriptionFor(role: Role): JobDescription {
  const department = departmentById(role.department);
  const functionName = department?.name ?? "the organization";
  const gradeCode = role.grade.split(" ")[0] ?? "G";
  const title = role.name.toLowerCase();
  return {
    purpose: `To perform the assigned activities within the ${functionName} function, delivering the responsibilities of the ${title} to AAA's standards, policies and KPIs.`,
    responsibilities: RESPONSIBILITIES_BY_GRADE[gradeCode] ?? RESPONSIBILITIES_BY_GRADE.G,
    qualifications: QUALIFICATIONS_BY_GRADE[gradeCode] ?? QUALIFICATIONS_BY_GRADE.G,
    core: CORE_COMPETENCIES,
    functional: FUNCTIONAL_BY_GRADE[gradeCode] ?? FUNCTIONAL_BY_GRADE.G,
    jobFamily: JOB_FAMILY[(department?.name ?? "").split(" · ")[0]] ?? "General",
    gradeBand: GRADE_LABELS[gradeCode] ?? role.grade,
    gradeCode,
    status: "Approved",
    version: "1.2",
    lastReviewed: "March 2026",
  };
}
