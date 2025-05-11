import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from "../../../../axiosApi.js";

export const fetchMasters = createAsyncThunk(
    'masters/fetchMasters',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosApi.get('/api/masters');
            return response.data.map((master) => ({
                ...master,
                services: master.services.map((service) => service.name)
            }));
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createMaster = createAsyncThunk(
    'masters/createMaster',
    async (masterData, { rejectWithValue }) => {
        try {
            const formData = new FormData();

            Object.keys(masterData).forEach(key => {
                if (key === 'services') {
                    masterData[key].forEach((serviceId) => {
                        formData.append('services', serviceId);
                    });
                } else {
                    formData.append(key, masterData[key]);
                }
            });

            const response = await axiosApi.post('/api/masters', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateMaster = createAsyncThunk(
    'masters/updateMaster',
    async ({ id, masterData }, { rejectWithValue }) => {
        try {
            const formData = new FormData();

            Object.keys(masterData).forEach(key => {
                if (key === 'services') {
                    masterData[key].forEach(serviceId => {
                        formData.append('services', serviceId);
                    });
                } else if (key === 'photo') {
                    formData.append('photo', masterData[key]);
                } else {
                    formData.append(key, masterData[key]);
                }
            });

            const response = await axiosApi.put(`/api/masters/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteMaster = createAsyncThunk(
    'masters/deleteMaster',
    async (id, { rejectWithValue }) => {
        try {
            await axiosApi.delete(`/api/masters/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
