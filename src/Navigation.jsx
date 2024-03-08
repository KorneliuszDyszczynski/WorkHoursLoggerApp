// Navigation.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminPage from './AdminPage';
import LoginPage from './LoginPage';
import WorkerPage from './WorkerPage';
import SuccessPage from './SuccessPage';
import HistoryPage from './HistoryPage';


const Navigation = () => {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/worker" element={<WorkerPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/history" element={<HistoryPage />} />
        </Routes>
    );
};

export default Navigation;
