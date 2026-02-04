'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const noop = (e: React.MouseEvent) => e.preventDefault();

const SOCIAL_ICONS = [
  { name: 'LinkedIn', src: 'https://media-assets.swiggy.com/h_32/portal/m/seo/icon-linkedin.png' },
  { name: 'Instagram', src: 'https://media-assets.swiggy.com/h_32/portal/m/seo/icon-instagram.png' },
  { name: 'Facebook', src: 'https://media-assets.swiggy.com/h_32/portal/m/seo/icon-facebook.png' },
  { name: 'Pinterest', src: 'https://media-assets.swiggy.com/h_32/portal/m/seo/icon-pinterest.png' },
  { name: 'Twitter', src: 'https://media-assets.swiggy.com/h_32/portal/m/seo/icon-twitter.png' },
];

// Representative subset of "Other cities that we deliver" (4 columns)
const OTHER_CITIES_COL1 = ['Kolkata', 'Chennai', 'Ahmedabad', 'Chandigarh', 'Jaipur', 'Kochi', 'Coimbatore', 'Lucknow', 'Nagpur', 'Vadodara', 'Indore', 'Guwahati', 'Vizag', 'Surat', 'Dehradun', 'Noida', 'Ludhiana', 'Trichy', 'Vijayawada', 'Kanpur'];
const OTHER_CITIES_COL2 = ['Mysore', 'Nashik', 'Udaipur', 'Pondicherry', 'Agra', 'Aurangabad', 'Jalandhar', 'Kota', 'Madurai', 'Allahabad', 'Manipal', 'Amritsar', 'Bareilly', 'Meerut', 'Bhopal', 'Ooty', 'Bhubaneswar', 'Raipur', 'Bikaner', 'Rajkot'];
const OTHER_CITIES_COL3 = ['Kozhikode', 'Central Goa', 'Sirsa', 'Gwalior', 'Thrissur', 'Kharagpur', 'Tirupati', 'Tirupur', 'Vellore', 'Thiruvananthapuram', 'Warangal', 'Varanasi', 'Mangaluru', 'Patna', 'Ranchi', 'Faridabad', 'Guntur', 'Ujjain', 'Patiala', 'Karnal'];
const OTHER_CITIES_COL4 = ['Kakinada', 'Rajahmundry', 'Bilaspur', 'Bhilai', 'Anand', 'Bhavnagar', 'Jammu', 'Muktsar', 'Panipat', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hubli', 'Belgaum', 'Jabalpur', 'Kolhapur', 'Solapur', 'Shillong', 'Cuttack', 'Aligarh'];

const LinkItem = ({ children }: { children: React.ReactNode }) => (
  <li className="mb-3">
    <a href="#" onClick={noop} className="text-[#02060c99] text-sm font-medium hover:text-[#02060c] cursor-default">
      {children}
    </a>
  </li>
);

const Footer = () => {
  const [showOtherCities, setShowOtherCities] = useState(false);

  return (
    <footer data-theme="light" data-testid="footer_widget" className="bg-[#f8f8f8] text-[#02060c] pt-12 pb-10 w-full mt-10 md:mt-12">
      <div className="max-w-[1200px] mx-auto px-4 md:px-5">
        {/* Top row: Logo + 6 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-8 lg:gap-6 pb-10">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <svg className="h-10 w-10 flex-shrink-0" viewBox="0 0 61 61" fill="none">
                <path fill="#FE5005" d="M.32 30.5c0-12.966 0-19.446 3.498-23.868a16.086 16.086 0 0 1 2.634-2.634C10.868.5 17.354.5 30.32.5s19.446 0 23.868 3.498c.978.774 1.86 1.656 2.634 2.634C60.32 11.048 60.32 17.534 60.32 30.5s0 19.446-3.498 23.868a16.086 16.086 0 0 1-2.634 2.634C49.772 60.5 43.286 60.5 30.32 60.5s-19.446 0-23.868-3.498a16.086 16.086 0 0 1-2.634-2.634C.32 49.952.32 43.466.32 30.5Z" />
                <path fill="#fff" fillRule="evenodd" d="M32.317 24.065v-6.216a.735.735 0 0 0-.732-.732.735.735 0 0 0-.732.732v7.302c0 .414.336.744.744.744h.714c10.374 0 11.454.54 10.806 2.73-.03.108-.066.21-.102.324-.006.024-.012.048-.018.066-2.724 8.214-10.092 18.492-12.27 21.432a.764.764 0 0 1-1.23 0c-1.314-1.776-4.53-6.24-7.464-11.304-.198-.462-.294-1.542 2.964-1.542h3.984c.222 0 .402.18.402.402v3.216c0 .384.282.738.666.768a.73.73 0 0 0 .582-.216.701.701 0 0 0 .216-.516v-4.362a.76.76 0 0 0-.756-.756h-8.052c-1.404 0-2.256-1.2-2.814-2.292-1.752-3.672-3.006-7.296-3.006-10.152 0-7.314 5.832-13.896 13.884-13.896 7.17 0 12.6 5.214 13.704 11.52.006.054.048.294.054.342.288 3.096-7.788 2.742-11.184 2.76a.357.357 0 0 1-.36-.36v.006Z" clipRule="evenodd" />
              </svg>
              <span className="text-[#FE5005] font-bold text-xl tracking-tight">Swiggy</span>
            </div>
            <p className="text-[#02060c99] text-sm">© 2026 Swiggy Limited</p>
          </div>

          <div>
            <h4 className="font-bold text-[#02060c] text-sm mb-3">Company</h4>
            <ul className="list-none p-0 m-0">
              <LinkItem>About Us</LinkItem>
              <LinkItem>Swiggy Corporate</LinkItem>
              <LinkItem>Careers</LinkItem>
              <LinkItem>Team</LinkItem>
              <LinkItem>Swiggy One</LinkItem>
              <li className="mb-3">
                <Link href="/instamart" className="text-[#02060c99] text-sm font-medium hover:text-[#02060c]">
                  Swiggy Instamart
                </Link>
              </li>
              <LinkItem>Swiggy Dineout</LinkItem>
              <LinkItem>Swiggy Genie</LinkItem>
              <LinkItem>Minis</LinkItem>
              <LinkItem>Pyng</LinkItem>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#02060c] text-sm mb-3">Contact us</h4>
            <ul className="list-none p-0 m-0">
              <LinkItem>Help & Support</LinkItem>
              <LinkItem>Partner with us</LinkItem>
              <LinkItem>Ride with us</LinkItem>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#02060c] text-sm mb-3">Legal</h4>
            <ul className="list-none p-0 m-0">
              <LinkItem>Terms & Conditions</LinkItem>
              <LinkItem>Cookie Policy</LinkItem>
              <LinkItem>Privacy Policy</LinkItem>
              <LinkItem>Investor Relations</LinkItem>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#02060c] text-sm mb-3">Life at Swiggy</h4>
            <ul className="list-none p-0 m-0">
              <LinkItem>Explore with Swiggy</LinkItem>
              <LinkItem>Swiggy News</LinkItem>
              <LinkItem>Snackables</LinkItem>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#02060c] text-sm mb-3">Available in:</h4>
            <ul className="list-none p-0 m-0 mb-3">
              <LinkItem>Bangalore</LinkItem>
              <LinkItem>Gurgaon</LinkItem>
              <LinkItem>Hyderabad</LinkItem>
              <LinkItem>Delhi</LinkItem>
              <LinkItem>Mumbai</LinkItem>
              <LinkItem>Pune</LinkItem>
            </ul>
            <button
              type="button"
              data-testid="footer_more_cities"
              onClick={(e) => { e.preventDefault(); setShowOtherCities((v) => !v); }}
              className="inline-flex items-center gap-1 border border-[#02060c4d] rounded-md px-3 py-2 text-[#02060c99] text-sm font-semibold hover:bg-white cursor-pointer"
              aria-expanded={showOtherCities}
            >
              679 cities
              <svg aria-hidden height="12" width="12" viewBox="0 0 12 12" fill="currentColor" className={`transition-transform ${showOtherCities ? 'rotate-180' : ''}`}><path d="M2.5 4.5L6 8l3.5-3.5" /></svg>
            </button>
          </div>

          <div>
            <h4 className="font-bold text-[#02060c] text-sm mb-3">Social Links</h4>
            <div className="flex gap-3 flex-wrap">
              {SOCIAL_ICONS.map(({ name, src }) => (
                <a key={name} href="#" target="_blank" rel="nofollow noopener noreferrer" className="block" onClick={noop} aria-label={name}>
                  <img src={src} alt={name} className="h-8 w-8 object-contain" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Other cities that we deliver – visible only when "679 cities" is clicked */}
        {showOtherCities && (
        <div data-testid="footer_other_cities" className="pt-8 border-t border-[#02060c1f]">
          <h4 className="font-bold text-[#02060c] text-sm mb-4">Other cities that we deliver:</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-1">
            <ul className="list-none p-0 m-0">
              {OTHER_CITIES_COL1.map((city) => (
                <li key={city} className="mb-2">
                  <a href="#" onClick={noop} className="text-[#02060c99] text-sm font-medium hover:text-[#02060c] cursor-default">{city}</a>
                </li>
              ))}
            </ul>
            <ul className="list-none p-0 m-0">
              {OTHER_CITIES_COL2.map((city) => (
                <li key={city} className="mb-2">
                  <a href="#" onClick={noop} className="text-[#02060c99] text-sm font-medium hover:text-[#02060c] cursor-default">{city}</a>
                </li>
              ))}
            </ul>
            <ul className="list-none p-0 m-0">
              {OTHER_CITIES_COL3.map((city) => (
                <li key={city} className="mb-2">
                  <a href="#" onClick={noop} className="text-[#02060c99] text-sm font-medium hover:text-[#02060c] cursor-default">{city}</a>
                </li>
              ))}
            </ul>
            <ul className="list-none p-0 m-0">
              {OTHER_CITIES_COL4.map((city) => (
                <li key={city} className="mb-2">
                  <a href="#" onClick={noop} className="text-[#02060c99] text-sm font-medium hover:text-[#02060c] cursor-default">{city}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
