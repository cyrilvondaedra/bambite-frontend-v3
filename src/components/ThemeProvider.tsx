"use client";

import { useEffect } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/themes/selected`,
        );
        const {
          data: { theme },
        } = await response.json();
        console.log("Loaded theme data:", theme.colors);

        if (!theme) {
          return;
        }

        const themeToApply = theme.colors ;
        console.log("themeToApply",themeToApply);
        

        if (themeToApply) {
          applyTheme(themeToApply);
        }
      } catch (error) {
        console.error("Failed to load theme:", error);
      }
    };

    loadTheme();
  }, []);

  return <>{children}</>;
}

function applyTheme(colors: Record<string, string>) {
  Object.entries(colors).forEach(([key, value]) => {
    console.log("value",value);
    
    document.documentElement.style.setProperty(`--color-${key}`, value);
  });
}
