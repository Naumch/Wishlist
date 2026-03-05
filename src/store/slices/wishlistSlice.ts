import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Wishlist } from "../../types";

export interface WishlistState {
  lists: Wishlist[];
  currentWishlist: Wishlist | null;
  requests: {
    fetchAll: RequestState;
    fetchOne: Record<string, RequestState>;
    create: RequestState;
    update: Record<string, RequestState>;
    delete: Record<string, RequestState>;
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

const initialState: WishlistState = {
  lists: [],
  currentWishlist: null,
  requests: {
    fetchAll: initialRequestState,
    fetchOne: {},
    create: initialRequestState,
    update: {},
    delete: {},
  },
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // Fetch all
    fetchWishlistsRequest: (state) => {
      state.requests.fetchAll.loading = true;
      state.requests.fetchAll.error = null;
    },
    fetchWishlistsSuccess: (state, action: PayloadAction<Wishlist[]>) => {
      state.lists = action.payload;
      state.requests.fetchAll.loading = false;
    },
    fetchWishlistsFailure: (state, action: PayloadAction<string>) => {
      state.requests.fetchAll.loading = false;
      state.requests.fetchAll.error = action.payload;
    },

    // Create
    createWishlistRequest: (
      state,
      _action: PayloadAction<{
        title: string;
        description?: string;
        is_public: boolean;
      }>,
    ) => {
      state.requests.create.loading = true;
      state.requests.create.error = null;
    },
    createWishlistSuccess: (state, action: PayloadAction<Wishlist>) => {
      state.lists.push(action.payload);
      state.requests.create.loading = false;
    },
    createWishlistFailure: (state, action: PayloadAction<string>) => {
      state.requests.create.loading = false;
      state.requests.create.error = action.payload;
    },

    // Update
    updateWishlistRequest: (
      state,
      action: PayloadAction<{
        id: string;
        _data: Partial<Wishlist>;
      }>,
    ) => {
      const { id } = action.payload;

      if (!state.requests.update) {
        state.requests.update = {};
      }

      if (!state.requests.update[id]) {
        state.requests.update[id] = { ...initialRequestState };
      } else {
        state.requests.update[id] = {
          ...state.requests.update[id],
          loading: true,
          error: null,
        };
      }
    },
    updateWishlistSuccess: (state, action: PayloadAction<Wishlist>) => {
      const index = state.lists.findIndex((w) => w.id === action.payload.id);
      if (index !== -1) {
        state.lists[index] = action.payload;
      }
      if (state.currentWishlist?.id === action.payload.id) {
        state.currentWishlist = action.payload;
      }
      if (state.requests.update[action.payload.id]) {
        state.requests.update[action.payload.id].loading = false;
      }
    },
    updateWishlistFailure: (
      state,
      action: PayloadAction<{ id: string; error: string }>,
    ) => {
      if (state.requests.update[action.payload.id]) {
        state.requests.update[action.payload.id].loading = false;
        state.requests.update[action.payload.id].error = action.payload.error;
      }
    },

    // Delete
    deleteWishlistRequest: (state, action: PayloadAction<string>) => {
      const id = action.payload;

      // Immer позволяет "мутировать" но нужно убедиться, что объект существует
      if (!state.requests.delete) {
        state.requests.delete = {};
      }

      if (!state.requests.delete[id]) {
        // Создаем новый объект, если его нет
        state.requests.delete[id] = { ...initialRequestState };
      } else {
        // Обновляем существующий, создавая новый объект
        state.requests.delete[id] = {
          ...state.requests.delete[id],
          loading: true,
          error: null,
        };
      }
    },
    deleteWishlistSuccess: (state, action: PayloadAction<string>) => {
      state.lists = state.lists.filter((w) => w.id !== action.payload);
      if (state.currentWishlist?.id === action.payload) {
        state.currentWishlist = null;
      }
      if (state.requests.delete[action.payload]) {
        state.requests.delete[action.payload].loading = false;
      }
    },
    deleteWishlistFailure: (
      state,
      action: PayloadAction<{ id: string; error: string }>,
    ) => {
      if (state.requests.delete[action.payload.id]) {
        state.requests.delete[action.payload.id].loading = false;
        state.requests.delete[action.payload.id].error = action.payload.error;
      }
    },

    setCurrentWishlist: (state, action: PayloadAction<Wishlist | null>) => {
      state.currentWishlist = action.payload;
    },
  },
});

export const {
  fetchWishlistsRequest,
  fetchWishlistsSuccess,
  fetchWishlistsFailure,
  createWishlistRequest,
  createWishlistSuccess,
  createWishlistFailure,
  updateWishlistRequest,
  updateWishlistSuccess,
  updateWishlistFailure,
  deleteWishlistRequest,
  deleteWishlistSuccess,
  deleteWishlistFailure,
  setCurrentWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
