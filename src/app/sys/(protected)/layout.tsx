import { PATH } from "@/lib/path";
import { getServerSession } from "@/server/session";
import "@/styles/globals.css";
import { redirect } from "next/navigation";

export default async function SystemContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    redirect(PATH.SIGNIN);
  }

  return children;
}
