import { Prisma } from "@prisma/client";
import { db } from "./db";

const OPEN = ["PENDING_SUBMIT", "PENDING", "IN_PROGRESS"] as const;

/** Close an open order and refund if needed. Idempotent: calling twice never double-refunds. */
export async function settle(orderId: string, to: "COMPLETED" | "PARTIAL" | "CANCELED" | "FAILED", remains = 0) {
  await db.$transaction(async (tx) => {
    const o = await tx.order.findUnique({ where: { id: orderId }, include: { service: true } });
    if (!o) return;

    const claimed = await tx.order.updateMany({
      where: { id: orderId, status: { in: [...OPEN] } },
      data: { status: to, remains },
    });
    if (claimed.count === 0) return;

    let refund = new Prisma.Decimal(0);
    if (to === "CANCELED" || to === "FAILED") refund = o.charge;
    else if (to === "PARTIAL") {
      const unit = o.charge.div(o.quantity); // exact per-unit price the user paid
      refund = unit.mul(Math.min(Math.max(remains, 0), o.quantity)).toDecimalPlaces(4);
    }

    if (refund.gt(0)) {
      await tx.user.update({ where: { id: o.userId }, data: { balance: { increment: refund } } });
      await tx.transaction.create({
        data: { userId: o.userId, type: "REFUND", amount: refund, orderId: o.id, note: `Order #${o.publicId} ${to.toLowerCase()}` },
      });
    }
  });
}
