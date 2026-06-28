import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { RoleForm } from "./role-form";

export default async function RolePage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  if (session.role) {
    redirect(
      session.role === "gym"
        ? "/athletes"
        : session.role === "admin"
          ? "/admin"
          : "/dashboard",
    );
  }

  return (
    <Card>
      <p className="eyebrow">One last step</p>
      <h1 className="mt-2 font-display text-2xl font-bold tracking-tight">
        How will you use MatLink?
      </h1>
      <p className="mt-2 text-sm text-muted">
        Pick one so we can set things up for you.
      </p>
      <div className="mt-6">
        <RoleForm />
      </div>
    </Card>
  );
}
