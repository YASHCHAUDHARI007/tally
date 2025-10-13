"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Boxes,
  Home,
  Users,
  Barcode,
  History,
  ReceiptText,
  Settings,
  Loader,
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
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import type { Employee } from "@/lib/types";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, `employees/${user.uid}`);
  }, [firestore, user]);

  const { data: currentUser, isLoading: isEmployeeLoading } = useDoc<Employee>(userDocRef);

  if (isUserLoading || isEmployeeLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    router.replace("/");
    return null;
  }

  // A simple user object to pass to the header, can be expanded later
  const headerUser = {
      id: user.uid,
      name: currentUser?.username || user.email || 'User',
      email: user.email || '',
      avatarUrl: user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`,
      role: currentUser?.role || 'Store'
  }

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
            {['Admin', 'Sales', 'Store'].includes(headerUser.role) && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Barcode Scanner">
                  <Link href="/dashboard/scan">
                    <Barcode />
                    <span>Scanner</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            {['Admin', 'Sales'].includes(headerUser.role) && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Invoices">
                  <Link href="/dashboard/invoices">
                    <ReceiptText />
                    <span>Invoices</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            {headerUser.role === 'Admin' && (
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
                </MenuItem>
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
        <Header user={headerUser} />
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
