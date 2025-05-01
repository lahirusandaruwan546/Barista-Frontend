import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Customer } from "./CustomerSlice";
import { Item } from "./itemSlice";
import axios from "axios";

interface OrderItem {
    id: string;
    itemId: string;
    orderId: string;
    quantity: number;
    price: number;
    item?: Item
}

interface Order {
    id: string;
    customerId: string;
    date: Date;
    status: 'pending' | 'completed' | 'cancelled';
    total: number;
    customer?: Customer,
    orderItems?: OrderItem[]
}

interface OrderState{
    orders: Order[];
    selectedOrder: Order | null;
}

const initialState: OrderState = {
    orders: [],
    selectedOrder: null
}

const BASE_URL = 'http://localhost:3000/orders';

export const fetchOrders = createAsyncThunk(
    'order/fetchOrders',
    async (_, { rejectWithValue }) => {
        try{
            const response = await axios.get(BASE_URL);
            return response.data;
        }catch(error: any) {
            return rejectWithValue(error.response?.data?.message || 'failed to fetch orders');
        }
    }
)

export const fetchOrderById = createAsyncThunk(
    'order/fetchOrderById',
    async (id: string, { rejectWithValue }) => {
        try{
            const response = await axios.get(`${BASE_URL}/${id}`);
            return response.data;
        }catch(error: any) {
            return rejectWithValue(error.response?.data?.message || 'failed to fetch order');
        }
    }
)

export const creatOrder = createAsyncThunk(
    'order/createOrder',
    async (
        {customerId, orderItems}: { customerId: string, orderItems: Omit<OrderItem, 'id' | 'orderId'>[] },
        {rejectWithValue}
    ) => {
        try{
            const response = await axios.post(BASE_URL, {customerId, orderItems});
            return response.data;
        }catch(error: any) {
            return rejectWithValue(error.response?.data?.message || 'failed to create order');
        }
    }
)

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {},
    extraReducers: (builder) =>{
        builder
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.orders = action.payload;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.selectedOrder = action.payload;
            })
            .addCase(creatOrder.fulfilled, (state, action) => {
                state.orders.push(action.payload);
            })
    }
})

export default orderSlice.reducer;