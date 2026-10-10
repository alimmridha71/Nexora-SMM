import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { Badge, Field, PageTitle, inp } from "@/components/ui";
import { StateForm, SubmitButton } from "@/components/forms";
import { replyTicketAction } from "@/app/actions/user";
import { dateTime } from "@/lib/util";

export const metadata = { title: "Ticket" };

export default async function TicketPage({ params }: { params: { id: string } }) {
  const user = await requireUser();
  const t = await db.ticket.findFirst({ where: { id: params.id, userId: user.id }, include: { messages: { orderBy: { createdAt: "asc" } } } });
  if (!t) notFound();
  return (
    <>
      <Link href="/tickets" className="text-sm text-nova-400 hover:underline">All tickets</Link>
      <div className="mt-2"><PageTitle title={`#${t.publicId} ${t.subject}`} action={<Badge status={t.status} />} /></div>
      <div className="max-w-2xl space-y-3">
        {t.messages.map((m) => (
          <div key={m.id} className={`rounded-lg border p-4 ${m.isStaff ? "border-nova-500/30 bg-nova-500/5" : "border-ink-700 bg-ink-800"}`}>
            <p className="mb-1 text-xs text-slate-500">{m.isStaff ? "Support" : "You"} · {dateTime(m.createdAt)}</p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">{m.body}</p>
          </div>
        ))}
        {t.status !== "CLOSED" ? (
          <StateForm action={replyTicketAction} className="space-y-3 pt-2">
            <input type="hidden" name="id" value={t.id} />
            <Field label="Reply"><textarea name="body" required rows={3} maxLength={4000} className={inp} /></Field>
            <SubmitButton>Send reply</SubmitButton>
          </StateForm>
        ) : (
          <p className="text-sm text-slate-500">This ticket is closed. Open a new one if you still need help.</p>
        )}
      </div>
    </>
  );
}
