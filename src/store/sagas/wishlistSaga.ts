import { call, put, takeLatest } from "redux-saga/effects";
import { supabase } from "../../services/supabase";
import {
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
} from "../slices/wishlistSlice";
import type { Wishlist } from "../../types";
import type { PayloadAction } from "@reduxjs/toolkit";

function* fetchWishlists() {
  try {
    const {
      data: { user },
    } = yield call([supabase.auth, "getUser"]);
    if (!user) throw new Error("User not authenticated");

    const query = supabase
      .from("wishlists")
      .select(
        `
          *,
          profile:profiles(*),
          tems:items(*)
        `,
      )
      .eq("user_id", user.id);

    const { data, error } = yield query;
    if (error) throw error;

    yield put(fetchWishlistsSuccess(data as Wishlist[]));
  } catch (error: any) {
    yield put(fetchWishlistsFailure(error.message));
  }
}

function* createWishlist(
  action: PayloadAction<{
    title: string;
    description?: string;
    is_public?: boolean;
  }>,
) {
  try {
    const {
      data: { user },
    } = yield call([supabase.auth, "getUser"]);
    if (!user) throw new Error("User not authenticated");

    const query = supabase
      .from("wishlists")
      .insert({
        user_id: user.id,
        ...action.payload,
      })
      .select()
      .single();

    const { data, error } = yield query;
    if (error) throw error;

    yield put(createWishlistSuccess(data as Wishlist));
  } catch (error: any) {
    yield put(createWishlistFailure(error.message));
  }
}

function* updateWishlist(
  action: PayloadAction<{
    id: string;
    data: Partial<Wishlist>;
  }>,
) {
  try {
    const query = supabase
      .from("wishlists")
      .update(action.payload.data)
      .eq("id", action.payload.id)
      .select()
      .single();

    const { data, error } = yield query;
    if (error) throw error;

    yield put(updateWishlistSuccess(data as Wishlist));
  } catch (error: any) {
    yield put(
      updateWishlistFailure({
        id: action.payload.id,
        error: error.message,
      }),
    );
  }
}

function* deleteWishlist(action: PayloadAction<string>) {
  try {
    const query = supabase.from("wishlists").delete().eq("id", action.payload);
    const { error } = yield query;
    if (error) throw error;
    console.log("tut");

    yield put(deleteWishlistSuccess(action.payload));
  } catch (error: any) {
    yield put(
      deleteWishlistFailure({
        id: action.payload,
        error: error.message,
      }),
    );
  }
}

export function* watchWishlistSagas() {
  yield takeLatest(fetchWishlistsRequest.type, fetchWishlists);
  yield takeLatest(createWishlistRequest.type, createWishlist);
  yield takeLatest(updateWishlistRequest.type, updateWishlist);
  yield takeLatest(deleteWishlistRequest.type, deleteWishlist);
}
