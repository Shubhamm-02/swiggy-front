'use client';

import Header from "../components/Header";
import Hero from "../components/Hero";
import FoodOptions from "../components/FoodOptions";
import GroceryOptions from "../components/GroceryOptions";
import DineoutSection from "../components/DineoutSection";
import AppBanner from "../components/AppBanner";
import Cities from "../components/Cities";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header (Absolute) */}
      <Header />

      {/* Hero Section */}
      <Hero />

      <div className="container-max px-4 py-8">
        {/* Food Options */}
        <FoodOptions />

        {/* Grocery Options */}
        <GroceryOptions />

        {/* Dineout Options */}
        <DineoutSection />
      </div>

      {/* App Banner */}
      <AppBanner />

      {/* Cities with delivery */}
      <Cities />

      {/* Footer */}
      <Footer />
    </main>
  );
}
