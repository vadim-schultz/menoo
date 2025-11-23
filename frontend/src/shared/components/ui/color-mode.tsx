import { ClientOnly, IconButton, Skeleton } from '@chakra-ui/react'
import { type ReactNode, useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

const COLOR_MODE_STORAGE_KEY = 'chakra-ui-color-mode'

function getColorMode(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem(COLOR_MODE_STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function setColorMode(mode: 'light' | 'dark') {
  localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode)
  // Chakra UI v3 uses data-theme attribute for color mode
  document.documentElement.setAttribute('data-theme', mode)
  document.documentElement.classList.toggle('dark', mode === 'dark')
  document.documentElement.classList.toggle('light', mode === 'light')
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const mode = getColorMode()
    setColorMode(mode)
  }, [])
  return <>{children}</>
}

export function useColorMode() {
  const [colorMode, setColorModeState] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light'
    return getColorMode()
  })

  useEffect(() => {
    const mode = getColorMode()
    setColorModeState(mode)
    setColorMode(mode)

    // Listen for system preference changes only if no explicit preference is set
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      const stored = localStorage.getItem(COLOR_MODE_STORAGE_KEY)
      if (!stored) {
        const newMode = mediaQuery.matches ? 'dark' : 'light'
        setColorModeState(newMode)
        setColorMode(newMode)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleColorMode = () => {
    const newMode = colorMode === 'dark' ? 'light' : 'dark'
    setColorModeState(newMode)
    setColorMode(newMode)
  }

  const setColorModeValue = (mode: 'light' | 'dark') => {
    setColorModeState(mode)
    setColorMode(mode)
  }

  return {
    colorMode,
    toggleColorMode,
    setColorMode: setColorModeValue,
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
      <IconButton onClick={toggleColorMode} aria-label="Toggle color mode">
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

