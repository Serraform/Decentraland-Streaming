import { configureStore } from '@reduxjs/toolkit';
import accountReducer from 'store/slices/account.slice';
import streamReducer from 'store/slices/stream.slice';
import transactionReducer from 'store/slices/transaction.slice';
import {streamsApi} from 'store/api/streams.api';
export const store = configureStore({
  reducer: {
    accountData: accountReducer,
    streamData: streamReducer,
    transactionData: transactionReducer,
    [streamsApi.reducerPath]: streamsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(streamsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

