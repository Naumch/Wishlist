import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Item } from "../../types";

export interface ItemState {
  items: Item[];
  requests: {
    fetchByWishlist: Record<string, RequestState>;
    create: RequestState;
    update: Record<string, RequestState>;
    delete: Record<string, RequestState>;
    reserve: Record<string, RequestState>;
  };
}

interface RequestState {
  loading: boolean;
  error: string | null;
}

const initialRequestState: RequestState = {
  loading: false,
  error: null,
};

const initialState: ItemState = {
  items: [],
  requests: {
    fetchByWishlist: {},
    create: initialRequestState,
    update: {},
    delete: {},
    reserve: {},
  },
};

const itemSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    // Fetch items by wishlist
    fetchItemsRequest: (state, action: PayloadAction<string>) => {
      const wishlistId = action.payload;

      if (!state.requests.fetchByWishlist) {
        state.requests.fetchByWishlist = {};
      }

      state.requests.fetchByWishlist[wishlistId] = {
        ...(state.requests.fetchByWishlist[wishlistId] || initialRequestState),
        loading: true,
        error: null,
      };
    },
    fetchItemsSuccess: (
      state,
      action: PayloadAction<{ wishlistId: string; items: Item[] }>,
    ) => {
      state.items = action.payload.items;
      if (state.requests.fetchByWishlist[action.payload.wishlistId]) {
        state.requests.fetchByWishlist[action.payload.wishlistId].loading =
          false;
      }
    },
    fetchItemsFailure: (
      state,
      action: PayloadAction<{ wishlistId: string; error: string }>,
    ) => {
      if (state.requests.fetchByWishlist[action.payload.wishlistId]) {
        state.requests.fetchByWishlist[action.payload.wishlistId].loading =
          false;
        state.requests.fetchByWishlist[action.payload.wishlistId].error =
          action.payload.error;
      }
    },

    // Create item
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
      state.requests.create.loading = true;
      state.requests.create.error = null;
    },
    createItemSuccess: (state, action: PayloadAction<Item>) => {
      state.items.push(action.payload);
      state.requests.create.loading = false;
    },
    createItemFailure: (state, action: PayloadAction<string>) => {
      state.requests.create.loading = false;
      state.requests.create.error = action.payload;
    },

    // Update item
    updateItemRequest: (
      state,
      action: PayloadAction<{
        id: string;
        data: Partial<Item>;
      }>,
    ) => {
      if (!state.requests.update[action.payload.id]) {
        state.requests.update[action.payload.id] = initialRequestState;
      }
      state.requests.update[action.payload.id].loading = true;
      state.requests.update[action.payload.id].error = null;
    },
    updateItemSuccess: (state, action: PayloadAction<Item>) => {
      const index = state.items.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.requests.update[action.payload.id]) {
        state.requests.update[action.payload.id].loading = false;
      }
    },
    updateItemFailure: (
      state,
      action: PayloadAction<{ id: string; error: string }>,
    ) => {
      if (state.requests.update[action.payload.id]) {
        state.requests.update[action.payload.id].loading = false;
        state.requests.update[action.payload.id].error = action.payload.error;
      }
    },

    // Delete item
    deleteItemRequest: (state, action: PayloadAction<string>) => {
      if (!state.requests.delete[action.payload]) {
        state.requests.delete[action.payload] = initialRequestState;
      }
      state.requests.delete[action.payload].loading = true;
      state.requests.delete[action.payload].error = null;
    },
    deleteItemSuccess: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      if (state.requests.delete[action.payload]) {
        state.requests.delete[action.payload].loading = false;
      }
    },
    deleteItemFailure: (
      state,
      action: PayloadAction<{ id: string; error: string }>,
    ) => {
      if (state.requests.delete[action.payload.id]) {
        state.requests.delete[action.payload.id].loading = false;
        state.requests.delete[action.payload.id].error = action.payload.error;
      }
    },

    // Reserve item
    reserveItemRequest: (
      state,
      action: PayloadAction<{
        itemId: string;
        userId: string;
      }>,
    ) => {
      if (!state.requests.reserve[action.payload.itemId]) {
        state.requests.reserve[action.payload.itemId] = initialRequestState;
      }
      state.requests.reserve[action.payload.itemId].loading = true;
      state.requests.reserve[action.payload.itemId].error = null;
    },
    reserveItemSuccess: (state, action: PayloadAction<Item>) => {
      const index = state.items.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.requests.reserve[action.payload.id]) {
        state.requests.reserve[action.payload.id].loading = false;
      }
    },
    reserveItemFailure: (
      state,
      action: PayloadAction<{ itemId: string; error: string }>,
    ) => {
      if (state.requests.reserve[action.payload.itemId]) {
        state.requests.reserve[action.payload.itemId].loading = false;
        state.requests.reserve[action.payload.itemId].error =
          action.payload.error;
      }
    },

    unreserveItemRequest: (state, action: PayloadAction<string>) => {
      if (!state.requests.reserve[action.payload]) {
        state.requests.reserve[action.payload] = initialRequestState;
      }
      state.requests.reserve[action.payload].loading = true;
      state.requests.reserve[action.payload].error = null;
    },
  },
});

export const {
  fetchItemsRequest,
  fetchItemsSuccess,
  fetchItemsFailure,
  createItemRequest,
  createItemSuccess,
  createItemFailure,
  updateItemRequest,
  updateItemSuccess,
  updateItemFailure,
  deleteItemRequest,
  deleteItemSuccess,
  deleteItemFailure,
  reserveItemRequest,
  reserveItemSuccess,
  reserveItemFailure,
  unreserveItemRequest,
} = itemSlice.actions;

export default itemSlice.reducer;
