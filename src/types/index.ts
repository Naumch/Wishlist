export interface Profile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Wishlist {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  is_public: boolean;
  event_date?: string;
  created_at: string;
  updated_at: string;
  profile?: Profile;
  items?: Item[];
  items_count?: number;
}

export interface Item {
  id: string;
  wishlist_id: string;
  title: string;
  description?: string;
  price?: number;
  currency: string;
  link?: string;
  image_url?: string;
  priority: number;
  is_reserved: boolean;
  reserved_by?: string;
  created_at: string;
  updated_at: string;
  categories?: Category[];
  reserver?: Profile;
  comments?: Comment[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  created_at: string;
}

export interface Comment {
  id: string;
  item_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface CreateWishlistDTO {
  title: string;
  description?: string;
  is_public: boolean;
  event_date?: string;
}

export interface CreateItemDTO {
  wishlist_id: string;
  title: string;
  description?: string;
  price?: number;
  currency?: string;
  link?: string;
  image_url?: string;
  priority?: number;
  category_ids?: string[];
}
