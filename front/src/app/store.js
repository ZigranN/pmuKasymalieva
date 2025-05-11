import { configureStore } from '@reduxjs/toolkit';
import {mastersReducer} from "../admin/features/masters/masterSlice.js";
import {servicesReducer} from "../admin/features/services/servicesSlice.js";
import {usersReducer} from "../admin/features/users/usersSlice.js";


const store = configureStore({
    reducer: {
        masters: mastersReducer,
        services: servicesReducer,
        users: usersReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
});

export default store;