import Link from "next/link";
import { redirect } from "next/navigation";
import { loginAction } from "@/app/actions/auth";
import { StateForm, SubmitButton } from "@/components/forms";
import { Field, inp } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Log in" };

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/dashboard");
  return (
    <>
      <h1 className="mb-5 text-xl font-bold text-slate-900">Log in</h1>
      <StateForm action={loginAction} className="space-y-4">
        <Field label="Email">
          <input name="email" type="email" required autoComplete="email" className={inp} />
        </Field>
        <Field label="Password">
          <input name="password" type="password" required autoComplete="current-password" className={inp} />
        </Field>
        <SubmitButton className="w-full rounded-md bg-nova-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-nova-600 disabled:opacity-60 shadow-xs">
          Log in
        </SubmitButton>
      </StateForm>
      <p className="mt-5 text-center text-sm text-slate-500">
        New here?{" "}
        <Link href="/register" className="font-semibold text-blue-600 hover:underline">
          Create an account
        </Link>
      </p>
    </>
  );
}
