import { configureStore } from '@reduxjs/toolkit';
import accountReducer from 'store/slices/account.slice';
import streamReducer from 'store/slices/stream.slice';

export const store = configureStore({
  reducer: {
    accountData: accountReducer,
    streamData: streamReducer
  },
  middleware: getDefaultMiddleware =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

