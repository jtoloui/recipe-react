import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Keep the screen awake while `active` is true, using the Screen Wake Lock API
 * (supported on iOS Safari 16.4+, Chrome, Edge). Gracefully no-ops where the
 * API is unavailable. Re-acquires the lock when the tab becomes visible again
 * (the browser drops the lock on tab switch / screen off).
 */
export const useWakeLock = (active: boolean) => {
  const sentinelRef = useRef<WakeLockSentinel | null>(null);
  const [isSupported] = useState(
    () => typeof navigator !== 'undefined' && 'wakeLock' in navigator
  );

  const release = useCallback(async () => {
    try {
      await sentinelRef.current?.release();
    } catch {
      // ignore — releasing an already-released lock throws on some browsers
    }
    sentinelRef.current = null;
  }, []);

  const acquire = useCallback(async () => {
    if (!isSupported || sentinelRef.current) return;
    try {
      sentinelRef.current = await navigator.wakeLock.request('screen');
      // The browser auto-releases on visibility loss; clear our ref so a later
      // visibility change re-acquires cleanly.
      sentinelRef.current.addEventListener('release', () => {
        sentinelRef.current = null;
      });
    } catch {
      // request can reject (low battery, permission) — treat as unsupported
      sentinelRef.current = null;
    }
  }, [isSupported]);

  useEffect(() => {
    if (!active) {
      void release();
      return;
    }

    void acquire();

    const onVisibility = () => {
      if (document.visibilityState === 'visible' && active) {
        void acquire();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      void release();
    };
  }, [active, acquire, release]);

  return { isSupported };
};

export default useWakeLock;
