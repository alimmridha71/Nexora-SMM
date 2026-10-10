import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { PageTitle } from "@/components/ui";
import { OrderForm } from "./order-form";

export const metadata = { title: "New order" };

export default async function NewOrder({ searchParams }: { searchParams: { service?: string } }) {
  await requireUser();
  const s = await getSettings();
  const services = await db.service.findMany({
    where: { active: true, provider: { active: true } },
    orderBy: [{ category: "asc" }, { publicId: "asc" }],
    select: { id: true, publicId: true, name: true, category: true, sellRate: true, min: true, max: true },
  });

  const initialPublicId = Number(searchParams.service) || undefined;

  return (
    <>
      <PageTitle title="New Order" sub="Select a service, paste your link, and place your order with instant wallet debit." />
      <OrderForm
        currency={s.currency}
        services={services.map((x) => ({ ...x, sellRate: Number(x.sellRate) }))}
        initialPublicId={initialPublicId}
      />
    </>
  );
}
