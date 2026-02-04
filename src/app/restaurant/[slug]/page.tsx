'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore, getCartItemId } from '@/store/cartStore';
import { CartCountBadge } from '@/components/CartCountBadge';
import RestaurantFromApi from './RestaurantFromApi';

const BASE = 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660';

const OFFERS_BASE = 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_96,h_96';

type Deal = {
  title: string;
  subtitle?: string;
  icon?: 'orange' | 'purple';
  timerText?: string;
  iconImg?: string;
};
type MenuItem = { name: string; price: number; description: string; veg: boolean; image?: string; bestseller?: boolean };
type MenuCategory = { title: string; items: MenuItem[] };
const TOPPICK_PLACEHOLDERS = [
  'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/green_placeholder',
  'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/red_placeholder',
  'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/blue_placeholder',
  'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/brown_placeholder',
] as const;

const PIZZAHUT_TOP_PICKS_IMG = 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_292,h_300/TopPicks/PrDiGiftHamper';
const PIZZAHUT_TOP_PICKS: Array<{ name: string; veg: boolean; price: number; offerPrice: number | null; bgUrl: string }> = [
  { name: 'Paneer Makhni Masala Flatzz Pizza', veg: true, price: 359, offerPrice: 559, bgUrl: TOPPICK_PLACEHOLDERS[0] },
  { name: 'Overloaded Veggies Flatzz Pizza', veg: true, price: 359, offerPrice: 559, bgUrl: TOPPICK_PLACEHOLDERS[1] },
  { name: 'Ultimate Flatzz Pizza', veg: false, price: 399, offerPrice: 599, bgUrl: TOPPICK_PLACEHOLDERS[2] },
  { name: 'Tandoori Chicken Flatzz Pizza', veg: false, price: 399, offerPrice: 599, bgUrl: TOPPICK_PLACEHOLDERS[3] },
  { name: 'Tandoori Paneer Ultimate Cheese Pizza', veg: true, price: 374, offerPrice: null, bgUrl: TOPPICK_PLACEHOLDERS[0] },
  { name: 'Chicken Tikka Ultimate Cheese Pizza', veg: false, price: 434, offerPrice: null, bgUrl: TOPPICK_PLACEHOLDERS[1] },
];

