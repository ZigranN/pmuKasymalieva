import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from './../../../../axiosApi.js';

// 📌 Загрузка всех пользователей
export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosApi.get('/api/users');
            return response.data;
        } catch (error) {
            console.error('Ошибка при загрузке пользователей:', error.message);
            return rejectWithValue(error.response.data);
        }
    }
);

// 📌 Добавление нового пользователя
export const addUser = createAsyncThunk(
    'users/addUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosApi.post('/api/users', userData);
            return response.data.user;
        } catch (error) {
            console.error('Ошибка при добавлении пользователя:', error.message);
            return rejectWithValue(error.response.data);
        }
    }
);

// 📌 Обновление данных пользователя
export const updateUser = createAsyncThunk(
    'users/updateUser',
    async ({ id, ...updates }, { rejectWithValue }) => {
        try {
            const response = await axiosApi.put(`/api/users/${id}`, updates);
            return response.data.user;
        } catch (error) {
            console.error('Ошибка при обновлении пользователя:', error.message);
            return rejectWithValue(error.response.data);
        }
    }
);

// 📌 Удаление пользователя
export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (id, { rejectWithValue }) => {
        try {
            await axiosApi.delete(`/api/users/${id}`);
            return id;
        } catch (error) {
            console.error('Ошибка при удалении пользователя:', error.message);
            return rejectWithValue(error.response.data);
        }
    }
);