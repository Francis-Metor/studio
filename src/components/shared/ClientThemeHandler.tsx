
'use client';

import { useEffect } from 'react';
import { useAppState } from '@/context/AppStateContext';

const themeOptionsList = [ // Ensure this list matches theme values used elsewhere
  "theme-red", "theme-orange", "theme-yellow", 
  "theme-green", "theme-vibrant-blue", "theme-indigo", "theme-violet"
];

export default function ClientThemeHandler() {
  const { appTheme } = useAppState();

  useEffect(() => {
    const body = document.body;
    
    // Remove all known theme classes first to avoid conflicts
    themeOptionsList.forEach(themeClass => {
      body.classList.remove(themeClass);
    });

    // Apply the current theme if it's not the default
    if (appTheme && appTheme !== 'default') {
      body.classList.add(appTheme);
    }
    // The 'dark' class is handled separately by NextThemes or manual toggle,
    // so we don't interfere with it here.
  }, [appTheme]);

  return null; // This component does not render anything
}

    