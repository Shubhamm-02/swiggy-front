'use client';

import React from 'react';

export default function AppBanner() {
  return (
    <div className="w-full mt-10 md:mt-12" data-testid="app_download_links">
      <img
        alt="Get the Swiggy App banner"
        className="object-contain w-full h-full"
        src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/seo/App_download_banner.png"
      />
    </div>
  );
}
