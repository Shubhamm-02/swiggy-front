'use client';

import React from 'react';

/**
 * Wraps the app so client-side hydration and event handlers attach correctly.
 * Without this, some setups can leave buttons unresponsive after SSR.
 */
export function ClientRoot({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
