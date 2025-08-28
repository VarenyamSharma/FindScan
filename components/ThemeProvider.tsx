'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

// Use a permissive props type to avoid depending on internal next-themes type paths
export function ThemeProvider({ children, ...props }: any) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}