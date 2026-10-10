import Link from "next/link";
import { redirect } from "next/navigation";
import { registerAction } from "@/app/actions/auth";
import { StateForm, SubmitButton } from "@/components/forms";
import { Field, inp } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Create account" };

export default async function RegisterPage() {
  if (await getCurrentUser()) redirect("/dashboard");
  return (
    <>
      <h1 className="mb-5 text-xl font-semibold">Create your account</h1>
      <StateForm action={registerAction} className="space-y-4">
        <Field label="Name">
          <input name="name" required maxLength={60} autoComplete="name" className={inp} />
        </Field>
        <Field label="Email">
          <input name="email" type="email" required autoComplete="email" className={inp} />
        </Field>
        <Field label="Password" hint="At least 8 characters">
          <input name="password" type="password" required minLength={8} autoComplete="new-password" className={inp} />
        </Field>
        <label className="flex items-start gap-2 text-sm text-slate-400">
          <input type="checkbox" name="terms" className="mt-1" />
          <span>
            I have read the{" "}
            <Link href="/terms" target="_blank" className="text-nova-400 hover:underline">
              Terms
            </Link>
            , including that platforms may remove or limit results.
          </span>
        </label>
        <SubmitButton className="w-full rounded-md bg-nova-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-nova-600 disabled:opacity-60">
          Create account
        </SubmitButton>
      </StateForm>
      <p className="mt-5 text-center text-sm text-slate-400">
        Already registered?{" "}
        <Link href="/login" className="text-nova-400 hover:underline">
          Log in
        </Link>
      </p>
    </>
  );
}
