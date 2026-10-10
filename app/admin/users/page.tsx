import Link from "next/link";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { requireAdmin } from "@/lib/auth";
import { Badge, PageTitle, Table, btnDanger, btnGhost, inp } from "@/components/ui";
import { StateForm, SubmitButton } from "@/components/forms";
import { adjustBalanceAction, toggleUserAction } from "@/app/actions/admin";
import { dateTime, money } from "@/lib/util";

export const metadata = { title: "Users" };
const PAGE = 50;

export default async function AdminUsers({ searchParams }: { searchParams: { q?: string; page?: string } }) {
  const admin = await requireAdmin();
  const s = await getSettings();
  const q = (searchParams.q ?? "").trim();
  const page = Math.max(1, Number(searchParams.page) || 1);
  const where = q ? { OR: [{ email: { contains: q, mode: "insensitive" as const } }, { name: { contains: q, mode: "insensitive" as const } }] } : {};
  const [users, total] = await Promise.all([
    db.user.findMany({ where, orderBy: { createdAt: "desc" }, take: PAGE, skip: (page - 1) * PAGE, include: { _count: { select: { orders: true } } } }),
    db.user.count({ where }),
  ]);
  return (
    <>
      <PageTitle title="Users" sub={`${total} total`} action={
        <form className="flex gap-2"><input name="q" defaultValue={q} placeholder="Search email or name" className={`${inp} w-60`} /><button className={btnGhost}>Search</button></form>
      } />
      <Table head={["User", "Balance", "Orders", "Joined", "Add / deduct balance", ""]} empty={users.length ? undefined : "No users found."}>
        {users.map((u) => (
          <tr key={u.id}>
            <td>
              <p className="font-medium text-white">{u.name} {u.role === "ADMIN" && <Badge status="Admin" raw />}</p>
              <p className="text-xs text-slate-400">{u.email}</p>
              {!u.active && <Badge status="CANCELED" raw />}
            </td>
            <td className="whitespace-nowrap text-gold-400">{money(u.balance.toString(), s.currency)}</td>
            <td>{u._count.orders}</td>
            <td className="whitespace-nowrap text-slate-400">{dateTime(u.createdAt)}</td>
            <td>
              <StateForm action={adjustBalanceAction} className="flex flex-wrap items-center gap-2">
                <input type="hidden" name="id" value={u.id} />
                <input name="amount" type="number" step="any" placeholder="±amount" className={`${inp} w-28`} required />
                <input name="note" placeholder="Note" className={`${inp} w-32`} />
                <SubmitButton className={btnGhost}>Apply</SubmitButton>
              </StateForm>
            </td>
            <td>
              {u.id !== admin.id && (
                <form action={toggleUserAction}>
                  <input type="hidden" name="id" value={u.id} />
                  <button className={u.active ? btnDanger : btnGhost}>{u.active ? "Suspend" : "Reactivate"}</button>
                </form>
              )}
            </td>
          </tr>
        ))}
      </Table>
      <div className="mt-4 flex gap-3 text-sm">
        {page > 1 && <Link className="text-nova-400" href={`/admin/users?q=${encodeURIComponent(q)}&page=${page - 1}`}>Previous</Link>}
        {page * PAGE < total && <Link className="text-nova-400" href={`/admin/users?q=${encodeURIComponent(q)}&page=${page + 1}`}>Next</Link>}
      </div>
    </>
  );
}
