"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function Navbar() {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Home" },
    { href: "/ingredients", label: "Foods" },
    { href: "/ingredients", label: "Ingredients" },
    { href: "#", label: "Local Culinary" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tight text-[#1D2B4F]">mealapp</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`transition-colors hover:text-foreground/80 ${
                pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/")
                  ? "text-foreground"
                  : "text-foreground/60"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
