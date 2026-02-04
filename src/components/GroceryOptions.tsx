'use client';

import React, { useRef } from 'react';

const CATEGORIES = [
  { name: 'Fresh Vegetables', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2025/5/14/43e3c412-4ca9-4894-82ba-24b69da80aa6_06c0d2a9-804c-4bf1-8725-7ebd234e144a' },
  { name: 'Fresh Fruits', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2025/5/14/a1493d81-f21e-415f-9875-f78383590fc2_9f3f0f68-4fbe-40f6-8f5d-5472a03469bd' },
  { name: 'Dairy, Bread and Eggs', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2025/5/14/6dea6676-ce07-45e6-b60c-a099c01c5462_6d33297a-5828-48ff-aa2a-c052ae97669e' },
  { name: 'Rice, Atta and Dals', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2025/5/14/097900ca-5d2d-4bb0-8e54-aede1e58dfd8_eab3796c-ac17-48fd-bfc7-6356c6f89783' },
  { name: 'Masalas and Dry Fruits', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2025/5/14/64714677-e6b6-41c1-b533-6644d43e55f7_76ef86af-0483-41a5-8387-37901bf4ca6a' },
  { name: 'Oils and Ghee', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2025/5/14/8e48ee13-3b51-49ea-b765-5cf3e7a97c04_695caa8a-c2f6-4a1a-9672-53213fea21aa' },
  { name: 'Munchies', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2024/7/6/73e018a7-d342-475e-aaca-ec5cd3d0c59f_228ff3d4-ff21-44db-9768-7a369c65ce6a' },
  { name: 'Sweet Tooth', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2024/7/6/83a9b71b-1db7-4cbe-a9f7-ead650d26326_3afbe8c8-f5c8-4dd7-8357-f5711f80646b' },
  { name: 'Cold Drinks and Juices', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2024/7/6/37d399b1-52d2-47ef-bdd8-8951e51819fc_0361a93d-e864-49be-a57d-46c958eb7b56' },
  { name: 'Biscuits and Cakes', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2024/7/6/76a7104c-0f11-4182-aa51-0d48efc2be7f_aae098f9-aaff-4504-a222-bf13595d58cd' },
  { name: 'Instant and Frozen Food', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2025/5/14/1a08f110-17b6-4785-92d4-404825b75f2d_869c1986-d9c1-4d46-b1c3-10c79a052a59' },
  { name: 'Meat and Seafood', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2025/5/14/25be4b2d-a9de-495e-a9a4-9a6d6a3d13c0_5f571281-eef0-4820-9982-d8bdd9af91c6' },
  { name: 'Cereals and Breakfast', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2025/5/14/012beae1-c31a-4360-9b32-173080b64652_aa07a04e-5f2e-4c00-86f6-297344906f01' },
  { name: 'Sauces and Spreads', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2024/7/6/e2f96940-2657-4a4b-a5e1-0c3413ba25cb_8b977351-a415-442a-bb9c-320e1642f740' },
  { name: 'Tea, Coffee and More', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2025/5/14/5fc3d15a-26b0-41e0-93ab-39ada0f553c2_82e0ff9f-558c-45dd-af3e-fdc16d0aa471' },
  { name: 'Cleaning Essentials', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2024/7/6/73a47bc4-c684-447f-9908-22da3ecd3ba2_c9948a61-3dca-4e29-82b4-31178d38746b' },
  { name: 'Pharma and Hygiene', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2025/5/14/fc74f557-a203-4dba-8955-82d6c608e91e_7d2481f0-8614-400c-b25c-554a655c14c7' },
  { name: 'Bath, Body and Hair', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2024/7/6/4342c814-6ff9-4bbe-a360-95200ad602a0_1905dc17-a04d-4a9e-9a4e-adde9b27f321' },
  { name: 'Paan Corner', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2025/3/25/1eae2df9-95a5-40e5-a2c0-92bb4893637a_5e1e6c72-dde5-4a12-8bdf-c7cbc4b0644b' },
  { name: 'Home and Kitchen', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2025/5/14/657a922d-067a-4e0b-b967-b3e0c7906fa9_485311db-2f22-4193-a05d-963f18a89150' },
  { name: 'Office and Electricals', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2025/5/14/52a66c89-6516-489f-96ac-b15286900648_ebbfd2d1-9b36-4ce3-b08c-7378f1ca6d7d' },
  { name: 'Baby Care', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2024/7/6/cbbab04b-845a-44bd-aa63-329276af1714_c6c9dc53-ae50-475a-89d8-b03824c4a98a' },
  { name: 'Pet Supplies', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2025/5/14/705173ff-7cd9-4d7e-9e5b-3886d81411b9_bb324827-9556-48e4-b8f6-280706478fe2' },
  { name: 'Beauty and Grooming', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2025/5/14/e160e4c4-2114-4e3d-97ff-3922125a3b2e_224bcfa1-77e3-47e5-aea5-1ab060585b4b' },
];

const CARD_WIDTH = 144 + 40; // 184px per card
const ROW_WIDTH = CATEGORIES.length * CARD_WIDTH;
const SCROLL_AMOUNT = 184;

function GroceryCard({ name, img }: { name: string; img: string }) {
  return (
    <div className="sc-iHmpnF iPOqfT cursor-not-allowed">
      <div>
        <div className="sc-eWzREE bOruKC" style={{ marginRight: 40 }}>
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            aria-label={name}
            aria-disabled
            className="sc-fFlnrN gNzDuI block p-0 border-0 bg-transparent cursor-not-allowed overflow-hidden w-full text-left"
            style={{ width: 144, minWidth: 144, height: 180, minHeight: 180 }}
          >
            <img className="sc-eeDRCY nODVy sc-gweoQa epodGz w-full h-full object-cover" src={img} alt={name} />
          </button>
          <div className="sc-cDnByv nDJTd">
            <div className="sc-aXZVg dfNLup">{name}</div>
          </div>
        </div>
        <div />
      </div>
    </div>
  );
}

const GroceryOptions = () => {
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
          <div className="sc-aXZVg knOYjD sc-bpUBKd hmGNkX title text-xl md:text-2xl font-extrabold text-[#02060c] tracking-tight cursor-not-allowed">
            <span>Shop groceries on Instamart</span>
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
        className="sc-fBdRDi hOIpT overflow-x-auto no-scrollbar pb-2"
        style={{ marginLeft: -4 }}
      >
        <div className="row flex flex-shrink-0" style={{ width: ROW_WIDTH, minWidth: ROW_WIDTH }}>
          {CATEGORIES.map((item) => (
            <GroceryCard key={item.name} name={item.name} img={item.img} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroceryOptions;
