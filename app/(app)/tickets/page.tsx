import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { Badge, Field, PageTitle, Panel, Table, inp } from "@/components/ui";
import { StateForm, SubmitButton } from "@/components/forms";
import { createTicketAction } from "@/app/actions/user";
import { dateTime } from "@/lib/util";

export const metadata = { title: "Support" };

export default async function Tickets() {
  const user = await requireUser();
  const tickets = await db.ticket.findMany({ where: { userId: user.id }, orderBy: { updatedAt: "desc" }, take: 50 });
  return (
    <>
      <PageTitle title="Support" sub="Include the order ID if your question is about an order." />
      <Panel className="mb-8 max-w-2xl p-5">
        <StateForm action={createTicketAction} className="space-y-4">
          <Field label="Subject">
            <input name="subject" required maxLength={120} className={inp} />
          </Field>
          <Field label="Message">
            <textarea name="body" required rows={4} maxLength={4000} className={inp} />
          </Field>
          <SubmitButton>Open ticket</SubmitButton>
        </StateForm>
      </Panel>
      <Table head={["ID", "Subject", "Updated", "Status"]} empty={tickets.length ? undefined : "No tickets yet."}>
        {tickets.map((t) => (
          <tr key={t.id}>
            <td className="text-slate-400">#{t.publicId}</td>
            <td><Link href={`/tickets/${t.id}`} className="text-nova-400 hover:underline">{t.subject}</Link></td>
            <td className="text-slate-400">{dateTime(t.updatedAt)}</td>
            <td><Badge status={t.status} /></td>
          </tr>
        ))}
      </Table>
    </>
  );
}
