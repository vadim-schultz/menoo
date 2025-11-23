"use client"

import { ClientOnly, IconButton, Skeleton } from '@chakra-ui/react'
import { ThemeProvider, useTheme, type ThemeProviderProps } from 'next-themes'
import { type ReactNode, useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export type ColorModeProviderProps = Omit<ThemeProviderProps, 'children'> & {
  children: ReactNode
}

export function ColorModeProvider({
  children,
  attribute = 'class',
  defaultTheme = 'light',
  storageKey = 'chakra-ui-color-mode',
  forcedTheme,
  enableSystem = true,
  disableTransitionOnChange = false,
}: ColorModeProviderProps) {
  return (
    <ThemeProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      storageKey={storageKey}
      forcedTheme={forcedTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
    >
      {children}
    </ThemeProvider>
  )
}

export function useColorMode() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const colorMode = mounted ? (resolvedTheme || theme) : undefined
  const toggleColorMode = () => {
    const currentResolved = resolvedTheme || theme
    if (currentResolved === 'dark') {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }

  return {
    colorMode: colorMode as 'light' | 'dark' | undefined,
    theme: theme as 'light' | 'dark' | 'system' | undefined,
    resolvedTheme: resolvedTheme as 'light' | 'dark' | undefined,
    setColorMode: setTheme,
    toggleColorMode,
  }
}

export function useColorModeValue<T>(lightValue: T, darkValue: T): T {
  const { colorMode } = useColorMode()
  return colorMode === 'dark' ? darkValue : lightValue
}

export function ColorModeButton() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <ClientOnly fallback={<Skeleton boxSize="8" />}>
      <IconButton
        onClick={toggleColorMode}
        aria-label="Toggle color mode"
      >
        {colorMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </IconButton>
    </ClientOnly>
  )
}

export function LightMode({ children }: { children: ReactNode }) {
  const { setColorMode } = useColorMode()
  useEffect(() => {
    setColorMode('light')
  }, [setColorMode])
  return <>{children}</>
}

export function DarkMode({ children }: { children: ReactNode }) {
  const { setColorMode } = useColorMode()
  useEffect(() => {
    setColorMode('dark')
  }, [setColorMode])
  return <>{children}</>
}

