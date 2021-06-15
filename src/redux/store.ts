import { configureStore } from '@reduxjs/toolkit';

import user from './user/userSlice';

export default configureStore({
  reducer: {
      user
  },
});
