import { all } from "redux-saga/effects";
import { watchWishlistSagas } from "./wishlistSaga";
import { watchItemSagas } from "./itemSaga";

export default function* rootSaga() {
  yield all([watchWishlistSagas(), watchItemSagas()]);
}
