import { call, put, takeLatest, all } from "redux-saga/effects";
import { supabase } from "../../services/supabase";
import {
  fetchWishlistsRequest,
  fetchWishlistsSuccess,
  fetchWishlistsFailure,
  createWishlistRequest,
  createWishlistSuccess,
  updateWishlistRequest,
  updateWishlistSuccess,
  deleteWishlistRequest,
  deleteWishlistSuccess,
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
} from "../slices/wishlistSlce";
import type { Wishlist, Item, Category, Comment } from "../../types";
import type { PayloadAction } from "@reduxjs/toolkit";

// Wishlist Sagas
function* fetchWishlists() {
  try {
    const {
      data: { user },
    } = yield call([supabase.auth, "getUser"]);

    if (!user) throw new Error("User not authenticated");

    // Создаем запрос отдельно
    const query = supabase
      .from("wishlists")
      .select(
        `
        *,
        profile:profiles(*),
        items:items(*)
      `,
      )
      .eq("user_id", user.id);

    // Выполняем запрос через call
    const { data, error } = yield call([query, "then"], (result) => result);

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

    const { data, error } = yield call([query, "then"], (result) => result);

    if (error) throw error;

    yield put(createWishlistSuccess(data as Wishlist));
  } catch (error: any) {
    yield put(fetchWishlistsFailure(error.message));
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

    const { data, error } = yield call([query, "then"], (result) => result);

    if (error) throw error;

    yield put(updateWishlistSuccess(data as Wishlist));
  } catch (error: any) {
    yield put(fetchWishlistsFailure(error.message));
  }
}

function* deleteWishlist(action: PayloadAction<string>) {
  try {
    const query = supabase.from("wishlists").delete().eq("id", action.payload);

    const { error } = yield call([query, "then"], (result) => result);

    if (error) throw error;

    yield put(deleteWishlistSuccess(action.payload));
  } catch (error: any) {
    yield put(fetchWishlistsFailure(error.message));
  }
}

// Items Sagas
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

    const { data, error } = yield call([query, "then"], (result) => result);

    if (error) throw error;

    // Трансформируем данные
    const items = (data as any[]).map((item) => ({
      ...item,
      categories: item.categories?.map((c: any) => c.category),
    }));

    yield put(fetchItemsSuccess(items as Item[]));
  } catch (error: any) {
    yield put(fetchWishlistsFailure(error.message));
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

    const { data, error } = yield call([query, "then"], (result) => result);

    if (error) throw error;

    yield put(createItemSuccess(data as Item));
  } catch (error: any) {
    yield put(fetchWishlistsFailure(error.message));
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

    const { data, error } = yield call([query, "then"], (result) => result);

    if (error) throw error;

    yield put(updateItemSuccess(data as Item));
  } catch (error: any) {
    yield put(fetchWishlistsFailure(error.message));
  }
}

function* deleteItem(action: PayloadAction<string>) {
  try {
    const query = supabase.from("items").delete().eq("id", action.payload);

    const { error } = yield call([query, "then"], (result) => result);

    if (error) throw error;

    yield put(deleteItemSuccess(action.payload));
  } catch (error: any) {
    yield put(fetchWishlistsFailure(error.message));
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

    const { data, error } = yield call([query, "then"], (result) => result);

    if (error) throw error;

    yield put(reserveItemSuccess(data as Item));
  } catch (error: any) {
    yield put(fetchWishlistsFailure(error.message));
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

    const { data, error } = yield call([query, "then"], (result) => result);

    if (error) throw error;

    yield put(updateItemSuccess(data as Item));
  } catch (error: any) {
    yield put(fetchWishlistsFailure(error.message));
  }
}

// Categories Sagas
function* fetchCategories() {
  try {
    const query = supabase.from("categories").select("*").order("name");

    const { data, error } = yield call([query, "then"], (result) => result);

    if (error) throw error;

    yield put(fetchCategoriesSuccess(data as Category[]));
  } catch (error: any) {
    yield put(fetchWishlistsFailure(error.message));
  }
}

// Comments Sagas
function* fetchComments(action: PayloadAction<string>) {
  try {
    const query = supabase
      .from("comments")
      .select(
        `
        *,
        profile:profiles(*)
      `,
      )
      .eq("item_id", action.payload)
      .order("created_at", { ascending: true });

    const { data, error } = yield call([query, "then"], (result) => result);

    if (error) throw error;

    yield put(
      fetchCommentsSuccess({
        itemId: action.payload,
        comments: data as Comment[],
      }),
    );
  } catch (error: any) {
    yield put(fetchWishlistsFailure(error.message));
  }
}

function* addComment(
  action: PayloadAction<{
    itemId: string;
    content: string;
    userId: string;
  }>,
) {
  try {
    const query = supabase
      .from("comments")
      .insert({
        item_id: action.payload.itemId,
        user_id: action.payload.userId,
        content: action.payload.content,
      })
      .select(
        `
        *,
        profile:profiles(*)
      `,
      )
      .single();

    const { data, error } = yield call([query, "then"], (result) => result);

    if (error) throw error;

    yield put(addCommentSuccess(data as Comment));
  } catch (error: any) {
    yield put(fetchWishlistsFailure(error.message));
  }
}

function* deleteComment(action: PayloadAction<string>) {
  try {
    const query = supabase.from("comments").delete().eq("id", action.payload);

    const { error } = yield call([query, "then"], (result) => result);

    if (error) throw error;

    // После удаления комментария можно обновить список комментариев
    // или просто показать уведомление
  } catch (error: any) {
    yield put(fetchWishlistsFailure(error.message));
  }
}

// Watchers
function* watchWishlistSagas() {
  yield all([
    takeLatest(fetchWishlistsRequest.type, fetchWishlists),
    takeLatest(createWishlistRequest.type, createWishlist),
    takeLatest(updateWishlistRequest.type, updateWishlist),
    takeLatest(deleteWishlistRequest.type, deleteWishlist),
    takeLatest(fetchItemsRequest.type, fetchItems),
    takeLatest(createItemRequest.type, createItem),
    takeLatest(updateItemRequest.type, updateItem),
    takeLatest(deleteItemRequest.type, deleteItem),
    takeLatest(reserveItemRequest.type, reserveItem),
    takeLatest("wishlist/unreserveItem", unreserveItem),
    takeLatest(fetchCategoriesRequest.type, fetchCategories),
    takeLatest(fetchCommentsRequest.type, fetchComments),
    takeLatest(addCommentRequest.type, addComment),
    takeLatest("wishlist/deleteComment", deleteComment),
  ]);
}

export default watchWishlistSagas;
