import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

export interface Customer {
    id: number;
    name: string;
    email: string;
    telephone: string;
}
interface CustomerState{
    customers: Customer[];
}
const initialState: CustomerState = {
    customers: []
}

export const fetchCustomers = createAsyncThunk('customer/fetchCustomers', async (_, {rejectWithValue}) => {
    try{
        const response = await axios.get('http://localhost:3000/customers');
        return response.data;
    }catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'failed to fetch customers');
    }
});

export const addCustomer = createAsyncThunk('customer/addCustomer', async (customer: Omit<Customer, 'id'>, {rejectWithValue}) => {
    try{
        const response = await axios.post('http://localhost:3000/customers', customer);
        return response.data;
    }catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'failed to add customer');
    }
});

export const updateCustomer = createAsyncThunk('customer/updateCustomer', async (customer: Customer, {rejectWithValue}) => {
    try{
        const response = await axios.put(`http://localhost:3000/customers/${customer.id}`, customer);
        return response.data;
    }catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'failed to update customer');
    }
});

export const deleteCustomer = createAsyncThunk('customer/deleteCustomer', async (id: string, {rejectWithValue}) => {
    try{
        await axios.delete(`http://localhost:3000/customers/${id}`);
        return id;
    }catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'failed to delete customer');
    }
});

const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomers.pending, (state) => {
                console.log("pending");
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.customers = action.payload;
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                console.log("rejected");
            })
            .addCase(addCustomer.fulfilled, (state, action) => {
                state.customers.push(action.payload);
            })
            .addCase(updateCustomer.fulfilled, (state, action) => {
                const index = state.customers.findIndex(customer => customer.id === action.payload.id);
                if (index !== -1) {
                    state.customers[index] = action.payload;
                }
            })
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                state.customers = state.customers.filter(customer => customer.id !== action.payload);
            })
        }
});

export default customerSlice.reducer;