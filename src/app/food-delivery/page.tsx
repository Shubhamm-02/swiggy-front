'use client';

import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import Link from 'next/link';
import AppBanner from '../../components/AppBanner';
import Footer from '../../components/Footer';
import { CartCountBadge } from '../../components/CartCountBadge';
import { SignInNavLink } from '../../components/SignInNavLink';
import { useRestaurantsFromApi, type RestaurantCard } from '../../lib/useRestaurants';

function getRestaurantSlug(r: { name: string; slug?: string; id?: string }): string {
  if (r.slug) return r.slug;
  if (r.id) return r.id;
  return r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'restaurant';
}

// Map UI sort to API sort_by
function sortToApi(appliedSort: string): string | undefined {
  switch (appliedSort) {
    case 'deliveryTimeAsc': return 'delivery_time';
    case 'modelBasedRatingDesc': return 'rating';
    case 'costForTwoAsc': return 'price_low';
    case 'costForTwoDesc': return 'price_high';
    default: return undefined;
  }
}

// What's on your mind – order & structure from Swiggy snippet (collection_grid): biryani → Pastry
const MIND_BASE = 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/MERCHANDISING_BANNERS/IMAGES/MERCH';
const MIND_ITEMS = [
  { name: 'Biryani', ariaLabel: 'restaurants curated for biryani', img: `${MIND_BASE}/2024/7/2/6ef07bda-b707-48ea-9b14-2594071593d1_Biryani.png` },
  { name: 'Cake', ariaLabel: 'restaurant curated for cake', img: `${MIND_BASE}/2024/7/2/8f508de7-e0ac-4ba8-b54d-def9db98959e_cake.png` },
  { name: 'Burger', ariaLabel: 'restaurants curated for burger', img: `${MIND_BASE}/2024/7/2/8f508de7-e0ac-4ba8-b54d-def9db98959e_burger.png` },
  { name: 'Pizza', ariaLabel: 'restaurants curated for pizza', img: `${MIND_BASE}/2024/7/2/6ef07bda-b707-48ea-9b14-2594071593d1_Pizzas.png` },
  { name: 'Icecream', ariaLabel: 'restaurants curated for icecream', img: `${MIND_BASE}/2024/7/2/8f508de7-e0ac-4ba8-b54d-def9db98959e_chocolate%20icecream.png` },
  { name: 'Roll', ariaLabel: 'restaurants curated for roll', img: `${MIND_BASE}/2024/7/17/58760e8e-324f-479e-88fa-31800120ea38_Rolls1.png` },
  { name: 'Dosa', ariaLabel: 'restaurants curated for dosa', img: `${MIND_BASE}/2024/7/2/6ef07bda-b707-48ea-9b14-2594071593d1_Dosa.png` },
  { name: 'Kebabs', ariaLabel: 'restaurant curated for kebabs', img: `${MIND_BASE}/2024/7/2/6ef07bda-b707-48ea-9b14-2594071593d1_Kebabs.png` },
  { name: 'Salad', ariaLabel: 'restaurant curated for salad', img: `${MIND_BASE}/2025/1/24/186ebf5c-d9ad-4d2b-a2b0-77795e19241f_Salad2.png` },
  { name: 'Noodles', ariaLabel: 'restaurant curated for noodles', img: `${MIND_BASE}/2024/7/2/6ef07bda-b707-48ea-9b14-2594071593d1_Noodles.png` },
  { name: 'Idly', ariaLabel: 'restaurants curated for idly', img: `${MIND_BASE}/2024/7/2/6ef07bda-b707-48ea-9b14-2594071593d1_Idli.png` },
  { name: 'Pasta', ariaLabel: 'restaurant curated for pasta', img: `${MIND_BASE}/2024/7/2/f1263395-5d4a-4775-95dc-80ab6f3bbd89_pasta.png` },
  { name: 'Shawarma', ariaLabel: 'restaurant curated for shawarma', img: `${MIND_BASE}/2024/7/2/f1263395-5d4a-4775-95dc-80ab6f3bbd89_shawarma.png` },
  { name: 'Parotta', ariaLabel: 'restaurant curated for parotta', img: `${MIND_BASE}/2024/7/2/8f508de7-e0ac-4ba8-b54d-def9db98959e_Parotta.png` },
  { name: 'Paratha', ariaLabel: 'restaurants curated for paratha', img: `${MIND_BASE}/2024/7/2/6ef07bda-b707-48ea-9b14-2594071593d1_Paratha.png` },
  { name: 'Momos', ariaLabel: 'restaurant curated for momos', img: `${MIND_BASE}/2024/7/2/6ef07bda-b707-48ea-9b14-2594071593d1_Momos.png` },
  { name: 'Khichdi', ariaLabel: 'restaurants curated for khichdi', img: `${MIND_BASE}/2024/7/2/6ef07bda-b707-48ea-9b14-2594071593d1_Khichdi.png` },
  { name: 'Waffle', ariaLabel: 'restaurants curated for waffle', img: `${MIND_BASE}/2024/7/2/cb5669c8-d6f1-46ab-b24d-3da99b9fa32c_waffle.png` },
  { name: 'Juice', ariaLabel: 'restaurants curated for juice', img: `${MIND_BASE}/2024/7/2/6ef07bda-b707-48ea-9b14-2594071593d1_Orange%20juice.png` },
  { name: 'Pastry', ariaLabel: 'restaurant curated for Pastry', img: `${MIND_BASE}/2024/7/2/f1263395-5d4a-4775-95dc-80ab6f3bbd89_pastry.png` },
];

