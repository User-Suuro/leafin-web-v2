import React from "react";
import { getServerSession } from "@/server/session";
import { PATH } from "@/lib/path";
import { redirect } from "next/navigation";
import { Sidebar } from "../_components/sidebar";
import { Session } from "@/server/auth-types";

export default async function SystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  const user = session?.user;

  if (!React.isValidElement(children)) {
    throw new Error("SystemLayout expects session paramaeter");
  }

  const child = children as ChildWithSession;

  // if (!user) redirect(PATH.SIGNIN);

  return (
    <main className="flex min-h-screen ">
      <div className="flex">
        <Sidebar />
      </div>

      {React.cloneElement(child, { session })}
    </main>
  );
}

type ChildWithSession = React.ReactElement<{
  session: Session | null;
}>;
