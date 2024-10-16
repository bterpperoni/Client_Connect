'use client'

import { Button } from "$/app/components/ui/button"
import { Separator } from "$/app/components/ui/separator"

export function SimpleNav() {
  return (
    <nav className="w-full bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-start h-16 space-x-4">
          <Button variant="ghost">Dashboard</Button>
          <Button variant="ghost">Tasks</Button>
        </div>
      </div>
      <Separator />
    </nav>
  )
}