// Top restaurant chains in Bangalore – order & data from snippet (sc-jIGnZt hfRYJK cards)
const RX = 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/RX_THUMBNAIL/IMAGES/VENDOR';
const TOP_CHAINS: Array<{ name: string; rating: string; time: string; cuisines: string; location: string; offer: string; img: string; slug?: string }> = [
  { name: 'Pizza Hut', rating: '4.3', time: '35-40 mins', cuisines: 'Pizzas', location: 'Central Bangalore', offer: 'ITEMS AT ₹49', img: `${RX}/2025/9/1/5d703bb8-2414-4ab1-bcae-59bba6a52598_10575.JPG`, slug: 'pizza-hut' },
  { name: 'Barbeque Nation', rating: '4', time: '55-65 mins', cuisines: 'North Indian, Barbecue, Kebabs, Biryani, Street Food, Snacks', location: 'RAJAJI NAGAR', offer: 'ITEMS AT ₹99', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/a536e38a8033ed9c86f46ee0b3bf849a', slug: 'barbeque-nation' },
  { name: 'WeFit - Protein Bowls, Salads & Sandwiches', rating: '4.7', time: '20-30 mins', cuisines: 'Healthy Food, Salads, Keto, Snacks', location: 'Central Bangalore', offer: 'ITEMS AT ₹99', img: `${RX}/2025/2/3/c64e7364-7909-417f-a850-ea89f41c318e_643832.jpg`, slug: 'wefit' },
  { name: 'LeanCrust Pizza- ThinCrust Experts', rating: '4.6', time: '20-30 mins', cuisines: 'Pizzas, Italian, Desserts', location: 'Central Bangalore', offer: 'ITEMS AT ₹99', img: `${RX}/2024/8/30/14414940-565f-4b31-8880-eb44478a5ec0_681612.jpg`, slug: 'leancrust-pizza' },
  { name: "McDonald's", rating: '4.3', time: '35-40 mins', cuisines: 'Burgers, Beverages, Cafe, Desserts', location: 'Ashok Nagar', offer: '₹100 OFF ABOVE ₹349', img: `${RX}/2025/10/3/136c9e23-b373-45d5-9fad-7e4763ebd36b_43836.JPG`, slug: 'mcdonalds' },
  { name: 'Subway', rating: '4.5', time: '25-30 mins', cuisines: 'sandwich, Salads, wrap, Healthy Food', location: 'Vittal Mallya Road', offer: '25% OFF UPTO ₹125', img: `${RX}/2025/6/12/f4848952-184f-414f-bbe3-7a39faeddec9_69876.jpg`, slug: 'subway' },
  { name: 'Daily Kitchen - Everyday Homely Meals', rating: '4.4', time: '20-30 mins', cuisines: 'Home Food, Indian, North Indian, Thalis', location: 'Central Bangalore', offer: 'ITEMS AT ₹99', img: `${RX}/2025/6/10/05595a0f-d3f2-474e-8183-3ef3d67f3ead_750396.jpg`, slug: 'daily-kitchen' },
  { name: 'SMOOR', rating: '4.6', time: '30-35 mins', cuisines: 'Asian, Burgers, Italian, Thai, Sushi, Salads, Pastas, Pizzas, Mexican, Chinese', location: 'Lavelle Road', offer: '₹200 OFF ABOVE ₹699', img: `${RX}/2026/1/2/6ec1221b-fddf-417d-bd93-2fd514d43fde_588012.JPG`, slug: 'smoor' },
  { name: 'BOX8 - Desi Meals', rating: '4.5', time: '20-30 mins', cuisines: 'North Indian, Biryani, Thalis, Home Food', location: 'Central Bangalore', offer: 'ITEMS AT ₹69', img: `${RX}/2025/3/26/d119b3fc-a01e-428e-9b8b-9b94051a0c3e_502999.jpg`, slug: 'box8-desi-meals' },
  { name: 'Mealful Rolls - India\'s Biggest Rolls', rating: '4.4', time: '20-30 mins', cuisines: 'Fast Food, Snacks, North Indian, Desserts', location: 'Central Bangalore', offer: 'ITEMS AT ₹64', img: `${RX}/2025/12/8/14d1d14e-75f9-4982-b440-8163558b578c_503001.JPG`, slug: 'mealful-rolls' },
  { name: 'Oven Story Pizza', rating: '4.2', time: '25-30 mins', cuisines: 'Pizzas, Pastas, Italian, Desserts, Beverages', location: 'R.T. Nagar', offer: 'ITEMS AT ₹89', img: `${RX}/2025/5/29/a10d2f9d-dd61-46ea-869a-69ed106b6409_24888.jpg`, slug: 'oven-story-pizza' },
  { name: 'Truffles', rating: '4.6', time: '25-30 mins', cuisines: 'American, Desserts, Continental, Italian', location: 'St. Marks Road', offer: '₹125 OFF ABOVE ₹299', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/cd832b6167eb9f88aeb1ccdebf38d942', slug: 'truffles' },
  { name: "Glen's Bakehouse", rating: '4.6', time: '30-40 mins', cuisines: 'Desserts, Bakery, Beverages, Continental, Italian', location: 'Ashok Nagar', offer: '', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/m6jahioyu7zrodei5pcq', slug: 'glens-bakehouse' },
  { name: "Toscano's Crafted Cakes and Desserts", rating: '4.7', time: '35-40 mins', cuisines: 'Desserts, Bakery', location: 'Ashok Nagar', offer: 'ITEMS AT ₹137', img: `${RX}/2025/12/15/6f20b203-e6eb-4065-89d0-e62a02ded8e7_347256.JPG`, slug: 'toscanos' },
  { name: 'Salt - Indian Restaurant Bar & Grill', rating: '4.6', time: '30-35 mins', cuisines: 'North Indian, Kebabs, Tandoori, Biryani, Thalis', location: 'UB City', offer: '60% OFF UPTO ₹120', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/bsvhzfo27ivluydh5lwh', slug: 'salt' },
  { name: 'Itminaan Matka Biryani - Slow Cooked', rating: '4.4', time: '20-30 mins', cuisines: 'Biryani, North Indian, Mughlai', location: 'Central Bangalore', offer: 'ITEMS AT ₹139', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/e165225d26130103fecf1c40f5dc3669', slug: 'itminaan-matka-biryani' },
  { name: 'MOJO Pizza - 2X Toppings', rating: '4.6', time: '20-30 mins', cuisines: 'Pizzas, Italian, Fast Food, Desserts', location: 'Central Bangalore', offer: 'ITEMS AT ₹99', img: `${RX}/2024/12/12/e7ccd786-be92-4743-8e0c-f3d3a577d48f_622202.jpg`, slug: 'mojo-pizza' },
  { name: 'ZAZA Mughal Biryani', rating: '4.5', time: '20-30 mins', cuisines: 'Biryani, North Indian, Awadhi', location: 'Central Bangalore', offer: 'ITEMS AT ₹99', img: `${RX}/2024/9/17/d26bdfca-3b50-41ea-87e1-e7f9a6b0581d_503003.jpg`, slug: 'zaza-mughal-biryani' },
  { name: 'NH1 Bowls - Highway To North', rating: '4.6', time: '20-30 mins', cuisines: 'North Indian, Punjabi, Home Food', location: 'Central Bangalore', offer: 'ITEMS AT ₹99', img: `${RX}/2024/11/8/aea607a6-5ce6-4fe6-b7d1-7ba2bacdc647_503002.jpg`, slug: 'nh1-bowls' },
  { name: 'Nandhini Deluxe', rating: '4.4', time: '20-25 mins', cuisines: 'Andhra, Biryani, Chinese, North Indian', location: 'St. Marks Road', offer: 'ITEMS AT ₹199', img: `${RX}/2024/11/3/7f19aaac-7299-4b54-a22d-69fd67f8fb65_3434.jpg`, slug: 'nandhini-deluxe' },
];

// Swiggy StoreRating20 – green gradient circle + white star (from top_brands)
function StoreRatingStar({ id }: { id: string }) {
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="9" fill={`url(#${id})`} />
      <path d="M10.0816 12.865C10.0312 12.8353 9.96876 12.8353 9.91839 12.865L7.31647 14.3968C6.93482 14.6214 6.47106 14.2757 6.57745 13.8458L7.27568 11.0245C7.29055 10.9644 7.26965 10.9012 7.22195 10.8618L4.95521 8.99028C4.60833 8.70388 4.78653 8.14085 5.23502 8.10619L8.23448 7.87442C8.29403 7.86982 8.34612 7.83261 8.36979 7.77777L9.54092 5.06385C9.71462 4.66132 10.2854 4.66132 10.4591 5.06385L11.6302 7.77777C11.6539 7.83261 11.706 7.86982 11.7655 7.87442L14.765 8.10619C15.2135 8.14085 15.3917 8.70388 15.0448 8.99028L12.7781 10.8618C12.7303 10.9012 12.7095 10.9644 12.7243 11.0245L13.4225 13.8458C13.5289 14.2757 13.0652 14.6214 12.6835 14.3968L10.0816 12.865Z" fill="white" />
      <defs>
        <linearGradient id={id} x1="10" y1="1" x2="10" y2="19" gradientUnits="userSpaceOnUse">
          <stop stopColor="#21973B" />
          <stop offset="1" stopColor="#128540" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function FoodDeliveryPage() {
  const mindRef = useRef<HTMLDivElement>(null);
  const chainsRef = useRef<HTMLDivElement>(null);
  const [chainsScroll, setChainsScroll] = useState({ left: 0, width: 0, clientWidth: 0 });
  const [sortOpen, setSortOpen] = useState(false);
  const [sortValue, setSortValue] = useState('relevance');
  const [appliedSort, setAppliedSort] = useState('relevance');

  const { data: apiRestaurants, loading: apiLoading, error: apiError } = useRestaurantsFromApi({
    sort_by: sortToApi(appliedSort),
  });
  const sortedRestaurants: RestaurantCard[] = useMemo(() => apiRestaurants ?? [], [apiRestaurants]);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, dir: 'left' | 'right', amount: number) => {
    if (ref.current) ref.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  };

  const updateChainsScroll = useCallback(() => {
    const el = chainsRef.current;
    if (!el) return;
    setChainsScroll({ left: el.scrollLeft, width: el.scrollWidth, clientWidth: el.clientWidth });
  }, []);

  useEffect(() => {
    updateChainsScroll();
    const el = chainsRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateChainsScroll);
    ro.observe(el);
    el.addEventListener('scroll', updateChainsScroll);
    return () => {
      ro.disconnect();
      el.removeEventListener('scroll', updateChainsScroll);
    };
  }, [updateChainsScroll, TOP_CHAINS.length]);

  return (
    <main className="min-h-screen bg-white">
      {/* Top navigation – Swiggy listing page exact match from head CSS */}
      <header
        className="sticky top-0 left-0 right-0 z-[1000] h-20 bg-white px-5 will-change-transform contain-[size_layout_style] transition-transform duration-300 ease-[ease]"
        style={{ boxShadow: '0 15px 40px -20px rgba(40,44,63,.15)' }}
      >
        <div className="max-w-[1200px] min-w-0 mx-auto h-20 flex items-center">
          {/* Logo – ._1GLPZ: height 49px, margin-right 16px; VXJlj: fill #ff5200 */}
          <a href="/" className="flex-shrink-0 mr-4 block transition-transform duration-300 ease-[cubic-bezier(.215,.61,.355,1)] hover:scale-110" onClick={(e) => e.preventDefault()}>
            <svg className="h-[49px] w-auto block" viewBox="0 0 61 61" fill="none" stroke="currentColor" strokeWidth="0" aria-hidden>
              <path fill="#ff5200" d="M.32 30.5c0-12.966 0-19.446 3.498-23.868a16.086 16.086 0 0 1 2.634-2.634C10.868.5 17.354.5 30.32.5s19.446 0 23.868 3.498c.978.774 1.86 1.656 2.634 2.634C60.32 11.048 60.32 17.534 60.32 30.5s0 19.446-3.498 23.868a16.086 16.086 0 0 1-2.634 2.634C49.772 60.5 43.286 60.5 30.32 60.5s-19.446 0-23.868-3.498a16.086 16.086 0 0 1-2.634-2.634C.32 49.952.32 43.466.32 30.5Z" />
              <path fill="#FFF" fillRule="evenodd" d="M32.317 24.065v-6.216a.735.735 0 0 0-.732-.732.735.735 0 0 0-.732.732v7.302c0 .414.336.744.744.744h.714c10.374 0 11.454.54 10.806 2.73-.03.108-.066.21-.102.324-.006.024-.012.048-.018.066-2.724 8.214-10.092 18.492-12.27 21.432a.764.764 0 0 1-1.23 0c-1.314-1.776-4.53-6.24-7.464-11.304-.198-.462-.294-1.542 2.964-1.542h3.984c.222 0 .402.18.402.402v3.216c0 .384.282.738.666.768a.73.73 0 0 0 .582-.216.701.701 0 0 0 .216-.516v-4.362a.76.76 0 0 0-.756-.756h-8.052c-1.404 0-2.256-1.2-2.814-2.292-1.752-3.672-3.006-7.296-3.006-10.152 0-7.314 5.832-13.896 13.884-13.896 7.17 0 12.6 5.214 13.704 11.52.006.054.048.294.054.342.288 3.096-7.788 2.742-11.184 2.76a.357.357 0 0 1-.36-.36v.006Z" clipRule="evenodd" />
            </svg>
          </a>
          {/* Location – .wuQJ3: margin-left 30px, max-width 300px, height 30px; ._1bpfb: font-weight 600; :after 2px bottom; hover #ff5200; .kNby2 caret #ff5200 */}
          <button type="button" className="group relative flex items-center ml-6 md:ml-[30px] max-w-[300px] h-[30px] cursor-pointer mb-[-1px] pr-[10px] bg-transparent border-0 p-0 text-left">
            <span className="relative font-semibold text-[rgba(2,6,12,.9)] group-hover:text-[#ff5200] after:content-[''] after:absolute after:left-0 after:bottom-[-5px] after:h-0.5 after:w-full after:bg-[rgba(2,6,12,.9)] group-hover:after:bg-[#ff5200]">
              Other
            </span>
            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[#ff5200] font-extrabold text-[.9rem] leading-none" aria-hidden>▼</span>
          </button>
          {/* Nav right – ._3DdHb flex 1 min-w-0 flex row-reverse; .xNIjm margin-right 50px, font-size 16px font-weight 400, color rgba(2,6,12,.9), hover #ff5200 */}
          <div className="flex-1 min-w-0 flex flex-row-reverse items-center h-full mr-[-16px]">
            <CartCountBadge />
            <Link href="/orders" className="flex items-center h-full pl-7 text-base font-normal text-[rgba(2,6,12,.9)] hover:text-[#ff5200] transition-colors group">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              Recent Orders
            </Link>
            <SignInNavLink />
            <a href="#" className="flex items-center h-full pl-7 text-base font-normal text-[rgba(2,6,12,.9)] hover:text-[#ff5200] transition-colors group" onClick={(e) => e.preventDefault()}>
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Help
            </a>
            <a href="#" className="flex items-center h-full pl-7 text-base font-normal text-[rgba(2,6,12,.9)] hover:text-[#ff5200] transition-colors group relative mr-[50px]" onClick={(e) => e.preventDefault()}>
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
              <span className="relative">
                Offers
                <span className="absolute -top-2.5 right-[-22px] text-[#ffa700] text-[10px] font-semibold uppercase leading-none">NEW</span>
              </span>
            </a>
            <a href="#" className="hidden md:flex items-center h-full pl-7 text-base font-normal text-[rgba(2,6,12,.9)] hover:text-[#ff5200] transition-colors group mr-[50px]" onClick={(e) => e.preventDefault()}>
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Search
            </a>
            <a href="#" className="hidden md:flex items-center h-full pl-7 text-base font-normal text-[rgba(2,6,12,.9)] hover:text-[#ff5200] transition-colors group mr-[50px]" onClick={(e) => e.preventDefault()}>
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13a2 2 0 01-2 2h-1l-2 2H8l-2-2H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v8z" /></svg>
              Swiggy Corporate
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-4 md:px-5 py-6">
        {/* What's on your mind? – structure from actual Swiggy (sc-iBTApF, sc-dsAker hpheUG, collection_grid, sc-ioUWlN fLrdwA, sc-ilJxFg gjVXYH, sc-bLHCGa leMgOo, 144x180) */}
        <section className="sc-iBTApF sc-fXRJzk dIHtgG jnFtOt mb-8">
          <div className="sc-dsAker hpheUG" data-testid="collection_grid">
            <div data-theme="light">
              <div className="sc-ktJbId iBRlyG">
                <div className="sc-kMkxaj egzYab">
                  <div className="sc-fiCwlc eZFkXx flex items-center justify-between gap-4 mb-4">
                    <h2 className="sc-kbhJrz fKfLFK title text-xl md:text-2xl font-extrabold text-[#02060c] tracking-tight">What&apos;s on your mind?</h2>
                    <div className="sc-aXZVg dcVxGb sc-ehixzo fINqWQ sc-ioUWlN fLrdwA flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => scroll(mindRef, 'left', 180)}
                        className="sc-ixKSzz gNWrUn flex items-center justify-center w-9 h-9 rounded-full border border-[#e9e9eb] bg-white text-[#02060c] hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                        aria-label="click here to move previous"
                      >
                        <div className="sc-bvrlno sc-bEhhBa BqWZr kcLIwi flex items-center justify-center">
                          <svg aria-hidden height={16} width={16} className="sc-dcJsrY bExgxb" fill="none" stroke="currentColor" viewBox="0 0 16 16"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 12L6 8l4-4" /></svg>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => scroll(mindRef, 'right', 180)}
                        className="sc-ixKSzz kfRaUU flex items-center justify-center w-9 h-9 rounded-full border border-[#e9e9eb] bg-white text-[#02060c] hover:bg-gray-50 transition-colors"
                        aria-label="click here to move next"
                      >
                        <div className="sc-bvrlno BqWZr flex items-center justify-center">
                          <svg aria-hidden height={16} width={16} className="sc-dcJsrY bExgxb" fill="none" stroke="currentColor" viewBox="0 0 16 16"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4l4 4-4 4" /></svg>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sc-gmgFlS byiJDc">
                <div ref={mindRef} className="row flex gap-4 overflow-x-auto no-scrollbar pb-2 scroll-smooth" role="list">
                  {MIND_ITEMS.map((item) => {
                    const slug = item.name.toLowerCase().replace(/\s+/g, '-');
                    return (
                      <div key={item.name} className="sc-jIGnZt eWabVR flex-shrink-0" role="listitem">
                        <Link
                          href={`/food-delivery/${slug}`}
                          aria-label={item.ariaLabel}
                          className="sc-ilJxFg gjVXYH block"
                        >
                          <div className="sc-bLHCGa leMgOo overflow-hidden rounded-lg" style={{ width: 144, height: 180 }}>
                            <img
                              className="sc-eeDRCY eKScfy w-full h-full object-cover"
                              src={item.img}
                              alt={item.ariaLabel}
                              width={144}
                              height={180}
                            />
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* hr then Top restaurant chains in Bangalore – structure from snippet: title + scroll buttons on right */}
        <hr className="sc-llILlE cczkGK border-0 h-px bg-[#e9e9eb] my-6" />
        <div className="sc-iBTApF sc-fXRJzk dIHtgG jnFtOt mb-10">
          <div>
            <div data-testid="top_brands" className="sc-jiDjCn ebnEkk">
              <div data-theme="light">
                <div className="sc-ktJbId iBRlyG">
                  <div className="sc-kMkxaj egzYab">
                    <div className="sc-fiCwlc eZFkXx flex items-center justify-between gap-4 mb-4">
                      <h2 className="sc-kbhJrz fKfLFK title text-xl md:text-2xl font-extrabold text-[#02060c] tracking-tight">Top restaurant chains in Bangalore</h2>
                      <div className="sc-aXZVg dcVxGb sc-ehixzo fINqWQ sc-ioUWlN fLrdwA flex items-center gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => scroll(chainsRef, 'left', 320)}
                          className="sc-ixKSzz gNWrUn flex items-center justify-center w-9 h-9 rounded-full border border-[#e9e9eb] bg-white text-[#02060c] hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                          aria-label="click here to move previous"
                        >
                          <div className="sc-bvrlno sc-bEhhBa BqWZr kcLIwi flex items-center justify-center">
                            <svg aria-hidden height={16} width={16} className="sc-dcJsrY bExgxb" fill="none" stroke="currentColor" viewBox="0 0 16 16"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 12L6 8l4-4" /></svg>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => scroll(chainsRef, 'right', 320)}
                          className="sc-ixKSzz kfRaUU flex items-center justify-center w-9 h-9 rounded-full border border-[#e9e9eb] bg-white text-[#02060c] hover:bg-gray-50 transition-colors"
                          aria-label="click here to move next"
                        >
                          <div className="sc-bvrlno BqWZr flex items-center justify-center">
                            <svg aria-hidden height={16} width={16} className="sc-dcJsrY bExgxb" fill="none" stroke="currentColor" viewBox="0 0 16 16"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4l4 4-4 4" /></svg>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="sc-gmgFlS iSkJN">
                    <div
                      ref={chainsRef}
                      onScroll={updateChainsScroll}
                      className="row flex gap-4 overflow-x-auto no-scrollbar pb-2 scroll-smooth"
                      style={{ marginLeft: '-4px' }}
                    >
                      {TOP_CHAINS.map((chain, idx) => (
                        <div key={chain.name} className="sc-jIGnZt hfRYJK flex-shrink-0">
                          <div>
                            <Link href={`/restaurant/${getRestaurantSlug(chain)}`} className="sc-iSrTKI ctUvxa block no-underline text-inherit">
                              <div className="sc-jRUPCi gFZfmz flex flex-col w-[254px]">
                                <div className="sc-dCFHLb cwwyro flex-shrink-0 rounded-xl overflow-hidden w-full" style={{ height: 160 }}>
                                  <div className="sc-fhzFiK kmcVQW w-full h-full relative">
                                    <div className="sc-cWSHoV qMwEb w-full h-full">
                                      <img className="sc-eeDRCY nODVy w-full h-full object-cover" src={chain.img} alt={chain.name} width="100%" height="100%" />
                                      <div data-theme="dark" className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-6 pb-2 px-2">
                                        <div className="sc-dtInlm cBdWXe sc-eBMEME dkBijF flex items-center justify-between gap-1 text-white text-xs font-semibold">
                                          <span className="sc-aXZVg iwOBvp sc-kOPcWz aKTld" />
                                          <span className="sc-aXZVg kCePhW sc-kOPcWz aKTld truncate">{chain.offer || ' '}</span>
                                          <span className="sc-aXZVg cZfNzk sc-kOPcWz aKTld" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col min-w-0 pt-3" style={{ marginLeft: 12 }}>
                                  <div>
                                    <div className="sc-aXZVg brETgz font-bold text-[#02060c] text-base truncate">{chain.name}</div>
                                  </div>
                                  <div className="sw-restaurant-card-subtext-container flex items-center gap-1 flex-wrap mt-0.5">
                                    <div className="flex items-center -mt-0.5" style={{ marginTop: -2 }}>
                                      <StoreRatingStar id={`star-${idx}`} />
                                    </div>
                                    <div className="sc-aXZVg bKIGLW text-[13px] text-[#686b78] -mt-1" style={{ marginTop: -4 }}>
                                      <span className="sc-aXZVg cbhbwm font-semibold text-[#02060c]">{chain.rating} • </span>
                                      {chain.time}
                                    </div>
                                  </div>
                                  <div className="sw-restaurant-card-descriptions-container mt-0.5">
                                    <div className="sc-aXZVg OyTrl text-[13px] text-[#686b78] truncate">{chain.cuisines}</div>
                                    <div className="sc-aXZVg OyTrl text-[13px] text-[#686b78] truncate">{chain.location}</div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div data-theme="light" className="mt-2 flex justify-center">
                <div
                  className="sc-fTFjTM kEqfnv w-full max-w-[35%] rounded-full bg-[#e9e9eb] relative cursor-pointer"
                  style={{ height: 2 }}
                  role="scrollbar"
                  aria-label="Horizontal scrollbar for top restaurant chains"
                  onClick={(e) => {
                    const el = chainsRef.current;
                    if (!el) return;
                    const track = e.currentTarget;
                    const rect = track.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const pct = Math.max(0, Math.min(1, x / rect.width));
                    const maxScroll = el.scrollWidth - el.clientWidth;
                    el.scrollTo({ left: pct * maxScroll, behavior: 'smooth' });
                  }}
                >
                  {chainsScroll.width > chainsScroll.clientWidth && (() => {
                    const thumbPct = (chainsScroll.clientWidth / chainsScroll.width) * 100;
                    const maxScroll = chainsScroll.width - chainsScroll.clientWidth;
                    const leftPct = maxScroll > 0 ? (chainsScroll.left / maxScroll) * (100 - thumbPct) : 0;
                    return (
                      <div
                        className="absolute top-0 h-full rounded-full bg-[#ff5200] transition-[left] duration-150"
                        style={{ width: `${Math.min(thumbPct, 95)}%`, left: `${leftPct}%` }}
                      />
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurants with online food delivery in Bangalore – exact structure: hr, container (title), sc-fJbgJ, container (Sort By), restaurant_list */}
        <hr className="sc-llILlE cczkGK border-0 h-px bg-[#e9e9eb] my-6" />
        <div id="container-grid-filter-sort" className="sc-kNlxZa gVUnbB">
          <div>
            <h2 className="sc-aXZVg cBrbwn text-xl md:text-2xl font-extrabold text-[#02060c] tracking-tight">Restaurants with online food delivery in Bangalore</h2>
            <div />
          </div>
        </div>
        <div className="sc-fJbgJ hxNYuf" />
        <div id="container-grid-filter-sort" className="sc-kNlxZa gVUnbB">
          <div>
            <div className="sc-jNUliw keEiJS">
              <div data-testid="filter_widget" className="sc-doOioq dyWdxa">
                <div className="sc-cAkrUM hbXQNP relative">
                  <div data-testid="dropdown-chip" className="sc-jMakVo EBXsX">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#e9e9eb] rounded-lg bg-white text-[#02060c] font-medium text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => { setSortOpen((o) => { if (!o) setSortValue(appliedSort); return !o; }); }}
                      aria-expanded={sortOpen}
                    >
                      <div className="sc-aXZVg hwUmr">Sort By</div>
                      <div className="sc-iMTnTL hpuwEP flex items-center" style={{ fillOpacity: 1 }}>
                        <svg aria-hidden height={12} width={12} className={`sc-dcJsrY dnGnZy flex-shrink-0 transition-transform ${sortOpen ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="currentColor">
                          <path d="M2.5 4.5L6 8l3.5-3.5" />
                        </svg>
                      </div>
                    </button>
                  </div>
                  {sortOpen && (
                    <div className="sc-ihgnxF hZjSuT absolute left-0 top-full z-50 mt-1 min-w-[220px] rounded-lg border border-[#e9e9eb] bg-white py-2 shadow-lg">
                      <div className="controls-container">
                        <div className="section px-3">
                          <div data-direction="vertical" className="sc-eZkCL obVJM flex flex-col gap-0">
                            {[
                              { id: 'Sort-0', value: 'relevance', label: 'Relevance (Default)', testId: 'Sort-0' },
                              { id: 'Sort-1', value: 'deliveryTimeAsc', label: 'Delivery Time', testId: 'Sort-1' },
                              { id: 'Sort-2', value: 'modelBasedRatingDesc', label: 'Rating', testId: 'Sort-2' },
                              { id: 'Sort-3', value: 'costForTwoAsc', label: 'Cost: Low to High', testId: 'Sort-3' },
                              { id: 'Sort-4', value: 'costForTwoDesc', label: 'Cost: High to Low', testId: 'Sort-4' },
                            ].map((opt) => (
                              <label
                                key={opt.id}
                                data-testid={opt.testId}
                                className="sc-dZoequ ffYvyg flex cursor-pointer items-center gap-3 py-2.5 px-2 rounded hover:bg-[#f8f8f8]"
                              >
                                <input
                                  type="radio"
                                  name="Sort"
                                  value={opt.value}
                                  checked={sortValue === opt.value}
                                  onChange={() => setSortValue(opt.value)}
                                  aria-label={opt.label}
                                  className="sr-only"
                                />
                                <span className="custom-checkbox flex-shrink-0" style={{ marginTop: 3 }}>
                                  {sortValue === opt.value ? (
                                    <svg aria-hidden width={16} height={16} viewBox="0 0 16 16" fill="none" className="sc-dcJsrY jgDmOG">
                                      <circle cx="8" cy="8" r="6" fill="#ff5200" stroke="#ff5200" strokeWidth="2" />
                                    </svg>
                                  ) : (
                                    <svg aria-hidden width={16} height={16} viewBox="0 0 16 16" fill="none" className="sc-dcJsrY bExgxb">
                                      <circle cx="8" cy="8" r="7" stroke="#e9e9eb" strokeWidth="1.5" fill="none" />
                                    </svg>
                                  )}
                                </span>
                                <span className={`sc-aXZVg text-sm ${sortValue === opt.value ? 'fdFUBF font-semibold text-[#02060c]' : 'gCijQr text-[#02060c99]'}`}>
                                  {opt.label}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div className="button-container border-t border-[#e9e9eb] mt-2 pt-2 px-3">
                          <button
                            type="button"
                            className="sc-gFVvzn biqNdf w-full rounded-lg bg-[#ff5200] py-2.5 text-sm font-semibold text-white hover:bg-[#e64a00] transition-colors cursor-pointer"
                            onClick={() => { setAppliedSort(sortValue); setSortOpen(false); }}
                          >
                            <span className="sc-aXZVg WHNGr sc-brPLxw xFpyX">Apply</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div />
          </div>
        </div>
        <div className="sc-iBTApF sc-fXRJzk dIHtgG jnFtOt">
          <div>
            {apiLoading && (
              <p className="text-[#686b78] text-sm py-6">Loading restaurants…</p>
            )}
            {apiError && (
              <p className="text-red-600 text-sm py-6" role="alert">{apiError}. Ensure the backend is running (e.g. POST /api/seed to seed data).</p>
            )}
            <div data-testid="restaurant_list" className="sc-kOHTFB iynxeh grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {!apiLoading && sortedRestaurants.map((r, idx) => (
                <div key={r.id} data-testid="restaurant_list_card">
                  <Link href={`/restaurant/${getRestaurantSlug(r)}`} className="sc-hkaVUD kCcAII block no-underline text-inherit">
                    <div className="sc-jRUPCi gFZfmz flex flex-col w-full">
                      <div className="sc-dCFHLb cwwyro flex-shrink-0 rounded-xl overflow-hidden w-full" style={{ height: 160 }}>
                        <div className="sc-fhzFiK kmcVQW w-full h-full relative">
                          <div className="sc-cWSHoV qMwEb w-full h-full">
                            <img className="sc-eeDRCY nODVy w-full h-full object-cover" src={r.img} alt={r.name} width="100%" height="100%" />
                            <div data-theme="dark" className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-6 pb-2 px-2">
                              <div className="sc-dtInlm cBdWXe sc-eBMEME dkBijF flex items-center justify-between gap-1 text-white text-xs font-semibold">
                                <span className="sc-aXZVg iwOBvp sc-kOPcWz aKTld" />
                                <span className="sc-aXZVg kCePhW sc-kOPcWz aKTld truncate">{r.offer || ' '}</span>
                                <span className="sc-aXZVg cZfNzk sc-kOPcWz aKTld" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={{ marginLeft: '12px' }}>
                        <div>
                          <div className="sc-aXZVg brETgz font-bold text-[#02060c] text-base truncate">{r.name}</div>
                        </div>
                        <div className="sw-restaurant-card-subtext-container flex items-center gap-1 flex-wrap mt-0.5">
                          <div style={{ marginTop: -2 }}>
                            <StoreRatingStar id={`res-star-${idx}`} />
                          </div>
                          <div className="sc-aXZVg bKIGLW text-[13px] text-[#686b78]" style={{ marginTop: -4 }}>
                            <span className="sc-aXZVg cbhbwm font-semibold text-[#02060c]">{r.rating} • </span>
                            {r.time}
                          </div>
                        </div>
                        <div className="sw-restaurant-card-descriptions-container mt-0.5">
                          <div className="sc-aXZVg OyTrl text-[13px] text-[#686b78] truncate">{r.cuisines}</div>
                          <div className="sc-aXZVg OyTrl text-[13px] text-[#686b78] truncate">{r.location}</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div />
                </div>
              ))}
            </div>
            <div />
            <div />
          </div>
        </div>

        {/* Best Places to Eat Across Cities */}
        <div className="sc-iBTApF sc-uYXSi dIHtgG hifeyv mt-12 pt-2">
          <div>
            <div data-testid="interlinking_content">
              <div className="sc-dGHkRN eypswK">
                <h2 className="sc-aXZVg cBrbwn text-xl md:text-2xl font-extrabold text-[#02060c] tracking-tight">Best Places to Eat Across Cities</h2>
              </div>
              <div className="sc-cJbhSk hZulil flex flex-wrap gap-4 mt-6">
                {[
                  'Bangalore', 'Pune', 'Mumbai', 'Delhi', 'Hyderabad', 'Kolkata', 'Chennai', 'Chandigarh', 'Ahmedabad', 'Jaipur', 'Nagpur', 'Bhubaneswar', 'Kochi', 'Surat', 'Dehradun', 'Ludhiana', 'Patna', 'Mangaluru', 'Bhopal', 'Gurgaon', 'Coimbatore', 'Agra', 'Noida', 'Vijayawada', 'Guwahati', 'Mysore', 'Pondicherry', 'Thiruvananthapuram', 'Ranchi', 'Vizag', 'Udaipur', 'Vadodara',
                ].map((city) => (
                  <a key={city} href="#" className="sc-lccgLh dteGaB no-underline" onClick={(e) => e.preventDefault()}>
                    <div className="sc-fbFiXs ephaob">
                      <div className="sc-bJUkQH lnyuub">
                        <div className="sc-aXZVg hotnzO text-[#02060c] text-sm font-medium hover:text-[#ff5200] transition-colors px-3 py-2 border border-[#e9e9eb] rounded-lg bg-white hover:bg-gray-50">Best Restaurants in {city}</div>
                      </div>
                    </div>
                  </a>
                ))}
                <button type="button" className="sc-leXBFf eGoiMh border border-[#e9e9eb] rounded-lg bg-white px-3 py-2 text-sm font-medium text-[#02060c] hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-1" onClick={(e) => e.preventDefault()}>
                  <div className="sc-fbFiXs ephaob">
                    <div className="sc-bJUkQH lnyuub flex items-center gap-1">
                      <div className="sc-aXZVg cidEgL">Show More</div>
                      <div className="sc-hXCwRK cyvuvM">
                        <svg aria-hidden height={12} width={12} className="sc-dcJsrY jgDmOG" viewBox="0 0 12 12" fill="currentColor"><path d="M2.5 4.5L6 8l3.5-3.5" fill="currentColor" /></svg>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
            <div />
          </div>
        </div>

        <div className="sc-fJbgJ sc-eBAZHg hxNYuf dOAFob min-h-[2rem] py-8" />

        {/* Best Cuisines Near Me */}
        <div className="sc-iBTApF sc-uYXSi dIHtgG hifeyv mt-4">
          <div>
            <div data-testid="interlinking_content">
              <div className="sc-dGHkRN eypswK">
                <h2 className="sc-aXZVg cBrbwn text-xl md:text-2xl font-extrabold text-[#02060c] tracking-tight">Best Cuisines Near Me</h2>
              </div>
              <div className="sc-cJbhSk hZulil flex flex-wrap gap-4 mt-6">
                {[
                  'Chinese', 'South Indian', 'Indian', 'Kerala', 'Korean', 'North Indian', 'Seafood', 'Bengali', 'Punjabi', 'Italian', 'Andhra', 'Biryani', 'Japanese', 'Arabian', 'Fast Food', 'Jain', 'Gujarati', 'Thai', 'Pizzas', 'Asian', 'Cafe', 'Continental', 'Mexican', 'Mughlai', 'Sushi', 'Mangalorean', 'Tibetan', 'Barbecue', 'Maharashtrian', 'Nepalese', 'Rajasthani', 'Turkish',
                ].map((cuisine) => (
                  <a key={cuisine} href="#" className="sc-lccgLh dteGaB no-underline" onClick={(e) => e.preventDefault()}>
                    <div className="sc-fbFiXs ephaob">
                      <div className="sc-bJUkQH lnyuub">
                        <div className="sc-aXZVg hotnzO text-[#02060c] text-sm font-medium hover:text-[#ff5200] transition-colors px-3 py-2 border border-[#e9e9eb] rounded-lg bg-white hover:bg-gray-50">{cuisine} Restaurant Near Me</div>
                      </div>
                    </div>
                  </a>
                ))}
                <button type="button" className="sc-leXBFf eGoiMh border border-[#e9e9eb] rounded-lg bg-white px-3 py-2 text-sm font-medium text-[#02060c] hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-1" onClick={(e) => e.preventDefault()}>
                  <div className="sc-fbFiXs ephaob">
                    <div className="sc-bJUkQH lnyuub flex items-center gap-1">
                      <div className="sc-aXZVg cidEgL">Show More</div>
                      <div className="sc-hXCwRK cyvuvM">
                        <svg aria-hidden height={12} width={12} className="sc-dcJsrY jgDmOG" viewBox="0 0 12 12" fill="currentColor"><path d="M2.5 4.5L6 8l3.5-3.5" fill="currentColor" /></svg>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
            <div />
          </div>
        </div>

        <div className="sc-fJbgJ sc-eBAZHg hxNYuf dOAFob min-h-[2rem] py-8" />

        {/* Explore Every Restaurants Near Me */}
        <div className="sc-iBTApF sc-uYXSi dIHtgG hifeyv mt-4">
          <div>
            <div data-testid="interlinking_content">
              <div className="sc-dGHkRN eypswK">
                <h2 className="sc-aXZVg cBrbwn text-xl md:text-2xl font-extrabold text-[#02060c] tracking-tight">Explore Every Restaurants Near Me</h2>
              </div>
              <div className="sc-cJbhSk hZulil flex flex-wrap gap-4 mt-6">
                <a href="#" className="sc-lccgLh dteGaB no-underline" onClick={(e) => e.preventDefault()}>
                  <div className="sc-fbFiXs ephaob">
                    <div className="sc-bJUkQH lnyuub">
                      <div className="sc-aXZVg hotnzO text-[#02060c] text-sm font-medium hover:text-[#ff5200] transition-colors px-3 py-2 border border-[#e9e9eb] rounded-lg bg-white hover:bg-gray-50">Explore Restaurants Near Me</div>
                    </div>
                  </div>
                </a>
                <a href="#" className="sc-lccgLh dteGaB no-underline" onClick={(e) => e.preventDefault()}>
                  <div className="sc-fbFiXs ephaob">
                    <div className="sc-bJUkQH lnyuub">
                      <div className="sc-aXZVg hotnzO text-[#02060c] text-sm font-medium hover:text-[#ff5200] transition-colors px-3 py-2 border border-[#e9e9eb] rounded-lg bg-white hover:bg-gray-50">Explore Top Rated Restaurants Near Me</div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
            <div />
          </div>
        </div>

        <div className="sc-fJbgJ sc-eBAZHg hxNYuf dOAFob min-h-[2rem] py-8" />
      </div>

      {/* App download banner – full width dark band + store buttons */}
      <div className="mt-12" />
      <AppBanner />

      {/* Footer – full width, inner max-w for content */}
      <Footer />
    </main>
  );
  }
  