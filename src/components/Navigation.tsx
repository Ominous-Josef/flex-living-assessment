"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Bell,
  Building2,
  ChevronDown,
  Home,
  Menu,
  Star,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

interface NavigationProps {
  children: React.ReactNode;
}

interface NavigationItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
  badge?: string;
  children?: NavigationItem[];
}

const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
    description: "Overview of all properties and reviews",
  },
  {
    title: "Properties",
    href: "/properties",
    icon: Building2,
    description: "Manage your property portfolio",
  },
  {
    title: "Reviews",
    href: "/reviews",
    icon: Star,
    description: "Review management and approval",
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    description: "Performance insights and trends",
  },
];

function NavigationContent({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const renderNavigationItem = (item: NavigationItem, isChild = false) => {
    const isActive =
      pathname === item.href ||
      (item.children && item.children.some((child) => pathname === child.href));
    const isExpanded = expandedItems.includes(item.title);
    const hasChildren = item.children && item.children.length > 0;
    const IconComponent = item.icon;

    return (
      <div key={item.title} className={cn("space-y-1", isChild && "ml-4")}>
        <div
          className={cn(
            "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer",
            isActive && "bg-accent text-accent-foreground",
            isChild && "py-1.5 text-xs"
          )}
          onClick={() => {
            if (hasChildren && !isChild) {
              toggleExpanded(item.title);
            } else {
              onItemClick?.();
            }
          }}
        >
          <div className="flex items-center gap-3">
            {!isChild && IconComponent && <IconComponent className="h-4 w-4" />}
            <Link
              href={item.href}
              className="flex-1"
              onClick={(e) => {
                if (hasChildren && !isChild) {
                  e.preventDefault();
                }
              }}
            >
              {item.title}
            </Link>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto text-xs">
                {item.badge}
              </Badge>
            )}
          </div>
          {hasChildren && !isChild && (
            <ChevronDown
              className={cn(
                "h-3 w-3 transition-transform",
                isExpanded && "rotate-90"
              )}
            />
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-1 ml-2">
            {item.children?.map((child) => renderNavigationItem(child, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full w-full flex-col">
      {/* Header */}
      <div className="flex h-14 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Building2 className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold">Flex Living</span>
            <span className="text-xs text-muted-foreground">
              Reviews Dashboard
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navigationItems.map((item) => renderNavigationItem(item))}
        </div>

        <Separator className="my-4" />
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
          <div className="flex-1 text-sm">
            <p className="font-medium">Property Manager</p>
            <p className="text-muted-foreground text-xs">
              manager@flexliving.com
            </p>
          </div>
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Navigation({ children }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-muted/40">
        <NavigationContent />
      </aside>

      {/* Mobile Navigation */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <NavigationContent onItemClick={() => setIsMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold">Flex Living</span>
          </div>
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
        </div>

        {/* Page Content */}
        <div className="p-6 pt-16 md:pt-6">{children}</div>
      </main>
    </div>
  );
}
