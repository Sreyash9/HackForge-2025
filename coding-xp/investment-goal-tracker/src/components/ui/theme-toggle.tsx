
"use client";

import * as React from "react";
import { useTheme } from "@/components/ui/theme-provider";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    // Render a placeholder or nothing on the server and during initial client render
    // to avoid a hydration mismatch.
    return <Button variant="outline" size="sm" disabled={true} className="w-[58px]"></Button>;
  }

  return (
    <Button variant="outline" size="sm" onClick={toggle} title={theme === "dark" ? "Switch to Light mode" : "Switch to Dark mode"}>
      {theme === "dark" ? "Light" : "Dark"}
    </Button>
  );
}
