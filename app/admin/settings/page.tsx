import { getSettings } from "@/lib/settings";
import { Field, PageTitle, Panel, inp } from "@/components/ui";
import { StateForm, SubmitButton } from "@/components/forms";
import { saveSettingsAction } from "@/app/actions/admin";

export const metadata = { title: "Settings" };

export default async function AdminSettings() {
  const s = await getSettings();
  return (
    <>
      <PageTitle title="Settings" sub="Payment methods with an empty number are hidden from users." />
      <Panel className="max-w-2xl p-5">
        <StateForm action={saveSettingsAction} className="grid gap-4 sm:grid-cols-2">
          <Field label="Site name"><input name="siteName" defaultValue={s.siteName} className={inp} /></Field>
          <Field label="Currency symbol"><input name="currency" defaultValue={s.currency} maxLength={4} className={inp} /></Field>
          <Field label="Minimum deposit"><input name="minDeposit" type="number" defaultValue={s.minDeposit} className={inp} /></Field>
          <Field label="Support email"><input name="supportEmail" type="email" defaultValue={s.supportEmail} className={inp} /></Field>
          <Field label="bKash number"><input name="bkashNumber" defaultValue={s.bkashNumber} className={inp} /></Field>
          <Field label="Nagad number"><input name="nagadNumber" defaultValue={s.nagadNumber} className={inp} /></Field>
          <Field label="Rocket number"><input name="rocketNumber" defaultValue={s.rocketNumber} className={inp} /></Field>
          <Field label="Binance Pay ID"><input name="binanceId" defaultValue={s.binanceId} className={inp} /></Field>
          <div className="sm:col-span-2"><Field label="Message shown on Add funds"><textarea name="paymentNote" rows={2} defaultValue={s.paymentNote} className={inp} /></Field></div>
          <div className="sm:col-span-2"><SubmitButton>Save settings</SubmitButton></div>
        </StateForm>
      </Panel>
    </>
  );
}
