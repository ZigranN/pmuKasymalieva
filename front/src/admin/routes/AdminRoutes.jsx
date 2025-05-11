import React from "react";
import { Route, Routes } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage.jsx";
import ClientsListPage from "../pages/ClientsListPage.jsx";
import ServicesListPage from "../pages/ServicesListPage.jsx";
import DashboardStatistics from "../pages/DashboardStatistics.jsx";
import MasterPage from "../pages/MastersPage.jsx";

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<DashboardPage />}>
                <Route path="dashboard" element={<DashboardStatistics />} />
                <Route path="services" element={<ServicesListPage />} />
                <Route path="clients" element={<ClientsListPage />} />
                <Route path="masters" element={<MasterPage />} />
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
