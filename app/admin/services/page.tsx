import Link from "next/link";
import { db } from "@/lib/db";
import { PageTitle, Table, btnGhost, inp } from "@/components/ui";
import { updateServiceAction } from "@/app/actions/admin";

export const metadata = { title: "Services" };
const PAGE = 50;

export default async function AdminServices({ searchParams }: { searchParams: { q?: string; provider?: string; page?: string } }) {
  const q = (searchParams.q ?? "").trim();
  const providerId = searchParams.provider || undefined;
  const page = Math.max(1, Number(searchParams.page) || 1);
  const where = {
    ...(providerId ? { providerId } : {}),
    ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" as const } }, { category: { contains: q, mode: "insensitive" as const } }, ...(/^\d+$/.test(q) ? [{ publicId: Number(q) }] : [])] } : {}),
  };
  const [providers, services, total] = await Promise.all([
    db.provider.findMany({ orderBy: { name: "asc" } }),
    db.service.findMany({ where, orderBy: [{ category: "asc" }, { publicId: "asc" }], take: PAGE, skip: (page - 1) * PAGE, include: { provider: true } }),
    db.service.count({ where }),
  ]);
  const qs = (p: number) => `/admin/services?provider=${providerId ?? ""}&q=${encodeURIComponent(q)}&page=${p}`;
  return (
    <>
      <PageTitle title="Services" sub={`${total} matching. Editing a price locks it, so provider syncs will not overwrite it.`} />
      <form className="mb-4 flex flex-wrap gap-2">
        <input name="q" defaultValue={q} placeholder="Search name, category or ID" className={`${inp} w-64`} />
        <select name="provider" defaultValue={providerId ?? ""} className={`${inp} w-48`}>
          <option value="">All providers</option>
          {providers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <button className={btnGhost}>Filter</button>
      </form>
      <Table head={["ID", "Name / category", "Cost /1000", "Your price /1000", "Active", "Locked", ""]} empty={services.length ? undefined : "No services. Add a provider and sync it."}>
        {services.map((x) => {
          const cost = Number(x.rate) * Number(x.provider.rateMultiplier);
          const f = `f${x.id}`;
          return (
            <tr key={x.id}>
              <td className="text-slate-400">{x.publicId}<p className="text-xs">{x.provider.name}</p></td>
              <td className="min-w-[260px] space-y-1.5">
                <input form={f} name="name" defaultValue={x.name} className={inp} />
                <input form={f} name="category" defaultValue={x.category} className={inp} />
              </td>
              <td className="whitespace-nowrap text-slate-400">{cost.toFixed(4)}</td>
              <td><input form={f} name="sellRate" type="number" step="any" min="0" defaultValue={x.sellRate.toString()} className={`${inp} w-28`} /></td>
              <td><input form={f} type="checkbox" name="active" defaultChecked={x.active} aria-label="Active" /></td>
              <td><input form={f} type="checkbox" name="locked" defaultChecked={x.locked} aria-label="Locked price" /></td>
              <td>
                <form id={f} action={updateServiceAction}>
                  <input type="hidden" name="id" value={x.id} />
                  <button className={btnGhost}>Save</button>
                </form>
              </td>
            </tr>
          );
        })}
      </Table>
      <div className="mt-4 flex gap-3 text-sm">
        {page > 1 && <Link className="text-nova-400" href={qs(page - 1)}>Previous</Link>}
        {page * PAGE < total && <Link className="text-nova-400" href={qs(page + 1)}>Next</Link>}
      </div>
    </>
  );
}
