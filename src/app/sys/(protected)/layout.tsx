import React from "react";
import { getServerSession } from "@/lib/auth-utils/session";
import { Sidebar } from "../_components/sidebar";
import { Session } from "@/lib/auth-utils/auth-types";
import { redirect } from "next/navigation";
import { PATH } from "@/lib/path";

// we pass session data to children

type ChildWithSession = React.ReactElement<{
  session: Session | null;
}>;

export default async function SystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  const user = session?.user;
  if (!user) redirect(PATH.SIGNIN);

  if (!React.isValidElement(children)) {
    throw new Error("SystemLayout expects session paramaeter");
  }

  const child = children as ChildWithSession;

  return (
    <main className="flex min-h-screen min-w-screen overflow-hidden pr-8">
      <div className="flex">
        <Sidebar session={session} />
      </div>

      {React.cloneElement(child, { session })}
    </main>
  );
}
