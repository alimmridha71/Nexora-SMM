import { Suspense } from "react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { PageTitle } from "@/components/ui";
import { ServicesCatalog } from "./services-catalog";

export const metadata = { title: "Services" };

export default async function Services() {
  await requireUser();
  const s = await getSettings();
  const rawServices = await db.service.findMany({
    where: { active: true, provider: { active: true } },
    orderBy: [{ category: "asc" }, { publicId: "asc" }],
  });

  const services = rawServices.map((x) => ({
    id: x.id,
    publicId: x.publicId,
    name: x.name,
    category: x.category,
    sellRate: x.sellRate.toString(),
    min: x.min,
    max: x.max,
  }));

  return (
    <>
      <PageTitle
        title="Service Catalog"
        sub={`All wholesale pricing is shown per 1,000 quantity in ${s.currency}. Search by name or category.`}
      />
      <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading service catalog...</div>}>
        <ServicesCatalog services={services} currency={s.currency} />
      </Suspense>
    </>
  );
}
