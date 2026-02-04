import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Order Food Online from India's Best Food Delivery Service | Swiggy",
  description:
    "Order food online from restaurants and get it delivered. Serving in Bangalore, Hyderabad, Delhi and more. Order Pizzas, Biryanis, from Swiggy.",
  openGraph: {
    title: "Order Food Online from India's Best Food Delivery Service | Swiggy",
    description:
      "Order food online from restaurants and get it delivered. Serving in Bangalore, Hyderabad, Delhi and more. Order Pizzas, Biryanis, from Swiggy.",
    url: "/food-delivery",
    type: "website",
  },
};

export default function FoodDeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
