import React from "react";
import "./App.css";
import DashboardLayout from "./Components/layouts/DashboardLayout";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Customers from "./pages/Customers";



function App() {

    return (
        <>
            <Router>
                <Routes>
                    <Route element={<DashboardLayout />}>
                        <Route path="/" element={<DashboardLayout />}/>
                        <Route path="/customers" element={<Customers />}/>
                    </Route>
                </Routes>
            </Router>
        </>

    )
}

export default App;
