import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-login-form";
import { hasAdminSession, isAdminAuthConfigured } from "@/server/admin-auth";

export default async function AdminLoginPage() {
  if (await hasAdminSession()) redirect("/admin");
  const configured = isAdminAuthConfigured();

  return (
    <div className="mx-auto max-w-md space-y-5">
      <div>
        <h1 className="text-3xl font-black text-maroon-950">Admin Login</h1>
        <p className="mt-2 text-zinc-700">Residents do not need an account. This sign-in is only for the single committee admin account.</p>
      </div>
      {!configured ? (
        <div className="rounded-lg border border-maroon-800/10 bg-saffron-50 p-4 text-sm font-semibold text-maroon-900">
          Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` in `.env.local` to enable admin login.
        </div>
      ) : null}
      <AdminLoginForm disabled={!configured} />
    </div>
  );
}
