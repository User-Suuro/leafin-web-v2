"use client";

import { ChevronDown } from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { authClient } from "@/lib/auth-utils/auth-client";
import { toast } from "sonner";
import { User } from "@/lib/auth-utils/auth-types";
import { UserAvatar } from "./user-avatar";

interface UserDropdownProps {
  user: User;
}

export function UserDropdown({ user }: UserDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <UserAvatar name={user.name} image={user.image} className="h-6 w-6" />
          <span className="max-w-48 truncate ">{user.name}</span>
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">{user.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings/profile" className="flex items-center gap-2">
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        <SignOutItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AdminItem() {
  return (
    <DropdownMenuItem asChild>
      <Link href="/admin">
        <span>Admin</span>
      </Link>
    </DropdownMenuItem>
  );
}

function SellerItem() {
  return (
    <DropdownMenuItem asChild>
      <Link href="/seller">
        <span>Seller Center</span>
      </Link>
    </DropdownMenuItem>
  );
}

function SignOutItem() {
  const router = useRouter();

  async function handleSignOut() {
    toast.loading("Signing out...");

    const { error } = await authClient.signOut();

    toast.dismiss();

    if (error) {
      toast.error(error.message || "Something went wrong");
    } else {
      toast.success("Signed out successfully");
      router.push("/sign-in");
    }
  }

  return (
    <DropdownMenuItem onClick={handleSignOut}>
      <span>Sign out</span>
    </DropdownMenuItem>
  );
}
