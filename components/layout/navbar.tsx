"use client"

import Link from "next/link"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tight text-[#1D2B4F] dark:text-white">
            mealapp
          </span>
        </Link>
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
