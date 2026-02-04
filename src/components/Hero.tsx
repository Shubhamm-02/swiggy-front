'use client';

import { useRouter } from 'next/navigation';

import React, { useEffect, useRef, useState } from 'react';

const Hero = () => {
    const router = useRouter();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setShowDropdown(false);
        }
      }
      function handleKey(event: KeyboardEvent) {
        if (event.key === 'Escape') setShowDropdown(false);
      }
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKey);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKey);
      };
    }, []);

    // Images URLs
    const leftImage = "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/testing/seo-home/Veggies_new.png";
    const rightImage = "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/testing/seo-home/Sushi_replace.png";

    return (
        <div className="w-full relative bg-swiggy-orange min-h-[560px] flex flex-col justify-end pt-32 pb-16">
            {/* Background Images - positioned absolutely */}
            <div className="absolute left-0 top-0 h-full w-[200px] xl:w-[350px] z-10 hidden lg:block">
                <img src={leftImage} alt="Vegetables" className="w-full h-full object-cover object-right-top opacity-90" />
            </div>
            <div className="absolute right-0 top-0 h-full w-[200px] xl:w-[350px] z-10 hidden lg:block">
                <img src={rightImage} alt="Sushi" className="w-full h-full object-cover object-left-top opacity-90" />
            </div>

            <div className="container-max relative z-20 flex flex-col items-center px-4">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-[40px] leading-[1.2] font-semibold text-white tracking-tight mb-2">
                        Order food & groceries. Discover <br /> best restaurants. Swiggy it!
                    </h1>
                </div>

                {/* Search Bar Container */}
                <div className="relative flex flex-col md:flex-row items-center gap-4 mb-14 w-full max-w-[1000px]">
                    {/* Location Input */}
                    <div className="flex-1 w-full md:w-auto">
                        <div
                          onClick={() => setShowDropdown(prev => !prev)}
                          onFocus={() => setShowDropdown(true)}
                          className="flex items-center bg-white rounded-[28px] px-6 h-16 cursor-pointer border border-gray-200 shadow-sm hover:shadow-lg transition-shadow"
                        >
                            <span className="text-swiggy-orange mr-4">
                                <svg viewBox="0 0 32 32" className="w-6 h-6 fill-current">
                                    <path d="M16 0c-5.523 0-10 4.477-10 10 0 1.637.387 3.179 1.073 4.545l.039.076.024.043c2.724 4.508 8.864 12.338 8.864 12.338s6.14-7.83 8.864-12.338l.024-.043.039-.076c.686-1.366 1.073-2.908 1.073-4.545 0-5.523-4.477-10-10-10zM16 14c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"></path>
                                </svg>
                            </span>
                            <input
                              type="text"
                              placeholder="Enter your delivery location"
                              className="w-full outline-none text-gray-700 font-semibold placeholder-gray-400 text-base"
                              onFocus={() => setShowDropdown(true)}
                              aria-haspopup="true"
                              aria-expanded={showDropdown}
                            />
                            <span className="text-gray-500">
                                <svg className={`w-4 h-4 transform transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </span>
                        </div>
                    </div> 
                    {/* Search Input */}
                    <div className="flex-[1.5] w-full md:w-auto relative">
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const el = document.getElementById('restaurant-list');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="flex items-center bg-white rounded-2xl px-5 h-14 relative hover:shadow-lg transition-shadow cursor-pointer"
                        >
                            <input id="hero-search" type="text" placeholder="Search for restaurant, item or more" className="w-full outline-none text-gray-700 font-medium placeholder-gray-400 text-sm" />
                            <button type="submit" aria-label="Search" className="absolute right-5 text-gray-500">
                                <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </button>
                        </form>
                    </div>

                    {showDropdown && (
                      <div ref={dropdownRef} className="absolute left-1/2 -translate-x-1/2 top-full mt-4 bg-white rounded-[24px] shadow-[0_12px_30px_rgba(7,11,20,0.12)] p-6 z-50 w-[80%] max-w-[900px]">
                        <div className="flex items-center gap-4">
                          <span className="text-swiggy-orange">
                            <svg viewBox="0 0 32 32" className="w-6 h-6 fill-current">
                              <path d="M16 0c-5.523 0-10 4.477-10 10 0 1.637.387 3.179 1.073 4.545l.039.076.024.043c2.724 4.508 8.864 12.338 8.864 12.338s6.14-7.83 8.864-12.338l.024-.043.039-.076c.686-1.366 1.073-2.908 1.073-4.545 0-5.523-4.477-10-10-10zM16 14c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" />
                            </svg>
                          </span>
                          <div className="font-semibold text-swiggy-orange text-xl">Use my current location</div>
                        </div>
                      </div>
                    )}
                </div>

                {/* Service Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] w-full max-w-[1000px]">
                    {/* Food Delivery Card - navigates to /food-delivery */}
                    <div className="relative cursor-pointer hover:scale-[1.02] transition-transform duration-300">
                        <button
                            type="button"
                            aria-label="Food Delivery"
                            onClick={() => {
                                // Use Next.js router for client-side navigation
                                // This requires 'useRouter' from next/navigation (app directory) or next/router (pages directory)
                                // Assuming app directory
                                // At the top of your component: import { useRouter } from "next/navigation";
                                router.push('/food-delivery');
                            }}
                            className="block w-full text-left p-0 border-0 bg-transparent"
                            tabIndex={0}
                        >
                            <img
                                src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/23/ec86a309-9b06-48e2-9adc-35753f06bc0a_Food3BU.png"
                                alt="Food Delivery"
                                className="w-full h-auto object-contain rounded-[24px]"
                                draggable="false"
                            />
                        </button>
                    </div>

                    {/* Instamart Card – not available; disabled cursor on hover */}
                    <div className="relative cursor-not-allowed transition-transform duration-300">
                        <button
                            type="button"
                            onClick={(e) => e.preventDefault()}
                            className="block w-full text-left p-0 border-0 bg-transparent cursor-not-allowed"
                            aria-disabled
                        >
                            <img
                                src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/23/b5c57bbf-df54-4dad-95d1-62e3a7a8424d_IM3BU.png"
                                alt="Instamart"
                                className="w-full h-auto object-contain rounded-3xl"
                            />
                        </button>
                    </div>

                    {/* Dineout Card – not available; disabled cursor on hover */}
                    <div className="relative cursor-not-allowed transition-transform duration-300">
                        <button type="button" onClick={(e) => e.preventDefault()} className="block w-full text-left p-0 border-0 bg-transparent cursor-not-allowed" aria-disabled>
                            <img
                                src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/23/b6d9b7ab-91c7-4f72-9bf2-fcd4ceec3537_DO3BU.png"
                                alt="Dineout"
                                className="w-full h-auto object-contain rounded-3xl"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
