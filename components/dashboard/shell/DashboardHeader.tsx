'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Menu, UserRound, LogOut, Settings, LoaderCircle, X } from 'lucide-react';
import { Breadcrumb } from '@/components/navigation/Breadcrumb';
import { CommandPalette } from '@/components/navigation/CommandPalette';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { trpc, setAuthToken } from '@/lib/trpc';
import { useQueryClient } from '@tanstack/react-query';

interface DashboardHeaderProps {
  isSidebarCollapsed?: boolean;
  isMobileMenuOpen?: boolean;
  isMobileViewport?: boolean;
  onToggleSidebar?: () => void;
}

export function DashboardHeader({ isSidebarCollapsed = false, isMobileMenuOpen = false, isMobileViewport = false, onToggleSidebar }: DashboardHeaderProps) {
  const [accountOpen, setAccountOpen] = React.useState(false);
  const account = trpc.auth.me.useQuery(undefined, {
    enabled: accountOpen,
    retry: false,
    refetchOnWindowFocus: false,
  });
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = account.data;
  const accountName = user?.email?.trim() || 'Account';

  const signOut = () => {
    setAuthToken(null);
    queryClient.clear();
    router.replace('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-2 sm:px-3 sm:gap-3 lg:px-4 overflow-x-hidden">
      <Button
        variant="ghost"
        size="icon"
        className="size-9 shrink-0"
        onClick={onToggleSidebar}
        aria-controls="dashboard-sidebar"
        aria-label={isMobileViewport ? (isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu') : isSidebarCollapsed ? 'Expand navigation sidebar' : 'Collapse navigation sidebar'}
        aria-expanded={isMobileViewport ? isMobileMenuOpen : !isSidebarCollapsed}
      >
        {isMobileViewport && isMobileMenuOpen ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
      </Button>

      <div className="hidden min-w-0 flex-1 sm:block">
        <Breadcrumb />
      </div>

      <div className="flex min-w-0 flex-1 justify-start sm:flex-none sm:justify-center">
        <CommandPalette />
      </div>

      <DropdownMenu open={accountOpen} onOpenChange={setAccountOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-9 shrink-0" aria-label="Open account menu" aria-expanded={accountOpen}>
            <UserRound className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="font-normal">
            {account.isLoading ? (
              <span className="flex items-center gap-2 text-muted-foreground"><LoaderCircle className="size-4 animate-spin" />Loading account…</span>
            ) : user ? (
              <span className="flex min-w-0 flex-col gap-1">
                <span className="truncate text-sm font-medium text-foreground">{accountName}</span>
                {user.email && <span className="truncate text-xs text-muted-foreground">{user.email}</span>}
                {user.role && <span className="text-xs text-muted-foreground">{user.role}</span>}
              </span>
            ) : account.isError ? (
              <span className="block whitespace-normal text-xs text-muted-foreground">Account details are unavailable. Your session may have expired.</span>
            ) : (
              <span className="text-xs text-muted-foreground">Account information unavailable.</span>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => router.push('/settings')}>
            <Settings className="size-4" aria-hidden="true" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={signOut}>
            <LogOut className="size-4" aria-hidden="true" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

export default DashboardHeader;
