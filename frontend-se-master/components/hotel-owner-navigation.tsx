"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

export default function HotelOwnerNavigation() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Manage Hotels",
      href: "/hotel/dashboard",
      icon: Building,
    },
    {
      name: "Manage Bookings",
      href: "/hotel/dashboard/bookings",
      icon: Calendar,
    },
  ]

  return (
    <nav className="w-50 border-r bg-white">
      <div className="p-3">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
