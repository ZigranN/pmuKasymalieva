import { createSlice } from '@reduxjs/toolkit';
import {
    addUser,
    deleteUser,
    fetchUsers,
    updateUser
} from './usersThunk.js';

const initialState = {
    list: [],
    fetchLoading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
    error: null,
    success: null
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearUserMessages: (state) => {
            state.error = null;
            state.success = null;
        }
    },
    extraReducers: (builder) => {
        //  Загрузка списка пользователей
        builder.addCase(fetchUsers.pending, (state) => {
            state.fetchLoading = true;
            state.error = null;
        });
        builder.addCase(fetchUsers.fulfilled, (state, { payload }) => {
            state.fetchLoading = false;
            state.list = payload;
        });
        builder.addCase(fetchUsers.rejected, (state, action) => {
            state.fetchLoading = false;
            state.error = action.payload;
        });

        //  Создание пользователя
        builder.addCase(addUser.pending, (state) => {
            state.createLoading = true;
            state.error = null;
        });
        builder.addCase(addUser.fulfilled, (state, { payload }) => {
            state.createLoading = false;
            state.list.push(payload);
            state.success = "Пользователь успешно добавлен";
        });
        builder.addCase(addUser.rejected, (state, action) => {
            state.createLoading = false;
            state.error = action.payload;
        });

        //  Обновление пользователя
        builder.addCase(updateUser.pending, (state) => {
            state.updateLoading = true;
            state.error = null;
        });
        builder.addCase(updateUser.fulfilled, (state, { payload }) => {
            state.updateLoading = false;
            const index = state.list.findIndex((user) => user._id === payload._id);
            if (index !== -1) {
                state.list[index] = payload;
            }
            state.success = "Пользователь успешно обновлён";
        });
        builder.addCase(updateUser.rejected, (state, action) => {
            state.updateLoading = false;
            state.error = action.payload;
        });

        //  Удаление пользователя
        builder.addCase(deleteUser.pending, (state) => {
            state.deleteLoading = true;
            state.error = null;
        });
        builder.addCase(deleteUser.fulfilled, (state, { payload }) => {
            state.deleteLoading = false;
            state.list = state.list.filter((user) => user._id !== payload);
            state.success = "Пользователь успешно удалён";
        });
        builder.addCase(deleteUser.rejected, (state, action) => {
            state.deleteLoading = false;
            state.error = action.payload;
        });
    }
});

// 🔹 Экспорт редьюсера и экшенов
export const { clearUserMessages } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;

// 🔹 Селекторы
export const selectUsers = (state) => state.users.list;
export const selectFetchLoading = (state) => state.users.fetchLoading;
export const selectCreateLoading = (state) => state.users.createLoading;
export const selectUpdateLoading = (state) => state.users.updateLoading;
export const selectDeleteLoading = (state) => state.users.deleteLoading;
export const selectUsersError = (state) => state.users.error;
export const selectUsersSuccess = (state) => state.users.success;
