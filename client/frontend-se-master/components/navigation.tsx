"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, MessageSquare, User, Heart, ChevronRight, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Navigation() {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)

  const navItems = [
    {
      name: "Home",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "All Destinations",
      href: "/dashboard/fulldestinations",
      icon: MessageSquare,
    },
    {
      name: "My Bookings",
      href: "/dashboard/bookings",
      icon: Calendar,
    },
    {
      name: "Profile Information",
      href: "/dashboard/profile",
      icon: User,
    },
    {
      name: "Favorite Places",
      href: "/dashboard/favorites",
      icon: Heart,
    },
  ]

  return (
    <nav
      className={cn("border-r bg-white transition-all duration-300 ease-in-out", isExpanded ? "w-64" : "w-16")}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center justify-center rounded-md py-2 text-sm font-medium transition-colors",
                isExpanded ? "px-3 justify-start" : "px-0",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <div className={cn("flex items-center justify-center", isExpanded ? "" : "w-full")}>
                <item.icon className="h-5 w-5" />
              </div>
              <span
                className={cn(
                  "ml-3 transition-all duration-200",
                  isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden absolute",
                )}
              >
                {item.name}
              </span>
              {!isExpanded && <span className="sr-only">{item.name}</span>}
            </Link>
          )
        })}
      </div>

      <div
        className={cn("absolute right-0 top-1/2 -translate-y-1/2 transform", isExpanded ? "opacity-0" : "opacity-100")}
      >
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </nav>
  )
}
