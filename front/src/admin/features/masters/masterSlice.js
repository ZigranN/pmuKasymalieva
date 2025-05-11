import { createSlice } from '@reduxjs/toolkit';
import {createMaster, deleteMaster, fetchMasters, updateMaster} from "./masterThunks.js";

const initialState = {
    list: [],
    fetchLoading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
    error: null,
    success: null
};

const mastersSlice = createSlice({
    name: 'masters',
    initialState,
    reducers: {
        clearMessages: (state) => {
            state.error = null;
            state.success = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchMasters.pending, (state) => {
            state.fetchLoading = true;
            state.error = null;
        });
        builder.addCase(fetchMasters.fulfilled, (state, { payload }) => {
            state.fetchLoading = false;
            state.list = payload;
        });
        builder.addCase(fetchMasters.rejected, (state, action) => {
            state.fetchLoading = false;
            state.error = action.payload;
        });

        builder.addCase(createMaster.pending, (state) => {
            state.createLoading = true;
            state.error = null;
        });
        builder.addCase(createMaster.fulfilled, (state, { payload }) => {
            state.createLoading = false;
            state.list.push(payload);
            state.success = "Мастер успешно добавлен";
        });
        builder.addCase(createMaster.rejected, (state, action) => {
            state.createLoading = false;
            state.error = action.payload;
        });

        builder.addCase(updateMaster.pending, (state) => {
            state.updateLoading = true;
            state.error = null;
        });
        builder.addCase(updateMaster.fulfilled, (state, { payload }) => {
            state.updateLoading = false;
            const index = state.list.findIndex((master) => master._id === payload._id);
            if (index !== -1) {
                state.list[index] = payload;
            }
            state.success = "Мастер успешно обновлён";
        });
        builder.addCase(updateMaster.rejected, (state, action) => {
            state.updateLoading = false;
            state.error = action.payload;
        });

        builder.addCase(deleteMaster.pending, (state) => {
            state.deleteLoading = true;
            state.error = null;
        });
        builder.addCase(deleteMaster.fulfilled, (state, { payload }) => {
            state.deleteLoading = false;
            state.list = state.list.filter((master) => master._id !== payload);
            state.success = "Мастер успешно удалён";
        });
        builder.addCase(deleteMaster.rejected, (state, action) => {
            state.deleteLoading = false;
            state.error = action.payload;
        });
    }
});

export const { clearMessages } = mastersSlice.actions;
export const mastersReducer = mastersSlice.reducer;

export const selectMasters = (state) => state.masters.list;
export const selectMastersFetchLoading = (state) => state.masters.fetchLoading;
export const selectCreateLoading = (state) => state.masters.createLoading;
export const selectUpdateLoading = (state) => state.masters.updateLoading;
export const selectDeleteLoading = (state) => state.masters.deleteLoading;
export const selectMastersError = (state) => state.masters.error;
export const selectMastersSuccess = (state) => state.masters.success;