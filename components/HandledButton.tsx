"use client";

import { useTransition } from "react";
import { markSubmissionHandled } from "@/app/actions/admin";

export default function HandledButton({ table, id }: { table: string; id: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      onClick={() => start(() => markSubmissionHandled(table, id))}
      disabled={pending}
      className="h-fit rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-green-50 hover:border-green-300 disabled:opacity-50 min-h-[44px]"
    >
      {pending ? "…" : "Mark handled"}
    </button>
  );
}
