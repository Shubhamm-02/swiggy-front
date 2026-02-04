'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';

const BASE = 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/PC_Mweb';

function categorySlug(name: string): string {
  return name.toLowerCase();
}

// Order and items from snippet: Row 1 then Row 2
const ROW1 = [
  { name: 'Cake', img: `${BASE}/Cake.png` },
  { name: 'Pizza', img: `${BASE}/Pizza.png` },
  { name: 'Burger', img: `${BASE}/Burger.png` },
  { name: 'Biryani', img: `${BASE}/Biryani.png` },
  { name: 'Rolls', img: `${BASE}/Rolls.png` },
  { name: 'Samosa', img: `${BASE}/Samosa.png` },
  { name: 'Salad', img: `${BASE}/Salad.png` },
  { name: 'Dosa', img: `${BASE}/Dosa.png` },
  { name: 'Idli', img: `${BASE}/Idli.png` },
  { name: 'Tea', img: `${BASE}/Tea.png` },
];
const ROW2 = [
  { name: 'Noodles', img: `${BASE}/Noodles.png` },
  { name: 'Pasta', img: `${BASE}/Pasta.png` },
  { name: 'Shawarma', img: `${BASE}/Shawarma.png` },
  { name: 'Momo', img: `${BASE}/Momo.png` },
  { name: 'Pastry', img: `${BASE}/Pastry.png` },
  { name: 'Shake', img: `${BASE}/Shake.png` },
  { name: 'Juice', img: `${BASE}/Juice.png` },
  { name: 'Vada', img: `${BASE}/Vada.png` },
  { name: 'Parotta', img: `${BASE}/Parotta.png` },
  { name: 'Khichdi', img: `${BASE}/Khichdi.png` },
];

// 10 cards × (144px + 40px margin) = 1840px – one scroll container so both rows stay in sync
const ROW_WIDTH = 10 * (144 + 40);

function FoodOptionCard({ name, img, slug }: { name: string; img: string; slug: string }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/food-delivery/${slug}`);
  };

  return (
    <div className="sc-iHmpnF iPOqfT">
      <div>
        <div className="sc-eWzREE bOruKC" style={{ marginRight: 40 }}>
          <button
            type="button"
            onClick={handleClick}
            className="sc-fFlnrN gNzDuI block p-0 border-0 bg-transparent cursor-pointer overflow-hidden"
            style={{ width: 144, minWidth: 144, height: 180, minHeight: 180 }}
            aria-label={`Restaurants curated for ${name.toLowerCase()}`}
          >
            <img className="sc-eeDRCY nODVy sc-gweoQa epodGz w-full h-full object-cover" src={img} alt={name} />
          </button>
        </div>
        <div />
      </div>
    </div>
  );
}

const SCROLL_AMOUNT = 184;

const FoodOptions = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'right' ? SCROLL_AMOUNT : -SCROLL_AMOUNT,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="sc-jIGnZt NTwnN mt-10 md:mt-12">
      <div className="sc-kbhJrz ifklP flex items-center justify-between gap-4 mb-4">
        <div className="sc-ehixzo irLoo">
          <div className="sc-aXZVg knOYjD sc-bpUBKd hmGNkX title text-xl md:text-2xl font-extrabold text-[#02060c] tracking-tight">
            <div>Order our best food options</div>
          </div>
          <div className="sc-aXZVg dcVxGb sc-eyvILC hNwxyF"> </div>
        </div>
        <div className="sc-aXZVg dcVxGb sc-eyvILC hNwxyF flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-[#e9e9eb] bg-white text-[#02060c] hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
            aria-label="Scroll left"
          >
            <svg aria-hidden className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-[#e9e9eb] bg-white text-[#02060c] hover:bg-gray-50 transition-colors"
            aria-label="Scroll right"
          >
            <svg aria-hidden className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="sc-fBdRDi fyzirx overflow-x-auto no-scrollbar pb-2"
        style={{ marginLeft: -4 }}
      >
        <div className="flex flex-col gap-0" style={{ width: ROW_WIDTH, minWidth: ROW_WIDTH }}>
          <div className="row flex flex-shrink-0">
            {ROW1.map((item) => (
              <FoodOptionCard key={item.name} name={item.name} img={item.img} slug={categorySlug(item.name)} />
            ))}
          </div>
          <div className="row flex flex-shrink-0">
            {ROW2.map((item) => (
              <FoodOptionCard key={item.name} name={item.name} img={item.img} slug={categorySlug(item.name)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodOptions;
