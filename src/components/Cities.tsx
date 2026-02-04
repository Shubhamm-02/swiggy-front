"use client";
import React, { useEffect, useRef, useState } from 'react';

const Cities = () => {
    const cities = [
        "Bangalore", "Gurgaon", "Hyderabad", "Delhi",
        "Mumbai", "Pune", "Kolkata", "Chennai",
        "Ahmedabad", "Chandigarh", "Jaipur"
    ];

    const fullCities = [
        'Bangalore','Gurgaon','Hyderabad','Delhi','Mumbai','Pune','Kolkata','Chennai',
        'Ahmedabad','Chandigarh','Jaipur','Kochi','Coimbatore','Lucknow','Nagpur','Vadodara',
        'Indore','Guwahati','Vizag','Surat','Dehradun','Noida','Ludhiana','Trichy','Vijayawada',
        'Kanpur','Mysore','Nashik','Udaipur','Pondicherry','Agra','Aurangabad','Jalandhar',
        'Kota','Madurai','Allahabad','Manipal','Amritsar','Bareilly','Meerut','Bhopal','Ooty','Bhubaneswar','Raipur'
    ];

    const CityGrid = ({ type, items }: { type: string, items: string[] }) => {
        const [showAll, setShowAll] = useState(false);
        const expandRef = useRef<HTMLDivElement | null>(null);

        useEffect(() => {
            function onKey(e: KeyboardEvent) {
                if (e.key === 'Escape') setShowAll(false);
            }
            document.addEventListener('keydown', onKey);
            return () => document.removeEventListener('keydown', onKey);
        }, []);

        useEffect(() => {
            if (showAll && expandRef.current) {
                // Wait a tick for the DOM to render, then smooth scroll
                const id = setTimeout(() => {
                    expandRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }, 60);
                return () => clearTimeout(id);
            }
        }, [showAll]);



        return (
            <div className="mb-12">
                <h2 className="text-2xl font-extrabold text-[#02060c] mb-4">Cities with {type} delivery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {items.map((city, index) => (
                        <div key={index} className="border border-[#e2e2e7] rounded-xl p-4 flex items-center justify-center cursor-pointer hover:shadow-sm transition-shadow">
                            <span className="text-[#02060c] font-bold text-sm truncate opacity-90">Order {type} {type === 'food' ? 'online' : 'delivery'} in {city}</span>
                        </div>
                    ))}
                    <button onClick={() => setShowAll(true)} className="border border-[#e2e2e7] rounded-xl p-4 flex items-center justify-center cursor-pointer hover:shadow-sm transition-shadow">
                        <span className="text-[#ff5200] font-bold text-sm flex items-center gap-1">
                            Show More <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </span>
                    </button>
                </div>

                {showAll && (
                    <div ref={expandRef} className="mt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {fullCities.map((city, idx) => (
                                <div key={idx} className="border border-[#e8e8ec] rounded-xl p-4 flex items-center justify-center">
                                    <span className="text-[#02060c] font-medium text-sm">Order food online in {city}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-center">
                            <button onClick={() => setShowAll(false)} className="text-[#ff5200] font-bold">Show Less</button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <section id="cities" className="container-max mx-auto px-4 md:px-20 py-8 mt-10 md:mt-12">
            <CityGrid type="food" items={cities} />
            <CityGrid type="grocery" items={cities} />
        </section>
    );
};

export default Cities;
