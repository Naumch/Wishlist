import { put, takeLatest } from "redux-saga/effects";
import { supabase } from "../../services/supabase";
import {
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
} from "../slices/itemSlice";
import type { Item } from "../../types";
import type { PayloadAction } from "@reduxjs/toolkit";

function* fetchItems(action: PayloadAction<string>) {
  try {
    const wishlistId = action.payload;

    const query = supabase
      .from("items")
      .select(
        `
        *,
        categories:items_categories(
          category:categories(*)
        ),
        reserver:profiles(*),
        comments:comments(
          *,
          profile:profiles(*)
        )
      `,
      )
      .eq("wishlist_id", wishlistId);

    const { data, error } = yield query;
    if (error) throw error;

    const items = (data as any[]).map((item) => ({
      ...item,
      categories: item.categories?.map((c: any) => c.category),
    }));

    yield put(fetchItemsSuccess({ wishlistId, items: items as Item[] }));
  } catch (error: any) {
    yield put(
      fetchItemsFailure({
        wishlistId: action.payload,
        error: error.message,
      }),
    );
  }
}

function* createItem(
  action: PayloadAction<{
    wishlistId: string;
    data: {
      title: string;
      description?: string;
      price?: number;
      link?: string;
      priority?: number;
      currency?: string;
      image_url?: string;
    };
  }>,
) {
  try {
    const query = supabase
      .from("items")
      .insert({
        wishlist_id: action.payload.wishlistId,
        ...action.payload.data,
      })
      .select()
      .single();

    const { data, error } = yield query;
    if (error) throw error;

    yield put(createItemSuccess(data as Item));
  } catch (error: any) {
    yield put(createItemFailure(error.message));
  }
}

function* updateItem(
  action: PayloadAction<{
    id: string;
    data: Partial<Item>;
  }>,
) {
  try {
    const query = supabase
      .from("items")
      .update(action.payload.data)
      .eq("id", action.payload.id)
      .select()
      .single();

    const { data, error } = yield query;
    if (error) throw error;

    yield put(updateItemSuccess(data as Item));
  } catch (error: any) {
    yield put(
      updateItemFailure({
        id: action.payload.id,
        error: error.message,
      }),
    );
  }
}

function* deleteItem(action: PayloadAction<string>) {
  try {
    const query = supabase.from("items").delete().eq("id", action.payload);
    const { error } = yield query;
    if (error) throw error;

    yield put(deleteItemSuccess(action.payload));
  } catch (error: any) {
    yield put(
      deleteItemFailure({
        id: action.payload,
        error: error.message,
      }),
    );
  }
}

function* reserveItem(
  action: PayloadAction<{
    itemId: string;
    userId: string;
  }>,
) {
  try {
    const query = supabase
      .from("items")
      .update({
        is_reserved: true,
        reserved_by: action.payload.userId,
      })
      .eq("id", action.payload.itemId)
      .select(
        `
        *,
        reserver:profiles(*)
      `,
      )
      .single();

    const { data, error } = yield query;
    if (error) throw error;

    yield put(reserveItemSuccess(data as Item));
  } catch (error: any) {
    yield put(
      reserveItemFailure({
        itemId: action.payload.itemId,
        error: error.message,
      }),
    );
  }
}

function* unreserveItem(action: PayloadAction<string>) {
  try {
    const query = supabase
      .from("items")
      .update({
        is_reserved: false,
        reserved_by: null,
      })
      .eq("id", action.payload)
      .select()
      .single();

    const { data, error } = yield query;
    if (error) throw error;

    yield put(updateItemSuccess(data as Item));
  } catch (error: any) {
    yield put(
      updateItemFailure({
        id: action.payload,
        error: error.message,
      }),
    );
  }
}

export function* watchItemSagas() {
  yield takeLatest(fetchItemsRequest.type, fetchItems);
  yield takeLatest(createItemRequest.type, createItem);
  yield takeLatest(updateItemRequest.type, updateItem);
  yield takeLatest(deleteItemRequest.type, deleteItem);
  yield takeLatest(reserveItemRequest.type, reserveItem);
  yield takeLatest(unreserveItemRequest.type, unreserveItem);
}
