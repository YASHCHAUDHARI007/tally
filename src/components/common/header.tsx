import { SidebarTrigger } from "@/components/ui/sidebar";
import type { User } from "@/lib/types";
import { UserNav } from "./user-nav";
import { useUser } from "@/firebase";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";

type HeaderProps = {
  user: User;
};

export default function Header({ user }: HeaderProps) {
  const { isUserLoading } = useUser();
  const auth = getAuth();

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
      </div>
      <div className="ml-auto flex items-center gap-4">
        {isUserLoading ? null : user ? (
          <UserNav user={user} />
        ) : (
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        )}
      </div>
    </header>
  );
}
