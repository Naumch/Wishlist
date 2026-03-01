import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Wishlist, Item, Category, Comment } from "../../types";

interface WishlistState {
  wishlists: Wishlist[];
  currentWishlist: Wishlist | null;
  items: Item[];
  categories: Category[];
  comments: Record<string, Comment[]>;
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  wishlists: [],
  currentWishlist: null,
  items: [],
  categories: [],
  comments: {},
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // Wishlists
    fetchWishlistsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchWishlistsSuccess: (state, action: PayloadAction<Wishlist[]>) => {
      state.wishlists = action.payload;
      state.loading = false;
    },
    fetchWishlistsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    createWishlistRequest: (
      state,
      _action: PayloadAction<{
        title: string;
        description?: string;
        is_public?: boolean;
      }>,
    ) => {
      state.loading = true;
      state.error = null;
    },
    createWishlistSuccess: (state, action: PayloadAction<Wishlist>) => {
      state.wishlists.push(action.payload);
      state.loading = false;
    },

    updateWishlistRequest: (
      state,
      _action: PayloadAction<{
        id: string;
        data: Partial<Wishlist>;
      }>,
    ) => {
      state.loading = true;
      state.error = null;
    },
    updateWishlistSuccess: (state, action: PayloadAction<Wishlist>) => {
      const index = state.wishlists.findIndex(
        (w) => w.id === action.payload.id,
      );
      if (index !== -1) {
        state.wishlists[index] = action.payload;
      }
      if (state.currentWishlist?.id === action.payload.id) {
        state.currentWishlist = action.payload;
      }
      state.loading = false;
    },

    deleteWishlistRequest: (state, _action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    deleteWishlistSuccess: (state, action: PayloadAction<string>) => {
      state.wishlists = state.wishlists.filter((w) => w.id !== action.payload);
      if (state.currentWishlist?.id === action.payload) {
        state.currentWishlist = null;
      }
      state.loading = false;
    },

    setCurrentWishlist: (state, action: PayloadAction<Wishlist | null>) => {
      state.currentWishlist = action.payload;
    },

    // Items
    fetchItemsRequest: (state, _action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    fetchItemsSuccess: (state, action: PayloadAction<Item[]>) => {
      state.items = action.payload;
      state.loading = false;
    },

    createItemRequest: (
      state,
      _action: PayloadAction<{
        wishlistId: string;
        data: {
          title: string;
          description?: string;
          price?: number;
          link?: string;
        };
      }>,
    ) => {
      state.loading = true;
      state.error = null;
    },
    createItemSuccess: (state, action: PayloadAction<Item>) => {
      state.items.push(action.payload);
      state.loading = false;
    },

    updateItemRequest: (
      state,
      _action: PayloadAction<{
        id: string;
        data: Partial<Item>;
      }>,
    ) => {
      state.loading = true;
      state.error = null;
    },
    updateItemSuccess: (state, action: PayloadAction<Item>) => {
      const index = state.items.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      state.loading = false;
    },

    deleteItemRequest: (state, _action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    deleteItemSuccess: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      state.loading = false;
    },

    reserveItemRequest: (
      state,
      _action: PayloadAction<{
        itemId: string;
        userId: string;
      }>,
    ) => {
      state.loading = true;
      state.error = null;
    },
    reserveItemSuccess: (state, action: PayloadAction<Item>) => {
      const index = state.items.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      state.loading = false;
    },

    // Categories
    fetchCategoriesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCategoriesSuccess: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
      state.loading = false;
    },

    // Comments
    fetchCommentsRequest: (state, _action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    fetchCommentsSuccess: (
      state,
      action: PayloadAction<{
        itemId: string;
        comments: Comment[];
      }>,
    ) => {
      state.comments[action.payload.itemId] = action.payload.comments;
      state.loading = false;
    },

    addCommentRequest: (
      state,
      _action: PayloadAction<{
        itemId: string;
        content: string;
        userId: string;
      }>,
    ) => {
      state.loading = true;
      state.error = null;
    },
    addCommentSuccess: (state, action: PayloadAction<Comment>) => {
      const itemComments = state.comments[action.payload.item_id] || [];
      state.comments[action.payload.item_id] = [
        ...itemComments,
        action.payload,
      ];
      state.loading = false;
    },
    unreserveItemRequest: (state, _action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
  },
});

export const {
  fetchWishlistsRequest,
  fetchWishlistsSuccess,
  fetchWishlistsFailure,
  createWishlistRequest,
  createWishlistSuccess,
  updateWishlistRequest,
  updateWishlistSuccess,
  deleteWishlistRequest,
  deleteWishlistSuccess,
  setCurrentWishlist,
  fetchItemsRequest,
  fetchItemsSuccess,
  createItemRequest,
  createItemSuccess,
  updateItemRequest,
  updateItemSuccess,
  deleteItemRequest,
  deleteItemSuccess,
  reserveItemRequest,
  reserveItemSuccess,
  fetchCategoriesRequest,
  fetchCategoriesSuccess,
  fetchCommentsRequest,
  fetchCommentsSuccess,
  addCommentRequest,
  addCommentSuccess,
  unreserveItemRequest,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
