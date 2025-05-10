import React from "react";
import "./App.css";
import DashboardLayout from "./Components/layouts/DashboardLayout";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Customers from "./pages/Customers";
import Items from "./pages/Items";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import OrderDetails from "./pages/OrderDetails";
import Orders from "./pages/Orders";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";



function App() {

    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    return (
        <>
            <Router>
                <Routes>
                    <Route path="/signup" element={ isAuthenticated ? <Navigate to="/" /> : <Signup />}/>
                    <Route path="/login" element={ isAuthenticated ? <Navigate to="/" /> : <Login />}/>
                    <Route element={<DashboardLayout />}>
                        <Route path="/" element={ isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}/>
                        <Route path="/customers" element={ isAuthenticated ? <Customers /> : <Navigate to="/login" />}/>
                        <Route path="/items" element={ isAuthenticated ? <Items /> : <Navigate to="/login" />}/>
                        <Route path="/order-details" element={ isAuthenticated ? <OrderDetails /> : <Navigate to="/login" />}/>
                        <Route path="/orders" element={ isAuthenticated ? <Orders /> : <Navigate to="/login" />}/>
                    </Route>
                    </Routes>
            </Router>
        </>

    )
}

export default App;
