import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { SignInForm } from "./sign-in-form";
import { PATH } from "@/lib/path";
import { ArrowLeft, Loader2 } from "lucide-react";
import { user } from "@/lib/db/schema/auth-schema";
import { ROLES } from "@/lib/auth-utils/permissions";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import { CreateAdminForm } from "./create-admin-form";

export default async function SignIn() {
  const hasSuperAdmin = await checkIfHasSuperAdmin();

  return (
    <main className="flex flex-col min-h-svh justify-center px-4">
      <div className="w-full max-w-md mx-auto flex flex-col gap-6 items-start">
        <Suspense
          fallback={
            <div className="flex items-center gap-2">
              Loading form... <Loader2 />
            </div>
          }
        >
          {hasSuperAdmin ? <SignInForm /> : <CreateAdminForm />}
        </Suspense>

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
    .where(eq(user.role, ROLES.SUPERADMIN));

  if (superAdmin.length === 0) {
    return false;
  }

  return true;
}
