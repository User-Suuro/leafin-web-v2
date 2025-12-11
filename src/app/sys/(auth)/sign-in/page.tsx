import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInForm } from "./sign-in-form";
import { PATH } from "@/lib/path";
import { ArrowLeft } from "lucide-react";
import { USER_ROLES, user } from "@/lib/db/schema/auth-schema";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";

export default async function SignIn() {
  return (
    <main className="flex flex-col min-h-svh justify-center px-4">
      <div className="w-full max-w-md mx-auto flex flex-col gap-6 items-start">
        <SignInForm />

        <Link href={PATH.HOME}>
          <Button className="w-fit cursor-pointer">
            <ArrowLeft /> <span>Go back to home</span>
          </Button>
        </Link>
      </div>
    </main>
  );
}

async function checkIfHasSuperAdmin() {
  const superAdmin = await db
    .select()
    .from(user)
    .where(eq(user.role, USER_ROLES.SUPERADMIN));

  if (superAdmin.length === 0) {
    return false;
  }

  return true;
}
