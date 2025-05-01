import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthSlice{
    user: any;
    isAuthenticated: boolean;
}

const initialState: AuthSlice = {
    user: null,
    isAuthenticated: false,
};

const BASE_URL = 'http://localhost:3000/user';

export const login = createAsyncThunk(
    'auth/login',
    async({email, password}: {email: string, password: string}, {rejectWithValue}) => {
        try{
            const response = await axios.post(`${BASE_URL}/login`, {email, password});
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data;
        }catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'failed to login');
    }
});

export const signup = createAsyncThunk(
    'auth/signup',
    async({name, email, password}: {name: string, email: string, password: string}, {rejectWithValue}) => {
        try{
            const response = await axios.post(`${BASE_URL}/register`, {name, email, password});
            return response.data;
        }catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'failed to signup');
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async() => {
        localStorage.removeItem('user');
        return null;   
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            })
    }
});

export default authSlice.reducer;