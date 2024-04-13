import { combineReducers } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from '@/app/features/user/userSlice';
import loaderReducer from '@/app/features/loader/loaderSlice';
import employReducer from './features/employ';
import filterReducer from './features/filter';

const rootReducer = combineReducers({
  user: userReducer,
  loader: loaderReducer,
  employ:employReducer,
  filter:filterReducer
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['user','employ','filter'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const persistor = persistStore(store);

export default store;

// BELOW IS THE ORIGINAL CODE WRITTEN BY MUDIT

// import { configureStore } from '@reduxjs/toolkit';
// import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// import userReducer from '@/app/features/user/userSlice';

// const store = configureStore({
//   reducer: {
//     user: userReducer,
//   },
//   middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
// });

// export type RootState = ReturnType<typeof store.getState>;

// export type AppDispatch = typeof store.dispatch;

// export const useAppDispatch: () => AppDispatch = useDispatch;

// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// export default store;
