import { redirect } from "next/navigation";

/** Entry point — hand off to the timesheets area (which guards auth). */
export default function Home() {
  redirect("/timesheets");
}
