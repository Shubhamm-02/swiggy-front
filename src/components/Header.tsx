"use client";
import React from 'react';
import Link from 'next/link';
import { useAuthStore, maskEmail } from '@/store/authStore';

const Header = () => {
    const user = useAuthStore((s) => s.user);
    const signOut = useAuthStore((s) => s.signOut);

    return (
        <header className="absolute top-0 left-0 right-0 z-50 pt-8 px-4 md:px-20 bg-transparent text-white">
            <div className="container-max flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Logo */}
                    <a href="/" className="scale-100 hover:scale-110 transition-transform duration-300">
                        <img
                            src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/static-assets/images/swiggy_logo_white.png"
                            alt="Swiggy"
                            className="w-8 h-8 md:w-12 md:h-12 lg:w-48 lg:h-14 object-contain hidden lg:block"
                        />
                        {/* Fallback/Mobile Logo */}
                        <div className="flex items-center gap-2 lg:hidden">
                            <svg className="fill-white w-8 h-8" viewBox="0 0 61 61"><g clipPath="url(#a)"><path fill="#FFF" d="M.32 30.5c0-12.966 0-19.446 3.498-23.868a16.086 16.086 0 0 1 2.634-2.634C10.868.5 17.354.5 30.32.5s19.446 0 23.868 3.498c.978.774 1.86 1.656 2.634 2.634C60.32 11.048 60.32 17.534 60.32 30.5s0 19.446-3.498 23.868a16.086 16.086 0 0 1-2.634 2.634C49.772 60.5 43.286 60.5 30.32 60.5s-19.446 0-23.868-3.498a16.086 16.086 0 0 1-2.634-2.634C.32 49.952.32 43.466.32 30.5Z"></path><path fill="#FF5200" fillRule="evenodd" d="M32.317 24.065v-6.216a.735.735 0 0 0-.732-.732.735.735 0 0 0-.732.732v7.302c0 .414.336.744.744.744h.714c10.374 0 11.454.54 10.806 2.73-.03.108-.066.21-.102.324-.006.024-.012.048-.018.066-2.724 8.214-10.092 18.492-12.27 21.432a.764.764 0 0 1-1.23 0c-1.314-1.776-4.53-6.24-7.464-11.304-.198-.462-.294-1.542 2.964-1.542h3.984c.222 0 .402.18.402.402v3.216c0 .384.282.738.666.768a.73.73 0 0 0 .582-.216.701.701 0 0 0 .216-.516v-4.362a.76.76 0 0 0-.756-.756h-8.052c-1.404 0-2.256-1.2-2.814-2.292-1.752-3.672-3.006-7.296-3.006-10.152 0-7.314 5.832-13.896 13.884-13.896 7.17 0 12.6 5.214 13.704 11.52.006.054.048.294.054.342.288 3.096-7.788 2.742-11.184 2.76a.357.357 0 0 1-.36-.36v.006Z" clipRule="evenodd"></path></g><defs><clipPath id="a"><path fill="#fff" d="M.32.5h60v60h-60z"></path></clipPath></defs></svg>
                            <span className="font-bold text-2xl">Swiggy</span>
                        </div>
                    </a>
                </div>

                <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
                    <button type="button" onClick={(e) => e.preventDefault()} className="hover:opacity-80 transition-opacity bg-transparent border-none text-inherit cursor-pointer font-inherit">
                        Swiggy Corporate
                    </button>
                    <button type="button" onClick={(e) => e.preventDefault()} className="hover:opacity-80 transition-opacity bg-transparent border-none text-inherit cursor-pointer font-inherit">
                        Partner with us
                    </button>
                    <a href="#app-banner" className="border border-white rounded-xl px-4 py-3 flex items-center gap-2 hover:bg-white hover:text-swiggy-orange transition-colors">
                        Get the App
                        <span className="text-lg">↗</span>
                    </a>
                    {user ? (
                        <div className="flex items-center gap-3">
                            <Link href="/orders" className="text-white/90 hover:text-white transition-colors">
                                Recent Orders
                            </Link>
                            <span className="text-white/90">Hi, {user.name || maskEmail(user.email)}</span>
                            <button type="button" onClick={() => signOut()} className="bg-black text-white rounded-xl px-6 py-3 hover:bg-gray-900 transition-colors cursor-pointer">
                                Sign out
                            </button>
                        </div>
                    ) : (
                        <button onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('open-login')); }} className="bg-black text-white rounded-xl px-6 py-3 hover:bg-gray-900 transition-colors cursor-pointer">
                            Sign in
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
