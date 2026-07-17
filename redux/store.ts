import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import logger from "redux-logger";
import AuthReducer from "@/redux/reducers/AuthReducer";
import PopUpsReducer from "@/redux/reducers/PopUpsReducer";
import Config from "@/utils/Config";

// redux-persist needs a storage engine; on the server we substitute a no-op
// so the store can be created during SSR without warnings.
const createNoopStorage = () => ({
  getItem: async () => null,
  setItem: async (_key: string, value: string) => value,
  removeItem: async () => {},
});

const storage =
  typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

const rootReducer = combineReducers({
  auth: AuthReducer,
  popUps: PopUpsReducer,
});

const persistConfig = {
  key: Config.STORAGE_KEYS.PERSIST_ROOT,
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({ serializableCheck: false });
    return process.env.NODE_ENV !== "production"
      ? middleware.concat(logger)
      : middleware;
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
