"use client"

import * as React from "react"
import { Info, Monitor, Moon, Palette, Sun, Settings, ChevronLeft } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AboutDialog } from "@/components/about-dialog"

export function ThemeToggle() {
  const { setTheme } = useTheme()
  const [aboutDialogOpen, setAboutDialogOpen] = React.useState(false)
  const [showAppearanceMenu, setShowAppearanceMenu] = React.useState(false)
  const [menuOpen, setMenuOpen] = React.useState(false)

  // Reset internal state when the main dropdown is closed
  const handleMenuOpenChange = (open: boolean) => {
    setMenuOpen(open)
    if (!open) {
      setShowAppearanceMenu(false)
    }
  }

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={handleMenuOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="focus-visible:ring-0 focus-visible:ring-offset-0">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {showAppearanceMenu ? (
            <>
              {/* This item acts as a "back" button and header */}
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault() // Prevent menu from closing
                  setShowAppearanceMenu(false)
                }}
                className="font-semibold"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Appearance
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="mr-2 h-4 w-4" />
                <span>System</span>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault() // Prevent menu from closing
                  setShowAppearanceMenu(true)
                }}
              >
                <Palette className="mr-2 h-4 w-4" />
                <span>Appearance</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setAboutDialogOpen(true)}>
                <Info className="mr-2 h-4 w-4" />
                <span>About</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <AboutDialog open={aboutDialogOpen} onOpenChange={setAboutDialogOpen} />
    </>
  )
}
