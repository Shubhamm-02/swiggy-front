'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import AppBanner from '../../../components/AppBanner';
import Footer from '../../../components/Footer';
import { CartCountBadge } from '../../../components/CartCountBadge';
import { SignInNavLink } from '../../../components/SignInNavLink';
import { useRestaurantsFromApi, type RestaurantCard } from '../../../lib/useRestaurants';

const RX = 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660';

// Fallback restaurants when API returns none (e.g. backend down or cuisine mismatch). One list, reused across categories.
const FALLBACK_RESTAURANTS: RestaurantCard[] = [
  { id: 'rest-1', name: 'Meghana Foods', rating: '4.7', time: '40-45 mins', cuisines: 'Andhra, Biryani, South Indian', location: 'Residency Road, Bengaluru', offer: '20% OFF UPTO ₹75', img: `${RX}/FOOD_CATALOG/IMAGES/CMS/2025/12/29/57bebf52-5a58-42e0-af9d-3d872d52de83_2d89d14b-3568-4be1-946d-1d7b0539edae.jpg`, slug: 'rest-1' },
  { id: 'rest-2', name: 'Pizza Hut', rating: '4.3', time: '35-40 mins', cuisines: 'Pizzas, Italian', location: 'Central Bangalore', offer: 'ITEMS AT ₹49', img: `${RX}/RX_THUMBNAIL/IMAGES/VENDOR/2025/9/1/5d703bb8-2414-4ab1-bcae-59bba6a52598_10575.JPG`, slug: 'rest-2' },
  { id: 'rest-3', name: 'Truffles', rating: '4.6', time: '25-30 mins', cuisines: 'American, Continental, Desserts', location: 'St. Marks Road, Bengaluru', offer: '15% OFF UPTO ₹75', img: `${RX}/cd832b6167eb9f88aeb1ccdebf38d942`, slug: 'rest-3' },
  { id: 'rest-4', name: 'Vidyarthi Bhavan', rating: '4.6', time: '30-35 mins', cuisines: 'South Indian, Breakfast', location: 'Gandhi Bazaar, Bengaluru', offer: '', img: `${RX}/tladdzgke7gic8xjng4z`, slug: 'rest-4' },
  { id: 'rest-5', name: 'Empire Restaurant', rating: '4.1', time: '35-40 mins', cuisines: 'North Indian, Biryani, Mughlai', location: 'Koramangala, Bengaluru', offer: '20% OFF UPTO ₹50', img: `${RX}/titgwthozpmhyzjgdh5u`, slug: 'rest-5' },
  { id: 'rest-6', name: 'KFC', rating: '4.2', time: '30-35 mins', cuisines: 'Burgers, Fast Food', location: 'Ashok Nagar, Bengaluru', offer: '₹100 OFF', img: `${RX}/RX_THUMBNAIL/IMAGES/VENDOR/2025/10/3/136c9e23-b373-45d5-9fad-7e4763ebd36b_43836.JPG`, slug: 'rest-6' },
  { id: 'rest-7', name: 'Saravana Bhavan', rating: '4.5', time: '35-40 mins', cuisines: 'South Indian, North Indian', location: 'Shanti Nagar, Bengaluru', offer: 'ITEMS AT ₹33', img: `${RX}/RX_THUMBNAIL/IMAGES/VENDOR/2026/1/7/394d4bca-db65-43a2-9372-12543611d33a_12808.JPG`, slug: 'rest-7' },
  { id: 'rest-8', name: "McDonald's", rating: '4.3', time: '35-40 mins', cuisines: 'Burgers, Beverages, Desserts', location: 'Ashok Nagar, Bengaluru', offer: '₹100 OFF ABOVE ₹349', img: `${RX}/RX_THUMBNAIL/IMAGES/VENDOR/2025/10/3/136c9e23-b373-45d5-9fad-7e4763ebd36b_43836.JPG`, slug: 'rest-8' },
  { id: 'rest-9', name: 'Airlines Hotel', rating: '4.5', time: '30-35 mins', cuisines: 'South Indian, North Indian', location: 'Central Bangalore', offer: 'ITEMS AT ₹49', img: `${RX}/b1iffaxblxghqqyrmbkp`, slug: 'rest-9' },
  { id: 'rest-10', name: 'Theobroma', rating: '4.7', time: '20-25 mins', cuisines: 'Desserts, Bakery, Beverages', location: 'Vittal Mallya Road', offer: '50% OFF', img: `${RX}/RX_THUMBNAIL/IMAGES/VENDOR/2026/1/6/bf430b2f-9106-4a52-8fe9-3a0032e667c2_426730.JPG`, slug: 'rest-10' },
  { id: 'rest-11', name: 'Chaayos', rating: '4.6', time: '35-40 mins', cuisines: 'Beverages, Chaat, Snacks', location: 'Central Bangalore', offer: 'ITEMS AT ₹199', img: `${RX}/RX_THUMBNAIL/IMAGES/VENDOR/2024/4/17/dfbcecfc-b380-4648-930a-b9b56b21e781_435405.JPG`, slug: 'rest-11' },
  { id: 'rest-12', name: 'Wow! China', rating: '3.9', time: '30-35 mins', cuisines: 'Chinese, Asian, Noodles', location: 'Church Street', offer: 'ITEMS AT ₹99', img: `${RX}/RX_THUMBNAIL/IMAGES/VENDOR/2025/10/22/0a619a1f-e105-416b-9cbb-723af5fdeda6_264240.JPG`, slug: 'rest-12' },
];

