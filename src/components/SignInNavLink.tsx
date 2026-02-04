'use client';

import React from 'react';
import { useAuthStore } from '@/store/authStore';

type SignInNavLinkProps = {
  className?: string;
};

export function SignInNavLink({ className }: SignInNavLinkProps) {
  const user = useAuthStore((s) => s.user);

  const openLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('open-login'));
  };

  const baseClass =
    'flex items-center h-full pl-7 text-base font-normal text-[rgba(2,6,12,.9)] hover:text-[#ff5200] transition-colors group';

  if (user) {
    return (
      <span
        className={className ?? baseClass}
        role="status"
        aria-label="Account"
      >
        <svg
          className="w-5 h-5 mr-2 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        Account
      </span>
    );
  }

  return (
    <a
      href="#"
      className={className ?? baseClass}
      onClick={openLogin}
      aria-label="Sign in"
    >
      <svg
        className="w-5 h-5 mr-2 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
      Sign In
    </a>
  );
}
