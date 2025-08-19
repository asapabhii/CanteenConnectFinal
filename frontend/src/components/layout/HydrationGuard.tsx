import { useEffect, useState } from 'react';

export const HydrationGuard = ({ children }: { children: React.ReactNode }) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // A simple delay to allow zustand to hydrate from local storage
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 100); // A small delay is usually enough
    return () => clearTimeout(timer);
  }, []);

  return isHydrated ? <>{children}</> : null; // Render nothing until hydrated
};