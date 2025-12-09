'use client'

import { ThemeProvider } from './ThemeProvider'

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}