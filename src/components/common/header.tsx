import { SidebarTrigger } from "@/components/ui/sidebar";
import type { User } from "@/lib/types";
import { UserNav } from "./user-nav";

type HeaderProps = {
  user: User;
};

export default function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
      </div>
      <div className="ml-auto flex items-center gap-4">
        <UserNav user={user} />
      </div>
    </header>
  );
}
