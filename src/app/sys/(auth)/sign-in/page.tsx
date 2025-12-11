import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInForm } from "./sign-in-form";
import { PATH } from "@/lib/path";
import { ArrowLeft } from "lucide-react";

export default function SignIn() {
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
