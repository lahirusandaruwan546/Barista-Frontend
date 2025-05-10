import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Item {
    id: string;
    name: string;
    category: string;
    price: number;
    image: string;
    remark: string;
}

interface ItemState {
    items: Item[];
    categories: string[];
}

const initialState: ItemState = {
    items: [],
    categories: ['Cake', 'Beverage', 'Dessert', 'Pastry'],
};

const BASE_URL = 'http://localhost:3000/items'

export const fetchItems = createAsyncThunk('items/fetchItems', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(BASE_URL);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch items');
    }
});

export const addItem = createAsyncThunk(
    'items/addItem',
    async (item: Omit<Item, 'id'>, { rejectWithValue }) => {
        try {
            const response = await axios.post(BASE_URL, item);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add item');
        }
    }
);

export const updateItem = createAsyncThunk(
    'items/updateItem',
    async (item: Item, { rejectWithValue }) => {
        try {const response = await axios.put(`${BASE_URL}/${item._id}`, item);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update item');
        }
    }
);

export const deleteItem = createAsyncThunk(
    'items/deleteItem',
    async (id: string, { rejectWithValue }) => {
        try {
            await axios.delete(`${BASE_URL}/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete item');
        }
    }
);

const itemSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchItems.pending, (state) => {
                console.log('Pending');
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            .addCase(fetchItems.rejected, (state, action) => {
                console.log('Rejected');
            })
            .addCase(addItem.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateItem.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteItem.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
            });
    },
});

export default itemSlice.reducer;