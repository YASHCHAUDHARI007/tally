import type { ReactNode } from "react";
import Link from "next/link";
import {
  Boxes,
  Home,
  Users,
  Barcode,
  History,
  ReceiptText,
  Settings,
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar";
import Header from "@/components/common/header";
import { mockUsers } from "@/lib/mock-data";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // Mocking the logged-in user. In a real app, this would come from a session/context.
  const currentUser = mockUsers[0]; // Admin user for full menu view

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2 p-2">
            <Boxes className="size-6 text-primary" />
            <span className="text-lg font-semibold font-headline">TallySync Pro</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard" isActive>
                <Link href="/dashboard">
                  <Home />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {['Admin', 'Sales', 'Store'].includes(currentUser.role) && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Barcode Scanner">
                  <Link href="/dashboard/scan">
                    <Barcode />
                    <span>Scanner</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            {['Admin', 'Sales'].includes(currentUser.role) && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Invoices">
                  <Link href="/dashboard/invoices">
                    <ReceiptText />
                    <span>Invoices</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            {currentUser.role === 'Admin' && (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="User Management">
                    <Link href="/dashboard/users">
                      <Users />
                      <span>Users</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Activity Logs">
                    <Link href="/dashboard/logs">
                      <History />
                      <span>Logs</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Settings">
                <Link href="#">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header user={currentUser} />
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
