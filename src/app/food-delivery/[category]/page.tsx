import React from 'react';
import type { Metadata } from 'next';
import CategoryContent from './CategoryContent';

type PageProps = { params: Promise<{ category: string }> };

function categoryTitleFromSlug(slug: string): string {
  return slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const title = categoryTitleFromSlug(category);
  return {
    title: `Order ${title} from Restaurants Near You | Swiggy`,
    description: `Order ${title.toLowerCase()} online from restaurants and get it delivered. Serving in Bangalore, Hyderabad, Delhi and more.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  return <CategoryContent category={category} />;
}
