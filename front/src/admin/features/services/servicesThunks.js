import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { message } from 'antd';
import axiosApi from "../../../../axiosApi.js";

export const fetchServices = createAsyncThunk(
    'services/fetchServices',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosApi.get('/api/services');
            return response.data;
        } catch (error) {
            message.error('Ошибка при загрузке списка услуг');
            return rejectWithValue(error.response.data);
        }
    }
);

export const createService = createAsyncThunk(
    'services/createService',
    async (serviceData, { rejectWithValue }) => {
        try {
            const response = await axiosApi.post('/api/services', serviceData);
            message.success('Услуга успешно добавлена!');
            return response.data;
        } catch (error) {
            message.error('Ошибка при создании услуги');
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateService = createAsyncThunk(
    'services/updateService',
    async ({ id, serviceData }, { rejectWithValue }) => {
        try {
            const response = await axiosApi.put(`/api/services/${id}`, serviceData);
            message.success('Услуга успешно обновлена!');
            return response.data;
        } catch (error) {
            message.error('Ошибка при обновлении услуги');
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteService = createAsyncThunk(
    'services/deleteService',
    async (id, { rejectWithValue }) => {
        try {
            await axiosApi.delete(`/api/services/${id}`);
            message.success('Услуга успешно удалена!');
            return id;
        } catch (error) {
            message.error('Ошибка при удалении услуги');
            return rejectWithValue(error.response.data);
        }
    }
);
