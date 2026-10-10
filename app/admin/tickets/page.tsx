import Link from "next/link";
import { db } from "@/lib/db";
import { Badge, PageTitle, Table } from "@/components/ui";
import { dateTime } from "@/lib/util";

export const metadata = { title: "Tickets" };

export default async function AdminTickets() {
  const tickets = await db.ticket.findMany({ orderBy: [{ status: "asc" }, { updatedAt: "desc" }], take: 100, include: { user: { select: { email: true } } } });
  return (
    <>
      <PageTitle title="Tickets" />
      <Table head={["ID", "Subject", "User", "Updated", "Status"]} empty={tickets.length ? undefined : "No tickets."}>
        {tickets.map((t) => (
          <tr key={t.id}>
            <td className="text-slate-400">#{t.publicId}</td>
            <td><Link href={`/admin/tickets/${t.id}`} className="text-nova-400 hover:underline">{t.subject}</Link></td>
            <td className="text-xs">{t.user.email}</td>
            <td className="text-slate-400">{dateTime(t.updatedAt)}</td>
            <td><Badge status={t.status} /></td>
          </tr>
        ))}
      </Table>
    </>
  );
}
