"use client";
import { ReactNode } from "react";
import { useFormState, useFormStatus } from "react-dom";
import type { FormState } from "@/lib/types";
import { btn } from "./ui";

export function SubmitButton({ children, className = btn }: { children: ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? "Please wait…" : children}
    </button>
  );
}

export function StateForm({
  action,
  children,
  className,
}: {
  action: (s: FormState, f: FormData) => Promise<FormState>;
  children: ReactNode;
  className?: string;
}) {
  const [state, formAction] = useFormState(action, null);
  return (
    <form action={formAction} className={className}>
      {children}
      {state?.error && (
        <p role="alert" className="mt-3 text-sm text-rose-400">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p role="status" className="mt-3 text-sm text-emerald-400">
          {state.ok}
        </p>
      )}
    </form>
  );
}
