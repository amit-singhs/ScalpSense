"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, History, BotMessageSquare } from 'lucide-react';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { APP_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/backtesting', label: 'Backtesting', icon: History },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <BotMessageSquare className="w-8 h-8 text-sidebar-primary" />
          <h1 className={cn(
            "text-xl font-semibold text-sidebar-foreground",
            "group-data-[collapsible=icon]:hidden"
            )}>
            {APP_NAME}
          </h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  className="justify-start"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className={cn(
        "p-2 text-xs text-center text-sidebar-foreground/60",
        "group-data-[collapsible=icon]:hidden"
        )}>
        © {new Date().getFullYear()} {APP_NAME}
      </SidebarFooter>
    </>
  );
}
