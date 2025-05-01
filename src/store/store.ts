import {configureStore} from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import customerSlice from "./slice/CustomerSlice";
import itemSlice from "./slice/itemSlice";
import orderSlice from "./slice/orderSlice";
import cartSlice from "./slice/cartSlice";


export const store = configureStore({
    reducer: {
        auth: authSlice,
        customer: customerSlice,
        items: itemSlice,
        orders: orderSlice,
        cart: cartSlice
    }
});


export type RootState = ReturnType<typeof store.getState>;