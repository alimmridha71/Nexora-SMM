import { db } from "@/lib/db";
import { Badge, Field, PageTitle, Panel, btnDanger, btnGhost, inp } from "@/components/ui";
import { StateForm, SubmitButton } from "@/components/forms";
import { addProviderAction, syncProviderAction, testProviderAction, toggleProviderAction, updateProviderAction } from "@/app/actions/admin";

export const metadata = { title: "Providers" };
export const maxDuration = 60; // syncing a large catalog can take a while

export default async function AdminProviders() {
  const providers = await db.provider.findMany({ orderBy: { priority: "desc" }, include: { _count: { select: { services: true } } } });
  return (
    <>
      <PageTitle title="Providers" sub="Upstream APIs your orders are sent to. API keys are stored encrypted." />
      <div className="space-y-5">
        {providers.map((p) => (
          <Panel key={p.id} className="p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">{p.name} <Badge status={p.active ? "COMPLETED" : "CLOSED"} raw /> <span className="ml-1 text-xs font-normal text-slate-500">{p.active ? "active" : "disabled"}</span></h2>
                <p className="text-xs text-slate-500">{p.apiUrl} · {p._count.services} services</p>
              </div>
              <div className="flex flex-wrap items-start gap-2">
                <StateForm action={testProviderAction}><input type="hidden" name="id" value={p.id} /><SubmitButton className={btnGhost}>Test connection</SubmitButton></StateForm>
                <StateForm action={syncProviderAction}><input type="hidden" name="id" value={p.id} /><SubmitButton className={btnGhost}>Sync services</SubmitButton></StateForm>
                <form action={toggleProviderAction}><input type="hidden" name="id" value={p.id} /><button className={p.active ? btnDanger : btnGhost}>{p.active ? "Disable" : "Enable"}</button></form>
              </div>
            </div>
            <StateForm action={updateProviderAction} className="grid items-end gap-3 sm:grid-cols-5">
              <input type="hidden" name="id" value={p.id} />
              <Field label="Margin %"><input name="marginPct" type="number" step="any" min="0" defaultValue={p.marginPct.toString()} className={inp} /></Field>
              <Field label="Rate multiplier" hint="e.g. USD → BDT"><input name="rateMultiplier" type="number" step="any" min="0" defaultValue={p.rateMultiplier.toString()} className={inp} /></Field>
              <Field label="Priority"><input name="priority" type="number" defaultValue={p.priority} className={inp} /></Field>
              <Field label="New API key" hint="Leave empty to keep"><input name="apiKey" type="password" autoComplete="off" className={inp} /></Field>
              <SubmitButton className={btnGhost}>Save & reprice</SubmitButton>
            </StateForm>
          </Panel>
        ))}
      </div>

      <h2 className="mb-3 mt-10 text-lg font-semibold">Add provider</h2>
      <Panel className="max-w-3xl p-5">
        <StateForm action={addProviderAction} className="grid gap-4 sm:grid-cols-2">
          <Field label="Name"><input name="name" required className={inp} /></Field>
          <Field label="API URL" hint="Must be https://"><input name="apiUrl" required placeholder="https://provider.com/api/v2" className={inp} /></Field>
          <Field label="API key"><input name="apiKey" type="password" required autoComplete="off" className={inp} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Margin %"><input name="marginPct" type="number" step="any" min="0" defaultValue="30" className={inp} /></Field>
            <Field label="Rate multiplier"><input name="rateMultiplier" type="number" step="any" min="0" defaultValue="1" className={inp} /></Field>
          </div>
          <div className="sm:col-span-2"><SubmitButton>Add provider</SubmitButton></div>
        </StateForm>
      </Panel>
    </>
  );
}