// Map category slug (from URL) to indices in FALLBACK_RESTAURANTS so each category shows relevant places.
const FALLBACK_INDICES_BY_CATEGORY: Record<string, number[]> = {
  cake: [2, 3, 9, 10],           // Truffles, Vidyarthi, Theobroma, Chaayos
  pizza: [1, 2],                 // Pizza Hut, Truffles
  burger: [5, 7],                // KFC, McDonald's
  biryani: [0, 4, 5],           // Meghana, Empire, KFC (Biryani / North Indian)
  rolls: [4, 5, 7],             // Empire, KFC, McDonald's
  samosa: [6, 8, 10],            // Saravana, Airlines, Chaayos
  salad: [2, 3],                // Truffles, Vidyarthi
  dosa: [3, 6, 8],              // Vidyarthi, Saravana, Airlines
  idli: [3, 6, 8],              // Vidyarthi, Saravana, Airlines
  tea: [10, 11, 8],             // Chaayos, Wow China, Airlines
  noodles: [11, 5, 7],          // Wow China, KFC, McDonald's
  pasta: [1, 2],                // Pizza Hut, Truffles
  shawarma: [5, 7],             // KFC, McDonald's
  momo: [11, 5],                // Wow China, KFC
  pastry: [2, 8, 10],           // Truffles, Theobroma, Chaayos
  shake: [7, 10, 2],            // McDonald's, Chaayos, Truffles
  juice: [10, 11, 2],           // Chaayos, Wow China, Truffles
  vada: [3, 6, 8],              // Vidyarthi, Saravana, Airlines
  parotta: [4, 6, 8],           // Empire, Saravana, Airlines
  khichdi: [6, 4, 8],           // Saravana, Empire, Airlines
};

function getRestaurantSlug(r: { name: string; slug?: string; id?: string }): string {
  if (r.slug) return r.slug;
  if (r.id) return r.id;
  return r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'restaurant';
}

function sortToApi(appliedSort: string): string | undefined {
  switch (appliedSort) {
    case 'deliveryTimeAsc': return 'delivery_time';
    case 'modelBasedRatingDesc': return 'rating';
    case 'costForTwoAsc': return 'price_low';
    case 'costForTwoDesc': return 'price_high';
    default: return undefined;
  }
}

function categoryTitleFromSlug(slug: string): string {
  return slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();
}

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

type Props = { category: string };

