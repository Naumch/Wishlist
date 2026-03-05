import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import wishlistReducer from "./slices/wishlistSlice";
import itemReducer from "./slices/itemSlice";
import rootSaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    wishlist: wishlistReducer,
    items: itemReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
