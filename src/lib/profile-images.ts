import { EMPLOYEES, type Employee } from "@/lib/org-v2-data";

const PROFILE_IMAGES = [
  "/profiles/frame-1.jpg",
  "/profiles/frame-2.jpg",
  "/profiles/frame-3.jpg",
  "/profiles/frame-4.jpg",
  "/profiles/frame-5.jpg",
  "/profiles/frame-6.jpg",
  "/profiles/frame-7.jpg",
  "/profiles/frame-8.jpg",
  "/profiles/frame-10.jpg",
  "/profiles/frame-12.jpg",
] as const;

export function profileImageFor(employee: Employee) {
  const index = Math.max(0, EMPLOYEES.findIndex((item) => item.id === employee.id));
  return PROFILE_IMAGES[index % PROFILE_IMAGES.length];
}
