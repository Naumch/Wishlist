import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import wishlistReducer from "./slices/wishlistSlce";
import watchWishlistSagas from "./sagas/wishlistSaga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    wishlist: wishlistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(watchWishlistSagas);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
