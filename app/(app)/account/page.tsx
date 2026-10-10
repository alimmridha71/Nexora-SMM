import { requireUser } from "@/lib/auth";
import { Field, PageTitle, Panel, inp } from "@/components/ui";
import { StateForm, SubmitButton } from "@/components/forms";
import { changePasswordAction } from "@/app/actions/user";

export const metadata = { title: "Account" };

export default async function Account() {
  const user = await requireUser();
  return (
    <>
      <PageTitle title="Account" sub={`${user.name} · ${user.email}`} />
      <Panel className="max-w-md p-5">
        <h2 className="mb-4 text-base font-semibold">Change password</h2>
        <StateForm action={changePasswordAction} className="space-y-4">
          <Field label="Current password"><input name="current" type="password" required autoComplete="current-password" className={inp} /></Field>
          <Field label="New password" hint="At least 8 characters"><input name="next" type="password" required minLength={8} autoComplete="new-password" className={inp} /></Field>
          <SubmitButton>Update password</SubmitButton>
        </StateForm>
      </Panel>
    </>
  );
}
