"use client";

import { Session } from "@/server/auth-types";

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
