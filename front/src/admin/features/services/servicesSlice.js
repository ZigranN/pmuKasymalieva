import { createSlice } from '@reduxjs/toolkit';
import {
    fetchServices,
    createService,
    updateService,
    deleteService
} from './servicesThunks';

const initialState = {
    list: [],
    fetchLoading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
    error: null,
    success: null
};

const servicesSlice = createSlice({
    name: 'services',
    initialState,
    reducers: {
        clearServiceMessages: (state) => {
            state.error = null;
            state.success = null;
        }
    },
    extraReducers: (builder) => {
        // 🔹 Загрузка списка услуг
        builder.addCase(fetchServices.pending, (state) => {
            state.fetchLoading = true;
            state.error = null;
        });
        builder.addCase(fetchServices.fulfilled, (state, { payload }) => {
            state.fetchLoading = false;
            state.list = payload;
        });
        builder.addCase(fetchServices.rejected, (state, action) => {
            state.fetchLoading = false;
            state.error = action.payload;
        });

        // 🔹 Создание услуги
        builder.addCase(createService.pending, (state) => {
            state.createLoading = true;
            state.error = null;
        });
        builder.addCase(createService.fulfilled, (state, { payload }) => {
            state.createLoading = false;
            state.list.push(payload);
            state.success = "Услуга успешно добавлена";
        });
        builder.addCase(createService.rejected, (state, action) => {
            state.createLoading = false;
            state.error = action.payload;
        });

        // 🔹 Обновление услуги
        builder.addCase(updateService.pending, (state) => {
            state.updateLoading = true;
            state.error = null;
        });
        builder.addCase(updateService.fulfilled, (state, { payload }) => {
            state.updateLoading = false;
            const index = state.list.findIndex((service) => service._id === payload._id);
            if (index !== -1) {
                state.list[index] = payload;
            }
            state.success = "Услуга успешно обновлена";
        });
        builder.addCase(updateService.rejected, (state, action) => {
            state.updateLoading = false;
            state.error = action.payload;
        });

        // 🔹 Удаление услуги
        builder.addCase(deleteService.pending, (state) => {
            state.deleteLoading = true;
            state.error = null;
        });
        builder.addCase(deleteService.fulfilled, (state, { payload }) => {
            state.deleteLoading = false;
            state.list = state.list.filter((service) => service._id !== payload);
            state.success = "Услуга успешно удалена";
        });
        builder.addCase(deleteService.rejected, (state, action) => {
            state.deleteLoading = false;
            state.error = action.payload;
        });
    }
});

// 🔹 Экспорт редьюсера и экшенов
export const { clearServiceMessages } = servicesSlice.actions;
export const servicesReducer = servicesSlice.reducer;

// 🔹 Селекторы
export const selectServices = (state) => state.services.list;
export const selectServicesFetchLoading = (state) => state.services.fetchLoading;
export const selectCreateLoading = (state) => state.services.createLoading;
export const selectUpdateLoading = (state) => state.services.updateLoading;
export const selectDeleteLoading = (state) => state.services.deleteLoading;
export const selectServicesError = (state) => state.services.error;
export const selectServicesSuccess = (state) => state.services.success;

