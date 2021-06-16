import { configureStore } from '@reduxjs/toolkit';

import server from './server/serverSlice';
import user from './user/userSlice';

export default configureStore({
  reducer: {
      user,
      server
  },
});
