import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AdminRoutes from "./admin/routes/AdminRoutes.jsx";
import Home from "./clients/Home.jsx";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
    );
};

export default App;
