"use client";

import { Session } from "@/lib/auth-utils/auth-types";

export default function SystemDashboard({
  session,
}: {
  session: Session | null;
}) {
  return (
    <div className="">
      <p>system dashboard</p>
    </div>
  );
}
