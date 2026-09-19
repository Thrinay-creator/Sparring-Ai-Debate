import { useState, useEffect, useCallback } from 'react';

/**
 * Lightweight browser router hook.
 * Synchronizes with window.location.pathname and browser back/forward buttons (popstate).
 * No external dependencies required.
 */
export function useRouter() {
  const [currentPath, setCurrentPath] = useState(() => {
    // Check if recovery link landed on root with hash
    if (window.location.hash && window.location.hash.includes('type=recovery')) {
      return '/reset-password';
    }
    return window.location.pathname || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash && window.location.hash.includes('type=recovery')) {
        setCurrentPath('/reset-password');
      } else {
        setCurrentPath(window.location.pathname || '/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((toPath) => {
    if (toPath !== window.location.pathname) {
      window.history.pushState({}, '', toPath);
    }
    setCurrentPath(toPath);
    window.scrollTo(0, 0);
  }, []);

  return {
    currentPath,
    navigate
  };
}