const FOOD_CMS = 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS';
type PizzaHutRecommendedItem = {
  name: string;
  veg: boolean;
  bestseller: boolean;
  price: number;
  rating: string;
  ratingsCount: number;
  ratingFill: '#116649' | '#1BA672';
  ratingClass: 'kwGXdv' | 'hyOybz';
  description: string;
  imageUrl: string;
  imageBg: string;
  customisable: boolean;
  descBlockClass: 'jkPAmQ' | 'iQBPNo';
  descTextClass: 'jiJudb' | 'kWsTbb';
  rightColClass: 'ihUMdj' | 'jbEYva';
};
const PIZZAHUT_RECOMMENDED: PizzaHutRecommendedItem[] = [
  { name: 'Margherita', veg: true, bestseller: true, price: 169, rating: '4.6', ratingsCount: 350, ratingFill: '#116649', ratingClass: 'kwGXdv', description: 'Pizza topped with our herb-infused signature pan sauce and mozzarella cheese. A classic treat for all cheese lovers out there! (PAN Per/Med-292 Kcal/100g | TnC-293 Kcal/100g | Stuffed Crust Add : Per: 295 Kcal/Pizza | Med: 448kcal/Pizza| Ultimate Cheese : PER: 250 kcal/Pizza | MED: 375 kcal/Pizza. Contains Cereals containing Gluten (Wheat), Soya and Milk & Milk Products.', imageUrl: `${FOOD_CMS}/2026/1/5/41b56b0c-c864-4081-8c9c-ed4585cb3a5c_e725dfb8-341d-4ef3-9914-e7a2634187aa.jpg`, imageBg: 'rgb(251, 238, 215)', customisable: true, descBlockClass: 'jkPAmQ', descTextClass: 'jiJudb', rightColClass: 'ihUMdj' },
  { name: 'Veggie Feast', veg: true, bestseller: false, price: 259, rating: '4.6', ratingsCount: 136, ratingFill: '#116649', ratingClass: 'kwGXdv', description: 'Serves 1 | Herbed onion and green capsicum, juicy sweet corn & mozzarella cheese with flavourful pan sauce (PAN Per/Med-269 Kcal/100g | TnC-274 Kcal/100g | Stuffed Crust Add : Per: 295 Kcal/Pizza | Med: 448kcal/Pizza| Ultimate Cheese : PER: 250 kcal/Pizza | MED: 375 kcal/Pizza. Contains Cereals containing Gluten (Wheat), Soya and Milk & Milk Products.', imageUrl: `${FOOD_CMS}/2026/1/5/185b654c-4ff2-42ca-991e-11caf0781cb5_9fd71142-80db-4471-bec2-f80db3b1e08f.jpg`, imageBg: 'rgb(229, 241, 211)', customisable: true, descBlockClass: 'jkPAmQ', descTextClass: 'jiJudb', rightColClass: 'ihUMdj' },
  { name: 'Tandoori Paneer', veg: true, bestseller: false, price: 299, rating: '3.8', ratingsCount: 149, ratingFill: '#1BA672', ratingClass: 'hyOybz', description: 'Serves 1 | It\'s our signature. Spiced paneer, crunchy onions & green capsicum, spicy red paprika with delicious tandoori sauce and mozzarella cheese! (PAN Per/Med-335 Kcal/100g | TnC-326 Kcal/100g | Stuffed Crust Add : Per: 295 Kcal/Pizza | Med: 448kcal/Pizza| Ultimate Cheese : PER: 250 kcal/Pizza | MED: 375 kcal/Pizza. Contains Cereals containing Gluten (Wheat), Soya and Milk & Milk Products.', imageUrl: `${FOOD_CMS}/2026/1/5/413649b2-52b2-42d8-afcf-fff2174192b2_71809375-48ba-48f6-bdba-b464956098bb.jpg`, imageBg: 'rgb(224, 238, 245)', customisable: true, descBlockClass: 'jkPAmQ', descTextClass: 'jiJudb', rightColClass: 'ihUMdj' },
  { name: 'Country Feast', veg: true, bestseller: false, price: 299, rating: '4.5', ratingsCount: 48, ratingFill: '#116649', ratingClass: 'kwGXdv', description: 'Serves 1 | Loaded with herbed onion & green capsicum, sweet corn, tomato with signature pan sauce and mozzarella cheese. It\'s a feast you can\'t refuse (PAN Per/Med-244 Kcal/100g | TnC-282 Kcal/100g | Stuffed Crust Add : Per: 295 Kcal/Pizza | Med: 448kcal/Pizza| Ultimate Cheese : PER: 250 kcal/Pizza | MED: 375 kcal/Pizza. Contains Cereals containing Gluten (Wheat), Soya and Milk & Milk Products.', imageUrl: `${FOOD_CMS}/2026/1/5/40b16d1c-c89d-4938-8a34-031e6792ee0f_3b7f3b2b-cd20-47c0-b68e-9740ee2c3c6a.jpg`, imageBg: 'rgb(246, 230, 233)', customisable: true, descBlockClass: 'jkPAmQ', descTextClass: 'jiJudb', rightColClass: 'ihUMdj' },
  { name: 'Veggie Supreme', veg: true, bestseller: false, price: 359, rating: '4.0', ratingsCount: 127, ratingFill: '#116649', ratingClass: 'kwGXdv', description: 'Serves 1 | A supreme combination of black olives, green capsicum, mushroom, onion, spicy red paprika & juicy sweet corn with flavourful pan sauce and mozzarella cheese. (PAN Per/Med-254 Kcal/100g | TnC-258 Kcal/100g | Stuffed Crust Add : Per: 295 Kcal/Pizza | Med: 448kcal/Pizza| Ultimate Cheese : PER: 250 kcal/Pizza | MED: 375 kcal/Pizza. Contains Cereals containing Gluten (Wheat), Soya and Milk & Milk Products.', imageUrl: `${FOOD_CMS}/2026/1/5/497f5159-0ffd-4f0f-ba40-9411e04bf4c1_80ec6a1d-5289-4d2c-b143-74e57132937a.jpg`, imageBg: 'rgb(251, 238, 215)', customisable: true, descBlockClass: 'jkPAmQ', descTextClass: 'jiJudb', rightColClass: 'ihUMdj' },
  { name: 'Chicken Sausage', veg: false, bestseller: false, price: 249, rating: '4.3', ratingsCount: 93, ratingFill: '#116649', ratingClass: 'kwGXdv', description: 'Serves 1 | Pizza topped with chicken n cheese sausages & crunchy onions, flavourful pan sauce and mozzarella cheese (PAN Per/Med-310 Kcal/100g | TnC-312 Kcal/100g | Stuffed Crust Add : Per: 295 Kcal/Pizza | Med: 448kcal/Pizza| Ultimate Cheese : PER: 250 kcal/Pizza | MED: 375 kcal/Pizza| Stuff Crust Chicken Seekh Kebab Add : Per: 389 kcal/Pizza | Med: 614 Kcal/Pizza. Contains Cereals containing Gluten (Wheat), Soya and Milk & Milk Products.', imageUrl: `${FOOD_CMS}/2026/1/12/587afcd6-e8d7-47b3-b8b2-0e6ed49b49e1_4bf7d761-f113-45ae-907b-f086e78d9fbf.jpg`, imageBg: 'rgb(229, 241, 211)', customisable: true, descBlockClass: 'jkPAmQ', descTextClass: 'jiJudb', rightColClass: 'ihUMdj' },
  { name: 'Murg Malai Chicken', veg: false, bestseller: false, price: 359, rating: '4.2', ratingsCount: 16, ratingFill: '#116649', ratingClass: 'kwGXdv', description: 'Serves 1 | Amazingly flavourful chicken malai tikka, herbed onion & green capsicum, spicy red paprika with flavourful pan sauce and mozzarella cheese (PAN Per/Med-269 Kcal/100g | TnC-299 Kcal/100g | Stuffed Crust Add : Per: 295 Kcal/Pizza | Med: 448kcal/Pizza| Ultimate Cheese : PER: 250 kcal/Pizza | MED: 375 kcal/Pizza| Stuff Crust Chicken Seekh Kebab Add : Per: 389 kcal/Pizza | Med: 614 Kcal/Pizza. Contains Cereals containing Gluten (Wheat), Soya and Milk & Milk Products.', imageUrl: `${FOOD_CMS}/2026/1/5/0727a66a-07ce-4ff6-8ffb-ec2d070aab85_055da41f-a59a-49a2-8524-975e3f59d6d7.jpg`, imageBg: 'rgb(224, 238, 245)', customisable: true, descBlockClass: 'jkPAmQ', descTextClass: 'jiJudb', rightColClass: 'ihUMdj' },
  { name: 'Chicken Supreme', veg: false, bestseller: false, price: 379, rating: '4.2', ratingsCount: 78, ratingFill: '#116649', ratingClass: 'kwGXdv', description: 'Serves 1 | Loaded with delicious chicken tikka, flavourful herbed chicken, spicy schezwan chicken meatball with flavourful pan sauce and mozzarella cheese. (PAN Per/Med-273 Kcal/100g | TnC-284 Kcal/100g | Stuffed Crust Add : Per: 295 Kcal/Pizza | Med: 448kcal/Pizza| Ultimate Cheese : PER: 250 kcal/Pizza | MED: 375 kcal/Pizza| Stuff Crust Chicken Seekh Kebab Add : Per: 389 kcal/Pizza | Med: 614 Kcal/Pizza. Contains Cereals containing Gluten (Wheat), Soya and Milk & Milk Products.', imageUrl: `${FOOD_CMS}/2026/1/5/9cb9383d-5776-450a-91c9-51cd839c55b1_6eed4f34-f7a7-4f67-abfa-649de5903176.jpg`, imageBg: 'rgb(246, 230, 233)', customisable: true, descBlockClass: 'jkPAmQ', descTextClass: 'jiJudb', rightColClass: 'ihUMdj' },
  { name: 'Triple Chicken Feast', veg: false, bestseller: false, price: 379, rating: '4.9', ratingsCount: 48, ratingFill: '#116649', ratingClass: 'kwGXdv', description: 'Serves 1 | Spicy schezwan chicken meatball, flavourful herbed chicken, juicy chicken sausage, green capsicum & onion, spicy red paprika with classic pan sauce and mozzarella cheese (PAN Per/Med-262 Kcal/100g | TnC-277 Kcal/100g | Stuffed Crust Add : Per: 295 Kcal/Pizza | Med: 448kcal/Pizza| Ultimate Cheese : PER: 250 kcal/Pizza | MED: 375 kcal/Pizza| Stuff Crust Chicken Seekh Kebab Add : Per: 389 kcal/Pizza | Med: 614 Kcal/Pizza. Contains Cereals containing Gluten (Wheat), Soya and Milk & Milk Products.', imageUrl: `${FOOD_CMS}/2026/1/5/006ba8b5-ae01-468f-aa2b-0f29d5f18777_acb7a7c2-4f55-4792-894f-c31653f249c1.jpg`, imageBg: 'rgb(251, 238, 215)', customisable: true, descBlockClass: 'jkPAmQ', descTextClass: 'jiJudb', rightColClass: 'ihUMdj' },
  { name: 'Classic Onion Capsicum', veg: true, bestseller: true, price: 109, rating: '4.4', ratingsCount: 278, ratingFill: '#116649', ratingClass: 'kwGXdv', description: 'Serves 1 | Pizza topped with our classic pan sauce, crunchy onion & capsicum and a flavourful dressing. (307 Kcal/100g). Contains Cereals containing Gluten (Wheat), Soya and Milk & Milk Products.', imageUrl: `${FOOD_CMS}/2026/1/2/43d430bb-cf34-4230-b88e-8784728fd3ef_06fd1528-17e2-418e-bc67-d7e7b8e493bf.jpg`, imageBg: 'rgb(229, 241, 211)', customisable: true, descBlockClass: 'jkPAmQ', descTextClass: 'jiJudb', rightColClass: 'ihUMdj' },
  { name: 'Cheesy Spicy Delight', veg: true, bestseller: false, price: 169, rating: '4.3', ratingsCount: 35, ratingFill: '#116649', ratingClass: 'kwGXdv', description: 'Pizza topped with mozzarella cheese, a flavourful dressing, onion and spicy green chilli, sprinkled with our signature spiced seasoning. (367 Kcal/100g). Contains Cereals containing Gluten (Wheat), Soya and Milk & Milk Products.', imageUrl: `${FOOD_CMS}/2026/1/2/78fc6391-10f2-45b3-afd4-416a3bfb8260_dc58c551-a663-4499-b951-99b287116ced.jpg`, imageBg: 'rgb(224, 238, 245)', customisable: true, descBlockClass: 'jkPAmQ', descTextClass: 'jiJudb', rightColClass: 'ihUMdj' },
  { name: 'Chilli Paneer Sizzle', veg: true, bestseller: false, price: 189, rating: '4.3', ratingsCount: 52, ratingFill: '#116649', ratingClass: 'kwGXdv', description: 'Pizza topped with spiced paneer, a spicy Schezwan sauce, juicy tomato, crunchy onion & capsicum and a flavourful dressing. (298 Kcal/100g). Contains Cereals containing Gluten (Wheat), Soya and Milk & Milk Products.', imageUrl: `${FOOD_CMS}/2026/1/5/ee217a6b-423d-4cab-a98f-edec542c7103_563a38ad-b7e7-4e49-bcf0-c55a49a980b9.jpg`, imageBg: 'rgb(246, 230, 233)', customisable: true, descBlockClass: 'jkPAmQ', descTextClass: 'jiJudb', rightColClass: 'ihUMdj' },
  { name: 'Classic Chicken Pepperoni & Onion', veg: false, bestseller: false, price: 159, rating: '4.3', ratingsCount: 8, ratingFill: '#116649', ratingClass: 'kwGXdv', description: 'Pizza topped with our classic signature pan sauce, chicken pepperoni, crunchy onion and a flavourful dressing. (332 Kcal/100g). Contains Cereals containing Gluten (Wheat), Soya and Milk & Milk Products.', imageUrl: `${FOOD_CMS}/2026/1/2/e6f4237a-55ab-46a4-adbe-cbf79541416f_ef441d3e-0f31-4c12-b114-08a564de7ee9.jpg`, imageBg: 'rgb(251, 238, 215)', customisable: true, descBlockClass: 'jkPAmQ', descTextClass: 'jiJudb', rightColClass: 'ihUMdj' },
  { name: 'Classic Herbed Chicken & Capsicum', veg: false, bestseller: false, price: 179, rating: '4.4', ratingsCount: 10, ratingFill: '#116649', ratingClass: 'kwGXdv', description: 'Pizza topped with our classic signature pan sauce, herbed chicken, crunchy capsicum and a flavourful dressing. (331 Kcal/100g). Contains Cereals containing Gluten (Wheat), Soya and Milk & Milk Products.', imageUrl: `${FOOD_CMS}/2026/1/2/4bd67a36-e254-489a-9519-3118951e5b11_1a56a4d2-72dd-46cc-aa17-8c806f086c91.jpg`, imageBg: 'rgb(229, 241, 211)', customisable: true, descBlockClass: 'jkPAmQ', descTextClass: 'jiJudb', rightColClass: 'ihUMdj' },
  { name: 'Chatpata Chicken Feast', veg: false, bestseller: false, price: 199, rating: '3.8', ratingsCount: 14, ratingFill: '#1BA672', ratingClass: 'hyOybz', description: 'Pizza topped with a spicy tandoori sauce, Schezwan chicken meatballs, crunchy onion & capsicum, green chilli, juicy tomato and a flavourful dressing. (294 Kcal/100g). Contains Cereals containing Gluten (Wheat), Soya and Milk & Milk Products.', imageUrl: `${FOOD_CMS}/2026/1/2/d0247064-0689-49fc-b382-fed753d47f28_61e83c62-d60d-456b-aa27-b83f2f89082a.jpg`, imageBg: 'rgb(224, 238, 245)', customisable: true, descBlockClass: 'jkPAmQ', descTextClass: 'jiJudb', rightColClass: 'ihUMdj' },
  { name: 'Sprinkled Fries - New', veg: true, bestseller: false, price: 109, rating: '4.0', ratingsCount: 83, ratingFill: '#116649', ratingClass: 'kwGXdv', description: 'Serves 1 | Baked fries seasoned with our signature peruvian seasoning (204 Kcal/100g) Contains Cereals containing Gluten (Wheat), Soya and Milk & Milk Products.', imageUrl: `${FOOD_CMS}/2026/1/5/ec0a4db2-58c1-4b6a-ad52-e8c1ff2d5e70_cced7c63-5625-42ce-9456-8ab71948f3f9.jpg`, imageBg: 'rgb(246, 230, 233)', customisable: false, descBlockClass: 'iQBPNo', descTextClass: 'kWsTbb', rightColClass: 'jbEYva' },
  { name: 'Spicy Baked Chicken Wings 4pc', veg: false, bestseller: false, price: 209, rating: '3.6', ratingsCount: 5, ratingFill: '#1BA672', ratingClass: 'hyOybz', description: 'Serves 1 | 4 pcs of tender and juicy sweet chilly chicken wings (189 Kcal/100g) Contains Cereals containing Gluten (Wheat) & Soya.', imageUrl: `${FOOD_CMS}/2026/1/5/8e5ecbd1-b453-413f-8429-57331f004c65_c389fbb2-46c1-4060-8960-8da8a2232ae6.jpg`, imageBg: 'rgb(251, 238, 215)', customisable: false, descBlockClass: 'iQBPNo', descTextClass: 'kWsTbb', rightColClass: 'jbEYva' },
  { name: 'Spicy Schezwan Pasta Chicken', veg: false, bestseller: false, price: 199, rating: '3.8', ratingsCount: 6, ratingFill: '#1BA672', ratingClass: 'hyOybz', description: 'Serves 1 | Fusilli pasta baked in spicy schezwan sauce along with schezwan chicken meatballs, green capsicum, onion, red capsicum and red paprika (178 Kcal/100g) Contains Cereals containing Gluten (Wheat), Soya and Milk & Milk Products.', imageUrl: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/4/16/3a3c74db-fdd7-43a5-bbe8-90727348e91b_775cc55b-2478-4dc0-8c91-f792e4c0a9ac.jpg_compressed', imageBg: 'rgb(229, 241, 211)', customisable: true, descBlockClass: 'jkPAmQ', descTextClass: 'jiJudb', rightColClass: 'ihUMdj' },
  { name: 'Spicy Red Schezwan Pasta', veg: true, bestseller: false, price: 179, rating: '3.9', ratingsCount: 6, ratingFill: '#1BA672', ratingClass: 'hyOybz', description: 'Serves 1 | Fusilli pasta baked in spicy schezwan sauce, along with green capsicum, onion, red capsicum and paprika for an added zing (190 Kcal/100g) Contains Cereals containing Gluten (Wheat), Soya and Milk & Milk Products.', imageUrl: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/FOOD_CATALOG/IMAGES/CMS/2025/4/16/d0417990-1257-4407-9d38-a3f004c4793e_a168f449-d145-492f-b01f-7773a2faa6a8.jpg_compressed', imageBg: 'rgb(224, 238, 245)', customisable: true, descBlockClass: 'jkPAmQ', descTextClass: 'jiJudb', rightColClass: 'ihUMdj' },
  { name: 'Brow-wow-nie', veg: true, bestseller: false, price: 109, rating: '4.7', ratingsCount: 15, ratingFill: '#116649', ratingClass: 'kwGXdv', description: 'Serves 1 | A divine choco brownie for your all time chocolate cravings (273 Kcal/100g). Contains Cereals containing Gluten (Wheat), Soya and Milk & Milk Products.', imageUrl: `${FOOD_CMS}/2026/1/5/21e66abc-3438-490f-8250-f69bd7a146a7_3a54cd83-2de8-4e0d-8ade-a1d796acc6cb.jpg`, imageBg: 'rgb(246, 230, 233)', customisable: false, descBlockClass: 'iQBPNo', descTextClass: 'kWsTbb', rightColClass: 'jbEYva' },
];

type TopPick = { name: string; description: string };

type RestaurantConfig = {
  name: string;
  rating: string;
  ratingsCount: string;
  costForTwo: number;
  cuisines: string[];
  location: string;
  deliveryTime: string;
  img: string;
  deals: Deal[];
  menuCategories: MenuCategory[];
  outlet?: string;
  topPicks?: TopPick[];
  showOrderTabs?: boolean;
  useRatingCard?: boolean;
};

const RESTAURANT_CONFIG: Record<string, RestaurantConfig> = {
  'a2b-adyar-ananda-bhavan': {
    name: 'A2B - Adyar Ananda Bhavan',
    rating: '4.6',
    ratingsCount: '34K+ ratings',
    costForTwo: 300,
    cuisines: ['South Indian', 'North Indian', 'Sweets', 'Chinese'],
    location: 'Shanti Nagar',
    deliveryTime: '35-40 MINS',
    img: `${BASE}/RX_THUMBNAIL/IMAGES/VENDOR/2026/1/7/394d4bca-db65-43a2-9372-12543611d33a_12808.JPG`,
    outlet: 'Shanti Nagar',
    topPicks: [],
    deals: [
      { title: 'ITEMS AT ₹33', subtitle: 'Use code SWIGGYIT' },
      { title: '20% OFF UPTO ₹50', subtitle: 'Above ₹199' },
      { title: 'FLAT ₹50 OFF', subtitle: 'Above ₹299' },
    ],
    menuCategories: [
      {
        title: 'Recommended',
        items: [
          { name: 'Veg Meals', price: 120, description: 'Rice, sambar, rasam, curd, papad, vegetable curry', veg: true, bestseller: true },
          { name: 'Curd Rice', price: 80, description: 'South Indian curd rice with tempering', veg: true },
          { name: 'Masala Dosa', price: 75, description: 'Crispy dosa with potato masala filling', veg: true, bestseller: true },
          { name: 'Idli (2 pcs)', price: 45, description: 'Steamed rice cakes with chutney and sambar', veg: true },
          { name: 'Vada (2 pcs)', price: 50, description: 'Crispy lentil donuts with sambar', veg: true },
          { name: 'Rava Dosa', price: 85, description: 'Crispy semolina dosa', veg: true },
          { name: 'Set Dosa (3 pcs)', price: 90, description: 'Soft sponge dosas with chutney', veg: true },
          { name: 'Medu Vada (3 pcs)', price: 55, description: 'Crispy lentil donuts', veg: true },
          { name: 'Pongal', price: 70, description: 'Rice and lentil breakfast', veg: true },
          { name: 'Upma', price: 55, description: 'Semolina upma with vegetables', veg: true },
        ],
      },
      {
        title: 'Meals & Combos',
        items: [
          { name: 'South Indian Meals', price: 150, description: 'Full meals with rice, sambar, rasam, curd, papad', veg: true },
          { name: 'North Indian Thali', price: 180, description: 'Roti, dal, rice, sabzi, curd', veg: true },
          { name: 'Meals with Fish Fry', price: 220, description: 'South Indian meals with crispy fish', veg: false },
          { name: 'Curd Rice Combo', price: 95, description: 'Curd rice with pickle and papad', veg: true },
        ],
      },
      {
        title: 'Chinese',
        items: [
          { name: 'Veg Hakka Noodles', price: 149, description: 'Stir-fried noodles with vegetables', veg: true },
          { name: 'Chicken Manchurian', price: 179, description: 'Crispy chicken in spicy sauce', veg: false },
          { name: 'Veg Fried Rice', price: 139, description: 'Fried rice with mixed vegetables', veg: true },
          { name: 'Gobi Manchurian', price: 159, description: 'Crispy cauliflower in Manchurian sauce', veg: true },
        ],
      },
      {
        title: 'Sweets & Desserts',
        items: [
          { name: 'Mysore Pak', price: 60, description: 'Traditional gram flour sweet', veg: true },
          { name: 'Badam Halwa', price: 99, description: 'Rich almond halwa', veg: true },
          { name: 'Gulab Jamun (2 pcs)', price: 55, description: 'Sweet milk dumplings', veg: true },
          { name: 'Rasmalai (2 pcs)', price: 95, description: 'Cottage cheese in sweet milk', veg: true },
          { name: 'Payasam', price: 65, description: 'South Indian rice kheer', veg: true },
        ],
      },
    ],
  },
  'pizza-hut': {
    name: 'Pizza Hut',
    rating: '4.3',
    ratingsCount: '11K+ ratings',
    costForTwo: 600,
    cuisines: ['Pizzas'],
    location: 'Central Bangalore',
    deliveryTime: '40–45 mins',
    img: `${BASE}/RX_THUMBNAIL/IMAGES/VENDOR/2025/9/1/5d703bb8-2414-4ab1-bcae-59bba6a52598_10575.JPG`,
    outlet: 'Central Bangalore',
    showOrderTabs: true,
    useRatingCard: true,
    deals: [
      { title: 'Items At ₹379', subtitle: 'ENDS IN 04h : 34m : 52s', icon: 'purple', timerText: 'ENDS IN 04h : 34m : 52s', iconImg: `${OFFERS_BASE}/offers/DealRush_Offer_Icon.png` },
      { title: '7.5% Off Upto ₹100', subtitle: 'NO CODE REQUIRED', iconImg: `${OFFERS_BASE}/offers/generic` },
      { title: '50% Off Upto ₹100', subtitle: 'Use code PIZZA50', icon: 'orange', iconImg: `${OFFERS_BASE}/offers/generic` },
    ],
    topPicks: [
      { name: 'Veggie Lovers Pizza', description: 'Loaded with fresh vegetables and mozzarella. A classic choice for veg lovers.' },
      { name: 'Pepperoni Feast', description: 'Spicy pepperoni with extra cheese. Our bestseller for meat lovers.' },
      { name: 'Margherita', description: 'Classic tomato and basil with fresh mozzarella. Simple and delicious.' },
      { name: 'BBQ Chicken Pizza', description: 'Smoky BBQ sauce with tender chicken and red onions.' },
    ],
    menuCategories: [
      {
        title: 'Recommended',
        items: [
          { name: 'Margherita', price: 299, description: 'Classic tomato sauce, mozzarella and basil', veg: true, bestseller: true },
          { name: 'Veggie Lovers', price: 379, description: 'Fresh vegetables and mozzarella', veg: true, bestseller: true },
          { name: 'Pepperoni', price: 399, description: 'Spicy pepperoni with extra cheese', veg: false },
          { name: 'BBQ Chicken', price: 429, description: 'Smoky BBQ sauce with chicken', veg: false },
          { name: 'Cheese & Corn', price: 329, description: 'Sweet corn and mozzarella', veg: true },
        ],
      },
      {
        title: 'Sides & Beverages',
        items: [
          { name: 'Garlic Bread', price: 129, description: 'Toasted bread with garlic butter', veg: true },
          { name: 'Chicken Wings (6 pcs)', price: 249, description: 'Crispy chicken wings with dip', veg: false },
          { name: 'Pepsi (500ml)', price: 60, description: 'Chilled soft drink', veg: true },
        ],
      },
    ],
  },
  'cookie-man': {
    name: 'Cookie Man',
    rating: '4.4',
    ratingsCount: '105 ratings',
    costForTwo: 500,
    cuisines: ['Desserts', 'Ice Cream'],
    location: 'Binnipete',
    deliveryTime: '55-65 mins',
    img: `${BASE}/RX_THUMBNAIL/IMAGES/VENDOR/2026/1/21/a2d8b72f-a4e9-4f83-901c-50dc41a595e6_58527.JPG`,
    outlet: 'Binnipete',
    showOrderTabs: false,
    useRatingCard: true,
    deals: [
      { title: 'Buy 1 Get 1 Free', subtitle: 'USE BUY1GET1', icon: 'orange', iconImg: `${OFFERS_BASE}/offers/generic` },
      { title: 'Items At ₹63', subtitle: 'ENDS IN 09h : 20m : 31s', icon: 'purple', timerText: 'ENDS IN 09h : 20m : 31s', iconImg: `${OFFERS_BASE}/offers/DealRush_Offer_Icon.png` },
    ],
    topPicks: [
      { name: 'Sweet Celebrations Mini Gift Hamper', description: 'An elegant assortment of cookie treats in a luxurious mini hamper. Designed to make every celebration truly memorable.' },
      { name: 'Cookie Classics Mini Gift Hamper', description: 'A box full of our all-time favorite cookie classics, baked to perfection. Perfect for gifting, sharing, or treating yourself anytime.' },
      { name: 'Cookieman Happiness Gift Hamper', description: 'This Hamper Contains: 300g Assorted Cookies With Floral Tin, 8 piece Chocolate Box, Choco Chunk Cookies, Almond Fingers & Choco dipped Brandy Snap.' },
      { name: 'Donuts - Buy 4 & Get 2 Free', description: 'MRP 826 Of This Delightful Mouth Watering Combo comes with 6 Assorted Donut Flavors!' },
      { name: 'Brownie Buy 3 Get 1 Free', description: 'MRP 614 Of This Delightful Combo comes with 4 Assorted Brownie Flavors!' },
    ],
    menuCategories: [
      {
        title: 'Recommended',
        items: [
          { name: 'Assorted Cookies (300gms)', price: 499, description: 'Veg. Assorted cookies pack.', veg: true, bestseller: true },
          { name: 'Chocolate Chip Cookie', price: 89, description: 'Veg. Classic chocolate chip.', veg: true },
          { name: 'Butter Cookie Jar', price: 399, description: 'Classic butter cookies', veg: true },
          { name: 'Oat & Raisin Cookie', price: 95, description: 'Oats and raisin cookies', veg: true },
          { name: 'Double Choco Cookie', price: 99, description: 'Rich double chocolate', veg: true },
          { name: 'Almond Cookie Pack', price: 449, description: 'Crunchy almond cookies', veg: true },
        ],
      },
      {
        title: 'Donuts & Brownies',
        items: [
          { name: 'Donut - Chocolate', price: 99, description: 'Chocolate glazed donut', veg: true },
          { name: 'Donut - Strawberry', price: 99, description: 'Strawberry glazed donut', veg: true },
          { name: 'Donut - Assorted (4 pcs)', price: 349, description: 'Four assorted donuts', veg: true, bestseller: true },
          { name: 'Chocolate Brownie', price: 129, description: 'Fudgy chocolate brownie', veg: true },
          { name: 'Walnut Brownie', price: 139, description: 'Brownie with walnuts', veg: true },
          { name: 'Brownie Combo (4 pcs)', price: 449, description: 'Assorted brownies', veg: true },
        ],
      },
      {
        title: 'Gift Hampers & Combos',
        items: [
          { name: 'Sweet Celebrations Mini Hamper', price: 799, description: 'Cookies and chocolates hamper', veg: true },
          { name: 'Cookie Classics Mini Hamper', price: 699, description: 'Classic cookies in gift box', veg: true },
          { name: 'Choco Lovers Combo', price: 599, description: 'Cookies and brownies combo', veg: true },
        ],
      },
    ],
  },
  'idc-kitchen': {
    name: 'IDC Kitchen',
    rating: '4.2',
    ratingsCount: '2.1K+ ratings',
    costForTwo: 400,
    cuisines: ['North Indian', 'Chinese', 'Biryani'],
    location: 'Koramangala',
    deliveryTime: '30-35 mins',
    img: `${BASE}/RX_THUMBNAIL/IMAGES/VENDOR/2024/11/21/2c004550-3e2f-4929-a6b4-7f2599e9e2d9_18975.jpg`,
    outlet: 'Koramangala',
    topPicks: [],
    deals: [
      { title: '20% OFF UPTO ₹80', subtitle: 'Above ₹299' },
      { title: 'ITEMS AT ₹99', subtitle: 'Use code IDC99' },
    ],
    menuCategories: [
      {
        title: 'Recommended',
        items: [
          { name: 'Chicken Biryani', price: 199, description: 'Hyderabadi style biryani', veg: false, bestseller: true },
          { name: 'Paneer Butter Masala', price: 189, description: 'Cottage cheese in rich tomato gravy', veg: true },
          { name: 'Veg Fried Rice', price: 149, description: 'Stir-fried rice with vegetables', veg: true },
          { name: 'Egg Biryani', price: 179, description: 'Full egg biryani', veg: false },
          { name: 'Mutton Biryani', price: 279, description: 'Hyderabadi mutton biryani', veg: false },
          { name: 'Veg Biryani', price: 169, description: 'Mixed vegetable biryani', veg: true },
          { name: 'Chicken 65', price: 199, description: 'Spicy fried chicken', veg: false },
          { name: 'Dal Makhani', price: 169, description: 'Creamy black lentils', veg: true },
          { name: 'Kadai Chicken', price: 229, description: 'Kadai style chicken curry', veg: false },
          { name: 'Veg Pulao', price: 149, description: 'Fragrant vegetable pulao', veg: true },
        ],
      },
      {
        title: 'Chinese',
        items: [
          { name: 'Hakka Noodles', price: 159, description: 'Stir-fried noodles', veg: true },
          { name: 'Chicken Manchurian', price: 189, description: 'Crispy chicken Manchurian', veg: false },
          { name: 'Schezwan Rice', price: 169, description: 'Spicy Schezwan fried rice', veg: true },
          { name: 'Gobi Manchurian', price: 169, description: 'Crispy cauliflower', veg: true },
        ],
      },
      {
        title: 'Beverages',
        items: [
          { name: 'Sweet Lassi', price: 49, description: 'Chilled yogurt drink', veg: true },
          { name: 'Masala Chai', price: 30, description: 'Spiced tea', veg: true },
          { name: 'Fresh Lime Soda', price: 45, description: 'Chilled lime soda', veg: true },
          { name: 'Mango Lassi', price: 59, description: 'Mango yogurt drink', veg: true },
        ],
      },
    ],
  },
  'sri-udupi-park': {
    name: 'Sri Udupi Park',
    rating: '4.5',
    ratingsCount: '8.5K+ ratings',
    costForTwo: 250,
    cuisines: ['South Indian', 'North Indian'],
    location: 'Malleshwaram',
    deliveryTime: '25-30 mins',
    img: `${BASE}/RX_THUMBNAIL/IMAGES/VENDOR/2026/1/7/394d4bca-db65-43a2-9372-12543611d33a_12808.JPG`,
    outlet: 'Malleshwaram',
    topPicks: [{ name: 'Mysore Masala Dosa', description: 'Crispy dosa with spicy red chutney and potato filling.' }, { name: 'Rava Idli', description: 'Steamed semolina idlis, soft and fluffy.' }],
    deals: [
      { title: 'FLAT ₹40 OFF', subtitle: 'Above ₹199' },
      { title: 'ITEMS AT ₹49', subtitle: 'Select items' },
    ],
    menuCategories: [
      {
        title: 'Breakfast',
        items: [
          { name: 'Masala Dosa', price: 65, description: 'Crispy dosa with potato masala', veg: true, bestseller: true },
          { name: 'Idli (3 pcs)', price: 50, description: 'Steamed rice cakes', veg: true },
          { name: 'Vada (2 pcs)', price: 55, description: 'Crispy lentil donuts', veg: true },
          { name: 'Rava Dosa', price: 75, description: 'Crispy semolina dosa', veg: true },
          { name: 'Mysore Masala Dosa', price: 85, description: 'Spicy red chutney dosa', veg: true },
          { name: 'Uttapam', price: 70, description: 'Savory rice pancake', veg: true },
          { name: 'Pongal', price: 60, description: 'Rice and lentil breakfast', veg: true },
          { name: 'Set Dosa (3 pcs)', price: 80, description: 'Soft sponge dosas', veg: true },
        ],
      },
      {
        title: 'Meals',
        items: [
          { name: 'South Indian Meals', price: 150, description: 'Rice, sambar, rasam, curd, vegetables', veg: true },
          { name: 'Curd Rice', price: 70, description: 'South Indian curd rice', veg: true },
          { name: 'Bisi Bele Bath', price: 120, description: 'Karnataka rice dish', veg: true },
          { name: 'Meals with Fish Fry', price: 200, description: 'Meals with crispy fish', veg: false },
          { name: 'Mini Meals', price: 100, description: 'Light South Indian meal', veg: true },
        ],
      },
      {
        title: 'Sweets & Beverages',
        items: [
          { name: 'Mysore Pak', price: 55, description: 'Gram flour sweet', veg: true },
          { name: 'Payasam', price: 60, description: 'South Indian kheer', veg: true },
          { name: 'Filter Coffee', price: 40, description: 'South Indian filter coffee', veg: true },
          { name: 'Buttermilk', price: 35, description: 'Spiced buttermilk', veg: true },
        ],
      },
    ],
  },
  'anjappar': {
    name: 'Anjappar',
    rating: '4.4',
    ratingsCount: '12K+ ratings',
    costForTwo: 450,
    cuisines: ['Chettinad', 'South Indian', 'Biryani'],
    location: 'Indiranagar',
    deliveryTime: '35-40 mins',
    img: `${BASE}/RX_THUMBNAIL/IMAGES/VENDOR/2024/11/21/2c004550-3e2f-4929-a6b4-7f2599e9e2d9_18975.jpg`,
    outlet: 'Indiranagar',
    topPicks: [{ name: 'Chettinad Chicken', description: 'Spicy Chettinad-style chicken curry.' }, { name: 'Mutton Biryani', description: 'Fragrant mutton biryani with basmati rice.' }],
    deals: [
      { title: '25% OFF UPTO ₹100', subtitle: 'Above ₹399' },
      { title: 'ITEMS AT ₹129', subtitle: 'Biryani special' },
    ],
    menuCategories: [
      {
        title: 'Biryani',
        items: [
          { name: 'Chicken Biryani', price: 249, description: 'Chettinad chicken biryani', veg: false, bestseller: true },
          { name: 'Mutton Biryani', price: 299, description: 'Tender mutton biryani', veg: false },
          { name: 'Veg Biryani', price: 179, description: 'Mixed vegetable biryani', veg: true },
          { name: 'Egg Biryani', price: 199, description: 'Full egg biryani', veg: false },
          { name: 'Prawn Biryani', price: 329, description: 'Prawn biryani', veg: false },
          { name: 'Paneer Biryani', price: 219, description: 'Paneer biryani', veg: true },
        ],
      },
      {
        title: 'Curries & Chettinad',
        items: [
          { name: 'Chettinad Chicken', price: 279, description: 'Spicy Chettinad chicken', veg: false },
          { name: 'Fish Fry', price: 299, description: 'Crispy fried fish', veg: false },
          { name: 'Mutton Chukka', price: 329, description: 'Dry mutton Chettinad', veg: false },
          { name: 'Prawn Masala', price: 349, description: 'Prawn in spicy gravy', veg: false },
          { name: 'Paneer Chettinad', price: 239, description: 'Paneer in Chettinad spices', veg: true },
          { name: 'Kadai Chicken', price: 269, description: 'Kadai chicken curry', veg: false },
        ],
      },
      {
        title: 'South Indian & Sides',
        items: [
          { name: 'Parotta (2 pcs)', price: 60, description: 'Layered flatbread', veg: true },
          { name: 'Curd Rice', price: 80, description: 'South Indian curd rice', veg: true },
          { name: 'Chicken 65', price: 229, description: 'Spicy fried chicken', veg: false },
          { name: 'Raita', price: 49, description: 'Cucumber raita', veg: true },
        ],
      },
    ],
  },
  'meghana-foods': {
    name: 'Meghana Foods',
    rating: '4.7',
    ratingsCount: '25K+ ratings',
    costForTwo: 500,
    cuisines: ['Andhra', 'Biryani', 'South Indian'],
    location: 'Residency Road',
    deliveryTime: '40-45 mins',
    img: `${BASE}/FOOD_CATALOG/IMAGES/CMS/2025/12/29/57bebf52-5a58-42e0-af9d-3d872d52de83_2d89d14b-3568-4be1-946d-1d7b0539edae.jpg`,
    outlet: 'Residency Road',
    topPicks: [{ name: 'Andhra Chicken Biryani', description: 'Spicy Andhra-style chicken biryani.' }, { name: 'Gongura Mutton', description: 'Mutton in tangy gongura leaves curry.' }],
    deals: [
      { title: '20% OFF UPTO ₹75', subtitle: 'Above ₹349' },
      { title: 'ITEMS AT ₹199', subtitle: 'Biryani combo' },
    ],
    menuCategories: [
      {
        title: 'Biryani',
        items: [
          { name: 'Andhra Chicken Biryani', price: 269, description: 'Spicy Andhra chicken biryani', veg: false, bestseller: true },
          { name: 'Prawn Biryani', price: 349, description: 'Succulent prawn biryani', veg: false },
          { name: 'Veg Biryani', price: 199, description: 'Andhra veg biryani', veg: true },
          { name: 'Mutton Biryani', price: 319, description: 'Andhra mutton biryani', veg: false },
          { name: 'Egg Biryani', price: 219, description: 'Full egg biryani', veg: false },
          { name: 'Fish Biryani', price: 299, description: 'Fish biryani', veg: false },
        ],
      },
      {
        title: 'Andhra Specials',
        items: [
          { name: 'Gongura Mutton', price: 329, description: 'Mutton with gongura', veg: false },
          { name: 'Royyala Iguru', price: 299, description: 'Prawn curry', veg: false },
          { name: 'Gongura Chicken', price: 279, description: 'Chicken with gongura leaves', veg: false },
          { name: 'Andhra Chicken Curry', price: 259, description: 'Spicy Andhra chicken', veg: false },
          { name: 'Natu Kodi Pulusu', price: 269, description: 'Country chicken curry', veg: false },
          { name: 'Veg Gongura', price: 199, description: 'Gongura with vegetables', veg: true },
        ],
      },
      {
        title: 'Rice & Sides',
        items: [
          { name: 'Andhra Meals', price: 229, description: 'Full Andhra thali', veg: true },
          { name: 'Curd Rice', price: 85, description: 'South Indian curd rice', veg: true },
          { name: 'Chicken 65', price: 249, description: 'Spicy fried chicken', veg: false },
          { name: 'Raita', price: 55, description: 'Onion raita', veg: true },
        ],
      },
    ],
  },
  'nandhana-palace': {
    name: 'Nandhana Palace',
    rating: '4.4',
    ratingsCount: '18K+ ratings',
    costForTwo: 450,
    cuisines: ['Andhra', 'Biryani', 'South Indian', 'North Indian'],
    location: 'Rajajinagar',
    deliveryTime: '45-55 mins',
    img: `${BASE}/RX_THUMBNAIL/IMAGES/VENDOR/2024/11/21/2c004550-3e2f-4929-a6b4-7f2599e9e2d9_18975.jpg`,
    outlet: 'Rajajinagar',
    topPicks: [{ name: 'Andhra Meals', description: 'Full Andhra thali with rice, curries and papad.' }, { name: 'Nandhana Special Biryani', description: 'House special biryani with raita.' }],
    deals: [
      { title: 'ITEMS AT ₹99', subtitle: 'Select items' },
      { title: 'FLAT ₹60 OFF', subtitle: 'Above ₹399' },
    ],
    menuCategories: [
      {
        title: 'Biryani',
        items: [
          { name: 'Chicken Biryani', price: 229, description: 'Andhra chicken biryani', veg: false, bestseller: true },
          { name: 'Egg Biryani', price: 179, description: 'Egg biryani', veg: false },
          { name: 'Mutton Biryani', price: 289, description: 'Andhra mutton biryani', veg: false },
          { name: 'Veg Biryani', price: 169, description: 'Vegetable biryani', veg: true },
          { name: 'Prawn Biryani', price: 319, description: 'Prawn biryani', veg: false },
          { name: 'Paneer Biryani', price: 199, description: 'Paneer biryani', veg: true },
        ],
      },
      {
        title: 'Andhra Meals & Curries',
        items: [
          { name: 'Andhra Meals', price: 199, description: 'Full thali with rice and curries', veg: true },
          { name: 'Curd Rice', price: 80, description: 'South Indian curd rice', veg: true },
          { name: 'Nandhana Chicken Curry', price: 249, description: 'House special chicken', veg: false },
          { name: 'Gongura Chicken', price: 259, description: 'Chicken with gongura', veg: false },
          { name: 'Fish Curry', price: 269, description: 'Andhra fish curry', veg: false },
          { name: 'Paneer Butter Masala', price: 219, description: 'Paneer in tomato gravy', veg: true },
        ],
      },
      {
        title: 'Sides & Beverages',
        items: [
          { name: 'Chicken 65', price: 229, description: 'Spicy fried chicken', veg: false },
          { name: 'Parotta (2 pcs)', price: 55, description: 'Layered parotta', veg: true },
          { name: 'Raita', price: 49, description: 'Cucumber raita', veg: true },
          { name: 'Buttermilk', price: 35, description: 'Spiced buttermilk', veg: true },
        ],
      },
    ],
  },
  'biryani-blues': {
    name: 'Biryani Blues',
    rating: '4.3',
    ratingsCount: '9K+ ratings',
    costForTwo: 550,
    cuisines: ['Biryani', 'Kebabs', 'Lucknowi', 'Hyderabadi'],
    location: 'Church Street',
    deliveryTime: '30-35 mins',
    img: `${BASE}/97377e54937c079fe269d744aa66274a`,
    outlet: 'Church Street',
    topPicks: [{ name: 'Hyderabadi Chicken Biryani', description: 'Authentic Hyderabadi dum biryani.' }, { name: 'Lucknowi Galouti Kebab', description: 'Melt-in-mouth galouti kebabs.' }],
    deals: [
      { title: '66% OFF UPTO ₹156', subtitle: 'On select items' },
      { title: 'ITEMS AT ₹199', subtitle: 'Biryani combo' },
    ],
    menuCategories: [
      {
        title: 'Biryani',
        items: [
          { name: 'Hyderabadi Chicken Biryani', price: 299, description: 'Dum chicken biryani', veg: false, bestseller: true },
          { name: 'Veg Biryani', price: 229, description: 'Vegetable biryani', veg: true },
          { name: 'Mutton Biryani', price: 349, description: 'Mutton dum biryani', veg: false },
          { name: 'Egg Biryani', price: 219, description: 'Full egg biryani', veg: false },
          { name: 'Prawn Biryani', price: 379, description: 'Hyderabadi prawn biryani', veg: false },
          { name: 'Paneer Biryani', price: 249, description: 'Paneer dum biryani', veg: true },
        ],
      },
      {
        title: 'Kebabs & Tandoor',
        items: [
          { name: 'Chicken Seekh Kebab', price: 249, description: 'Grilled chicken seekh', veg: false },
          { name: 'Paneer Tikka', price: 199, description: 'Grilled cottage cheese', veg: true },
          { name: 'Lucknowi Galouti Kebab', price: 299, description: 'Melt-in-mouth galouti', veg: false },
          { name: 'Chicken Tikka', price: 269, description: 'Tandoori chicken tikka', veg: false },
          { name: 'Mutton Seekh Kebab', price: 319, description: 'Grilled mutton seekh', veg: false },
          { name: 'Veg Galouti', price: 219, description: 'Vegetarian galouti', veg: true },
        ],
      },
      {
        title: 'Curries & Raita',
        items: [
          { name: 'Chicken Raza', price: 279, description: 'Lucknowi chicken curry', veg: false },
          { name: 'Dal Makhani', price: 199, description: 'Creamy black lentils', veg: true },
          { name: 'Raita', price: 59, description: 'Onion raita', veg: true },
        ],
      },
    ],
  },
  'empire-restaurant': {
    name: 'Empire Restaurant',
    rating: '4.1',
    ratingsCount: '15K+ ratings',
    costForTwo: 350,
    cuisines: ['North Indian', 'Biryani', 'Mughlai'],
    location: 'Koramangala',
    deliveryTime: '35-40 mins',
    img: `${BASE}/RX_THUMBNAIL/IMAGES/VENDOR/2026/1/7/394d4bca-db65-43a2-9372-12543611d33a_12808.JPG`,
    outlet: 'Koramangala',
    topPicks: [],
    deals: [
      { title: '20% OFF UPTO ₹50', subtitle: 'Above ₹249' },
      { title: 'ITEMS AT ₹89', subtitle: 'Select combos' },
    ],
    menuCategories: [
      {
        title: 'Biryani & Rice',
        items: [
          { name: 'Chicken Biryani', price: 189, description: 'Hyderabadi chicken biryani', veg: false, bestseller: true },
          { name: 'Veg Biryani', price: 149, description: 'Vegetable biryani', veg: true },
          { name: 'Egg Biryani', price: 169, description: 'Full egg biryani', veg: false },
          { name: 'Chicken Fried Rice', price: 179, description: 'Indo-Chinese fried rice', veg: false },
          { name: 'Veg Pulao', price: 139, description: 'Vegetable pulao', veg: true },
        ],
      },
      {
        title: 'Rolls & Wraps',
        items: [
          { name: 'Chicken Roll', price: 129, description: 'Paratha wrap with chicken', veg: false },
          { name: 'Egg Roll', price: 99, description: 'Paratha wrap with egg', veg: false },
          { name: 'Paneer Roll', price: 119, description: 'Paneer in paratha', veg: true },
          { name: 'Mutton Roll', price: 159, description: 'Mutton kebab roll', veg: false },
          { name: 'Double Egg Roll', price: 119, description: 'Double egg wrap', veg: false },
        ],
      },
      {
        title: 'Curries & Sides',
        items: [
          { name: 'Chicken 65', price: 199, description: 'Spicy fried chicken', veg: false },
          { name: 'Dal Makhani', price: 149, description: 'Creamy dal', veg: true },
          { name: 'Raita', price: 45, description: 'Cucumber raita', veg: true },
        ],
      },
    ],
  },
  'mtr': {
    name: 'MTR',
    rating: '4.6',
    ratingsCount: '22K+ ratings',
    costForTwo: 300,
    cuisines: ['South Indian', 'North Indian', 'Sweets'],
    location: 'Lalbagh Road',
    deliveryTime: '30-35 mins',
    img: `${BASE}/RX_THUMBNAIL/IMAGES/VENDOR/2026/1/7/394d4bca-db65-43a2-9372-12543611d33a_12808.JPG`,
    outlet: 'Lalbagh Road',
    topPicks: [{ name: 'Rava Idli', description: 'Signature steamed semolina idlis.' }, { name: 'Bisi Bele Bath', description: 'Traditional Karnataka rice dish.' }],
    deals: [
      { title: 'FLAT ₹50 OFF', subtitle: 'Above ₹299' },
      { title: 'ITEMS AT ₹49', subtitle: 'Breakfast special' },
    ],
    menuCategories: [
      {
        title: 'Breakfast',
        items: [
          { name: 'Rava Idli (2 pcs)', price: 65, description: 'Steamed semolina idlis', veg: true, bestseller: true },
          { name: 'Masala Dosa', price: 75, description: 'Crispy dosa with potato', veg: true },
          { name: 'Uttapam', price: 80, description: 'Savory rice pancake', veg: true },
          { name: 'Idli (3 pcs)', price: 50, description: 'Steamed rice idlis', veg: true },
          { name: 'Vada (2 pcs)', price: 55, description: 'Crispy medu vada', veg: true },
          { name: 'Set Dosa (3 pcs)', price: 85, description: 'Soft sponge dosas', veg: true },
          { name: 'Mysore Masala Dosa', price: 90, description: 'Spicy red chutney dosa', veg: true },
          { name: 'Pongal', price: 65, description: 'Rice and lentil', veg: true },
        ],
      },
      {
        title: 'Meals',
        items: [
          { name: 'Bisi Bele Bath', price: 120, description: 'Karnataka rice dish', veg: true },
          { name: 'South Indian Meals', price: 160, description: 'Full meals with rice, sambar, rasam', veg: true },
          { name: 'Curd Rice', price: 75, description: 'South Indian curd rice', veg: true },
          { name: 'Mini Meals', price: 110, description: 'Light South Indian meal', veg: true },
        ],
      },
      {
        title: 'Sweets & Beverages',
        items: [
          { name: 'Mysore Pak', price: 55, description: 'Gram flour sweet', veg: true },
          { name: 'Payasam', price: 60, description: 'South Indian kheer', veg: true },
          { name: 'Badam Halwa', price: 95, description: 'Almond halwa', veg: true },
          { name: 'Filter Coffee', price: 45, description: 'South Indian filter coffee', veg: true },
          { name: 'Buttermilk', price: 35, description: 'Spiced buttermilk', veg: true },
        ],
      },
    ],
  },
  'truffles': {
    name: 'Truffles',
    rating: '4.5',
    ratingsCount: '14K+ ratings',
    costForTwo: 600,
    cuisines: ['American', 'Continental', 'Desserts'],
    location: 'Indiranagar',
    deliveryTime: '40-45 mins',
    img: `${BASE}/RX_THUMBNAIL/IMAGES/VENDOR/2025/9/1/5d703bb8-2414-4ab1-bcae-59bba6a52598_10575.JPG`,
    outlet: 'Indiranagar',
    topPicks: [{ name: 'Truffle Burger', description: 'Juicy burger with truffle mayo.' }, { name: 'Red Velvet Pastry', description: 'Classic red velvet slice.' }],
    deals: [
      { title: '15% OFF UPTO ₹75', subtitle: 'Above ₹499' },
      { title: 'ITEMS AT ₹199', subtitle: 'Dessert combo' },
    ],
    menuCategories: [
      {
        title: 'Burgers',
        items: [
          { name: 'Truffle Burger', price: 349, description: 'Beef burger with truffle mayo', veg: false, bestseller: true },
          { name: 'Veggie Burger', price: 279, description: 'Plant-based burger', veg: true },
          { name: 'Chicken Burger', price: 319, description: 'Crispy chicken burger', veg: false },
          { name: 'Cheese Burger', price: 329, description: 'Double cheese burger', veg: false },
          { name: 'Mushroom Burger', price: 289, description: 'Portobello mushroom burger', veg: true },
        ],
      },
      {
        title: 'Pasta & Main',
        items: [
          { name: 'Aglio Olio Pasta', price: 299, description: 'Garlic and olive oil pasta', veg: true },
          { name: 'Chicken Alfredo', price: 349, description: 'Creamy chicken pasta', veg: false },
          { name: 'Margherita Pizza', price: 329, description: 'Wood fired margherita', veg: true },
          { name: 'Fish & Chips', price: 379, description: 'Beer battered fish with fries', veg: false },
        ],
      },
      {
        title: 'Desserts',
        items: [
          { name: 'Red Velvet Pastry', price: 199, description: 'Red velvet cake slice', veg: true },
          { name: 'Chocolate Brownie', price: 179, description: 'Warm chocolate brownie', veg: true },
          { name: 'Tiramisu', price: 229, description: 'Classic tiramisu', veg: true },
          { name: 'New York Cheesecake', price: 249, description: 'Cream cheese cheesecake', veg: true },
          { name: 'Ice Cream Sundae', price: 199, description: 'Vanilla with toppings', veg: true },
        ],
      },
      {
        title: 'Beverages',
        items: [
          { name: 'Fresh Lime Soda', price: 99, description: 'Chilled lime soda', veg: true },
          { name: 'Iced Coffee', price: 149, description: 'Cold brew iced coffee', veg: true },
          { name: 'Milkshake', price: 179, description: 'Chocolate or vanilla', veg: true },
        ],
      },
    ],
  },
  'toit': {
    name: 'Toit',
    rating: '4.4',
    ratingsCount: '11K+ ratings',
    costForTwo: 800,
    cuisines: ['Continental', 'Italian', 'Beverages'],
    location: 'Indiranagar',
    deliveryTime: '45-50 mins',
    img: `${BASE}/RX_THUMBNAIL/IMAGES/VENDOR/2024/11/21/2c004550-3e2f-4929-a6b4-7f2599e9e2d9_18975.jpg`,
    outlet: 'Indiranagar',
    topPicks: [{ name: 'Wood Fired Pizza', description: 'Thin crust pizza from the wood oven.' }, { name: 'Craft Beer Flight', description: 'Selection of house brews.' }],
    deals: [
      { title: '20% OFF UPTO ₹100', subtitle: 'Above ₹599' },
      { title: 'ITEMS AT ₹299', subtitle: 'Pizza & beer' },
    ],
    menuCategories: [
      {
        title: 'Pizzas',
        items: [
          { name: 'Margherita', price: 399, description: 'Wood fired margherita', veg: true, bestseller: true },
          { name: 'Pepperoni', price: 449, description: 'Wood fired pepperoni', veg: false },
          { name: 'Four Cheese', price: 449, description: 'Mozzarella, cheddar, parmesan, gorgonzola', veg: true },
          { name: 'BBQ Chicken', price: 479, description: 'BBQ sauce and chicken', veg: false },
          { name: 'Veggie Supreme', price: 429, description: 'Bell peppers, olives, mushroom', veg: true },
        ],
      },
      {
        title: 'Main Course',
        items: [
          { name: 'Fish & Chips', price: 429, description: 'Beer battered fish', veg: false },
          { name: 'Chicken Wings', price: 349, description: 'Spicy chicken wings', veg: false },
          { name: 'Pasta Arrabiata', price: 349, description: 'Spicy tomato pasta', veg: true },
          { name: 'Caesar Salad', price: 299, description: 'Romaine, parmesan, croutons', veg: true },
        ],
      },
      {
        title: 'Beverages',
        items: [
          { name: 'Wheat Beer', price: 299, description: 'House wheat beer', veg: true },
          { name: 'Fresh Lime Soda', price: 99, description: 'Chilled lime soda', veg: true },
          { name: 'IPA', price: 349, description: 'Indian Pale Ale', veg: true },
          { name: 'Lager', price: 279, description: 'House lager', veg: true },
          { name: 'Iced Tea', price: 129, description: 'Fresh iced tea', veg: true },
        ],
      },
    ],
  },
  'haldiram': {
    name: 'Haldiram\'s',
    rating: '4.3',
    ratingsCount: '20K+ ratings',
    costForTwo: 350,
    cuisines: ['North Indian', 'Sweets', 'Snacks'],
    location: 'Jayanagar',
    deliveryTime: '25-30 mins',
    img: `${BASE}/RX_THUMBNAIL/IMAGES/VENDOR/2026/1/7/394d4bca-db65-43a2-9372-12543611d33a_12808.JPG`,
    outlet: 'Jayanagar',
    topPicks: [],
    deals: [
      { title: '15% OFF UPTO ₹60', subtitle: 'Above ₹399' },
      { title: 'ITEMS AT ₹49', subtitle: 'Snacks' },
    ],
    menuCategories: [
      {
        title: 'Snacks',
        items: [
          { name: 'Aloo Bhujia', price: 50, description: 'Crispy potato sticks', veg: true, bestseller: true },
          { name: 'Samosa (2 pcs)', price: 45, description: 'Fried potato samosa', veg: true },
          { name: 'Kachori (2 pcs)', price: 55, description: 'Stuffed kachori', veg: true },
          { name: 'Aloo Tikki', price: 60, description: 'Crispy potato tikki', veg: true },
          { name: 'Paneer Tikki', price: 75, description: 'Cottage cheese tikki', veg: true },
          { name: 'Papdi Chaat', price: 65, description: 'Crispy papdi with chutneys', veg: true },
          { name: 'Bhel Puri', price: 55, description: 'Puffed rice chaat', veg: true },
          { name: 'Dahi Puri', price: 70, description: 'Puris with yogurt', veg: true },
        ],
      },
      {
        title: 'Sweets',
        items: [
          { name: 'Gulab Jamun (2 pcs)', price: 60, description: 'Sweet milk dumplings', veg: true },
          { name: 'Rasmalai (2 pcs)', price: 99, description: 'Cottage cheese in sweet milk', veg: true },
          { name: 'Soan Papdi', price: 50, description: 'Flaky sweet', veg: true },
          { name: 'Kaju Katli', price: 199, description: 'Cashew fudge', veg: true },
          { name: 'Ladoo (2 pcs)', price: 55, description: 'Besan ladoo', veg: true },
          { name: 'Jalebi (4 pcs)', price: 65, description: 'Crispy jalebi', veg: true },
        ],
      },
      {
        title: 'Namkeen & Packed',
        items: [
          { name: 'Mix Namkeen (200g)', price: 120, description: 'Assorted namkeen', veg: true },
          { name: 'Moong Dal', price: 80, description: 'Crispy moong dal', veg: true },
          { name: 'Kaju Curry', price: 150, description: 'Cashew curry', veg: true },
        ],
      },
    ],
  },
  'wow-momo': {
    name: 'WOW! Momo',
    rating: '4.2',
    ratingsCount: '16K+ ratings',
    costForTwo: 300,
    cuisines: ['Tibetan', 'Chinese', 'Fast Food'],
    location: 'Koramangala',
    deliveryTime: '20-25 mins',
    img: `${BASE}/RX_THUMBNAIL/IMAGES/VENDOR/2025/9/1/5d703bb8-2414-4ab1-bcae-59bba6a52598_10575.JPG`,
    outlet: 'Koramangala',
    topPicks: [{ name: 'Chicken Momo', description: 'Steamed chicken dumplings with spicy sauce.' }, { name: 'Pan Fried Veg Momo', description: 'Crispy pan-fried vegetable momos.' }],
    deals: [
      { title: '20% OFF UPTO ₹50', subtitle: 'Above ₹199' },
      { title: 'ITEMS AT ₹99', subtitle: 'Momo combo' },
    ],
    menuCategories: [
      {
        title: 'Momos',
        items: [
          { name: 'Chicken Momo (6 pcs)', price: 129, description: 'Steamed chicken momos', veg: false, bestseller: true },
          { name: 'Veg Momo (6 pcs)', price: 99, description: 'Steamed veg momos', veg: true },
          { name: 'Pan Fried Momo (6 pcs)', price: 139, description: 'Crispy pan fried momos', veg: false },
          { name: 'Chicken Kothey Momo (6 pcs)', price: 149, description: 'Half fried half steamed', veg: false },
          { name: 'Pork Momo (6 pcs)', price: 159, description: 'Steamed pork momos', veg: false },
          { name: 'Cheese Momo (6 pcs)', price: 139, description: 'Veg momos with cheese', veg: true },
          { name: 'Tandoori Momo (6 pcs)', price: 169, description: 'Tandoori chicken momos', veg: false },
          { name: 'Momos Combo (12 pcs)', price: 229, description: 'Mix of veg and chicken', veg: false },
        ],
      },
      {
        title: 'Sides & Rice',
        items: [
          { name: 'Chilli Chicken', price: 179, description: 'Indo-Chinese chilli chicken', veg: false },
          { name: 'Fried Rice', price: 149, description: 'Veg fried rice', veg: true },
          { name: 'Chicken Fried Rice', price: 179, description: 'Chicken fried rice', veg: false },
          { name: 'Hakka Noodles', price: 159, description: 'Veg Hakka noodles', veg: true },
          { name: 'Chicken Manchurian', price: 189, description: 'Crispy chicken Manchurian', veg: false },
          { name: 'Veg Manchurian', price: 169, description: 'Crispy veg balls', veg: true },
        ],
      },
      {
        title: 'Soups & Beverages',
        items: [
          { name: 'Veg Clear Soup', price: 79, description: 'Clear vegetable soup', veg: true },
          { name: 'Chicken Soup', price: 99, description: 'Hot chicken soup', veg: false },
          { name: 'Thukpa', price: 149, description: 'Tibetan noodle soup', veg: true },
          { name: 'Red Chilli Sauce', price: 29, description: 'Spicy dip', veg: true },
        ],
      },
    ],
  },
  'chai-point': {
    name: 'Chai Point',
    rating: '4.0',
    ratingsCount: '8K+ ratings',
    costForTwo: 200,
    cuisines: ['Beverages', 'Snacks', 'North Indian'],
    location: 'Whitefield',
    deliveryTime: '25-30 mins',
    img: `${BASE}/RX_THUMBNAIL/IMAGES/VENDOR/2026/1/7/394d4bca-db65-43a2-9372-12543611d33a_12808.JPG`,
    outlet: 'Whitefield',
    topPicks: [],
    deals: [
      { title: 'FLAT ₹30 OFF', subtitle: 'Above ₹149' },
      { title: 'ITEMS AT ₹49', subtitle: 'Chai & snacks' },
    ],
    menuCategories: [
      {
        title: 'Chai',
        items: [
          { name: 'Masala Chai', price: 30, description: 'Spiced tea', veg: true, bestseller: true },
          { name: 'Adrak Chai', price: 35, description: 'Ginger tea', veg: true },
          { name: 'Kulhad Chai', price: 40, description: 'Earthen pot chai', veg: true },
          { name: 'Elaichi Chai', price: 35, description: 'Cardamom tea', veg: true },
          { name: 'Kadak Chai', price: 35, description: 'Strong brewed chai', veg: true },
          { name: 'Irani Chai', price: 45, description: 'Irani style tea', veg: true },
        ],
      },
      {
        title: 'Snacks',
        items: [
          { name: 'Samosa (2 pcs)', price: 45, description: 'Crispy samosa', veg: true },
          { name: 'Sandwich', price: 79, description: 'Veg sandwich', veg: true },
          { name: 'Vada Pav', price: 45, description: 'Mumbai style vada pav', veg: true },
          { name: 'Aloo Paratha', price: 65, description: 'Stuffed paratha', veg: true },
          { name: 'Pav Bhaji', price: 89, description: 'Butter pav with bhaji', veg: true },
          { name: 'Maggie', price: 49, description: 'Masala maggie', veg: true },
        ],
      },
      {
        title: 'Beverages',
        items: [
          { name: 'Cold Coffee', price: 79, description: 'Iced cold coffee', veg: true },
          { name: 'Fresh Lime Soda', price: 45, description: 'Chilled lime soda', veg: true },
          { name: 'Lassi', price: 59, description: 'Sweet or salted lassi', veg: true },
        ],
      },
    ],
  },
  'faasos': {
    name: 'Faasos',
    rating: '4.1',
    ratingsCount: '12K+ ratings',
    costForTwo: 400,
    cuisines: ['Fast Food', 'Rolls', 'North Indian'],
    location: 'HSR Layout',
    deliveryTime: '30-35 mins',
    img: `${BASE}/RX_THUMBNAIL/IMAGES/VENDOR/2024/11/21/2c004550-3e2f-4929-a6b4-7f2599e9e2d9_18975.jpg`,
    outlet: 'HSR Layout',
    topPicks: [{ name: 'Chicken Seekh Roll', description: 'Seekh kebab wrapped in paratha.' }, { name: 'Paneer Tikka Roll', description: 'Paneer tikka in soft wrap.' }],
    deals: [
      { title: '25% OFF UPTO ₹75', subtitle: 'Above ₹299' },
      { title: 'ITEMS AT ₹129', subtitle: 'Roll combo' },
    ],
    menuCategories: [
      {
        title: 'Rolls',
        items: [
          { name: 'Chicken Seekh Roll', price: 179, description: 'Seekh kebab roll', veg: false, bestseller: true },
          { name: 'Paneer Tikka Roll', price: 159, description: 'Paneer tikka roll', veg: true },
          { name: 'Egg Roll', price: 129, description: 'Egg wrap', veg: false },
          { name: 'Chicken Tikka Roll', price: 189, description: 'Tandoori chicken roll', veg: false },
          { name: 'Mutton Roll', price: 199, description: 'Mutton kebab roll', veg: false },
          { name: 'Veggie Roll', price: 139, description: 'Mixed veg roll', veg: true },
          { name: 'Double Chicken Roll', price: 219, description: 'Double chicken filling', veg: false },
        ],
      },
      {
        title: 'Meals & Biryani',
        items: [
          { name: 'Chicken Biryani', price: 229, description: 'Hyderabadi biryani', veg: false },
          { name: 'Veg Biryani', price: 179, description: 'Vegetable biryani', veg: true },
          { name: 'Egg Biryani', price: 199, description: 'Full egg biryani', veg: false },
          { name: 'Chicken Rice Bowl', price: 209, description: 'Chicken with rice', veg: false },
          { name: 'Veg Rice Bowl', price: 169, description: 'Veg with rice', veg: true },
        ],
      },
      {
        title: 'Sides & Beverages',
        items: [
          { name: 'Chicken 65', price: 199, description: 'Spicy fried chicken', veg: false },
          { name: 'French Fries', price: 99, description: 'Crispy fries', veg: true },
          { name: 'Cold Drink', price: 49, description: 'Soft drink', veg: true },
        ],
      },
    ],
  },
  'barbeque-nation': {
    name: 'Barbeque Nation',
    rating: '4.0',
    ratingsCount: '6K+ ratings',
    costForTwo: 1200,
    cuisines: ['North Indian', 'Barbecue', 'Kebabs', 'Biryani'],
    location: 'Ashok Nagar',
    deliveryTime: '50-60 mins',
    img: `${BASE}/qzqeafcmayvxggjgj7rf`,
    outlet: 'Ashok Nagar',
    topPicks: [{ name: 'Live Grill Platter', description: 'Assorted grilled meats and veggies.' }, { name: 'Dessert Counter', description: 'Unlimited desserts from the counter.' }],
    deals: [
      { title: '66% OFF UPTO ₹126', subtitle: 'On select combos' },
      { title: 'ITEMS AT ₹299', subtitle: 'Grill pack' },
    ],
    menuCategories: [
      {
        title: 'Live Grill & Kebabs',
        items: [
          { name: 'Chicken Tikka', price: 349, description: 'Tandoori chicken tikka', veg: false, bestseller: true },
          { name: 'Paneer Tikka', price: 299, description: 'Grilled cottage cheese', veg: true },
          { name: 'Fish Tikka', price: 379, description: 'Grilled fish', veg: false },
          { name: 'Mutton Seekh Kebab', price: 399, description: 'Grilled mutton seekh', veg: false },
          { name: 'Chicken Seekh Kebab', price: 359, description: 'Grilled chicken seekh', veg: false },
          { name: 'Tandoori Chicken (Half)', price: 389, description: 'Half tandoori chicken', veg: false },
          { name: 'Veg Grill Platter', price: 329, description: 'Assorted grilled vegetables', veg: true },
          { name: 'Prawn Tikka', price: 429, description: 'Grilled prawns', veg: false },
        ],
      },
      {
        title: 'Main Course & Biryani',
        items: [
          { name: 'Chicken Biryani', price: 329, description: 'Hyderabadi biryani', veg: false },
          { name: 'Dal Makhani', price: 249, description: 'Creamy black lentils', veg: true },
          { name: 'Veg Biryani', price: 279, description: 'Vegetable biryani', veg: true },
          { name: 'Mutton Biryani', price: 399, description: 'Mutton dum biryani', veg: false },
          { name: 'Butter Chicken', price: 359, description: 'Creamy butter chicken', veg: false },
          { name: 'Kadai Chicken', price: 349, description: 'Kadai chicken curry', veg: false },
          { name: 'Paneer Butter Masala', price: 299, description: 'Paneer in tomato gravy', veg: true },
        ],
      },
      {
        title: 'Desserts & Beverages',
        items: [
          { name: 'Gulab Jamun', price: 79, description: 'Sweet dumplings', veg: true },
          { name: 'Brownie', price: 129, description: 'Chocolate brownie', veg: true },
          { name: 'Fresh Lime Soda', price: 79, description: 'Chilled lime soda', veg: true },
          { name: 'Sweet Lassi', price: 89, description: 'Chilled sweet lassi', veg: true },
        ],
      },
    ],
  },
  'wefit': {
    name: 'WeFit - Protein Bowls, Salads & Sandwiches',
    rating: '4.7',
    ratingsCount: '2.5K+ ratings',
    costForTwo: 450,
    cuisines: ['Healthy Food', 'Salads', 'Keto', 'Snacks'],
    location: 'Central Bangalore',
    deliveryTime: '20-30 mins',
    img: `${BASE}/RX_THUMBNAIL/IMAGES/VENDOR/2025/2/3/c64e7364-7909-417f-a850-ea89f41c318e_643832.jpg`,
    outlet: 'Central Bangalore',
    topPicks: [
      { name: 'Protein Bowl', description: 'Loaded with grilled chicken, quinoa and fresh greens.' },
      { name: 'Keto Salad', description: 'Low-carb salad with avocado and feta.' },
      { name: 'Grilled Chicken Sandwich', description: 'Whole grain bread with lean chicken and veggies.' },
    ],
    deals: [
      { title: 'ITEMS AT ₹99', subtitle: 'Select bowls & salads' },
      { title: '20% OFF UPTO ₹60', subtitle: 'Above ₹299' },
    ],
    menuCategories: [
      {
        title: 'Protein Bowls',
        items: [
          { name: 'Chicken Protein Bowl', price: 299, description: 'Grilled chicken, quinoa, greens, hummus', veg: false, bestseller: true },
          { name: 'Veggie Power Bowl', price: 249, description: 'Roasted veggies, chickpeas, quinoa', veg: true },
          { name: 'Paneer Bowl', price: 269, description: 'Paneer, brown rice, greens', veg: true },
          { name: 'Tuna Bowl', price: 319, description: 'Tuna, greens, brown rice', veg: false },
          { name: 'Buddha Bowl', price: 259, description: 'Veggies, chickpeas, tahini', veg: true },
          { name: 'Egg Bowl', price: 249, description: 'Boiled egg, avocado, greens', veg: false },
        ],
      },
      {
        title: 'Salads & Sandwiches',
        items: [
          { name: 'Keto Caesar Salad', price: 229, description: 'Romaine, parmesan, caesar dressing', veg: true },
          { name: 'Grilled Chicken Sandwich', price: 199, description: 'Whole grain, chicken, lettuce, tomato', veg: false, bestseller: true },
          { name: 'Veggie Wrap', price: 179, description: 'Hummus, roasted veggies, wrap', veg: true },
          { name: 'Greek Salad', price: 219, description: 'Cucumber, feta, olives', veg: true },
          { name: 'Avocado Toast', price: 199, description: 'Sourdough with avocado', veg: true },
          { name: 'Turkey Sandwich', price: 229, description: 'Lean turkey, whole grain', veg: false },
        ],
      },
      {
        title: 'Smoothies & Beverages',
        items: [
          { name: 'Green Smoothie', price: 179, description: 'Spinach, banana, almond milk', veg: true },
          { name: 'Protein Shake', price: 199, description: 'Whey or plant protein', veg: true },
          { name: 'Cold Pressed Juice', price: 159, description: 'Fresh fruit or green juice', veg: true },
        ],
      },
    ],
  },
  'leancrust-pizza': {
    name: 'LeanCrust Pizza - ThinCrust Experts',
    rating: '4.6',
    ratingsCount: '3K+ ratings',
    costForTwo: 500,
    cuisines: ['Pizzas', 'Italian', 'Desserts'],
    location: 'Central Bangalore',
    deliveryTime: '20-30 mins',
    img: `${BASE}/RX_THUMBNAIL/IMAGES/VENDOR/2024/8/30/14414940-565f-4b31-8880-eb44478a5ec0_681612.jpg`,
    outlet: 'Central Bangalore',
    topPicks: [
      { name: 'Thin Crust Margherita', description: 'Classic tomato and basil on thin, crispy base.' },
      { name: 'Lean Veggie Pizza', description: 'Light thin crust loaded with fresh vegetables.' },
      { name: 'Chicken BBQ Thin Crust', description: 'Smoky BBQ chicken on our signature thin crust.' },
    ],
    deals: [
      { title: 'ITEMS AT ₹99', subtitle: 'Select pizzas' },
      { title: '25% OFF UPTO ₹80', subtitle: 'Above ₹349' },
    ],
    menuCategories: [
      {
        title: 'Thin Crust Pizzas',
        items: [
          { name: 'Margherita', price: 249, description: 'Tomato, mozzarella, basil', veg: true, bestseller: true },
          { name: 'Veggie Delight', price: 279, description: 'Bell peppers, olives, corn, onion', veg: true },
          { name: 'BBQ Chicken', price: 329, description: 'BBQ sauce, chicken, red onion', veg: false, bestseller: true },
          { name: 'Pepperoni', price: 299, description: 'Pepperoni, cheese', veg: false },
          { name: 'Four Cheese', price: 299, description: 'Mozzarella, cheddar, parmesan, feta', veg: true },
          { name: 'Chicken Tikka', price: 319, description: 'Tandoori chicken, onion', veg: false },
          { name: 'Paneer Makhani', price: 289, description: 'Paneer, makhani sauce', veg: true },
          { name: 'Mushroom & Olive', price: 269, description: 'Mushroom, black olives', veg: true },
        ],
      },
      {
        title: 'Sides & Desserts',
        items: [
          { name: 'Garlic Bread', price: 99, description: 'Toasted garlic bread', veg: true },
          { name: 'Cheese Sticks', price: 129, description: 'Mozzarella sticks', veg: true },
          { name: 'Brownie', price: 99, description: 'Chocolate brownie', veg: true },
          { name: 'Tiramisu', price: 149, description: 'Classic tiramisu', veg: true },
          { name: 'Fresh Lime Soda', price: 59, description: 'Chilled lime soda', veg: true },
        ],
      },
    ],
  },
  'mcdonalds': {
    name: "McDonald's",
    rating: '4.3',
    ratingsCount: '18K+ ratings',
    costForTwo: 400,
    cuisines: ['Burgers', 'Beverages', 'Cafe', 'Desserts'],
    location: 'Ashok Nagar',
    deliveryTime: '35-40 mins',
    img: `${BASE}/RX_THUMBNAIL/IMAGES/VENDOR/2025/10/3/136c9e23-b373-45d5-9fad-7e4763ebd36b_43836.JPG`,
    outlet: 'Ashok Nagar',
    topPicks: [
      { name: 'McAloo Tikki Burger', description: 'Crispy potato patty with signature sauces.' },
      { name: 'McChicken', description: 'Crispy chicken burger with lettuce and mayo.' },
      { name: 'McFlurry Oreo', description: 'Soft serve with Oreo pieces.' },
    ],
    deals: [
      { title: '₹100 OFF ABOVE ₹349', subtitle: 'NO CODE REQUIRED' },
      { title: 'ITEMS AT ₹99', subtitle: 'Value menu' },
    ],
    menuCategories: [
      {
        title: 'Burgers',
        items: [
          { name: 'McAloo Tikki', price: 59, description: 'Veg burger with potato patty', veg: true, bestseller: true },
          { name: 'McChicken', price: 169, description: 'Crispy chicken burger', veg: false, bestseller: true },
          { name: 'Big Spicy Paneer Wrap', price: 229, description: 'Paneer wrap with spicy sauce', veg: true },
          { name: 'Chicken McNuggets (6 pcs)', price: 199, description: 'Crispy chicken nuggets', veg: false },
          { name: 'McVeggie', price: 129, description: 'Veg burger with veg patty', veg: true },
          { name: 'McSpicy Chicken', price: 189, description: 'Spicy chicken burger', veg: false },
          { name: 'Filet-O-Fish', price: 179, description: 'Fish fillet burger', veg: false },
          { name: 'Chicken Maharaja Mac', price: 329, description: 'Double chicken burger', veg: false },
        ],
      },
      {
        title: 'Beverages & Desserts',
        items: [
          { name: 'McFlurry Oreo', price: 129, description: 'Soft serve with Oreo', veg: true },
          { name: 'McDonald\'s Fries', price: 99, description: 'World famous fries', veg: true },
          { name: 'Coke (500ml)', price: 60, description: 'Chilled soft drink', veg: true },
          { name: 'McFlurry KitKat', price: 129, description: 'Soft serve with KitKat', veg: true },
          { name: 'Apple Pie', price: 49, description: 'Fried apple pie', veg: true },
          { name: 'McWings (4 pcs)', price: 199, description: 'Spicy chicken wings', veg: false },
        ],
      },
    ],
  },
  'subway': {
    name: 'Subway',
    rating: '4.5',
    ratingsCount: '12K+ ratings',
    costForTwo: 350,
    cuisines: ['Sandwich', 'Salads', 'Wrap', 'Healthy Food'],
    location: 'Vittal Mallya Road',
    deliveryTime: '25-30 mins',
    img: `${BASE}/RX_THUMBNAIL/IMAGES/VENDOR/2025/6/12/f4848952-184f-414f-bbe3-7a39faeddec9_69876.jpg`,
    outlet: 'Vittal Mallya Road',
    topPicks: [
      { name: 'Veggie Delite', description: 'Fresh vegetables on your choice of bread.' },
      { name: 'Chicken Teriyaki', description: 'Teriyaki glazed chicken with crunchy veggies.' },
      { name: 'Turkey & Ham', description: 'Classic combo of turkey and ham.' },
    ],
    deals: [
      { title: '25% OFF UPTO ₹125', subtitle: 'Above ₹499' },
      { title: 'ITEMS AT ₹99', subtitle: '6-inch subs' },
    ],
    menuCategories: [
      {
        title: 'Subs & Wraps',
        items: [
          { name: 'Veggie Delite (6")', price: 199, description: 'Fresh veggies, choice of bread', veg: true, bestseller: true },
          { name: 'Chicken Teriyaki (6")', price: 249, description: 'Teriyaki chicken sub', veg: false, bestseller: true },
          { name: 'Paneer Tikka (6")', price: 229, description: 'Paneer tikka sub', veg: true },
          { name: 'Veggie Wrap', price: 219, description: 'Veggies in soft wrap', veg: true },
          { name: 'Turkey & Ham (6")', price: 269, description: 'Turkey and ham sub', veg: false },
          { name: 'Chicken Tikka (6")', price: 249, description: 'Chicken tikka sub', veg: false },
          { name: 'Italian BMT (6")', price: 279, description: 'Pepperoni, ham, salami', veg: false },
          { name: 'Tuna (6")', price: 259, description: 'Tuna sub', veg: false },
        ],
      },
      {
        title: 'Salads & Sides',
        items: [
          { name: 'Veggie Salad', price: 179, description: 'Fresh garden salad', veg: true },
          { name: 'Chicken Salad', price: 229, description: 'Grilled chicken salad', veg: false },
          { name: 'Cookies (2 pcs)', price: 60, description: 'Chocolate chip cookies', veg: true },
          { name: 'Chips', price: 49, description: 'Lay\'s chips', veg: true },
          { name: 'Soft Drink', price: 59, description: 'Fountain drink', veg: true },
        ],
      },
    ],
  },
  'daily-kitchen': {
    name: 'Daily Kitchen - Everyday Homely Meals',
    rating: '4.4',
    ratingsCount: '5K+ ratings',
    costForTwo: 350,
    cuisines: ['Home Food', 'Indian', 'North Indian', 'Thalis'],
    location: 'Central Bangalore',
    deliveryTime: '20-30 mins',
    img: `${BASE}/RX_THUMBNAIL/IMAGES/VENDOR/2025/6/10/05595a0f-d3f2-474e-8183-3ef3d67f3ead_750396.jpg`,
    outlet: 'Central Bangalore',
    topPicks: [
      { name: 'Dal Rice Combo', description: 'Homely dal chawal with pickle and papad.' },
      { name: 'Roti Sabzi Thali', description: 'Fresh rotis with seasonal vegetables.' },
      { name: 'Kadhi Chawal', description: 'North Indian kadhi with steamed rice.' },
    ],
    deals: [
      { title: 'ITEMS AT ₹99', subtitle: 'Select combos' },
      { title: '₹166 OFF ABOVE ₹699', subtitle: 'On orders above ₹699' },
    ],
    menuCategories: [
      {
        title: 'Thalis & Meals',
        items: [
          { name: 'Dal Rice Thali', price: 149, description: 'Dal, rice, roti, pickle, papad', veg: true, bestseller: true },
          { name: 'Roti Sabzi Combo', price: 129, description: '2 rotis, seasonal sabzi', veg: true },
          { name: 'Kadhi Chawal', price: 139, description: 'Kadhi with steamed rice', veg: true },
          { name: 'Paneer Thali', price: 199, description: 'Paneer curry, rice, roti, dal', veg: true },
          { name: 'Chicken Thali', price: 229, description: 'Chicken curry, rice, roti, dal', veg: false },
          { name: 'Rajma Chawal', price: 129, description: 'Kidney beans with rice', veg: true },
          { name: 'Sabzi Roti (4 pcs)', price: 119, description: 'Four rotis with sabzi', veg: true },
          { name: 'Curd Rice Thali', price: 119, description: 'Curd rice with pickle', veg: true },
        ],
      },
      {
        title: 'Home Style Curries',
        items: [
          { name: 'Dal Fry', price: 89, description: 'Tadka dal', veg: true },
          { name: 'Mix Veg', price: 99, description: 'Seasonal vegetables', veg: true },
          { name: 'Chole', price: 99, description: 'Spiced chickpeas', veg: true },
          { name: 'Palak Paneer', price: 179, description: 'Paneer in spinach gravy', veg: true },
          { name: 'Aloo Gobi', price: 109, description: 'Potato and cauliflower', veg: true },
          { name: 'Chicken Curry', price: 199, description: 'North Indian chicken curry', veg: false },
        ],
      },
      {
        title: 'Beverages',
        items: [
          { name: 'Buttermilk', price: 35, description: 'Spiced buttermilk', veg: true },
          { name: 'Lassi', price: 49, description: 'Sweet lassi', veg: true },
        ],
      },
    ],
  },
  'smoor': {
    name: 'SMOOR',
    rating: '4.6',
    ratingsCount: '4K+ ratings',
    costForTwo: 700,
    cuisines: ['Asian', 'Burgers', 'Italian', 'Thai', 'Sushi', 'Salads', 'Pastas', 'Pizzas', 'Mexican', 'Chinese'],
    location: 'Lavelle Road',
    deliveryTime: '30-35 mins',
    img: `${BASE}/RX_THUMBNAIL/IMAGES/VENDOR/2026/1/2/6ec1221b-fddf-417d-bd93-2fd514d43fde_588012.JPG`,
    outlet: 'Lavelle Road',
    topPicks: [
      { name: 'Chocolate Truffle Cake', description: 'Rich chocolate truffle with ganache.' },
      { name: 'Sushi Platter', description: 'Assorted fresh sushi and maki.' },
      { name: 'Wood Fired Pizza', description: 'Thin crust pizza from the oven.' },
    ],
    deals: [
      { title: '₹200 OFF ABOVE ₹699', subtitle: 'NO CODE REQUIRED' },
      { title: '20% OFF UPTO ₹100', subtitle: 'Above ₹499' },
    ],
    menuCategories: [
      {
        title: 'Desserts & Bakery',
        items: [
          { name: 'Chocolate Truffle Cake', price: 349, description: 'Rich chocolate truffle slice', veg: true, bestseller: true },
          { name: 'Red Velvet Pastry', price: 199, description: 'Classic red velvet', veg: true },
          { name: 'Croissant', price: 129, description: 'Buttery croissant', veg: true },
          { name: 'New York Cheesecake', price: 279, description: 'Cream cheese cheesecake', veg: true },
          { name: 'Tiramisu', price: 249, description: 'Classic tiramisu', veg: true },
          { name: 'Macarons (4 pcs)', price: 199, description: 'Assorted macarons', veg: true },
          { name: 'Chocolate Éclair', price: 149, description: 'Chocolate filled éclair', veg: true },
        ],
      },
      {
        title: 'Main Course',
        items: [
          { name: 'Margherita Pizza', price: 399, description: 'Wood fired margherita', veg: true },
          { name: 'Pasta Alfredo', price: 349, description: 'Creamy Alfredo pasta', veg: true },
          { name: 'Sushi Roll (6 pcs)', price: 299, description: 'Assorted sushi', veg: false },
          { name: 'Pad Thai', price: 329, description: 'Thai stir-fried noodles', veg: true },
          { name: 'Burger with Fries', price: 379, description: 'Gourmet burger', veg: false },
          { name: 'Caesar Salad', price: 279, description: 'Romaine, parmesan, croutons', veg: true },
        ],
      },
      {
        title: 'Beverages',
        items: [
          { name: 'Iced Latte', price: 199, description: 'Cold coffee latte', veg: true },
          { name: 'Fresh Juice', price: 179, description: 'Seasonal fresh juice', veg: true },
          { name: 'Smoothie', price: 229, description: 'Fruit smoothie', veg: true },
        ],
      },
    ],
  },
};

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

function DishRatingLeaf({ fill }: { fill: '#116649' | '#1BA672' }) {
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">
      <rect width={14} height={14} fill="white" />
      <path d="M5.67163 3.99166C6.22068 2.34179 6.49521 1.51686 7 1.51686C7.50479 1.51686 7.77932 2.34179 8.32837 3.99166L8.65248 4.96556H9.60668C11.4122 4.96556 12.315 4.96556 12.4703 5.45302C12.6256 5.94049 11.8893 6.4628 10.4167 7.50744L9.67376 8.03444L9.97544 8.94095C10.5325 10.615 10.8111 11.452 10.4033 11.754C9.99553 12.056 9.27604 11.5457 7.83705 10.5249L7 9.93112L6.16295 10.5249C4.72396 11.5457 4.00447 12.056 3.5967 11.754C3.18893 11.452 3.46747 10.615 4.02456 8.94095L4.04557 8.87783C4.18081 8.47145 4.24843 8.26825 4.18684 8.08006C4.12525 7.89187 3.94958 7.76725 3.59824 7.51802C2.11566 6.46633 1.37437 5.94049 1.52971 5.45302C1.68504 4.96556 2.5878 4.96556 4.39332 4.96556H5.34752L5.67163 3.99166Z" fill={fill} />
    </svg>
  );
}

type RestaurantPageProps = { params: { slug: string } | Promise<{ slug: string }> };

function RestaurantNotFoundUI() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-16 text-center">
      <h1 className="text-xl font-semibold text-[#02060c]">Restaurant not found</h1>
      <p className="text-[#686b78] mt-2">The restaurant you’re looking for doesn’t exist or has been removed.</p>
      <Link href="/food-delivery" className="inline-block mt-6 px-4 py-2 bg-[#ff5200] text-white font-medium rounded-lg hover:opacity-90">
        Back to food delivery
      </Link>
    </div>
  );
}

