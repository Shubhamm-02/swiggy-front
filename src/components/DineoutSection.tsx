'use client';
import React from 'react';

const DineoutSection = () => {
    const scrollContainer = React.useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainer.current) {
            const scrollAmount = 600;
            scrollContainer.current.scrollBy({
                left: direction === 'right' ? scrollAmount : -scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const restaurants = [
        {
            name: "Blue Shadow",
            rating: "4.2",
            cuisine: "Fast Food",
            price: "₹800 for two",
            location: "Davanam Sarovar Portico Suites, Koramangala",
            distance: "7.7 km",
            offer: "Flat 30% off on pre-booking",
            offerCount: "+ 2 more",
            img: "https://dineout-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/v1695813259/5334dbb843e78dc2e482bbfe08652a78.webp"
        },
        {
            name: "House Of Candy",
            rating: "4.2",
            cuisine: "Desserts",
            price: "₹500 for two",
            location: "UB City, Vittal Mallya Road, Bangalore",
            distance: "2 km",
            offer: "Flat 25% off on pre-booking",
            offerCount: "+ 4 more",
            img: "https://dineout-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/DINEOUT_ALL_RESTAURANTS/IMAGES/RESTAURANT_IMAGE_SERVICE/2024/8/18/85ab746e-dc5a-4bb2-ab0c-961e3b2ebfcc_20240818T093102948.jpg"
        },
        {
            name: "Tushita",
            rating: "3.7",
            cuisine: "Continental • Asian",
            price: "₹2000 for two",
            location: "Ashok Nagar, Bangalore",
            distance: "1.8 km",
            offer: "Flat 15% off on walk-in",
            offerCount: "+ 1 more",
            img: "https://dineout-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/v1668146567/l6gwhgjwfwd6n95cnlei.webp"
        },
        {
            name: "Thanco's Natural Ice Cream",
            rating: "4.3",
            cuisine: "Desserts • Beverages",
            price: "₹400 for two",
            location: "Sayari Complex, Nagarabhavi, Bangalore",
            distance: "10.8 km",
            offer: "Flat 20% off on walk-in",
            offerCount: "+ 2 more",
            img: "https://dineout-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/v1675051244/76ec7909a90010907c0ce1cff4861c1b.jpg"
        },
        {
            name: "The Bar - Marriott Executive",
            rating: "--",
            cuisine: "Bar Food",
            price: "₹1500 for two",
            location: "Ashok Nagar, Bangalore",
            distance: "1.1 km",
            offer: "Flat 20% off on pre-booking",
            offerCount: "",
            img: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/RX_THUMBNAIL/IMAGES/VENDOR/2024/4/17/5d3c8c73-453d-42bc-9d0b-689360df2272_68884.JPG"
        },
        {
            name: "The Roof Asian Grill & Bar",
            rating: "2.0",
            cuisine: "Asian • Grill",
            price: "₹1600 for two",
            location: "Ashok Nagar, Bangalore",
            distance: "1.1 km",
            offer: "Flat 10% off on walk-in",
            offerCount: "",
            img: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/RX_THUMBNAIL/IMAGES/VENDOR/2024/4/17/e2270129-d210-4a35-b044-73ae307c5280_29699.JPG"
        },
        {
            name: "H3Y Salad Cafe",
            rating: "4.6",
            cuisine: "Healthy Food • Beverages",
            price: "₹350 for two",
            location: "Sahakar Nagar, Bangalore",
            distance: "10.7 km",
            offer: "Flat 15% off on pre-booking",
            offerCount: "",
            img: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/RX_THUMBNAIL/IMAGES/VENDOR/2024/6/11/7f76a072-c1bc-4d74-ac56-33e0eea20c1e_5938.JPG"
        },
        {
            name: "Royce Chocolate",
            rating: "4.5",
            cuisine: "Desserts",
            price: "₹800 for two",
            location: "UB City, Vittal Mallya Road, Bangalore",
            distance: "1.1 km",
            offer: "Flat 25% off on pre-booking",
            offerCount: "",
            img: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/RX_THUMBNAIL/IMAGES/VENDOR/2024/4/17/2ce18342-6c04-4ad5-9763-498abd6d7c5a_33502.JPG"
        },
        {
            name: "Tijouri",
            rating: "4.4",
            cuisine: "North Indian • Beverages",
            price: "₹1200 for two",
            location: "Radisson Blu Atria Hotel, Vasanth Nagar, Bangalore",
            distance: "1.5 km",
            offer: "Flat 20% off on pre-booking",
            offerCount: "",
            img: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/e0vvulfbadld1h5a6s8o"
        }
    ];

    return (
        <section className="mt-10 md:mt-12 mb-20">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-extrabold text-[#02060c] tracking-tight cursor-not-allowed">Discover best restaurants on Dineout</h2>
                <div className="flex gap-3">
                    <button onClick={() => scroll('left')} className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-800 disabled:opacity-50 hover:bg-gray-300 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button onClick={() => scroll('right')} className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-800 disabled:opacity-50 hover:bg-gray-300 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>

            <div
                ref={scrollContainer}
                className="flex gap-6 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 scroll-smooth"
            >
                {restaurants.map((item, index) => (
                      <div key={index} className="min-w-[330px] max-w-[330px] group cursor-not-allowed">
                        <div className="block cursor-not-allowed" aria-label={item.name} aria-disabled>
                          {/* Image Section */}
                          <div className="w-full h-[220px] relative rounded-2xl overflow-hidden mb-3">
                              <img
                                  src={item.img}
                                  alt={item.name}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              {/* Gradient Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                              {/* Content Overlay */}
                              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                  <h3 className="text-white font-extrabold text-xl leading-tight truncate pr-2 z-10">{item.name}</h3>
                                  <div className="flex-shrink-0 bg-[#25a541] text-white text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm z-10">
                                      <span>{item.rating}</span>
                                      <span className="text-[10px]">★</span>
                                  </div>
                              </div>
                          </div>

                          {/* Details Section */}
                          <div className="px-1">
                              <div className="flex justify-between items-start mb-3">
                                  <div className="max-w-[70%]">
                                      <div className="text-[#02060c] font-medium text-base truncate">{item.cuisine}</div>
                                      <div className="text-[#02060c99] text-sm truncate">{item.location}</div>
                                  </div>
                                  <div className="text-right">
                                      <div className="text-[#02060c] font-medium text-base">{item.price}</div>
                                      <div className="text-[#02060c99] text-sm">{item.distance}</div>
                                  </div>
                              </div>

                              {/* Offers */}
                              <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                      <div className="flex-1 bg-[#1ba672] text-white px-2 py-1.5 rounded-lg flex items-center gap-2">
                                          <img src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/dineout/rx-card/OFFER.png" alt="%" className="w-5 h-5 brightness-0 invert" />
                                          <span className="text-sm font-bold truncate line-clamp-1">{item.offer}</span>
                                      </div>
                                      {item.offerCount && (
                                          <span className="text-[#02060c99] text-xs font-bold whitespace-nowrap">{item.offerCount}</span>
                                      )}
                                  </div>
                                  <div className="bg-[#eefcf4] text-[#1ba672] px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 inline-block">
                                      <img src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/dineout/rx-card/OFFER.png" alt="%" className="w-4 h-4" />
                                      Up to 10% off with bank offers
                                  </div>
                              </div>
                          </div>
                        </div>
                      </div>
                ))}
            </div>
        </section>
    );
};

export default DineoutSection;
