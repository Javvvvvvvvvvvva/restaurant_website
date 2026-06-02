import type {
  Media,
  MenuCategory,
  MenuItem,
  Notice,
  Profile,
  Restaurant,
  RestaurantMember,
  SiteSettings,
} from "@/types";

const DEMO_TIMESTAMP = "2026-06-01T00:00:00.000Z";

const profiles: Profile[] = [
  {
    id: "user_owner_001",
    full_name: "Jane Kim",
    email: "owner@example.com",
    created_at: DEMO_TIMESTAMP,
    updated_at: DEMO_TIMESTAMP,
  },
];

const restaurants: Restaurant[] = [
  {
    id: "rest_001",
    owner_id: "user_owner_001",
    slug: "north-star-diner",
    name: "North Star Diner",
    phone: "(612) 555-0182",
    address: "102 Lake Street, Minneapolis, MN",
    hours: "Mon-Sat 11:00 AM - 9:00 PM",
    description:
      "Neighborhood family restaurant serving Korean-American comfort meals.",
    logo_url: null,
    hero_image_url:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
    is_published: true,
    published_at: DEMO_TIMESTAMP,
    created_at: DEMO_TIMESTAMP,
    updated_at: DEMO_TIMESTAMP,
  },
  {
    id: "rest_002",
    owner_id: "user_owner_001",
    slug: "test-korean-restaurant",
    name: "Test Korean Restaurant",
    phone: "(651) 555-0190",
    address: "44 Grand Avenue, St. Paul, MN",
    hours: "Tue-Sun 10:30 AM - 8:30 PM",
    description:
      "Friendly local spot with simple Korean dishes and warm service.",
    logo_url: null,
    hero_image_url:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    is_published: false,
    published_at: null,
    created_at: DEMO_TIMESTAMP,
    updated_at: DEMO_TIMESTAMP,
  },
];

const restaurantMembers: RestaurantMember[] = [
  {
    id: "member_001",
    restaurant_id: "rest_001",
    user_id: "user_owner_001",
    role: "owner",
    created_at: DEMO_TIMESTAMP,
  },
  {
    id: "member_002",
    restaurant_id: "rest_002",
    user_id: "user_owner_001",
    role: "owner",
    created_at: DEMO_TIMESTAMP,
  },
];

const menuCategories: MenuCategory[] = [
  {
    id: "cat_001",
    restaurant_id: "rest_001",
    name: "Main",
    sort_order: 1,
    created_at: DEMO_TIMESTAMP,
    updated_at: DEMO_TIMESTAMP,
  },
  {
    id: "cat_002",
    restaurant_id: "rest_001",
    name: "Appetizer",
    sort_order: 0,
    created_at: DEMO_TIMESTAMP,
    updated_at: DEMO_TIMESTAMP,
  },
  {
    id: "cat_003",
    restaurant_id: "rest_002",
    name: "Main",
    sort_order: 0,
    created_at: DEMO_TIMESTAMP,
    updated_at: DEMO_TIMESTAMP,
  },
  {
    id: "cat_004",
    restaurant_id: "rest_002",
    name: "Side",
    sort_order: 1,
    created_at: DEMO_TIMESTAMP,
    updated_at: DEMO_TIMESTAMP,
  },
];

const menuItems: MenuItem[] = [
  {
    id: "menu_001",
    restaurant_id: "rest_001",
    category_id: "cat_001",
    name: "Bulgogi Bowl",
    description: "Marinated beef, steamed rice, and fresh vegetables.",
    price: 14.99,
    image_url: null,
    is_available: true,
    sort_order: 0,
    created_at: DEMO_TIMESTAMP,
    updated_at: DEMO_TIMESTAMP,
  },
  {
    id: "menu_002",
    restaurant_id: "rest_001",
    category_id: "cat_001",
    name: "Kimchi Fried Rice",
    description: null,
    price: 12.5,
    image_url: null,
    is_available: true,
    sort_order: 1,
    created_at: DEMO_TIMESTAMP,
    updated_at: DEMO_TIMESTAMP,
  },
  {
    id: "menu_003",
    restaurant_id: "rest_001",
    category_id: "cat_002",
    name: "Mandu Dumplings",
    description: null,
    price: 7.99,
    image_url: null,
    is_available: true,
    sort_order: 2,
    created_at: DEMO_TIMESTAMP,
    updated_at: DEMO_TIMESTAMP,
  },
  {
    id: "menu_004",
    restaurant_id: "rest_002",
    category_id: "cat_003",
    name: "Bibimbap",
    description: null,
    price: 13.95,
    image_url: null,
    is_available: true,
    sort_order: 0,
    created_at: DEMO_TIMESTAMP,
    updated_at: DEMO_TIMESTAMP,
  },
  {
    id: "menu_005",
    restaurant_id: "rest_002",
    category_id: "cat_004",
    name: "Tteokbokki",
    description: null,
    price: 8.5,
    image_url: null,
    is_available: true,
    sort_order: 1,
    created_at: DEMO_TIMESTAMP,
    updated_at: DEMO_TIMESTAMP,
  },
];