type PendingAdd = { restaurantSlug: string; restaurantName: string; name: string; price: number; isVeg: boolean };

function RestaurantPageContent({ config, slug }: { config: RestaurantConfig; slug: string }) {
  const [activeTab, setActiveTab] = useState<'order' | 'dineout'>('order');
  const [menuFilter, setMenuFilter] = useState<'all' | 'veg' | 'nonveg'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showReplaceConfirm, setShowReplaceConfirm] = useState(false);
  const [pendingAdd, setPendingAdd] = useState<PendingAdd | null>(null);
  const starId = 'rest-page-star';
  const dealsRef = React.useRef<HTMLDivElement>(null);
  const topPicksRef = React.useRef<HTMLDivElement>(null);

  const cartItems = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const incrementItem = useCartStore((s) => s.incrementItem);
  const decrementItem = useCartStore((s) => s.decrementItem);
  const clearCart = useCartStore((s) => s.clearCart);

  const getQty = (id: string) => cartItems.find((i) => i.itemId === id)?.quantity ?? 0;

  const handleAdd = (restaurantSlug: string, restaurantName: string, item: { name: string; price: number; isVeg: boolean }) => {
    const result = addItem(restaurantSlug, restaurantName, item);
    if (result.needConfirm) {
      setPendingAdd({ restaurantSlug, restaurantName, ...item });
      setShowReplaceConfirm(true);
    }
  };

  const confirmReplace = () => {
    if (pendingAdd) {
      clearCart();
      addItem(pendingAdd.restaurantSlug, pendingAdd.restaurantName, {
        name: pendingAdd.name,
        price: pendingAdd.price,
        isVeg: pendingAdd.isVeg,
      });
      setPendingAdd(null);
      setShowReplaceConfirm(false);
    }
  };

  const cancelReplace = () => {
    setPendingAdd(null);
    setShowReplaceConfirm(false);
  };

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return config.menuCategories.map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          (menuFilter === 'all' || (menuFilter === 'veg' && item.veg) || (menuFilter === 'nonveg' && !item.veg)) &&
          (!q || item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q))
      ),
    })).filter((cat) => cat.items.length > 0);
  }, [config.menuCategories, menuFilter, searchQuery]);

  const cityName = 'Bangalore';

  const scrollDeals = (dir: 'left' | 'right') => {
    if (dealsRef.current) dealsRef.current.scrollBy({ left: dir === 'right' ? 280 : -280, behavior: 'smooth' });
  };
  const scrollTopPicks = (dir: 'left' | 'right') => {
    if (topPicksRef.current) topPicksRef.current.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' });
  };

  return (
    <>
      {/* Breadcrumb – Pizza Hut: inspected structure (_4_3vb _1a6wI, _2vs3E, _3EB6q, KK6-u) */}
      {slug === 'pizza-hut' ? (
        <div className="max-w-[1200px] min-w-0 mx-auto px-4 pt-4 pb-2">
          <div className="_4_3vb _1a6wI flex flex-wrap items-center gap-1 text-sm text-[#686b78]" itemScope itemType="http://schema.org/BreadcrumbList">
            <span itemScope itemType="http://schema.org/ListItem" itemProp="itemListElement">
              <Link href="/" itemProp="item" data-url="/" className="_2vs3E text-[#686b78] hover:text-[#ff5200]">
                <span itemProp="name" className="_3EB6q">Home</span>
              </Link>
              <meta itemProp="position" content="1" />
            </span>
            <span className="KK6-u" aria-hidden>/</span>
            <span itemScope itemType="http://schema.org/ListItem" itemProp="itemListElement">
              <Link href="/food-delivery" itemProp="item" data-url="/city/bangalore" className="_2vs3E text-[#686b78] hover:text-[#ff5200]">
                <span itemProp="name" className="_3EB6q">Bangalore</span>
              </Link>
              <meta itemProp="position" content="2" />
            </span>
            <span className="KK6-u" aria-hidden>/</span>
            <span className="_2vs3E text-[#02060c]">Pizza Hut</span>
          </div>
        </div>
      ) : (
        <div className="max-w-[1200px] min-w-0 mx-auto px-4 pt-4 pb-2" itemScope itemType="http://schema.org/BreadcrumbList">
          <div className="flex flex-wrap items-center gap-1 text-sm text-[#686b78]">
            <Link href="/" className="hover:text-[#ff5200]">Home</Link>
            <span aria-hidden>/</span>
            <Link href="/food-delivery" className="hover:text-[#ff5200]">{cityName}</Link>
            <span aria-hidden>/</span>
            <span className="text-[#02060c] font-medium">{config.name}</span>
          </div>
        </div>
      )}

      {/* Section 1b: Restaurant name header – Pizza Hut inspected (sc-jpchaS cuqGpt) */}
      {/* Section 2: Order Online / Dineout tabs – Pizza Hut inspected (sc-eWQEsn izxMee) */}
      {/* Section 3: Rating / delivery card – Pizza Hut inspected (sc-fsdmtx PGrxW) */}
      {/* Section 4: Deals for you – Pizza Hut inspected (sc-fQQAXF dgcTSB) */}
      {slug === 'pizza-hut' ? (
        <>
          <div className="max-w-[1200px] min-w-0 mx-auto px-4">
            <div className="sc-jpchaS cuqGpt">
              <div>
                <h1 className="sc-aXZVg gONLwH">Pizza Hut</h1>
              </div>
            </div>
          </div>
          <div className="sc-eWQEsn izxMee flex gap-8 border-b border-[#e9e9eb] max-w-[1200px] min-w-0 mx-auto px-4">
            <Link href="/restaurant/pizza-hut" className="sc-jUhhhy hNlsoc block no-underline text-[#02060c] pb-3 -mb-px border-b-2 border-[#ff5200]">
              <div className="sc-aXZVg kmaeJm sc-iqnRUp jvJcbp font-medium text-sm">Order Online</div>
              <div className="sc-bYiLkE fwJUvc" />
            </Link>
            <Link href="/restaurant/pizza-hut" className="sc-jUhhhy hNlsoc block no-underline text-[#686b78] pb-3 -mb-px border-b-2 border-transparent">
              <div className="sc-aXZVg kmaeJm sc-iqnRUp jvJcbp font-medium text-sm">Dineout</div>
              <div className="sc-bYiLkE fQUMfE" />
            </Link>
          </div>
          <div className="max-w-[1200px] min-w-0 mx-auto px-4 py-4">
            <div className="sc-fsdmtx PGrxW">
              <div className="sc-ialZcF bEtGSH">
                <div className="sc-eUaqED ePAksq" />
                <div className="sc-iCiAtz hUQZGs flex flex-wrap items-center gap-2 text-sm text-[#02060c]">
                  <div className="sc-GkewF irxlbl">
                    <div style={{ lineHeight: 0 }}>
                      <StoreRatingStar id={`${starId}-pizza-hut`} />
                    </div>
                  </div>
                  <div className="sc-aXZVg bTHhpu font-semibold">4.3 (11K+ ratings)</div>
                  <div className="sc-aXZVg hzqUM sc-ckdtJO hNhgKC text-[#686b78]">•</div>
                  <div className="sc-aXZVg bTHhpu font-medium">₹600 for two</div>
                </div>
                <div className="sc-fDAHlQ kwZsAt mt-2">
                  <Link href="/food-delivery?cuisine=pizzas">
                    <div className="sc-aXZVg bPYyBR sc-DIosr cZjBEW">Pizzas</div>
                  </Link>
                  &nbsp;
                </div>
                <div className="sc-fAYRhC jFxbXm mt-3">
                  <div className="sc-jPZRTc LzjnF">
                    <div className="sc-htLNJe eXMaOf" />
                    <div className="sc-cxtnvD jsHwFJ" />
                    <div className="sc-htLNJe eXMaOf" />
                  </div>
                  <div className="sc-eTHrFB QHyfc flex flex-wrap items-center gap-2 text-sm">
                    <div className="sc-cRkIpO kGOgfL flex items-center gap-2">
                      <div className="sc-aXZVg bWlCVE text-[#686b78]">Outlet</div>
                      <div className="sc-aXZVg kYaBqd sc-jknRBj gVaQNB text-[#02060c] font-medium">Central Bangalore</div>
                      <div className="_1CJW_">
                        <button type="button" className="_1QsMS bg-transparent border-0 p-0 cursor-pointer text-[#686b78]" aria-label="Selected outlet is Central Bangalore, 3.0 km away. Double tap to change outlet.">
                          <span className="_3eQ8u" aria-hidden>▾</span>
                        </button>
                      </div>
                    </div>
                    <div className="sc-jwiwYR ecfuJD">
                      <div className="sc-aXZVg bWlCVE text-[#02060c] font-medium">40-45 mins</div>
                    </div>
                  </div>
                </div>
                <div className="sc-kbBBtk kRMRtE" />
              </div>
            </div>
          </div>
          <div className="sc-fQQAXF dgcTSB max-w-[1200px] min-w-0 mx-auto px-4 py-6">
            <div className="sc-dOtRHS elRkec flex items-center gap-2 flex-shrink-0">
              <button type="button" aria-label="click here to move previous" className="sc-cfWevs loxocv flex items-center justify-center w-9 h-9 rounded-full border border-[#e9e9eb] bg-white hover:bg-gray-50" onClick={() => scrollDeals('left')}>
                <div className="sc-khxaTn sc-iyZnGN gWLSRk bcSsTL flex items-center justify-center">
                  <svg aria-hidden height={16} width={16} className="sc-dcJsrY bExgxb" fill="currentColor" viewBox="0 0 16 16"><path d="M10 12L6 8l4-4" /></svg>
                </div>
              </button>
              <button type="button" aria-label="click here to move next" className="sc-cfWevs loxocv flex items-center justify-center w-9 h-9 rounded-full border border-[#e9e9eb] bg-white hover:bg-gray-50" onClick={() => scrollDeals('right')}>
                <div className="sc-khxaTn gWLSRk flex items-center justify-center">
                  <svg aria-hidden height={16} width={16} className="sc-dcJsrY bExgxb" fill="currentColor" viewBox="0 0 16 16"><path d="M6 4l4 4-4 4" /></svg>
                </div>
              </button>
            </div>
            <div>
              <div data-theme="light">
                <div className="sc-ktJbId jwmYbC">
                  <div className="sc-kMkxaj kFkzXi">
                    <div className="sc-fiCwlc eZFkXx">
                      <h2 color="text_Highest_Emphasis" className="sc-kbhJrz fKfLFK title">
                        <div>Deals for you</div>
                      </h2>
                      <div className="sc-aXZVg dcVxGb sc-ehixzo fINqWQ"> </div>
                    </div>
                  </div>
                  <div className="sc-gmgFlS gWgaGa">
                    <div ref={dealsRef} className="row flex gap-4 overflow-x-auto no-scrollbar pb-2" style={{ scrollBehavior: 'smooth' }}>
                      {[
                        { title: 'Items At ₹379', subtitle: 'ENDS IN 03h : 46m : 47s', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_96,h_96/offers/DealRush_Offer_Icon.png', alt: 'Items At ₹379' },
                        { title: '7.5% Off Upto ₹100', subtitle: 'NO CODE REQUIRED', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_96,h_96/MARKETING_BANNERS/IMAGES/OFFERS/2026/1/31/a7854ae9-0ce6-4dee-b5e5-7dc038a1574f_YESBankMenuLogoNew1.png', alt: '7.5% Off Upto ₹100' },
                        { title: 'Flat ₹150 Off', subtitle: 'USE AXISREWARDS', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_96,h_96/MARKETING_BANNERS/IMAGES/OFFERS/2026/1/31/41ce0d47-9d53-4cd2-b558-57a3990a411d_Axis.png', alt: 'Flat ₹150 Off' },
                        { title: 'Flat ₹50 Off', subtitle: 'NO CODE REQUIRED', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_96,h_96/MARKETING_BANNERS/IMAGES/OFFERS/2026/1/31/a8bab433-41a9-446a-a6da-3f8187d16e80_ICICIMenuLogo.png', alt: 'Flat ₹50 Off' },
                        { title: '66% Off Upto ₹126', subtitle: 'USE SWIGGY6', img: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_96,h_96/merch_bau/locked-badge.png', alt: '66% Off Upto ₹126' },
                      ].map((deal, i) => (
                        <div key={i} className="sc-jIGnZt dUFUZV flex-shrink-0 w-[260px] min-w-[260px]">
                          <div style={{ position: 'relative' }}>
                            <div data-stroke="border_Secondary" className="sc-ePDLzJ fUNakN sc-kNjblg iPnFdD border border-[#e9e9eb] rounded-xl bg-white p-4">
                              <div data-testid={`offer-card-container-${i}`} className="sc-htnKkc eGNuoq">
                                <div className="sc-jagrIt kWrzKC flex items-start gap-3">
                                  <div className="sc-jIHYlh fLEUqB flex-shrink-0 w-12 h-12 overflow-hidden rounded-full">
                                    <img className="sc-eeDRCY kwHpqe w-full h-full object-cover" src={deal.img} width={48} height={48} alt={deal.alt} />
                                  </div>
                                  <div className="sc-cPenmI jknsae min-w-0 flex-1">
                                    <div className="sc-aXZVg hsuIwO font-bold text-[#02060c] text-sm">{deal.title}</div>
                                    <div className="sc-aXZVg foYDCM text-[#686b78] text-xs mt-0.5">{deal.subtitle}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="max-w-[1200px] min-w-0 mx-auto px-4 pt-2 pb-4">
            <h1 className="sc-aXZVg gONLwH text-2xl md:text-3xl font-semibold text-[#02060c] tracking-tight">
              {config.name}
            </h1>
          </div>
          <div className="sc-eWQEsn izxMee border-b border-[#e9e9eb] max-w-[1200px] min-w-0 mx-auto px-4">
            <div className="flex gap-8">
              <button
                type="button"
                onClick={() => setActiveTab('order')}
                className="pb-3 border-b-2 font-medium text-sm -mb-px transition-colors"
                style={{
                  borderColor: activeTab === 'order' ? '#ff5200' : 'transparent',
                  color: activeTab === 'order' ? '#ff5200' : '#686b78',
                }}
              >
                Order Online
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('dineout')}
                className="pb-3 border-b-2 font-medium text-sm -mb-px transition-colors"
                style={{
                  borderColor: activeTab === 'dineout' ? '#ff5200' : 'transparent',
                  color: activeTab === 'dineout' ? '#ff5200' : '#686b78',
                }}
              >
                Dineout
              </button>
            </div>
          </div>
          <div className="max-w-[1200px] min-w-0 mx-auto px-4 py-4">
            <div className="bg-white rounded-2xl p-4 md:p-5 w-full" style={{ boxShadow: '0 1px 2px rgba(40,44,63,.08), 0 2px 8px rgba(40,44,63,.06)' }}>
              <div className="flex flex-wrap items-center gap-2 text-sm text-[#02060c]">
                <div className="flex items-center gap-1">
                  <StoreRatingStar id={starId} />
                  <span className="font-semibold">{config.rating} ({config.ratingsCount})</span>
                </div>
                <span className="text-[#686b78]">•</span>
                <span className="font-medium">₹{config.costForTwo} for two</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-0">
                {config.cuisines.map((c, i) => {
                  const cuisineSlug = c.toLowerCase().replace(/\s+/g, '-');
                  const cuisineHref = `/food-delivery?cuisine=${encodeURIComponent(cuisineSlug)}`;
                  return (
                    <span key={c}>
                      <Link href={cuisineHref} className="text-[#ff5200] font-medium underline hover:no-underline">
                        {c}
                      </Link>
                      {i < config.cuisines.length - 1 && <span className="text-[#686b78]">, </span>}
                    </span>
                  );
                })}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-[#686b78]">Outlet</span>
                <span className="text-[#02060c] font-medium">{config.outlet ?? config.location}</span>
                <span className="text-[#686b78] ml-1" aria-hidden>▼</span>
                <span className="border-l border-dashed border-[#e9e9eb] h-4 mx-2" aria-hidden />
                <span className="text-[#02060c] font-medium">{config.deliveryTime}</span>
              </div>
            </div>
          </div>
          <div className="sc-fQQAXF dgcTSB max-w-[1200px] min-w-0 mx-auto px-4 py-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="sc-kbhJrz fKfLFK title text-lg font-bold text-[#02060c]">Deals for you</h2>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button type="button" onClick={() => scrollDeals('left')} className="flex-shrink-0 w-9 h-9 rounded-full border border-[#e9e9eb] bg-white flex items-center justify-center text-[#686b78] hover:bg-gray-50" aria-label="Previous deals">
                  <svg width={16} height={16} viewBox="0 0 16 16" fill="currentColor" aria-hidden><path d="M10 12L6 8l4-4" /></svg>
                </button>
                <button type="button" onClick={() => scrollDeals('right')} className="flex-shrink-0 w-9 h-9 rounded-full border border-[#e9e9eb] bg-white flex items-center justify-center text-[#686b78] hover:bg-gray-50" aria-label="Next deals">
                  <svg width={16} height={16} viewBox="0 0 16 16" fill="currentColor" aria-hidden><path d="M6 4l4 4-4 4" /></svg>
                </button>
              </div>
            </div>
            <div ref={dealsRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-2" style={{ scrollBehavior: 'smooth' }}>
              {config.deals.map((deal, i) => (
                <div key={i} className="flex-shrink-0 w-[260px] rounded-xl border border-[#e9e9eb] bg-white p-4 flex items-start gap-3" style={{ boxShadow: '0 1px 2px rgba(40,44,63,.08)' }}>
                  <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-[#e9e9eb] flex items-center justify-center">
                    {deal.iconImg ? (
                      <img src={deal.iconImg} alt="" className="w-full h-full object-cover" width={48} height={48} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: deal.icon === 'purple' ? '#5e35b1' : '#ff5200' }}>
                        {deal.icon === 'orange' ? <span className="text-white font-bold text-lg">%</span> : <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" aria-hidden><path d="M20 12v10H4V12M12 2v4M12 18v4M2 12h4M18 12h4" /><path d="M12 6v12M6 12h12" /></svg>}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-[#02060c] text-sm">{deal.title}</div>
                    <div className="text-[#686b78] text-xs mt-0.5">{deal.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* MENU section – Pizza Hut: inspected (sc-gwCEra, sc-iqGQTr, sc-fwRBTg, Top Picks sc-fRjzWH) */}
      <div className="sc-gwCEra ieyMZc max-w-[1200px] min-w-0 mx-auto px-4 py-4 border-t border-[#e9e9eb]">
        {slug === 'pizza-hut' ? (
          <>
            <div className="flex items-center justify-center gap-2 my-6">
              <svg aria-hidden height={24} width={24} className="sc-dcJsrY bExgxb text-[#e9e9eb]" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" /></svg>
              <div className="sc-aXZVg cDIVgt sc-bAkedz dsasDD text-sm font-bold text-[#02060c] uppercase tracking-wide">MENU</div>
              <svg aria-hidden height={24} width={24} className="sc-dcJsrY bExgxb text-[#e9e9eb]" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" /></svg>
            </div>
            <div className="sc-iqGQTr tCPc relative mb-6">
              <svg aria-hidden height={20} width={20} className="sc-dcJsrY inwpzm text-[#686b78] pointer-events-none" style={{ position: 'absolute', right: 28, marginTop: 12 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <button type="button" data-cy="menu-search-button" aria-label="Search items" className="sc-iKfoIU jVgjup w-full max-w-[320px] text-left px-4 py-2.5 rounded-lg bg-[#e9e9eb] text-sm border-0 cursor-pointer" onClick={() => {}}>
                <div className="sc-aXZVg ivhtUN text-[#686b78]">Search for dishes</div>
              </button>
            </div>
            <div>
              <div className="sc-fwRBTg bxXXlh flex flex-wrap items-center gap-3">
                <div className="sc-AzbFF gKwtVP">
                  <div className="sc-crhfPb gjGCrq">
                    <label className="sc-gMZepy kkAjkP flex cursor-pointer items-center gap-2">
                      <input type="checkbox" aria-checked={menuFilter === 'veg'} aria-label="Enable veg option" id="VEG" className="sc-dgcZxp jjEXqn sr-only" checked={menuFilter === 'veg'} onChange={(e) => setMenuFilter(e.target.checked ? 'veg' : 'all')} />
                      <span className="sc-hBUXXM hivvjs inline-flex">
                        <div className="sc-cnVHiu itINAE w-5 h-5 rounded-full border-2 border-[#0f8a0f] flex items-center justify-center">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#0f8a0f]" />
                        </div>
                      </span>
                    </label>
                  </div>
                </div>
                <div className="sc-AzbFF gKwtVP">
                  <div className="sc-crhfPb gjGCrq">
                    <label className="sc-gMZepy kkAjkP flex cursor-pointer items-center gap-2">
                      <input type="checkbox" aria-checked={menuFilter === 'nonveg'} aria-label="Enable non veg option" id="NON_VEG" className="sc-dgcZxp jjEXqn sr-only" checked={menuFilter === 'nonveg'} onChange={(e) => setMenuFilter(e.target.checked ? 'nonveg' : 'all')} />
                      <span className="sc-hBUXXM hivvjs inline-flex">
                        <div className="sc-cnVHiu itINAE w-5 h-5 rounded-full border-2 border-[#e43b4f] flex items-center justify-center">
                          <span className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[8px] border-l-transparent border-r-transparent border-b-[#e43b4f]" />
                        </div>
                      </span>
                    </label>
                  </div>
                </div>
                <div className="sc-AzbFF gKwtVP">
                  <div className="sc-krNlru fSKcFz">
                    <div className="contents">
                      <div className="sc-aXZVg hwUmr px-3 py-2 rounded-lg border border-[#e9e9eb] bg-[#e9e9eb] text-[#02060c] text-sm font-medium">Bestseller</div>
                    </div>
                  </div>
                </div>
              </div>
              <div />
              <div className="sc-gbWBZM hxAGDs" />
            </div>
            <div>
              <div className="sc-fRjzWH khLdPG">
                <div className="sc-dOtRHS elRkec flex items-center gap-2 flex-shrink-0 mb-4">
                  <button type="button" aria-label="click here to move previous" className="sc-cfWevs hYvTxs flex items-center justify-center w-9 h-9 rounded-full border border-[#e9e9eb] bg-white opacity-50 cursor-not-allowed" disabled>
                    <div className="sc-khxaTn sc-iyZnGN gWLSRk bcSsTL flex items-center justify-center">
                      <svg aria-hidden height={16} width={16} className="sc-dcJsrY bExgxb" fill="currentColor" viewBox="0 0 16 16"><path d="M10 12L6 8l4-4" /></svg>
                    </div>
                  </button>
                  <button type="button" aria-label="click here to move next" className="sc-cfWevs loxocv flex items-center justify-center w-9 h-9 rounded-full border border-[#e9e9eb] bg-white hover:bg-gray-50" onClick={() => scrollTopPicks('right')}>
                    <div className="sc-khxaTn gWLSRk flex items-center justify-center">
                      <svg aria-hidden height={16} width={16} className="sc-dcJsrY bExgxb" fill="currentColor" viewBox="0 0 16 16"><path d="M6 4l4 4-4 4" /></svg>
                    </div>
                  </button>
                </div>
                <div data-theme="light">
                  <div className="sc-ktJbId iBRlyG">
                    <div className="sc-kMkxaj egzYab">
                      <div className="sc-fiCwlc eZFkXx">
                        <h2 color="text_Highest_Emphasis" className="sc-kbhJrz fKfLFK title text-lg font-bold text-[#02060c]">
                          <div>Top Picks</div>
                        </h2>
                        <div className="sc-aXZVg dcVxGb sc-ehixzo fINqWQ"> </div>
                      </div>
                    </div>
                    <div className="sc-gmgFlS jfsVZh">
                      <div ref={topPicksRef} className="row flex gap-4 overflow-x-auto no-scrollbar pb-2" style={{ scrollBehavior: 'smooth' }}>
                        {PIZZAHUT_TOP_PICKS.map((pick, i) => {
                          const topPickItemId = getCartItemId(slug, pick.name, pick.price);
                          const topPickQty = getQty(topPickItemId);
                          return (
                          <div key={i} className="sc-jIGnZt jQfTuj flex-shrink-0 w-[292px] min-w-[292px]">
                            <div className="_1U7PA min-h-[300px] rounded-xl bg-cover bg-center flex flex-col justify-end p-4" style={{ backgroundImage: `url(${pick.bgUrl})` }}>
                              <img src={PIZZAHUT_TOP_PICKS_IMG} alt={pick.name} aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none" />
                              <div className="_buSC relative z-10 mt-auto" style={{ color: 'rgb(255, 255, 255)' }}>
                                <p className="_1QbUq font-semibold text-sm text-white drop-shadow-md">{pick.name}</p>
                                <div className="ddDKp mt-2">
                                  <div className="_1gGaK flex items-center justify-between gap-2">
                                    <div data-theme="dark" className="flex items-center gap-2 text-white text-sm">
                                      {pick.offerPrice != null && <div className="sc-aXZVg gBtjIP sc-hSzcnm hRTjtN line-through">₹{pick.offerPrice}</div>}
                                      <div className="sc-aXZVg gBtjIP font-medium">₹{pick.price}</div>
                                    </div>
                                    <div className="_7QqbN">
                                      <div style={{ position: 'relative' }}>
                                        <div className="sc-iHmpnF oReI flex items-center gap-1">
                                          <div className="sc-kYxDKI cUYCxe flex items-center">
                                            <button type="button" onClick={() => decrementItem(topPickItemId)} className={`sc-bpUBKd sc-kbousE exyEfz gYnLCJ add-button-left-container border-0 bg-transparent cursor-pointer p-1 text-white text-lg font-medium ${topPickQty > 0 ? '' : 'hidden'}`}>−</button>
                                            <div className="sc-fifgRP jSvfPE flex items-center gap-0">
                                              <button type="button" onClick={() => handleAdd(slug, config.name, { name: pick.name, price: pick.price, isVeg: pick.veg })} className={`sc-bpUBKd sc-dBmzty exyEfz idWlOg px-3 py-1.5 rounded-lg bg-white text-[#02060c] text-sm font-semibold border-0 cursor-pointer ${topPickQty === 0 ? '' : 'hidden'}`}>Add</button>
                                              <button type="button" className="sc-bpUBKd sc-eyvILC exyEfz iRWuzT add-button-center-container hidden px-3 py-1.5 rounded-lg border border-white text-white text-sm font-semibold">Add</button>
                                              <button type="button" className={`sc-bpUBKd sc-dkmUuB exyEfz ecpYex px-3 py-1.5 rounded-lg border border-white text-white text-sm ${topPickQty > 0 ? '' : 'hidden'}`}>{topPickQty}</button>
                                            </div>
                                            <button type="button" onClick={() => incrementItem(topPickItemId)} className={`sc-bpUBKd sc-sLsrZ exyEfz llxHmw add-button-right-container border-0 bg-transparent cursor-pointer p-1 text-white text-lg font-medium ${topPickQty > 0 ? '' : 'hidden'}`}>+</button>
                                          </div>
                                          <div className="sc-ejfMa-d dJdxuH mt-1">
                                            <div className="sc-aXZVg btGlKk text-white/90 text-xs">Customisable</div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div />
                            </div>
                          </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="sc-iXviuJ fJzHfz" />
                <div className="sc-kYKKLo hGDlCH" />
              </div>
              <div />
            </div>
          </>
        ) : (
          <>
            <div className="sc-hdKjrx kwDdgu flex items-center justify-center gap-2 my-6">
              <svg aria-hidden className="w-6 h-6 text-[#e9e9eb]" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" /></svg>
              <span className="sc-aXZVg cDIVgt sc-LFcHM bTrItI text-sm font-bold text-[#02060c] uppercase tracking-wide">MENU</span>
              <svg aria-hidden className="w-6 h-6 text-[#e9e9eb]" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" /></svg>
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="sc-iKfoIU jVgjup flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#e9e9eb] text-sm w-full max-w-[320px]" role="search">
                <input type="text" placeholder="Search for dishes" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 bg-transparent outline-none placeholder-[#686b78] text-[#02060c] min-w-0" aria-label="Search for dishes" />
                <svg className="w-5 h-5 text-[#686b78] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setMenuFilter('veg')} className={`w-9 h-9 rounded-full border-2 flex items-center justify-center ${menuFilter === 'veg' ? 'border-[#0f8a0f] bg-[#0f8a0f]' : 'border-[#0f8a0f] bg-white'}`} aria-label="Veg">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: menuFilter === 'veg' ? '#fff' : '#0f8a0f' }} />
                </button>
                <button type="button" onClick={() => setMenuFilter('nonveg')} className={`w-9 h-9 rounded-full border-2 flex items-center justify-center ${menuFilter === 'nonveg' ? 'border-[#e43b4f] bg-[#e43b4f]' : 'border-[#e43b4f] bg-white'}`} aria-label="Non-veg">
                  <span className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent flex-shrink-0" style={{ borderBottomColor: menuFilter === 'nonveg' ? '#fff' : '#e43b4f' }} />
                </button>
                <button type="button" className="px-3 py-2 rounded-lg border border-[#e9e9eb] bg-[#e9e9eb] text-[#02060c] text-sm font-medium flex items-center gap-1 hover:bg-[#e0e0e0]">
                  Bestseller
                  <svg width={12} height={12} viewBox="0 0 12 12" fill="currentColor" className="text-[#686b78]" aria-hidden><path d="M2.5 4.5L6 8l3.5-3.5" /></svg>
                </button>
              </div>
            </div>
            <div className="mb-8">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="sc-kbhJrz fKfLFK title text-lg font-bold text-[#02060c]">Top Picks</h2>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button type="button" onClick={() => scrollTopPicks('left')} className="flex-shrink-0 w-9 h-9 rounded-full border border-[#e9e9eb] bg-white flex items-center justify-center text-[#686b78] hover:bg-gray-50" aria-label="Previous top picks">
                    <svg width={16} height={16} viewBox="0 0 16 16" fill="currentColor" aria-hidden><path d="M10 12L6 8l4-4" /></svg>
                  </button>
                  <button type="button" onClick={() => scrollTopPicks('right')} className="flex-shrink-0 w-9 h-9 rounded-full border border-[#e9e9eb] bg-white flex items-center justify-center text-[#686b78] hover:bg-gray-50" aria-label="Next top picks">
                    <svg width={16} height={16} viewBox="0 0 16 16" fill="currentColor" aria-hidden><path d="M6 4l4 4-4 4" /></svg>
                  </button>
                </div>
              </div>
              <div ref={topPicksRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-2" style={{ scrollBehavior: 'smooth' }}>
                {(config.topPicks ?? []).map((pick, i) => (
                  <div key={i} className="flex-shrink-0 w-[292px] rounded-xl overflow-hidden bg-[#1a1a1a] min-h-[300px] flex flex-col justify-end p-4 bg-cover bg-center" style={{ backgroundImage: `url(${TOPPICK_PLACEHOLDERS[i % TOPPICK_PLACEHOLDERS.length]})` }}>
                    <div className="relative z-10 mt-auto">
                      <span className="inline-flex items-center rounded-full bg-[#0f8a0f] text-white text-[10px] font-semibold uppercase px-2 py-0.5 w-fit mb-2">EXCLUSIVELY ON SWIGGY</span>
                      <p className="text-white font-semibold text-sm drop-shadow-md">{pick.name}</p>
                      <p className="text-white/90 text-xs mt-0.5 line-clamp-2 drop-shadow-md">{pick.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Dish list by category – Pizza Hut: inspected cid-Recommended, AWfRr, normal-dish-item */}
        {slug === 'pizza-hut' ? (
          <div id="cid-Recommended" style={{ position: 'relative' }}>
            <div />
            <div className="AWfRr">
              <button type="button" className="_1DNTu _3GTJN w-full flex items-center justify-between py-4 border-b border-[#e9e9eb] bg-transparent border-0 cursor-pointer text-left" data-cy="recommended-open" aria-label="Category: Recommended, 20 items available" aria-expanded data-role="category-heading">
                <h3 className="sc-aXZVg kSWsUU text-lg font-bold text-[#02060c]">Recommended (20)</h3>
                <div className="sc-YnwpJ bPiLGU flex items-center">
                  <svg aria-hidden height={16} width={16} className="sc-dcJsrY bExgxb text-[#686b78]" fill="currentColor" viewBox="0 0 16 16"><path d="M2.5 4.5L6 8l3.5-3.5" /></svg>
                </div>
              </button>
              <div className="">
                {PIZZAHUT_RECOMMENDED.map((item) => {
                  const recItemId = getCartItemId(slug, item.name, item.price);
                  const recQty = getQty(recItemId);
                  return (
                  <div key={item.name}>
                    <div data-testid="normal-dish-item" className="sc-dWTlHi chosDu flex gap-4 py-4 border-b border-[#e9e9eb]">
                      <div className="sc-gnjDPl izxBWH flex-1 min-w-0">
                        <p className="_1QbUq sr-only" tabIndex={0}>
                          {item.veg ? 'Veg' : 'Non-veg'} item. {item.name}.{item.bestseller ? ' This item is a Bestseller,' : ''} Costs: {item.price} rupees. Description: {item.description} This item is customizable. Swipe right to add item to cart.
                        </p>
                        <div>
                          <div aria-hidden className="sc-ipNeGl ibrxZQ flex items-center gap-2">
                            {item.veg ? (
                              <span className="w-4 h-4 rounded-full border-2 border-[#0f8a0f] flex items-center justify-center"><span className="w-2 h-2 rounded-full bg-[#0f8a0f]" /></span>
                            ) : (
                              <span className="w-4 h-4 rounded border-2 border-[#e43b4f] flex items-center justify-center"><span className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[6px] border-l-transparent border-r-transparent border-b-[#e43b4f]" /></span>
                            )}
                            {item.bestseller && <div className="sc-bPLjHf BTHTy text-[10px] font-semibold text-[#ee9c2d] uppercase">Bestseller</div>}
                          </div>
                          <div aria-hidden className="sc-aXZVg eqSzsP sc-kJbCpI dghYbs font-semibold text-[#02060c] text-base mt-1">{item.name}</div>
                          <div className="sc-gjYfiE hSmeYn mt-0.5">
                            <div aria-hidden className="sc-fqkvVR gxxfeE">
                              <span className="sc-eqUAAy hIDAJR">
                                <div className="sc-aXZVg chixpw font-medium text-[#02060c]">₹{item.price}</div>
                              </span>
                            </div>
                          </div>
                          <div className="sc-dQylYw idoeAw flex items-center gap-1 mt-0.5 flex-wrap">
                            <div className="sc-lzoWm cFegLW flex-shrink-0"><DishRatingLeaf fill={item.ratingFill} /></div>
                            <div className={`sc-aXZVg knBukL sc-hfcZUL ${item.ratingClass} text-sm text-[#02060c]`}>{item.rating}</div>
                            <div className="sc-aXZVg cDIVgt text-sm text-[#686b78]" style={{ marginLeft: 2 }}>({item.ratingsCount})</div>
                          </div>
                          <div className={`sc-dFSzXC ${item.descBlockClass} mt-1`}>
                            <div aria-hidden className={`sc-aXZVg gCijQr sc-kzwkWb ${item.descTextClass} text-[#686b78] text-sm line-clamp-2`}>{item.description}</div>
                            {item.descBlockClass === 'jkPAmQ' && <div className="sc-aXZVg gJIdXj text-[#ff5200] text-sm font-medium cursor-pointer mt-0.5">more</div>}
                          </div>
                        </div>
                      </div>
                      <div aria-hidden className={`sc-kZrTIu ${item.rightColClass} flex-shrink-0`}>
                        <button type="button" aria-label={`See more information about ${item.name}`} className="sc-bqORHP hZabmr rounded-lg overflow-hidden w-[156px] h-[144px] border-0 p-0 cursor-pointer block" style={{ background: item.imageBg }}>
                          <img alt={item.name} className="_3XS7H w-full h-full object-cover" loading="lazy" width={156} height={144} src={item.imageUrl} />
                        </button>
                        <div className="sc-gIUxhU bQGgeS mt-2">
                          <div style={{ position: 'relative' }}>
                            <div className="sc-iHmpnF oReI flex items-center gap-1 flex-wrap">
                              <div className="sc-kYxDKI cUYCxe flex items-center gap-0">
                                <button type="button" onClick={() => decrementItem(recItemId)} className={`sc-bpUBKd sc-kbousE exyEfz gYnLCJ add-button-left-container border-0 bg-transparent cursor-pointer p-1 text-[#02060c] text-lg ${recQty > 0 ? '' : 'hidden'}`}>−</button>
                                <div className="sc-fifgRP jSvfPE flex items-center gap-0">
                                  <button type="button" onClick={() => handleAdd(slug, config.name, { name: item.name, price: item.price, isVeg: item.veg })} className={`sc-bpUBKd sc-dBmzty exyEfz idWlOg px-3 py-1.5 rounded-lg border border-[#e9e9eb] bg-white text-[#02060c] text-sm font-semibold cursor-pointer hover:bg-gray-50 ${recQty === 0 ? '' : 'hidden'}`}>Add</button>
                                  <button type="button" className="sc-bpUBKd sc-eyvILC exyEfz iRWuzT add-button-center-container hidden px-3 py-1.5 rounded-lg border border-[#e9e9eb]">Add</button>
                                  <button type="button" className={`sc-bpUBKd sc-dkmUuB exyEfz ecpYex px-3 py-1.5 rounded-lg border border-[#e9e9eb] text-sm ${recQty > 0 ? '' : 'hidden'}`}>{recQty}</button>
                                </div>
                                <button type="button" onClick={() => incrementItem(recItemId)} className={`sc-bpUBKd sc-sLsrZ exyEfz llxHmw add-button-right-container border-0 bg-transparent cursor-pointer p-1 text-[#02060c] text-lg ${recQty > 0 ? '' : 'hidden'}`}>+</button>
                              </div>
                              {item.customisable && (
                                <div className="sc-ejfMa-d dJdxuH mt-1">
                                  <div className="sc-aXZVg btGlKk text-[#686b78] text-xs">Customisable</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="_207Gy" />
                    <div />
                  </div>
                  );
                })}
                <div className="_2kMID" />
                <div className="_6ha-2" data-scrollpoint="true" />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredCategories.map((category) => (
              <div key={category.title}>
                <h3 className="sc-aXZVg cDIVgt text-lg font-bold text-[#02060c] mb-4">{category.title}</h3>
                <div className="space-y-4">
                  {category.items.map((item) => {
                    const genItemId = getCartItemId(slug, item.name, item.price);
                    const genQty = getQty(genItemId);
                    return (
                    <div key={item.name} data-testid="normal-dish-item" className="sc-dWTlHi chosDu flex gap-4 py-4 border-b border-[#e9e9eb] last:border-0">
                      <div className="sc-gnjDPl izxBWH flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          {item.veg !== undefined && (
                            <span className="flex-shrink-0 w-4 h-4 rounded border-2 mt-0.5" style={{ borderColor: item.veg ? '#0f8a0f' : '#e43b4f' }} aria-hidden />
                          )}
                          <div className="min-w-0">
                            {item.bestseller && <span className="inline-block text-[10px] font-semibold text-[#ee9c2d] uppercase mb-0.5">Bestseller</span>}
                            <p className="_1QbUq font-semibold text-[#02060c]">{item.name}</p>
                            <p className="text-[#686b78] text-sm mt-0.5">{item.description}</p>
                            <p className="text-[#02060c] font-medium mt-1">₹{item.price}</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-1">
                          {genQty === 0 ? (
                            <button type="button" onClick={() => handleAdd(slug, config.name, { name: item.name, price: item.price, isVeg: item.veg })} className="px-4 py-2 border border-[#e9e9eb] rounded-lg text-sm font-semibold text-[#ff5200] hover:bg-orange-50 transition-colors">ADD</button>
                          ) : (
                            <>
                              <button type="button" onClick={() => decrementItem(genItemId)} className="px-2 py-1.5 border border-[#e9e9eb] rounded-lg text-sm font-semibold text-[#02060c] hover:bg-gray-50">−</button>
                              <span className="px-3 py-1.5 text-sm font-semibold text-[#02060c] min-w-[1.5rem] text-center">{genQty}</span>
                              <button type="button" onClick={() => incrementItem(genItemId)} className="px-2 py-1.5 border border-[#e9e9eb] rounded-lg text-sm font-semibold text-[#02060c] hover:bg-gray-50">+</button>
                            </>
                          )}
                        </div>
                      </div>
                      {item.image ? (
                        <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
                          <img src={item.image} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 w-24 h-24 rounded-lg bg-[#e9e9eb]" aria-hidden />
                      )}
                    </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating MENU button – identical for all restaurants */}
      <div className="fixed bottom-6 right-6 z-[900]" aria-hidden>
          <button
            type="button"
            className="w-14 h-14 rounded-full bg-[#02060c] text-white flex items-center justify-center gap-1 font-semibold text-xs uppercase shadow-[0_2px_8px_rgba(40,44,63,.15)] hover:opacity-90 transition-opacity"
            aria-label="Browse menu"
          >
            <span>MENU</span>
          </button>
        </div>

      {/* Replace cart confirmation modal */}
      {showReplaceConfirm && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/50" role="dialog" aria-modal="true" aria-labelledby="replace-cart-title">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h2 id="replace-cart-title" className="text-lg font-semibold text-[#02060c] mb-2">Replace cart?</h2>
            <p className="text-[#686b78] text-sm mb-6">Items from another restaurant will be removed. Continue?</p>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={cancelReplace} className="px-4 py-2 rounded-lg border border-[#e9e9eb] text-[#02060c] font-semibold text-sm hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={confirmReplace} className="px-4 py-2 rounded-lg bg-[#ff5200] text-white font-semibold text-sm hover:opacity-90">Continue</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const REST_ID_REGEX = /^rest-\d+$/;

export default function RestaurantPage(props: RestaurantPageProps) {
  const params = props.params instanceof Promise ? React.use(props.params) : props.params;
  const slug = typeof params?.slug === 'string' ? params.slug.toLowerCase().trim() : '';

  if (REST_ID_REGEX.test(slug)) {
    return <RestaurantFromApi restaurantId={slug} />;
  }

  const config = slug ? RESTAURANT_CONFIG[slug] : null;

  useEffect(() => {
    if (config?.name) {
      document.title = `${config.name} | Order Food Online | Swiggy`;
    }
    return () => {
      document.title = "Order Food Online from India's Best Food Delivery Service | Swiggy";
    };
  }, [config?.name]);

  return (
    <main className="min-h-screen bg-[#f5f6f8]">
      <header
        className="sticky top-0 left-0 right-0 z-[1000] h-20 bg-white px-4"
        style={{ boxShadow: '0 15px 40px -20px rgba(40,44,63,.15)' }}
      >
        <div className="max-w-[1200px] min-w-0 mx-auto h-20 flex items-center w-full">
          <Link href="/" className="flex-shrink-0 mr-4 block">
            <svg className="h-[49px] w-auto block" viewBox="0 0 61 61" fill="none" stroke="currentColor" strokeWidth="0" aria-hidden>
              <path fill="#ff5200" d="M.32 30.5c0-12.966 0-19.446 3.498-23.868a16.086 16.086 0 0 1 2.634-2.634C10.868.5 17.354.5 30.32.5s19.446 0 23.868 3.498c.978.774 1.86 1.656 2.634 2.634C60.32 11.048 60.32 17.534 60.32 30.5s0 19.446-3.498 23.868a16.086 16.086 0 0 1-2.634 2.634C49.772 60.5 43.286 60.5 30.32 60.5s-19.446 0-23.868-3.498a16.086 16.086 0 0 1-2.634-2.634C.32 49.952.32 43.466.32 30.5Z" />
              <path fill="#FFF" fillRule="evenodd" d="M32.317 24.065v-6.216a.735.735 0 0 0-.732-.732.735.735 0 0 0-.732.732v7.302c0 .414.336.744.744.744h.714c10.374 0 11.454.54 10.806 2.73-.03.108-.066.21-.102.324-.006.024-.012.048-.018.066-2.724 8.214-10.092 18.492-12.27 21.432a.764.764 0 0 1-1.23 0c-1.314-1.776-4.53-6.24-7.464-11.304-.198-.462-.294-1.542 2.964-1.542h3.984c.222 0 .402.18.402.402v3.216c0 .384.282.738.666.768a.73.73 0 0 0 .582-.216.701.701 0 0 0 .216-.516v-4.362a.76.76 0 0 0-.756-.756h-8.052c-1.404 0-2.256-1.2-2.814-2.292-1.752-3.672-3.006-7.296-3.006-10.152 0-7.314 5.832-13.896 13.884-13.896 7.17 0 12.6 5.214 13.704 11.52.006.054.048.294.054.342.288 3.096-7.788 2.742-11.184 2.76a.357.357 0 0 1-.36-.36v.006Z" clipRule="evenodd" />
            </svg>
          </Link>
          {config && (
            <div className="flex-1 min-w-0 truncate">
              <div className="font-semibold text-[#02060c] truncate">{config.name}</div>
              <div className="text-xs text-[#686b78]">{config.deliveryTime}</div>
            </div>
          )}
          <div className="flex items-center ml-auto">
            <CartCountBadge />
          </div>
        </div>
      </header>

      {config ? <RestaurantPageContent config={config} slug={slug} /> : <RestaurantNotFoundUI />}
    </main>
  );
}
