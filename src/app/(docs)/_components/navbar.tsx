"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Home,
  LayoutDashboard,
  FileText,
  Contact,
  ArrowRight,
} from "lucide-react";
import icon from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { PATH } from "@/lib/path";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: PATH.HOME, label: "Home", icon: <Home size={18} /> },
    { href: PATH.ABOUT, label: "About", icon: <FileText size={18} /> },
    { href: PATH.CONTACT, label: "Contact", icon: <Contact size={18} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-background px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Left - Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={icon}
            alt="Leafin Things Logo"
            height={40}
            className="h-10 w-auto object-contain"
            priority
          />
          <span className="text-xl font-bold text-green-700">
            LeaFin Things
          </span>
        </Link>

        {/* Center - Navigation Links */}
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-8">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href))
                      ? "text-green-700"
                      : "hover:text-green-600"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <Link href={PATH.SYSTEM} className="hover:cursor-pointer">
          <Button variant={"outline"}>
            Go to System <ArrowRight />
          </Button>
        </Link>
      </div>
    </nav>
  );
}
