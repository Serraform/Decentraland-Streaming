import { configureStore } from '@reduxjs/toolkit';
import accountReducer from 'store/slices/account.slice';

export const store = configureStore({
  reducer: {
    accountData: accountReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch


  