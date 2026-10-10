import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Badge, Field, PageTitle, btnGhost, inp } from "@/components/ui";
import { StateForm, SubmitButton } from "@/components/forms";
import { adminReplyTicketAction, closeTicketAction } from "@/app/actions/admin";
import { dateTime } from "@/lib/util";

export const metadata = { title: "Ticket" };

export default async function AdminTicket({ params }: { params: { id: string } }) {
  const t = await db.ticket.findUnique({ where: { id: params.id }, include: { user: { select: { email: true } }, messages: { orderBy: { createdAt: "asc" } } } });
  if (!t) notFound();
  return (
    <>
      <Link href="/admin/tickets" className="text-sm text-nova-400 hover:underline">All tickets</Link>
      <div className="mt-2">
        <PageTitle title={`#${t.publicId} ${t.subject}`} sub={t.user.email} action={<div className="flex items-center gap-3"><Badge status={t.status} />{t.status !== "CLOSED" && <form action={closeTicketAction}><input type="hidden" name="id" value={t.id} /><button className={btnGhost}>Close ticket</button></form>}</div>} />
      </div>
      <div className="max-w-2xl space-y-3">
        {t.messages.map((m) => (
          <div key={m.id} className={`rounded-lg border p-4 ${m.isStaff ? "border-nova-500/30 bg-nova-500/5" : "border-ink-700 bg-ink-800"}`}>
            <p className="mb-1 text-xs text-slate-500">{m.isStaff ? "Support" : "Customer"} · {dateTime(m.createdAt)}</p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.body}</p>
          </div>
        ))}
        <StateForm action={adminReplyTicketAction} className="space-y-3 pt-2">
          <input type="hidden" name="id" value={t.id} />
          <Field label="Reply"><textarea name="body" required rows={4} maxLength={4000} className={inp} /></Field>
          <SubmitButton>Send reply</SubmitButton>
        </StateForm>
      </div>
    </>
  );
}
