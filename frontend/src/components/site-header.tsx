"use client"

import Link from "next/link"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export function SiteHeader() {
  const { theme, toggle } = useTheme()

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-warm">
            <span className="text-lg font-bold">د</span>
          </span>
          <span className="text-xl font-bold tracking-tight">دُردکشان</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="/" className="transition-colors hover:text-foreground">
            خانه
          </Link>
          <a href="#speakers" className="transition-colors hover:text-foreground">
            سخنوران
          </a>
          <a href="#categories" className="transition-colors hover:text-foreground">
            دسته‌بندی‌ها
          </a>
          <a href="#about" className="transition-colors hover:text-foreground">
            درباره
          </a>
        </nav>

        <button
          onClick={toggle}
          aria-label="تغییر حالت روشن و تاریک"
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  )
}
