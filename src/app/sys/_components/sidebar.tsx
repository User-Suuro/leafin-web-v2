"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  ClipboardList,
  DollarSign,
  BarChart3,
  Settings,
  CreditCard,
  History,
  Fish,
  Users2Icon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PATH } from "@/lib/path";

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
  },

  {
    title: "Batch",
    icon: Fish,
    href: PATH.BATCH,
  },
  /*
  {
    title: "Monitoring",
    icon: Activity,
    href: PATH,
  },
  {
    title: "Batch",
    href: "/system/batch",
    icon: Fish,
  },
  {
    title: "Tasks",
    icon: ClipboardList,
    href: "/system/tasks",
  },
  {
    title: "Expenses",
    icon: CreditCard,
    href: "/system/expenses",
  },
  {
    title: "Sales",
    icon: DollarSign,
    href: "/system/sales",
  },
  {
    title: "Reports",
    icon: BarChart3,
    href: "/system/reports",
  },
  {
    title: "Logs",
    icon: History,
    href: "/system/logs",
  },
  */
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <div className="flex h-full w-16 flex-col border-r bg-background">
        {/* Navigation */}
        <nav className="flex flex-1 flex-col items-center gap-4 px-2 py-4">
          {sidebarItems.map((item) => {
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
      </div>
    </TooltipProvider>
  );
}
