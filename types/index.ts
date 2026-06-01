export type Restaurant = {
  id: string;
  slug: string;
  name: string;
  phone: string;
  address: string;
  hours: string;
  description: string;
  heroImageUrl: string;
};

export type MenuItem = {
  id: string;
  restaurantId: string;
  name: string;
  category: string;
  price: string;
  description?: string;
};

export type Notice = {
  id: string;
  restaurantId: string;
  title: string;
  message: string;
  active: boolean;
};

export type DesignSettings = {
  restaurantId: string;
  template: "Classic" | "Warm" | "Minimal";
  primaryColor: string;
  fontSize: "comfortable" | "large";
};
