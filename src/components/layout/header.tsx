import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from './theme-toggle';
import { APP_NAME } from '@/lib/constants';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1">
        {/* Optionally add breadcrumbs or page title here */}
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {/* Placeholder for User Profile if needed in future */}
        {/* <UserNav /> */}
      </div>
    </header>
  );
}