const notices: Notice[] = [
  {
    id: "notice_001",
    restaurant_id: "rest_001",
    title: "Summer Hours",
    message: "On Fridays we close at 10:00 PM.",
    is_active: true,
    created_at: DEMO_TIMESTAMP,
    updated_at: DEMO_TIMESTAMP,
  },
  {
    id: "notice_002",
    restaurant_id: "rest_001",
    title: "Holiday Notice",
    message: "Closed on July 4th.",
    is_active: false,
    created_at: DEMO_TIMESTAMP,
    updated_at: DEMO_TIMESTAMP,
  },
  {
    id: "notice_003",
    restaurant_id: "rest_002",
    title: "Lunch Special",
    message: "Weekday lunch combo available 11:00 AM - 2:00 PM.",
    is_active: true,
    created_at: DEMO_TIMESTAMP,
    updated_at: DEMO_TIMESTAMP,
  },
];

const siteSettingsByRestaurantId: Record<string, SiteSettings> = {
  rest_001: {
    id: "settings_001",
    restaurant_id: "rest_001",
    template_id: "classic",
    primary_color: "#14532d",
    background_color: "#fff7ed",
    button_style: "rounded",
    show_gallery: true,
    show_notices: true,
    show_contact_form: false,
    created_at: DEMO_TIMESTAMP,
    updated_at: DEMO_TIMESTAMP,
  },
  rest_002: {
    id: "settings_002",
    restaurant_id: "rest_002",
    template_id: "warm",
    primary_color: "#9a3412",
    background_color: "#fff7ed",
    button_style: "rounded",
    show_gallery: true,
    show_notices: true,
    show_contact_form: false,
    created_at: DEMO_TIMESTAMP,
    updated_at: DEMO_TIMESTAMP,
  },
};

const media: Media[] = [
  {
    id: "media_001",
    restaurant_id: "rest_001",
    file_url:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80",
    file_type: "image/jpeg",
    alt_text: "North Star Diner dining room",
    created_at: DEMO_TIMESTAMP,
  },
];

const categoryById = new Map(menuCategories.map((category) => [category.id, category]));

export function formatMenuPrice(price: number | null): string {
  if (price === null) {
    return "—";
  }

  return `$${price.toFixed(2)}`;
}

export function getCategoryNameById(categoryId: string | null): string {
  if (!categoryId) {
    return "Uncategorized";
  }

  return categoryById.get(categoryId)?.name ?? "Uncategorized";
}

export function getRestaurantBySlug(slug: string): Restaurant | undefined {
  return restaurants.find((restaurant) => restaurant.slug === slug);
}

export function getMenuCategoriesByRestaurantId(
  restaurantId: string
): MenuCategory[] {
  return menuCategories.filter((category) => category.restaurant_id === restaurantId);
}

export function getMenuByRestaurantId(restaurantId: string): MenuItem[] {
  return menuItems.filter((menuItem) => menuItem.restaurant_id === restaurantId);
}

export function getNoticesByRestaurantId(restaurantId: string): Notice[] {
  return notices.filter((notice) => notice.restaurant_id === restaurantId);
}

export function getSiteSettingsByRestaurantId(
  restaurantId: string
): SiteSettings | undefined {
  return siteSettingsByRestaurantId[restaurantId];
}

export function getMediaByRestaurantId(restaurantId: string): Media[] {
  return media.filter((item) => item.restaurant_id === restaurantId);
}

/** @deprecated Use getSiteSettingsByRestaurantId */
export function getDesignByRestaurantId(
  restaurantId: string
): SiteSettings | undefined {
  return getSiteSettingsByRestaurantId(restaurantId);
}

export const demoProfile = profiles[0];
export const demoRestaurantMembers = restaurantMembers.filter(
  (member) => member.restaurant_id === restaurants[0].id
);
export const demoRestaurant = restaurants[0];
export const demoMenu = getMenuByRestaurantId(demoRestaurant.id);
export const demoMenuCategories = getMenuCategoriesByRestaurantId(demoRestaurant.id);
export const demoNotices = getNoticesByRestaurantId(demoRestaurant.id);
export const demoSiteSettings = getSiteSettingsByRestaurantId(demoRestaurant.id);
