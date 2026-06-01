import type { DesignSettings, MenuItem, Notice, Restaurant } from "@/types";

const restaurants: Restaurant[] = [
  {
    id: "rest_001",
    slug: "north-star-diner",
    name: "North Star Diner",
    phone: "(612) 555-0182",
    address: "102 Lake Street, Minneapolis, MN",
    hours: "Mon-Sat 11:00 AM - 9:00 PM",
    description:
      "Neighborhood family restaurant serving Korean-American comfort meals.",
    heroImageUrl:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "rest_002",
    slug: "test-korean-restaurant",
    name: "Test Korean Restaurant",
    phone: "(651) 555-0190",
    address: "44 Grand Avenue, St. Paul, MN",
    hours: "Tue-Sun 10:30 AM - 8:30 PM",
    description:
      "Friendly local spot with simple Korean dishes and warm service.",
    heroImageUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  },
];

const menuItems: MenuItem[] = [
  {
    id: "menu_001",
    restaurantId: "rest_001",
    name: "Bulgogi Bowl",
    category: "Main",
    price: "$14.99",
    description: "Marinated beef, steamed rice, and fresh vegetables.",
  },
  {
    id: "menu_002",
    restaurantId: "rest_001",
    name: "Kimchi Fried Rice",
    category: "Main",
    price: "$12.50",
  },
  {
    id: "menu_003",
    restaurantId: "rest_001",
    name: "Mandu Dumplings",
    category: "Appetizer",
    price: "$7.99",
  },
  {
    id: "menu_004",
    restaurantId: "rest_002",
    name: "Bibimbap",
    category: "Main",
    price: "$13.95",
  },
  {
    id: "menu_005",
    restaurantId: "rest_002",
    name: "Tteokbokki",
    category: "Side",
    price: "$8.50",
  },
];

const notices: Notice[] = [
  {
    id: "notice_001",
    restaurantId: "rest_001",
    title: "Summer Hours",
    message: "On Fridays we close at 10:00 PM.",
    active: true,
  },
  {
    id: "notice_002",
    restaurantId: "rest_001",
    title: "Holiday Notice",
    message: "Closed on July 4th.",
    active: false,
  },
  {
    id: "notice_003",
    restaurantId: "rest_002",
    title: "Lunch Special",
    message: "Weekday lunch combo available 11:00 AM - 2:00 PM.",
    active: true,
  },
];

const designSettingsByRestaurantId: Record<string, DesignSettings> = {
  rest_001: {
    restaurantId: "rest_001",
    template: "Classic",
    primaryColor: "#14532d",
    fontSize: "large",
  },
  rest_002: {
    restaurantId: "rest_002",
    template: "Warm",
    primaryColor: "#9a3412",
    fontSize: "large",
  },
};

export function getRestaurantBySlug(slug: string): Restaurant | undefined {
  return restaurants.find((restaurant) => restaurant.slug === slug);
}

export function getMenuByRestaurantId(restaurantId: string): MenuItem[] {
  return menuItems.filter((menuItem) => menuItem.restaurantId === restaurantId);
}

export function getNoticesByRestaurantId(restaurantId: string): Notice[] {
  return notices.filter((notice) => notice.restaurantId === restaurantId);
}

export function getDesignByRestaurantId(
  restaurantId: string
): DesignSettings | undefined {
  return designSettingsByRestaurantId[restaurantId];
}

export const demoRestaurant = restaurants[0];
export const demoMenu = getMenuByRestaurantId(demoRestaurant.id);
export const demoNotices = getNoticesByRestaurantId(demoRestaurant.id);
