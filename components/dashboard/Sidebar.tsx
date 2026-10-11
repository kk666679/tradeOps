"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { LayoutDashboard, Package, BarChart3, Truck, Warehouse, Link as LinkIcon, ShoppingCart, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BrandLogo } from '@/components/branding/BrandLogo'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/inventory', label: 'Inventory', icon: Package },
  { href: '/dashboard/forecasting', label: 'Forecasting', icon: BarChart3 },
  { href: '/dashboard/transportation', label: 'Transportation', icon: Truck },
  { href: '/dashboard/wms', label: 'Warehouse', icon: Warehouse },
  { href: '/dashboard/order-management', label: 'Orders', icon: ShoppingCart },
  { href: '/dashboard/integrations', label: 'Integrations', icon: LinkIcon },
  { href: '/dashboard/vector', label: 'Vector AI', icon: Layers },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 h-screen fixed left-0 top-0 z-50 hidden md:block">
      <ScrollArea className="h-full">
        <div className="p-4">
          <Link href="/dashboard" aria-label="TradeOps Dashboard" className="inline-flex">
            <BrandLogo size="md" variant="full" />
          </Link>
          <Separator className="my-4" />
          <nav className="space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start',
                    pathname === href && 'bg-accent text-accent-foreground'
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </ScrollArea>
    </aside>
  )
}
