"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  ClipboardList,
  DollarSign,
  BarChart3,
  CreditCard,
  History,
  Fish,
  Users2Icon,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-utils/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PATH } from "@/lib/path";
import { ROLES } from "@/lib/auth-utils/permissions";
import { Session } from "@/lib/auth-utils/auth-types";

const sidebarItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: PATH.SYSTEM,
  },
  {
    title: "Users",
    icon: Users2Icon,
    href: PATH.USERS,
    roles: [ROLES.ADMIN, ROLES.SUPERADMIN],
  },
  {
    title: "Batch",
    icon: Fish,
    href: PATH.BATCH,
  },
  {
    title: "Monitoring",
    icon: Activity,
    href: PATH.MONITORING,
  },
  {
    title: "Expenses",
    icon: CreditCard,
    href: PATH.EXPENSES,
  },
  {
    title: "Tasks",
    icon: ClipboardList,
    href: PATH.TASKS,
  },
  {
    title: "Sales",
    icon: DollarSign,
    href: PATH.SALES,
    roles: [ROLES.ADMIN, ROLES.SUPERADMIN],
  },
  {
    title: "Reports",
    icon: BarChart3,
    href: PATH.REPORTS,
    roles: [ROLES.ADMIN, ROLES.SUPERADMIN],
  },
  {
    title: "Logs",
    icon: History,
    href: PATH.LOGS,
    roles: [ROLES.ADMIN, ROLES.SUPERADMIN],
  },
];

export function Sidebar({ session }: { session: Session | null }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  const filteredItems = sidebarItems.filter((item) => {
    if (!item.roles) return true;
    if (!session?.user) return false;
    return item.roles.includes(session.user.role as any);
  });

  return (
    <TooltipProvider>
      <div className="flex h-full w-16 flex-col border-r bg-background">
        {/* Navigation */}
        <nav className="flex flex-1 flex-col items-center gap-4 px-2 py-4">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="icon"
                    className={cn(
                      "h-9 w-9 transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                    asChild
                  >
                    <Link href={item.href}>
                      <Icon className="h-4 w-4" />
                      <span className="sr-only">{item.title}</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="flex items-center gap-4"
                >
                  {item.title}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* Sign Out Button */}
        <div className="flex flex-col items-center gap-4 px-2 py-4">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Sign Out</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-4">
              Sign Out
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
