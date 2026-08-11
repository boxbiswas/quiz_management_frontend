import React from 'react';
import { useSelector } from 'react-redux';

const AdminDashboardContent = () => {
    const { user } = useSelector((state) => state.auth);

    return (
        <div>
            <h1 className="font-display font-semibold text-3xl text-ink-900 mb-2">Admin Dashboard</h1>
            <p className="font-body text-ink-700 mb-8">Welcome back, {user?.name}. Here is an overview of the platform.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-card p-6 border border-warm-200/50">
                    <h3 className="font-mono text-xs uppercase tracking-wider text-ink-500 mb-1">Total Quizzes</h3>
                    <p className="font-display text-4xl text-ink-900">12</p>
                </div>
                <div className="bg-white rounded-xl shadow-card p-6 border border-warm-200/50">
                    <h3 className="font-mono text-xs uppercase tracking-wider text-ink-500 mb-1">Total Students</h3>
                    <p className="font-display text-4xl text-ink-900">145</p>
                </div>
                <div className="bg-white rounded-xl shadow-card p-6 border border-warm-200/50">
                    <h3 className="font-mono text-xs uppercase tracking-wider text-ink-500 mb-1">Total Attempts</h3>
                    <p className="font-display text-4xl text-ink-900">892</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardContent;
