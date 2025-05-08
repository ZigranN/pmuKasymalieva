import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './../admin/features/users/usersSlice.js';
import servicesReducer from './../admin/features/services/servicesSlice.js';

const store = configureStore({
    reducer: {
        users: usersReducer,
        services: servicesReducer,

    },
});

export default store;