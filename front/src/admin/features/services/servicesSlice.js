import { createSlice } from '@reduxjs/toolkit';
import {
    fetchServices,
    createService,
    updateService,
    deleteService
} from './servicesThunks';

const initialState = {
    services: [],
    loading: false,
    error: null,
};

const servicesSlice = createSlice({
    name: 'services',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchServices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.loading = false;
                state.services = action.payload;
            })
            .addCase(fetchServices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create
            .addCase(createService.fulfilled, (state, action) => {
                state.services.push(action.payload);
            })
            .addCase(createService.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Update
            .addCase(updateService.fulfilled, (state, action) => {
                state.services = state.services.map((service) =>
                    service._id === action.payload._id ? action.payload : service
                );
            })
            .addCase(updateService.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Delete
            .addCase(deleteService.fulfilled, (state, action) => {
                state.services = state.services.filter((service) => service._id !== action.payload);
            })
            .addCase(deleteService.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export default servicesSlice.reducer;