export default function CategoryContent({ category }: Props) {
  const [sortOpen, setSortOpen] = useState(false);
  const [sortValue, setSortValue] = useState('relevance');
  const [appliedSort, setAppliedSort] = useState('relevance');

  const cuisineParam = useMemo(() => categoryTitleFromSlug(category), [category]);
  const { data: apiRestaurants, loading: apiLoading, error: apiError } = useRestaurantsFromApi({
    cuisine: cuisineParam,
    sort_by: sortToApi(appliedSort),
  });
  const sortedRestaurants: RestaurantCard[] = useMemo(() => apiRestaurants ?? [], [apiRestaurants]);
  const fallbackForCategory = useMemo(() => {
    const slug = category.toLowerCase().trim();
    const indices = FALLBACK_INDICES_BY_CATEGORY[slug];
    if (indices && indices.length > 0) {
      return indices.map((i) => FALLBACK_RESTAURANTS[i]).filter(Boolean);
    }
    return FALLBACK_RESTAURANTS.slice(0, 8);
  }, [category]);
  const displayRestaurants = sortedRestaurants.length > 0 ? sortedRestaurants : fallbackForCategory;
  const title = categoryTitleFromSlug(category);

  return (
    <main className="min-h-screen bg-white">
      <header
        className="sticky top-0 left-0 right-0 z-[1000] h-20 bg-white px-5 will-change-transform contain-[size_layout_style] transition-transform duration-300 ease-[ease]"
        style={{ boxShadow: '0 15px 40px -20px rgba(40,44,63,.15)' }}
      >
        <div className="max-w-[1200px] min-w-0 mx-auto h-20 flex items-center">
          <Link href="/" className="flex-shrink-0 mr-4 block transition-transform duration-300 ease-[cubic-bezier(.215,.61,.355,1)] hover:scale-110">
            <svg className="h-[49px] w-auto block" viewBox="0 0 61 61" fill="none" stroke="currentColor" strokeWidth="0" aria-hidden>
              <path fill="#ff5200" d="M.32 30.5c0-12.966 0-19.446 3.498-23.868a16.086 16.086 0 0 1 2.634-2.634C10.868.5 17.354.5 30.32.5s19.446 0 23.868 3.498c.978.774 1.86 1.656 2.634 2.634C60.32 11.048 60.32 17.534 60.32 30.5s0 19.446-3.498 23.868a16.086 16.086 0 0 1-2.634 2.634C49.772 60.5 43.286 60.5 30.32 60.5s-19.446 0-23.868-3.498a16.086 16.086 0 0 1-2.634-2.634C.32 49.952.32 43.466.32 30.5Z" />
              <path fill="#FFF" fillRule="evenodd" d="M32.317 24.065v-6.216a.735.735 0 0 0-.732-.732.735.735 0 0 0-.732.732v7.302c0 .414.336.744.744.744h.714c10.374 0 11.454.54 10.806 2.73-.03.108-.066.21-.102.324-.006.024-.012.048-.018.066-2.724 8.214-10.092 18.492-12.27 21.432a.764.764 0 0 1-1.23 0c-1.314-1.776-4.53-6.24-7.464-11.304-.198-.462-.294-1.542 2.964-1.542h3.984c.222 0 .402.18.402.402v3.216c0 .384.282.738.666.768a.73.73 0 0 0 .582-.216.701.701 0 0 0 .216-.516v-4.362a.76.76 0 0 0-.756-.756h-8.052c-1.404 0-2.256-1.2-2.814-2.292-1.752-3.672-3.006-7.296-3.006-10.152 0-7.314 5.832-13.896 13.884-13.896 7.17 0 12.6 5.214 13.704 11.52.006.054.048.294.054.342.288 3.096-7.788 2.742-11.184 2.76a.357.357 0 0 1-.36-.36v.006Z" clipRule="evenodd" />
            </svg>
          </Link>
          <Link href="/food-delivery" className="ml-6 font-semibold text-[rgba(2,6,12,.9)] hover:text-[#ff5200] transition-colors">
            ← Food Delivery
          </Link>
          <div className="flex-1 min-w-0 flex flex-row-reverse items-center h-full mr-[-16px]">
            <CartCountBadge />
            <Link href="/orders" className="flex items-center h-full pl-7 text-base font-normal text-[rgba(2,6,12,.9)] hover:text-[#ff5200] transition-colors">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              Recent Orders
            </Link>
            <SignInNavLink />
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-4 md:px-5 py-6">
        <h1 className="sc-aXZVg cBrbwn text-xl md:text-2xl font-extrabold text-[#02060c] tracking-tight mb-4">
          Restaurants for {title}
        </h1>

        <div id="container-grid-filter-sort" className="sc-kNlxZa gVUnbB">
          <div>
            <div className="sc-jNUliw keEiJS">
              <div data-testid="filter_widget" className="sc-doOioq dyWdxa">
                <div className="sc-cAkrUM hbXQNP relative">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#e9e9eb] rounded-lg bg-white text-[#02060c] font-medium text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => { setSortOpen((o) => { if (!o) setSortValue(appliedSort); return !o; }); }}
                    aria-expanded={sortOpen}
                  >
                    <span className="sc-aXZVg hwUmr">Sort By</span>
                    <span className="sc-iMTnTL hpuwEP flex items-center" style={{ fillOpacity: 1 }}>
                      <svg aria-hidden height={12} width={12} className={`sc-dcJsrY dnGnZy flex-shrink-0 transition-transform ${sortOpen ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="currentColor">
                        <path d="M2.5 4.5L6 8l3.5-3.5" />
                      </svg>
                    </span>
                  </button>
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
          </div>
        </div>

        <div className="sc-iBTApF sc-fXRJzk dIHtgG jnFtOt mt-6">
          <div>
            {apiLoading && (
              <p className="text-[#686b78] text-sm py-6">Loading restaurants…</p>
            )}
            {apiError && displayRestaurants.length === 0 && (
              <p className="text-red-600 text-sm py-6" role="alert">{apiError}</p>
            )}
            {!apiLoading && displayRestaurants.length === 0 && (
              <p className="text-[#686b78] text-sm py-6">No restaurants found for {title}. Try another category.</p>
            )}
            <div data-testid="restaurant_list" className="sc-kOHTFB iynxeh grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {!apiLoading && displayRestaurants.map((r, idx) => (
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12" />
      <AppBanner />
      <Footer />
    </main>
  );
}
